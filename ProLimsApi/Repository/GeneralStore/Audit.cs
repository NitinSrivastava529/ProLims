using ProLimsApi.Models;
using ProLimsApi.Repository.Utility;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using static ProLimsApi.Models.AuditModal;

namespace ProLimsApi.Repository.GeneralStore
{
    public class Audit
    {
        public dataSet AuditQueries(AuditBO objBO)
        {
            dataSet dsObj = new dataSet();
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pwh_AuditQueries", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 20).Value = objBO.CompId;
                    cmd.Parameters.Add("@UnitId", SqlDbType.VarChar, 20).Value = objBO.UnitId;
                    cmd.Parameters.Add("@DeptId", SqlDbType.VarChar, 10).Value = objBO.DeptId;
                    cmd.Parameters.Add("@CartId", SqlDbType.VarChar, 10).Value = objBO.CartId;
                    cmd.Parameters.Add("@ItemId", SqlDbType.VarChar, 10).Value = objBO.ItemId;
                    cmd.Parameters.Add("@MasterKeyId", SqlDbType.VarChar, 10).Value = objBO.MasterKeyId;
                    cmd.Parameters.Add("@AuditNo", SqlDbType.VarChar, 10).Value = objBO.AuditNo;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 100).Value = objBO.Logic;
                    cmd.Parameters.Add("@loginId", SqlDbType.VarChar, 100).Value = objBO.login_id;
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
                    finally
                    {
                        con.Close();
                    }
                    return dsObj;
                }
            }
        }
        public string InsertAuditMaster(AuditMasterBO objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("pwh_InsertAuditMaster", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@CartId", SqlDbType.VarChar, 10).Value = objBO.CartId;
                    cmd.Parameters.Add("@audit_no", SqlDbType.VarChar, 16).Value = objBO.audit_no;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 20).Value = objBO.CompId;
                    cmd.Parameters.Add("@UnitId", SqlDbType.VarChar, 20).Value = objBO.UnitId;
                    cmd.Parameters.Add("@audit_remark", SqlDbType.NVarChar, 500).Value = objBO.audit_remark;
                    cmd.Parameters.Add("@login_id", SqlDbType.NVarChar, 10).Value = objBO.login_id;
                    cmd.Parameters.Add("@IsOpen", SqlDbType.NVarChar, 10).Value = objBO.IsOpen;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 100).Value = objBO.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 200).Value = "";
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
        public string InsertAuditInfo(AuditInfoBO objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("pwh_InsertAuditInfo", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;

                    cmd.Parameters.Add("@AutoId", SqlDbType.Int).Value = objBO.AutoId;
                    cmd.Parameters.Add("@audit_no", SqlDbType.VarChar, 20).Value = objBO.AuditNo;
                    cmd.Parameters.Add("@audittype", SqlDbType.VarChar, 20).Value = objBO.AuditType;
                    cmd.Parameters.Add("@ItemId", SqlDbType.VarChar, 20).Value = objBO.ItemId;
                    cmd.Parameters.Add("@masterkeyid", SqlDbType.VarChar, 25).Value = objBO.MasterKeyId;
                    cmd.Parameters.Add("@batchNo", SqlDbType.VarChar, 50).Value = objBO.batchNo;
                    cmd.Parameters.Add("@exp_date", SqlDbType.Date).Value = objBO.exp_date;
                    cmd.Parameters.Add("@mrp", SqlDbType.Decimal).Value = objBO.mrp;
                    cmd.Parameters.Add("@qty", SqlDbType.BigInt).Value = objBO.Qty;
                    cmd.Parameters.Add("@CartStock", SqlDbType.BigInt).Value = objBO.CartStock;
                    cmd.Parameters.Add("@CartId", SqlDbType.VarChar, 20).Value = objBO.CartId;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@login_id", SqlDbType.NVarChar, 15).Value = objBO.login_id;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 20).Value = objBO.CompId;
                    cmd.Parameters.Add("@UnitId", SqlDbType.VarChar, 20).Value = objBO.UnitId;
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
        public string AuditCompletion(AuditInfoBO objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("pwh_AuditCompletion", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@UnitId", SqlDbType.VarChar, 20).Value = objBO.UnitId;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 20).Value = objBO.CompId;
                    cmd.Parameters.Add("@AuditNo", SqlDbType.VarChar, 20).Value = objBO.AuditNo;
                    cmd.Parameters.Add("@AuditType", SqlDbType.VarChar, 50).Value = objBO.AuditType;
                    cmd.Parameters.Add("@loginId", SqlDbType.NVarChar, 10).Value = objBO.login_id;
                    cmd.Parameters.Add("@Logic", SqlDbType.NVarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 200).Value = "";
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