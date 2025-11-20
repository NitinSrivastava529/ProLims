using ProLimsApi.Models;
using ProLimsApi.Repository.Utility;
using System.Data;
using System.Data.SqlClient;

namespace ProLimsApi.Repository.SalesApp
{
    public class SalesApp
    {
        public string SalesApp_InsertDoctorVisit(ipSalesAppBO ip)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pSalesApp_InsertDoctorVisit", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@DoctorId", SqlDbType.VarChar, 20).Value = ip.DoctorId;
                    cmd.Parameters.Add("@ProId", SqlDbType.VarChar, 20).Value = ip.ProId;
                    cmd.Parameters.Add("@lat", SqlDbType.VarChar).Value =ip.latitude;
                    cmd.Parameters.Add("@long", SqlDbType.VarChar).Value =ip.longitude;
                    cmd.Parameters.Add("@VisitRemark", SqlDbType.VarChar, 500).Value = ip.VisitRemark;
                    cmd.Parameters.Add("@loginId", SqlDbType.VarChar, 20).Value = ip.loginId;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = ip.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 50).Value = "";
                    cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
                    try
                    {
                        con.Open();
                        cmd.ExecuteNonQuery();
                        processInfo = (string)cmd.Parameters["@result"].Value.ToString();
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
        public dataSet SalesApp_DoctorVisitQueries(ipSalesAppBO ip)
        {
            dataSet dsObj = new dataSet();
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pSalesApp_DoctorVisitQueries", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@DoctorId", SqlDbType.VarChar, 20).Value = ip.DoctorId;
                    cmd.Parameters.Add("@ProId", SqlDbType.VarChar, 20).Value = ip.ProId;                 
                    cmd.Parameters.Add("@from", SqlDbType.VarChar).Value = ip.from;
                    cmd.Parameters.Add("@to", SqlDbType.VarChar).Value = ip.to;
                    cmd.Parameters.Add("@Prm1", SqlDbType.VarChar, 100).Value = ip.Prm1;
                    cmd.Parameters.Add("@Prm2", SqlDbType.VarChar, 100).Value = ip.Prm2;
                    cmd.Parameters.Add("@loginId", SqlDbType.VarChar, 20).Value = ip.loginId;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = ip.Logic;
                    try
                    {
                        con.Open();
                        DataSet ds = new DataSet();
                        SqlDataAdapter da = new SqlDataAdapter(cmd);
                        da.Fill(ds);
                        dsObj.Msg = "-";
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