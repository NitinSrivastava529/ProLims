using ProLimsApi.Models;
using ProLimsApi.Repository.Utility;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ProLimsApi.Repository.GeneralStore
{
    public class Finance
    {
        public dataSet Diag_AccountingQueries(FinanceModal objBO)
        {
            dataSet dsObj = new dataSet();
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pDiag_AccountingQueries", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@UnitId", SqlDbType.VarChar, 10).Value = objBO.UnitId;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 20).Value = objBO.CompId;
                    cmd.Parameters.Add("@from", SqlDbType.Date).Value = objBO.from;
                    cmd.Parameters.Add("@to", SqlDbType.Date).Value = objBO.to;
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
        public string Prolims_VoucherGeneration(ipRefresh objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_Accounts))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("pProlims_VoucherGeneration", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@unit_Id", SqlDbType.VarChar, 20).Value = objBO.unit_Id;
                    cmd.Parameters.Add("@vchdate", SqlDbType.Date).Value = objBO.vchdate;
                    //cmd.Parameters.Add("@result", SqlDbType.VarChar, 100).Value = "";
                    //cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
                    try
                    {
                        cmd.ExecuteNonQuery();
                        processInfo = "Success";
                        //processInfo = (string)cmd.Parameters["@result"].Value.ToString();
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