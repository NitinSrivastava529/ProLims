using ProLimsApi.Models;
using ProLimsApi.Repository.Utility;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ProLimsApi.Repository.B2B
{
    public class B2BClient
    {
        public dataSet diag_SampleLabReceivingQueries(ipsampleRecive ip)
        {
            dataSet dsObj = new dataSet();
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pdiag_SampleLabReceivingQueries", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 10).Value = ip.CompId;
                    cmd.Parameters.Add("@ClientId ", SqlDbType.VarChar, 20).Value = ip.ClientId;
                    cmd.Parameters.Add("@VisitNo", SqlDbType.VarChar, 20).Value = ip.VisitNo;
                    cmd.Parameters.Add("@BarcodeNo", SqlDbType.VarChar, 20).Value = ip.BarcodeNo;
                    cmd.Parameters.Add("@SubCatId", SqlDbType.VarChar, 10).Value = ip.SubCatId;
                    cmd.Parameters.Add("@DispatchNo", SqlDbType.VarChar, 20).Value = ip.DispatchNo;
                    cmd.Parameters.Add("@DispatchLabCode", SqlDbType.VarChar, 20).Value = ip.DispatchLabCode;
                    cmd.Parameters.Add("@TestCode", SqlDbType.VarChar, 10).Value = ip.TestCode;
                    cmd.Parameters.Add("@from", SqlDbType.Date).Value = ip.from;
                    cmd.Parameters.Add("@to", SqlDbType.Date).Value = ip.to;
                    cmd.Parameters.Add("@Prm1", SqlDbType.VarChar, 50).Value = ip.Prm1;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = ip.login_id;
                    cmd.Parameters.Add("@unitId", SqlDbType.VarChar, 10).Value = ip.unitId;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = ip.Logic;
                    try
                    {
                        con.Open();
                        DataSet ds = new DataSet();
                        SqlDataAdapter da = new SqlDataAdapter(cmd);
                        da.Fill(ds);
                        dsObj.Msg = "Success";
                        dsObj.ResultSet = ds;
                    }
                    catch (SqlException sqlEx)
                    {
                        dsObj.ResultSet = null;
                        dsObj.Msg = "Error Found   : " + sqlEx.Message;
                    }
                    finally { con.Close(); }
                    return dsObj;
                }
            }
        }
    }
}