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
    public class Service
    {
        public dataSet Diag_ServiceQueries(ServiceQueries objBO)
        {
            dataSet dsObj = new dataSet();
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pDiag_ServiceQueries", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@UnitId", SqlDbType.VarChar, 10).Value = objBO.UnitId;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 20).Value = objBO.CompId;
                    cmd.Parameters.Add("@UHID", SqlDbType.VarChar, 20).Value = objBO.UHID;
                    cmd.Parameters.Add("@SearchKey", SqlDbType.VarChar, 100).Value = objBO.SearcKey;
                    cmd.Parameters.Add("@SearchValue", SqlDbType.VarChar, 100).Value = objBO.SearchValue;
                    cmd.Parameters.Add("@prm_1", SqlDbType.VarChar, 100).Value = objBO.prm_1;
                    cmd.Parameters.Add("@prm_2", SqlDbType.VarChar, 100).Value = objBO.prm_2;
                    cmd.Parameters.Add("@from", SqlDbType.DateTime, 20).Value = objBO.from;
                    cmd.Parameters.Add("@to", SqlDbType.DateTime, 20).Value = objBO.to;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.login_id;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;

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

        public dataSet Diag_InvestigationQueries(ipIvestigation objBO)
        {
            dataSet dsObj = new dataSet();
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pDiag_InvestigationQueries", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@hosp_id", SqlDbType.VarChar, 10).Value = objBO.hosp_id;
                    cmd.Parameters.Add("@CatId", SqlDbType.VarChar, 10).Value = objBO.catid;
                    cmd.Parameters.Add("@SubCatId", SqlDbType.VarChar, 12).Value = objBO.subcateid;
                    cmd.Parameters.Add("@TestCode", SqlDbType.VarChar, 12).Value = objBO.investcode;
                    cmd.Parameters.Add("@prm_1", SqlDbType.VarChar, 100).Value = objBO.prm_1;
                    cmd.Parameters.Add("@prm_2", SqlDbType.VarChar, 100).Value = objBO.prm_2;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.login_id;
                    cmd.Parameters.Add("@CartId", SqlDbType.VarChar, 7).Value = objBO.warehouseCartId;
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

        public string Diag_InvestigationInsertUpdate(ipIvestigation objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("pDiag_InvestigationInsertUpdate", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@unitId", SqlDbType.VarChar, 20).Value = objBO.unitId;
                    cmd.Parameters.Add("@compId", SqlDbType.VarChar, 20).Value = objBO.compId;
                    cmd.Parameters.Add("@ItemId", SqlDbType.VarChar, 20).Value = objBO.ItemId;
                    cmd.Parameters.Add("@SubCatId", SqlDbType.VarChar, 25).Value = objBO.subcateid;
                    cmd.Parameters.Add("@investCode", SqlDbType.VarChar, 50).Value = objBO.investcode;
                    cmd.Parameters.Add("@investtype", SqlDbType.VarChar, 50).Value = objBO.investtype;
                    cmd.Parameters.Add("@ExtCode", SqlDbType.VarChar, 50).Value = objBO.extTestCode;
                    cmd.Parameters.Add("@investname", SqlDbType.VarChar, 500).Value = objBO.investname;
                    cmd.Parameters.Add("@rate", SqlDbType.Decimal).Value = objBO.rate;
                    cmd.Parameters.Add("@SampleOption", SqlDbType.VarChar, 100).Value = objBO.sampleoption;
                    cmd.Parameters.Add("@SampleLinks", SqlDbType.VarChar, 5000).Value = objBO.samplelinkdata;
                    cmd.Parameters.Add("@DefaultSample", SqlDbType.NVarChar, 100).Value = objBO.defaultsample;
                    cmd.Parameters.Add("@IsPopular", SqlDbType.VarChar, 1).Value = objBO.IsPopular;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 20).Value = objBO.login_id;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 100).Value = "";
                    cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
                    try
                    {
                        cmd.ExecuteNonQuery();
                        processInfo = (string)cmd.Parameters["@result"].Value.ToString();
                    }
                    catch (Exception sqlEx)
                    {
                        processInfo = "Error Found   : " + sqlEx.Message;
                    }
                    finally { con.Close(); }
                    return processInfo;
                }
            }
        }
        public string Diag_ImportFromLisPackage(ipIvestigation objMaster, List<ippackagequery> objPackageList)
        {
            dataSet dsObj = new dataSet();
            string processInfo = string.Empty;
            DataTable dt = new DataTable();
            dt.Columns.Add("itemId", typeof(string));
            dt.Columns.Add("PackageId", typeof(string));
            dt.Columns.Add("InvestigationID", typeof(string));
            dt.Columns.Add("TypeName", typeof(string));
            if (objPackageList.Count > 0)
            {
                foreach (ippackagequery obj in objPackageList)
                {

                    DataRow dr = dt.NewRow();
                    dr["itemId"] = obj.itemId;
                    dr["PackageId"] = obj.PackageId;
                    dr["InvestigationID"] = obj.InvestigationID;
                    dr["TypeName"] = obj.TypeName;
                    dt.Rows.Add(dr);

                }
            }
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pDiag_ImportFromLisPackage", con))
                {

                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.AddWithValue("@udt_PackageList", dt);
                    cmd.Parameters.Add("@ItemId", SqlDbType.VarChar, 20).Value = objMaster.ItemId;
                    cmd.Parameters.Add("@SubCatId", SqlDbType.VarChar, 25).Value = objMaster.subcateid;
                    cmd.Parameters.Add("@investCode", SqlDbType.VarChar, 50).Value = objMaster.investcode;
                    cmd.Parameters.Add("@investtype", SqlDbType.VarChar, 50).Value = objMaster.investtype;
                    cmd.Parameters.Add("@ExtCode", SqlDbType.VarChar, 50).Value = objMaster.extTestCode;
                    cmd.Parameters.Add("@investname", SqlDbType.VarChar, 500).Value = objMaster.investname;
                    cmd.Parameters.Add("@rate", SqlDbType.Decimal).Value = objMaster.rate;
                    cmd.Parameters.Add("@DefaultSample", SqlDbType.NVarChar, 100).Value = objMaster.defaultsample;
                    cmd.Parameters.Add("@SampleOption", SqlDbType.NVarChar, 100).Value = objMaster.sampleoption;
                    cmd.Parameters.Add("@IsPopular", SqlDbType.VarChar, 1).Value = objMaster.IsPopular;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 50).Value = objMaster.login_id;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objMaster.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 120).Value = "";
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
        public string Diag_RefundBooking(ipCancellation objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("pDiag_RefundBooking", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 10).Value = objBO.CompId;
                    cmd.Parameters.Add("@UnitId", SqlDbType.VarChar, 20).Value = objBO.UnitId;
                    cmd.Parameters.Add("@ClientId", SqlDbType.VarChar, 20).Value = objBO.ClientId;
                    cmd.Parameters.Add("@OldVisitNo", SqlDbType.VarChar, 20).Value = objBO.OldVisitNo;
                    cmd.Parameters.Add("@ItemIds", SqlDbType.VarChar, 200).Value = objBO.ItemIds;
                    cmd.Parameters.Add("@DiscountRemark", SqlDbType.VarChar, 500).Value = objBO.DiscountRemark;
                    cmd.Parameters.Add("@LoginId", SqlDbType.VarChar, 20).Value = objBO.LoginId;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 100).Value = "";
                    cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
                    try
                    {
                        cmd.ExecuteNonQuery();
                        processInfo = (string)cmd.Parameters["@result"].Value.ToString();
                    }
                    catch (Exception sqlEx)
                    {
                        processInfo = "Error Found   : " + sqlEx.Message;
                    }
                    finally { con.Close(); }
                    return processInfo;
                }
            }
        }
    }
}