using ProLimsApi.Models;
using ProLimsApi.Repository.Utility;
using System.Data;
using System.Data.SqlClient;

namespace ProLimsApi.Repository.AccessControl
{
    public class Authentication
    {
        public string Config_InsertUpdate(ipAuthentication ip)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pConfig_InsertUpdate", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@comp_id", SqlDbType.VarChar, 10).Value = ip.comp_id;
                    cmd.Parameters.Add("@unit_id", SqlDbType.VarChar, 10).Value = ip.unit_id;
                    cmd.Parameters.Add("@menu_id", SqlDbType.VarChar, 20).Value = ip.menu_id;
                    cmd.Parameters.Add("@sub_menu_id", SqlDbType.VarChar, 20).Value = ip.sub_menu_id;
                    cmd.Parameters.Add("@menu_name", SqlDbType.VarChar, 100).Value = ip.menu_name;
                    cmd.Parameters.Add("@emp_code", SqlDbType.VarChar, 16).Value = ip.emp_code;
                    cmd.Parameters.Add("@Prm1", SqlDbType.VarChar).Value = ip.Prm1;
                    cmd.Parameters.Add("@Prm2", SqlDbType.VarChar).Value = ip.Prm2;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar).Value = ip.login_id;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 200).Value = ip.Logic;
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
        public dataSet Auth_ConfigQueries(ipAuthentication ip)
        {
            dataSet dsObj = new dataSet();
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pAuth_ConfigQueries", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@comp_id", SqlDbType.VarChar, 10).Value = ip.comp_id;
                    cmd.Parameters.Add("@unit_id", SqlDbType.VarChar, 10).Value = ip.unit_id;
                    cmd.Parameters.Add("@LoginId", SqlDbType.VarChar, 16).Value = ip.LoginId;
                    cmd.Parameters.Add("@password", SqlDbType.VarChar).Value = ip.Password;
                    cmd.Parameters.Add("@role_id", SqlDbType.VarChar).Value = ip.role_id;
                    cmd.Parameters.Add("@menu_id", SqlDbType.VarChar, 50).Value = ip.menu_id;
                    cmd.Parameters.Add("@sub_menu_id", SqlDbType.VarChar, 50).Value = ip.sub_menu_id;
                    cmd.Parameters.Add("@Prm1", SqlDbType.VarChar).Value = ip.Prm1;
                    cmd.Parameters.Add("@Prm2", SqlDbType.VarChar).Value = ip.Prm2;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 200).Value = ip.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 50).Value = "";
                    cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
                    try
                    {
                        con.Open();
                        DataSet ds = new DataSet();
                        SqlDataAdapter da = new SqlDataAdapter(cmd);
                        da.Fill(ds);
                        dsObj.Msg = (string)cmd.Parameters["@result"].Value.ToString();
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