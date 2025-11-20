using ProLimsApi.Models;
using ProLimsApi.Repository.Utility;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text.Json;

namespace ProLimsApi.Repository.GeneralStore
{
    public class Indent
    {
        public string GS_GenerateManualPO(ipIndent objBO, List<ManualPO> item)
        {
            string processInfo = string.Empty;
            if (item.Count > 0)
            {
                DataTable dt = new DataTable();
                dt.Columns.Add("ItemId", typeof(string));
                dt.Columns.Add("PackType", typeof(string));
                dt.Columns.Add("Qty", typeof(int));
                foreach (ManualPO m in item)
                {
                    DataRow dr = dt.NewRow();
                    dr["ItemId"] = m.ItemId;
                    dr["PackType"] = m.PackType;
                    dr["Qty"] = m.Qty;
                    dt.Rows.Add(dr);
                }
                using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
                {
                    using (SqlCommand cmd = new SqlCommand("pGS_GenerateManualPO", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandTimeout = 2500;
                        cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 20).Value = objBO.CompId;
                        cmd.Parameters.Add("@unit_id", SqlDbType.VarChar, 20).Value = objBO.UnitId;
                        cmd.Parameters.Add("@po_no", SqlDbType.VarChar, 20).Value = objBO.po_no;
                        cmd.Parameters.AddWithValue("udt_ManualPO", dt);
                        cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.LoginId;
                        cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                        cmd.Parameters.Add("@result", SqlDbType.VarChar, 100).Value = "";
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
                    }
                }
            }
            return processInfo;
        }
        public string wh_DispatchComplete(ipIndent objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pwh_DispatchComplete", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 20).Value = objBO.CompId;
                    cmd.Parameters.Add("@UnitId", SqlDbType.VarChar, 20).Value = objBO.UnitId;
                    cmd.Parameters.Add("@AutoId", SqlDbType.Int).Value = objBO.AutoId;
                    cmd.Parameters.Add("@MasterKeyId", SqlDbType.VarChar, 20).Value = objBO.MasterKeyId;
                    cmd.Parameters.Add("@ItemId", SqlDbType.VarChar, 20).Value = objBO.ItemId;
                    cmd.Parameters.Add("@PackType", SqlDbType.VarChar, 20).Value = objBO.PackType;
                    cmd.Parameters.Add("@LotNo", SqlDbType.VarChar, 20).Value = objBO.LotNo;
                    cmd.Parameters.Add("@Qty", SqlDbType.Int).Value = objBO.Qty;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 20).Value = objBO.LoginId;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 100).Value = "";
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
        public dataSet GS_DispatchQueries(DispatchBO objBO)
        {
            dataSet dsObj = new dataSet();
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pGS_DispatchQueries", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 20).Value = objBO.CompId;
                    cmd.Parameters.Add("@UnitId", SqlDbType.VarChar, 20).Value = objBO.UnitId;
                    cmd.Parameters.Add("@DispatchTo", SqlDbType.VarChar, 20).Value = objBO.DispatchTo;
                    cmd.Parameters.Add("@IndentNo", SqlDbType.VarChar, 20).Value = objBO.IndentNo;
                    cmd.Parameters.Add("@ItemId", SqlDbType.VarChar, 16).Value = objBO.ItemId;
                    cmd.Parameters.Add("@MasterKeyId", SqlDbType.VarChar, 20).Value = objBO.MasterKeyId;
                    cmd.Parameters.Add("@from", SqlDbType.DateTime).Value = objBO.From;
                    cmd.Parameters.Add("@to", SqlDbType.DateTime).Value = objBO.To;
                    cmd.Parameters.Add("@prm1", SqlDbType.VarChar).Value = objBO.Prm1;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.LoginId;
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
        public string wh_GRNPosting(IndentBO objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pwh_GRNPosting", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@GRNNo", SqlDbType.VarChar, 15).Value = objBO.GrnNo;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 20).Value = objBO.LoginId;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 100).Value = "";
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
        public string wh_GRNInsert(GRNInfo objBO, List<GRNItem> items)
        {
            string processInfo = string.Empty;
            if (items.Count > 0)
            {
                DataTable dt = new DataTable();
                dt.Columns.Add("AutoId", typeof(int));
                dt.Columns.Add("Item_id", typeof(string));
                dt.Columns.Add("barcodeNo", typeof(string));
                dt.Columns.Add("hsn", typeof(string));
                dt.Columns.Add("mfd_id", typeof(string));
                dt.Columns.Add("Batch_No", typeof(string));
                dt.Columns.Add("Exp_Date", typeof(DateTime));
                dt.Columns.Add("pack_type", typeof(string));
                dt.Columns.Add("pack_qty", typeof(int));
                dt.Columns.Add("MRP", typeof(decimal));
                dt.Columns.Add("trade", typeof(decimal));
                dt.Columns.Add("Quantity", typeof(decimal));
                dt.Columns.Add("It_Free", typeof(decimal));
                dt.Columns.Add("DisPer", typeof(decimal));
                dt.Columns.Add("Tax_id", typeof(int));
                dt.Columns.Add("BestRate", typeof(decimal));
                dt.Columns.Add("ItemType", typeof(string));
                foreach (GRNItem item in items)
                {
                    DataRow dr = dt.NewRow();
                    dr["AutoId"] = item.AutoId;
                    dr["Item_id"] = item.Item_id;
                    dr["barcodeNo"] = item.barcodeNo;
                    dr["hsn"] = item.hsn;
                    dr["mfd_id"] = item.mfd_id;
                    dr["Batch_No"] = item.Batch_No;
                    dr["Exp_Date"] = item.Exp_Date;
                    dr["pack_type"] = item.pack_type;
                    dr["pack_qty"] = item.pack_qty;
                    dr["MRP"] = item.MRP;
                    dr["trade"] = item.trade;
                    dr["Quantity"] = item.Quantity;
                    dr["It_Free"] = item.It_Free;
                    dr["DisPer"] = item.DisPer;
                    dr["Tax_id"] = item.Tax_id;
                    dr["BestRate"] = item.BestRate;
                    dr["ItemType"] = item.ItemType;
                    dt.Rows.Add(dr);
                }
                using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
                {
                    using (SqlCommand cmd = new SqlCommand("pwh_GRNInsertNew", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandTimeout = 2500;
                        cmd.Parameters.Add("@AutoId", SqlDbType.Int).Value = objBO.AutoId;
                        cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 10).Value = objBO.CompId;
                        cmd.Parameters.Add("@UnitId", SqlDbType.VarChar, 20).Value = objBO.UnitId;
                        cmd.Parameters.Add("@Grn_type", SqlDbType.VarChar, 15).Value = objBO.Grn_type;
                        cmd.Parameters.Add("@Vendor_Code", SqlDbType.VarChar, 10).Value = objBO.Vendor_Code;
                        cmd.Parameters.Add("@po_no", SqlDbType.VarChar, 20).Value = objBO.po_no;
                        cmd.Parameters.Add("@Inv_No", SqlDbType.VarChar, 50).Value = objBO.Inv_No;
                        cmd.Parameters.Add("@Inv_Date", SqlDbType.DateTime).Value = objBO.Inv_Date;
                        cmd.Parameters.Add("@NatureOfPurchase", SqlDbType.VarChar, 50).Value = objBO.NatureOfPurchase;
                        cmd.Parameters.Add("@eWayBillNo", SqlDbType.VarChar, 25).Value = objBO.eWayBillNo;
                        cmd.Parameters.Add("@eWayBillDate", SqlDbType.DateTime).Value = objBO.eWayBillDate;
                        cmd.Parameters.AddWithValue("udt_GRNItemInfo", dt);
                        cmd.Parameters.Add("@Remark", SqlDbType.VarChar, 200).Value = objBO.Remark;
                        cmd.Parameters.Add("@CreatedBy", SqlDbType.VarChar, 10).Value = objBO.CreatedBy;
                        cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                        cmd.Parameters.Add("@result", SqlDbType.VarChar, 100).Value = "";
                        cmd.Parameters.Add("@GrnNo", SqlDbType.VarChar, 50).Value = objBO.GrnNo;
                        cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
                        cmd.Parameters["@GrnNo"].Direction = ParameterDirection.InputOutput;
                        try
                        {
                            con.Open();
                            cmd.ExecuteNonQuery();
                            var response = new
                            {
                                result = (string)cmd.Parameters["@result"].Value.ToString(),
                                GrnNo = (string)cmd.Parameters["@GrnNo"].Value.ToString(),
                            };
                            processInfo = JsonSerializer.Serialize(response);
                        }
                        catch (SqlException sqlEx)
                        {
                            processInfo = "Error Found   : " + sqlEx.Message;
                        }
                        finally { con.Close(); }
                    }
                }
            }
            return processInfo;
        }
        public dataSet GS_PurchaseOrderQueries(IndentBO objBO)
        {
            dataSet dsObj = new dataSet();
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pGS_PurchaseOrderQueries", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 20).Value = objBO.CompId;
                    cmd.Parameters.Add("@unit_id", SqlDbType.VarChar, 10).Value = objBO.UnitId;
                    cmd.Parameters.Add("@IndentNo", SqlDbType.VarChar, 16).Value = objBO.indent_no;
                    cmd.Parameters.Add("@PONo", SqlDbType.VarChar, 16).Value = objBO.PONo;
                    cmd.Parameters.Add("@GrnNo", SqlDbType.VarChar, 20).Value = objBO.GrnNo;
                    cmd.Parameters.Add("@vendor_id", SqlDbType.VarChar, 16).Value = objBO.VendorId;
                    cmd.Parameters.Add("@item_id", SqlDbType.VarChar, 10).Value = objBO.ItemId;
                    cmd.Parameters.Add("@from", SqlDbType.DateTime).Value = objBO.From;
                    cmd.Parameters.Add("@to", SqlDbType.DateTime).Value = objBO.To;
                    cmd.Parameters.Add("@Prm1", SqlDbType.VarChar).Value = objBO.Prm1;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.LoginId;
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
        public string GS_GeneratePurchaseOrder(ipIndent objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pGS_GeneratePurchaseOrder", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 20).Value = objBO.CompId;
                    cmd.Parameters.Add("@unit_id", SqlDbType.VarChar, 20).Value = objBO.UnitId;
                    cmd.Parameters.Add("@Prm1", SqlDbType.VarChar, 200).Value = objBO.Prm1;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 20).Value = objBO.LoginId;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 100).Value = "";
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
        public string GS_IndentProcInsertUpdate(IndentBO objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pGS_IndentProcInsertUpdate", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 50).Value = objBO.CompId;
                    cmd.Parameters.Add("@unit_id", SqlDbType.VarChar, 50).Value = objBO.UnitId;
                    cmd.Parameters.Add("@indent_no", SqlDbType.VarChar, 50).Value = objBO.indent_no;
                    cmd.Parameters.Add("@item_id", SqlDbType.VarChar, 50).Value = objBO.ItemId;
                    cmd.Parameters.Add("@Pack_type", SqlDbType.VarChar, 50).Value = objBO.PackType;
                    cmd.Parameters.Add("@AutoId", SqlDbType.BigInt, 50).Value = objBO.AutoId;
                    cmd.Parameters.Add("@pack_qty", SqlDbType.Int).Value = objBO.PackQuantity;
                    cmd.Parameters.Add("@qty", SqlDbType.Int).Value = objBO.qty;
                    cmd.Parameters.Add("@indent_by", SqlDbType.VarChar, 50).Value = objBO.LoginId;
                    cmd.Parameters.Add("@uDailyAvg", SqlDbType.Decimal).Value = objBO.uDailyAvg;
                    cmd.Parameters.Add("@stockAtUnit", SqlDbType.Decimal).Value = objBO.UnitStock;
                    cmd.Parameters.Add("@Remark", SqlDbType.VarChar, 500).Value = objBO.Remark;
                    cmd.Parameters.Add("@IndentType", SqlDbType.VarChar, 50).Value = objBO.IndentType;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 100).Value = "";
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
        public dataSet GS_IndentProcessingQueries(IndentBO objBO)
        {
            dataSet dsObj = new dataSet();
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("PGS_IndentProcessingQueries", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 20).Value = objBO.CompId;
                    cmd.Parameters.Add("@unit_id", SqlDbType.VarChar, 10).Value = objBO.UnitId;
                    cmd.Parameters.Add("@indent_no", SqlDbType.VarChar, 16).Value = objBO.indent_no;
                    cmd.Parameters.Add("@item_id", SqlDbType.VarChar, 10).Value = objBO.ItemId;
                    cmd.Parameters.Add("@from", SqlDbType.DateTime).Value = objBO.From;
                    cmd.Parameters.Add("@to", SqlDbType.DateTime).Value = objBO.To;
                    cmd.Parameters.Add("@prm_1", SqlDbType.VarChar, 100).Value = objBO.Prm1;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.LoginId;
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
        public dataSet Indent_Queries(IndentBO objBO)
        {
            dataSet dsObj = new dataSet();
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pGS_IndentQueries", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 20).Value = objBO.CompId;
                    cmd.Parameters.Add("@unit_id", SqlDbType.VarChar, 10).Value = objBO.UnitId;
                    cmd.Parameters.Add("@indent_no", SqlDbType.VarChar, 16).Value = objBO.indent_no;
                    cmd.Parameters.Add("@item_id", SqlDbType.VarChar, 10).Value = objBO.ItemId;
                    cmd.Parameters.Add("@from", SqlDbType.DateTime).Value = objBO.From;
                    cmd.Parameters.Add("@to", SqlDbType.DateTime).Value = objBO.To;
                    cmd.Parameters.Add("@prm_1", SqlDbType.VarChar, 100).Value = objBO.Prm1;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.LoginId;
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
        public string GS_InsertModifyIndent(IndentBO objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pGS_InsertModifyIndent", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 50).Value = objBO.CompId;
                    cmd.Parameters.Add("@unit_id", SqlDbType.VarChar, 50).Value = objBO.UnitId;
                    cmd.Parameters.Add("@indent_no", SqlDbType.VarChar, 50).Value = objBO.indent_no;
                    cmd.Parameters.Add("@item_id", SqlDbType.VarChar, 50).Value = objBO.ItemId;
                    cmd.Parameters.Add("@Pack_type", SqlDbType.VarChar, 50).Value = objBO.PackType;
                    cmd.Parameters.Add("@pack_qty", SqlDbType.VarChar, 50).Value = objBO.PackQuantity;
                    cmd.Parameters.Add("@qty", SqlDbType.VarChar, 50).Value = objBO.qty;
                    cmd.Parameters.Add("@indent_by", SqlDbType.VarChar, 50).Value = objBO.LoginId;
                    cmd.Parameters.Add("@uDailyAvg", SqlDbType.Decimal).Value = objBO.uDailyAvg;
                    cmd.Parameters.Add("@stockAtUnit", SqlDbType.Decimal).Value = objBO.UnitStock;
                    cmd.Parameters.Add("@Remark", SqlDbType.VarChar, 500).Value = objBO.Remark;
                    cmd.Parameters.Add("@IndentType", SqlDbType.VarChar, 50).Value = objBO.IndentType;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 100).Value = "";
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
    }
}