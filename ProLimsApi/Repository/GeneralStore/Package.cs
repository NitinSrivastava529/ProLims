using MySql.Data.MySqlClient;
using ProLimsApi.Models;
using ProLimsApi.Repository.Utility;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using static ProLimsApi.Models.GeneralStoreDTO;

namespace ProLimsApi.Repository.GeneralStore
{
    public class Package
    {
        public dataSet PackageMasterQueries(LabPackage objBO)
        {
            dataSet dsObj = new dataSet();
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pGS_PackageQueries", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@hosp_id", SqlDbType.VarChar, 10).Value = objBO.hosp_id;
                    cmd.Parameters.Add("@CatId", SqlDbType.VarChar, 20).Value = objBO.catid;
                    cmd.Parameters.Add("@SubCatId", SqlDbType.VarChar, 20).Value = objBO.subcateid;
                    cmd.Parameters.Add("@PackageId", SqlDbType.VarChar, 20).Value = objBO.packageId;
                    cmd.Parameters.Add("@itemId", SqlDbType.VarChar, 20).Value = objBO.itemid;
                    cmd.Parameters.Add("@prm_1", SqlDbType.VarChar, 100).Value = objBO.prm_1;
                    cmd.Parameters.Add("@prm_2", SqlDbType.VarChar, 100).Value = objBO.prm_2;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.login_id;
                    cmd.Parameters.Add("@warehouseCartId", SqlDbType.VarChar, 7).Value = objBO.warehouseCartId;
                    try
                    {
                        con.Open();
                        DataSet ds = new DataSet();
                        SqlDataAdapter da = new SqlDataAdapter(cmd);
                        da.Fill(ds);
                        dsObj.ResultSet = ds;
                        dsObj.Msg = "Success";
                        con.Close();
                    }
                    catch (SqlException sqlEx)
                    {
                        dsObj.ResultSet = null;
                        dsObj.Msg = sqlEx.Message;
                    }
                    finally { con.Close(); }
                    return dsObj;
                }
            }
        }

        public string PackageInsertUpdate(LabPackage objBO)
        {
            dataSet dsObj = new dataSet();
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pGS_PackageInsertUpdate", con))
                {

                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@unitId", SqlDbType.VarChar, 10).Value = objBO.unitId;
                    cmd.Parameters.Add("@compId", SqlDbType.VarChar, 10).Value = objBO.compId;
                    cmd.Parameters.Add("@PackageType", SqlDbType.VarChar, 20).Value = objBO.packagetype;
                    cmd.Parameters.Add("@CatId", SqlDbType.VarChar, 20).Value = objBO.catid;
                    cmd.Parameters.Add("@SubCatId", SqlDbType.VarChar, 20).Value = objBO.subcateid;
                    cmd.Parameters.Add("@rate", SqlDbType.Decimal).Value = objBO.rate;
                    cmd.Parameters.Add("@PackageName", SqlDbType.VarChar, 100).Value = objBO.packagename;
                    cmd.Parameters.Add("@PackageId", SqlDbType.VarChar, 10).Value = objBO.packageId;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.login_id;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 50).Value = "";
                    cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
                    try
                    {
                        con.Open();
                        cmd.ExecuteNonQuery();
                        processInfo = (string)cmd.Parameters["@result"].Value.ToString();
                        con.Close();
                    }
                    catch (SqlException sqlEx)
                    {
                        processInfo = "Error Found   : " + sqlEx.Message;
                    }
                    finally { con.Close(); }
                    return processInfo;
                }
            }
        }

        public string PackageLinkItems(LabPackage objBO)
        {
            dataSet dsObj = new dataSet();
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pGS_PackageLinkItems", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@hosp_id", SqlDbType.VarChar, 20).Value = objBO.hosp_id;
                    cmd.Parameters.Add("@type", SqlDbType.VarChar, 20).Value = objBO.type;
                    cmd.Parameters.Add("@packageId", SqlDbType.VarChar, 20).Value = objBO.packageId;
                    cmd.Parameters.Add("@itemId", SqlDbType.VarChar, 20).Value = objBO.itemid;
                    cmd.Parameters.Add("@innerpackageId", SqlDbType.VarChar, 20).Value = objBO.innerpackageid;
                    cmd.Parameters.Add("@packageInvesttype", SqlDbType.VarChar, 20).Value = objBO.packageInvesttype;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.login_id;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 50).Value = "";
                    cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    try
                    {
                        con.Open();
                        cmd.ExecuteNonQuery();
                        processInfo = (string)cmd.Parameters["@result"].Value.ToString();
                        con.Close();
                    }
                    catch (SqlException sqlEx)
                    {
                        processInfo = "Error Found   : " + sqlEx.Message;
                    }
                    finally { con.Close(); }
                    return processInfo;
                }
            }
        }

        public string GS_InsertClientMaster(IpClient objBO)
        {
            dataSet dsObj = new dataSet();
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pGS_InsertClientMaster", con))
                {

                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@UnitId", SqlDbType.VarChar, 20).Value = objBO.UnitId;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 20).Value = objBO.CompId;
                    cmd.Parameters.Add("@ClientId", SqlDbType.VarChar, 20).Value = objBO.ClientId;
                    cmd.Parameters.Add("@ClientName", SqlDbType.VarChar, 100).Value = objBO.ClientName;
                    cmd.Parameters.Add("@ClientType", SqlDbType.VarChar, 20).Value = objBO.ClientType;
                    cmd.Parameters.Add("@PaymentType", SqlDbType.VarChar, 20).Value = objBO.PaymentType;
                    cmd.Parameters.Add("@CityName", SqlDbType.VarChar, 100).Value = objBO.CityName;
                    cmd.Parameters.Add("@StateName", SqlDbType.VarChar, 100).Value = objBO.StateName;
                    cmd.Parameters.Add("@Address", SqlDbType.VarChar, 5000).Value = objBO.Address;
                    cmd.Parameters.Add("@PINCode", SqlDbType.VarChar, 10).Value = objBO.PINCode;
                    cmd.Parameters.Add("@EmailId", SqlDbType.VarChar, 50).Value = objBO.EmailId;
                    cmd.Parameters.Add("@CreditLimit", SqlDbType.Decimal).Value = objBO.CreditLimit;
                    cmd.Parameters.Add("@CreditDays", SqlDbType.Int).Value = objBO.CreditDays;
                    cmd.Parameters.Add("@LoginId", SqlDbType.VarChar, 50).Value = objBO.LoginId;
                    cmd.Parameters.Add("@MRPRateListId", SqlDbType.VarChar, 50).Value = objBO.MRPRateListId;
                    cmd.Parameters.Add("@ClientRateListId", SqlDbType.VarChar, 50).Value = objBO.ClientRateListId;
                    cmd.Parameters.Add("@LedgerId", SqlDbType.VarChar, 50).Value = objBO.LedgerId;
                    cmd.Parameters.Add("@TDSLedgerId", SqlDbType.VarChar, 50).Value = objBO.TDSLedgerId;
                    cmd.Parameters.Add("@ClientGroupName", SqlDbType.VarChar, 50).Value = objBO.ClientGroupName;
                    cmd.Parameters.Add("@psw", SqlDbType.VarChar, 50).Value = objBO.Psw;
                    cmd.Parameters.Add("@tdsPerc", SqlDbType.Decimal).Value = objBO.TdsPerc;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 50).Value = "";
                    cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
                    try
                    {
                        con.Open();
                        cmd.ExecuteNonQuery();
                        processInfo = (string)cmd.Parameters["@result"].Value.ToString();
                        con.Close();
                    }
                    catch (SqlException sqlEx)
                    {
                        processInfo = "Error Found   : " + sqlEx.Message;
                    }
                    finally { con.Close(); }
                    return processInfo;
                }
            }
        }

        public string GS_InsertIdDoseClientMaster(IpClient ip)
        {
            string processInfo = string.Empty;
            string qry = "";
            qry += "INSERT INTO centre_master(centreCode, Centre, Type1, Address, UHIDCode, IntegrationType)";
            qry += " SELECT '" + ip.ClientId + "' centreCode ,'" + ip.ClientName + "' Centre,'CC' Type1,'" + ip.Address + "' Address,'JINA' UHIDCode,'JeenaSekho' IntegrationType FROM centre_master";
            qry += " WHERE NOT EXISTS(";
            qry += " SELECT  1 FROM centre_master WHERE centreCode = '" + ip.ClientId + "'";
            qry += ") LIMIT 1;";
            return QuerryExecute(qry);
        }

        public string QuerryExecute(string commandText)
        {
            string result = "";
            MySqlConnection con = new MySqlConnection(GlobalConfig.ConStr_LISByItDose);
            MySqlCommand cmd = new MySqlCommand(commandText, con);
            cmd.CommandType = CommandType.Text;
            cmd.CommandTimeout = 2500;
            try
            {
                con.Open();
                if (cmd.ExecuteNonQuery() > 0)
                    result = "Success";
                else
                    result = "Faild";
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }
            finally { con.Close(); }
            return result;
        }
    }
}