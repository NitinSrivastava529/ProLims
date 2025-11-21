using ProLimsApi.Models;
using ProLimsApi.Repository.Utility;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using static ProLimsApi.Models.GeneralStoreDTO;

namespace ProLimsApi.Repository.GeneralStore
{
    public class Master
    {
        public dataSet MasterQueries(GeneralStoreQueries objBO)
        {
            dataSet dsObj = new dataSet();
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pGS_MasterQueries", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@hosp_id", SqlDbType.VarChar, 10).Value = objBO.hosp_id;
                    cmd.Parameters.Add("@mfd_id", SqlDbType.VarChar, 7).Value = objBO.mfd_id;
                    cmd.Parameters.Add("@vendor_id", SqlDbType.VarChar, 10).Value = objBO.vendor_id;
                    cmd.Parameters.Add("@mfd_name", SqlDbType.VarChar, 50).Value = objBO.mfd_name;
                    cmd.Parameters.Add("@MainCategory", SqlDbType.VarChar, 50).Value = objBO.MainCategory;
                    cmd.Parameters.Add("@item_name", SqlDbType.VarChar, 50).Value = objBO.item_name;
                    cmd.Parameters.Add("@prm_1", SqlDbType.VarChar, 50).Value = objBO.prm_1;
                    cmd.Parameters.Add("@contact_no", SqlDbType.VarChar, 12).Value = objBO.contact_no;
                    cmd.Parameters.Add("@address", SqlDbType.VarChar, 100).Value = objBO.address;
                    cmd.Parameters.Add("@country_id", SqlDbType.Int).Value = objBO.country_id;
                    cmd.Parameters.Add("@state_code", SqlDbType.Int).Value = objBO.state_id;
                    cmd.Parameters.Add("@remark", SqlDbType.VarChar, 100).Value = objBO.remark;
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
        public string InsertUpdateVendorMaster(VendorMasterBO objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("pGS_InsertUpdateVendorMaster", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@vendor_id", SqlDbType.VarChar, 10).Value = objBO.vendor_id;
                    cmd.Parameters.Add("@hosp_id", SqlDbType.VarChar, 8).Value = objBO.hosp_id;
                    cmd.Parameters.Add("@vendor_name", SqlDbType.VarChar, 50).Value = objBO.vendor_name;
                    cmd.Parameters.Add("@contact_person", SqlDbType.VarChar, 50).Value = objBO.contact_person;
                    cmd.Parameters.Add("@address1", SqlDbType.VarChar, 50).Value = objBO.address1;
                    cmd.Parameters.Add("@address2", SqlDbType.VarChar, 50).Value = objBO.address2;
                    cmd.Parameters.Add("@address3", SqlDbType.VarChar, 50).Value = objBO.address3;
                    cmd.Parameters.Add("@city", SqlDbType.VarChar, 50).Value = objBO.city;
                    cmd.Parameters.Add("@state", SqlDbType.VarChar, 50).Value = objBO.state;
                    cmd.Parameters.Add("@country", SqlDbType.VarChar, 50).Value = objBO.country;
                    cmd.Parameters.Add("@pin", SqlDbType.VarChar, 8).Value = objBO.pin;
                    cmd.Parameters.Add("@ledgerid", SqlDbType.VarChar, 16).Value = objBO.ledgerid;
                    cmd.Parameters.Add("@contact_no", SqlDbType.VarChar, 20).Value = objBO.contact_no;
                    cmd.Parameters.Add("@email", SqlDbType.VarChar, 50).Value = objBO.email;
                    cmd.Parameters.Add("@payment_mode", SqlDbType.VarChar, 20).Value = objBO.payment_mode;
                    cmd.Parameters.Add("@payment_days", SqlDbType.Int, 5).Value = objBO.payment_days;
                    cmd.Parameters.Add("@gst_no", SqlDbType.VarChar, 30).Value = objBO.gst_no;
                    cmd.Parameters.Add("@drug_lic_no", SqlDbType.VarChar, 30).Value = objBO.drug_lic_no;
                    cmd.Parameters.Add("@notes", SqlDbType.VarChar, 250).Value = objBO.notes;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.login_id;
                    cmd.Parameters.Add("@active_flag", SqlDbType.VarChar, 1).Value = objBO.active_flag;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 200).Value = "";
                    cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
                    try
                    {
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
        public string InsertUpdateManufacturer(ManufacturerBO objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("pGS_InsertUpdateManufacturer", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@hosp_id", SqlDbType.VarChar, 10).Value = objBO.hosp_id;
                    cmd.Parameters.Add("@mfd_id", SqlDbType.VarChar, 7).Value = objBO.mfd_id;
                    cmd.Parameters.Add("@mfd_name", SqlDbType.VarChar, 50).Value = objBO.mfd_name;
                    cmd.Parameters.Add("@contact_no", SqlDbType.VarChar, 12).Value = objBO.contact_no;
                    cmd.Parameters.Add("@address", SqlDbType.VarChar, 100).Value = objBO.address;
                    cmd.Parameters.Add("@remark", SqlDbType.VarChar, 100).Value = objBO.remark;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.login_id;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 200).Value = "";
                    cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
                    try
                    {
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
        public string InsertUpdateItemMaster(ItemMasterBO objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("pGS_InsertUpdateItemMaster", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@hosp_id", SqlDbType.VarChar, 10).Value = objBO.hosp_id;
                    cmd.Parameters.Add("@hsn", SqlDbType.VarChar, 8).Value = objBO.hsn;
                    cmd.Parameters.Add("@item_type", SqlDbType.VarChar, 20).Value = objBO.ItemType;
                    cmd.Parameters.Add("@GroupId", SqlDbType.VarChar, 20).Value = objBO.GroupId;
                    cmd.Parameters.Add("@item_id", SqlDbType.VarChar, 10).Value = objBO.ItemId;
                    cmd.Parameters.Add("@item_name", SqlDbType.VarChar, 200).Value = objBO.ItemName;
                    cmd.Parameters.Add("@purchase_flag", SqlDbType.VarChar, 10).Value = objBO.purchase_flag;
                    cmd.Parameters.Add("@CategoryId", SqlDbType.VarChar, 30).Value = objBO.CategoryId;
                    cmd.Parameters.Add("@rol", SqlDbType.Int).Value = objBO.rol;
                    cmd.Parameters.Add("@MOQ", SqlDbType.Int).Value = objBO.MOQ;
                    cmd.Parameters.Add("@rate", SqlDbType.Decimal).Value = objBO.rate;
                    cmd.Parameters.Add("@taxPerc", SqlDbType.Decimal).Value = objBO.taxPerc;
                    cmd.Parameters.Add("@freeToStaff", SqlDbType.Char, 1).Value = objBO.freeToStaff;
                    cmd.Parameters.Add("@remark", SqlDbType.VarChar, 200).Value = objBO.Remark;
                    cmd.Parameters.Add("@status_flag", SqlDbType.Char, 1).Value = objBO.StatusFlag;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.login_id;
                    cmd.Parameters.Add("@ShelfNo", SqlDbType.VarChar, 20).Value = objBO.ShelfNo;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 100).Value = "";
                    cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
                    try
                    {
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
        public string InsertLinkPackManufacturerToItem(ItemMasterBO objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("pGS_LinkPackManufacturerToItem", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@ItemId", SqlDbType.VarChar, 10).Value = objBO.ItemId;
                    cmd.Parameters.Add("@pack_type", SqlDbType.VarChar, 20).Value = objBO.pack_type;
                    cmd.Parameters.Add("@pack_qty", SqlDbType.Int).Value = objBO.pack_qty;
                    cmd.Parameters.Add("@mfd_id", SqlDbType.VarChar, 50).Value = objBO.MfdId;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.login_id;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 200).Value = "";
                    cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
                    try
                    {
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
        public dataSet PurchaseQueries(PurchaseQueriesBO objBO)
        {
            dataSet dsObj = new dataSet();
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pGS_PurchaseQueries", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@purchId", SqlDbType.VarChar, 16).Value = objBO.purchId;
                    cmd.Parameters.Add("@VendorCode", SqlDbType.VarChar, 16).Value = objBO.VendorCode;
                    cmd.Parameters.Add("@item_name", SqlDbType.VarChar, 50).Value = objBO.item_name;
                    cmd.Parameters.Add("@Prm1", SqlDbType.VarChar, 100).Value = objBO.prm_1;
                    cmd.Parameters.Add("@from", SqlDbType.DateTime).Value = objBO.from;
                    cmd.Parameters.Add("@to", SqlDbType.DateTime).Value = objBO.to;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 50).Value = objBO.login_id;
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
        public string InsertGroupMaster(GroupMasterBO objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("pGS_InsertGroupMaster", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@Autoid", SqlDbType.Int).Value = objBO.Autoid;
                    cmd.Parameters.Add("@GroupId", SqlDbType.VarChar, 10).Value = objBO.GroupId;
                    cmd.Parameters.Add("@Unitid", SqlDbType.VarChar, 10).Value = objBO.Unitid;
                    cmd.Parameters.Add("@GroupName", SqlDbType.VarChar, 100).Value = objBO.GroupName;
                    cmd.Parameters.Add("@TestPerfNos", SqlDbType.VarChar, 100).Value = objBO.TestPerfNos;
                    cmd.Parameters.Add("@prm2", SqlDbType.VarChar, 100).Value = objBO.prm2;
                    cmd.Parameters.Add("@prm1", SqlDbType.VarChar, 100).Value = objBO.prm1;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.login_id;
                    cmd.Parameters.Add("@itemId", SqlDbType.VarChar, 20).Value = objBO.itemId;
                    cmd.Parameters.Add("@PackType", SqlDbType.VarChar, 20).Value = objBO.PackType;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 100).Value = "";
                    cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
                    try
                    {
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
        public string PurchaseInsert(GRNInsertBO objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("pwh_GRNInsert", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 10).Value = objBO.CompId;
                    cmd.Parameters.Add("@UnitId", SqlDbType.VarChar, 20).Value = objBO.UnitId;
                    cmd.Parameters.Add("@Grn_type", SqlDbType.NVarChar, 15).Value = objBO.Grn_type;
                    cmd.Parameters.Add("@Vendor_Code", SqlDbType.NVarChar, 8).Value = objBO.Vendor_Code;
                    cmd.Parameters.Add("@Inv_No", SqlDbType.NVarChar, 50).Value = objBO.Inv_No;
                    cmd.Parameters.Add("@Inv_Date", SqlDbType.DateTime).Value = objBO.Inv_Date;
                    cmd.Parameters.Add("@NatureOfPurchase", SqlDbType.NVarChar, 50).Value = objBO.NatureOfPurchase;
                    cmd.Parameters.Add("@eWayBillNo", SqlDbType.NVarChar, 25).Value = objBO.eWayBillNo;
                    cmd.Parameters.Add("@eWayBillDate", SqlDbType.DateTime, 30).Value = (object)objBO.eWayBillDate ?? DBNull.Value;
                    cmd.Parameters.Add("@Item_id", SqlDbType.VarChar, 10).Value = objBO.Item_id;
                    cmd.Parameters.Add("@barcodeNo", SqlDbType.VarChar, 50).Value = objBO.barcodeNo;
                    cmd.Parameters.Add("@hsn", SqlDbType.VarChar, 20).Value = objBO.hsn;
                    cmd.Parameters.Add("@mfd_id", SqlDbType.VarChar, 7).Value = objBO.mfd_id;
                    cmd.Parameters.Add("@Batch_No", SqlDbType.NVarChar, 30).Value = objBO.Batch_No;
                    cmd.Parameters.Add("@Exp_Date", SqlDbType.VarChar, 30).Value = (object)objBO.Exp_Date ?? DBNull.Value;
                    cmd.Parameters.Add("@pack_type", SqlDbType.NVarChar, 20).Value = objBO.pack_type;
                    cmd.Parameters.Add("@pack_qty", SqlDbType.Int).Value = objBO.pack_qty;
                    cmd.Parameters.Add("@MRP", SqlDbType.Decimal, 15).Value = objBO.MRP;
                    cmd.Parameters.Add("@trade", SqlDbType.Decimal, 15).Value = objBO.trade;
                    cmd.Parameters.Add("@Quantity", SqlDbType.Decimal, 10).Value = objBO.Quantity;
                    cmd.Parameters.Add("@It_Free", SqlDbType.Decimal, 10).Value = objBO.It_Free;
                    cmd.Parameters.Add("@DisPer", SqlDbType.Decimal, 10).Value = objBO.DisPer;
                    cmd.Parameters.Add("@Tax_id", SqlDbType.Decimal).Value = objBO.Tax_id;
                    cmd.Parameters.Add("@BestRate", SqlDbType.Decimal, 10).Value = objBO.BestRate;
                    cmd.Parameters.Add("@Remark", SqlDbType.VarChar, 200).Value = objBO.Remark;
                    cmd.Parameters.Add("@CreatedBy", SqlDbType.NVarChar, 10).Value = objBO.CreatedBy;
                    cmd.Parameters.Add("@PayMode", SqlDbType.NVarChar, 10).Value = objBO.PayMode;
                    cmd.Parameters.Add("@freightType", SqlDbType.NVarChar, 30).Value = objBO.freightType;
                    cmd.Parameters.Add("@freightCharges", SqlDbType.Decimal, 15).Value = objBO.freightCharges;
                    cmd.Parameters.Add("@GrnNo", SqlDbType.VarChar, 16).Value = objBO.GrnNo;
                    cmd.Parameters["@GrnNo"].Direction = ParameterDirection.InputOutput;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 200).Value = "";
                    cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
                    try
                    {
                        cmd.ExecuteNonQuery();
                        processInfo = (string)cmd.Parameters["@result"].Value.ToString();
                        if (processInfo == "Success")
                        {
                            processInfo = (string)cmd.Parameters["@GrnNo"].Value.ToString();
                        }
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
        public string GRNDiscountReprocess(DiascountReprocessBO objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("pwh_GRNDiscountReprocess", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@purch_id", SqlDbType.VarChar, 18).Value = objBO.purch_id;
                    cmd.Parameters.Add("@discount_amount", SqlDbType.Decimal, 20).Value = objBO.discount_amount;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.login_id;
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
        public string DeleteGRN(PurchaseInsertBO objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("pwh_DeleteGRN", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@Auto_Id", SqlDbType.Int, 10).Value = objBO.Auto_Id;
                    cmd.Parameters.Add("@purch_Id", SqlDbType.VarChar, 16).Value = objBO.Purch_id;
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
        public string GRNPosting(PurchaseInsertBO objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("pwh_GRNPosting", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@GRNNo", SqlDbType.VarChar, 18).Value = objBO.Purch_id;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.login_id;
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
        public string GRNOtherCharges(OtherChargesBo objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("pwh_GRNOtherCharges", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@Autoid", SqlDbType.Int).Value = objBO.Autoid;
                    cmd.Parameters.Add("@GrnNo", SqlDbType.VarChar, 20).Value = objBO.GrnNo;
                    cmd.Parameters.Add("@Item_id", SqlDbType.VarChar, 20).Value = objBO.Item_id;
                    cmd.Parameters.Add("@TaxableAmount", SqlDbType.Decimal, 10).Value = objBO.TaxableAmount;
                    cmd.Parameters.Add("@taxRate", SqlDbType.Decimal, 15).Value = objBO.taxRate;
                    cmd.Parameters.Add("@Tax", SqlDbType.Decimal, 15).Value = objBO.Tax;
                    cmd.Parameters.Add("@vendor_code", SqlDbType.VarChar, 50).Value = objBO.vendor_code;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 50).Value = objBO.login_id;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
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
        public dataSet KitOrTest_TrackingQueries(TrackingBO objBO)
        {
            dataSet dsObj = new dataSet();
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pKitOrTest_TrackingQueries", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@UnitId", SqlDbType.VarChar, 20).Value = objBO.UnitId;
                    cmd.Parameters.Add("@from", SqlDbType.Date).Value = objBO.from;
                    cmd.Parameters.Add("@to", SqlDbType.Date).Value = objBO.to;
                    cmd.Parameters.Add("@GroupId", SqlDbType.VarChar, 50).Value = objBO.GroupId;
                    cmd.Parameters.Add("@Prm1", SqlDbType.VarChar, 50).Value = objBO.Prm1;
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
        public string InsertUpdatePackType(PackTypeBO objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("pGS_InsertUpdatePackType", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 10).Value = objBO.CompId;
                    cmd.Parameters.Add("@autoid", SqlDbType.Int).Value = objBO.autoid;
                    cmd.Parameters.Add("@pack_type", SqlDbType.VarChar, 50).Value = objBO.pack_type;
                    cmd.Parameters.Add("@pack_qty", SqlDbType.VarChar, 10).Value = objBO.pack_qty;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.login_id;
                    cmd.Parameters.Add("@IsActive", SqlDbType.Bit, 10).Value = objBO.IsActive;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 200).Value = "";
                    cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
                    try
                    {
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
        public string InsertHSNMaster(HSNBO objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("pGS_InsertHSNMaster", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 10).Value = objBO.CompId;
                    cmd.Parameters.Add("@HSNCode", SqlDbType.VarChar, 50).Value = objBO.HSNCode;
                    cmd.Parameters.Add("@HSNRemark", SqlDbType.VarChar, 500).Value = objBO.HSNRemark;
                    cmd.Parameters.Add("@Cgst_rate", SqlDbType.Decimal).Value = objBO.Cgst_rate;
                    cmd.Parameters.Add("@Sgst_rate", SqlDbType.Decimal).Value = objBO.Sgst_rate;
                    cmd.Parameters.Add("@Igst_rate", SqlDbType.Decimal).Value = objBO.Igst_rate;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.login_id;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 200).Value = "";
                    cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
                    try
                    {
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
        public string InsertUpdateCategory(CategoryBO objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("pGS_InsertUpdateCategory", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@hosp_id", SqlDbType.VarChar, 10).Value = objBO.hosp_id;
                    cmd.Parameters.Add("@Prm1", SqlDbType.VarChar, 100).Value = objBO.Prm1;
                    cmd.Parameters.Add("@CategoryId", SqlDbType.VarChar, 7).Value = objBO.CategoryId;
                    cmd.Parameters.Add("@MainCategoryName", SqlDbType.VarChar, 50).Value = objBO.MainCategory;
                    cmd.Parameters.Add("@CategoryName", SqlDbType.VarChar, 50).Value = objBO.CategoryName;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.login_id;
                    cmd.Parameters.Add("@IsActive", SqlDbType.Bit, 10).Value = objBO.IsActive;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 200).Value = "";
                    cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
                    try
                    {
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

        public dataSet Internal_AuditQuery(IPReport objBO)
        {
            dataSet dsObj = new dataSet();
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pInternal_AuditQuery", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@UnitCode", SqlDbType.VarChar, 50).Value = objBO.UnitCode;
                    cmd.Parameters.Add("@from", SqlDbType.Date).Value = objBO.from;
                    cmd.Parameters.Add("@To", SqlDbType.Date).Value = objBO.To;
                    cmd.Parameters.Add("@ReportName", SqlDbType.VarChar, 50).Value = objBO.ReportName;
                    cmd.Parameters.Add("@Prm1", SqlDbType.VarChar, 50).Value = objBO.Prm1;
                    cmd.Parameters.Add("@Prm2", SqlDbType.VarChar, 50).Value = objBO.Prm2;
                    cmd.Parameters.Add("@LoginId", SqlDbType.VarChar, 10).Value = objBO.LoginId;
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
        public dataSet IssueQueries(IssueBO objBO)
        {
            dataSet dsObj = new dataSet();
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pwh_IssueQueries", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 10).Value = objBO.CompId;
                    cmd.Parameters.Add("@unit_id", SqlDbType.VarChar, 10).Value = objBO.UnitId;
                    cmd.Parameters.Add("@item_id", SqlDbType.VarChar, 10).Value = objBO.ItemId;
                    cmd.Parameters.Add("@from", SqlDbType.DateTime).Value = objBO.From;
                    cmd.Parameters.Add("@to", SqlDbType.DateTime).Value = objBO.To;
                    cmd.Parameters.Add("@prm_1", SqlDbType.VarChar, 50).Value = objBO.Prm1;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.LoginId;
                    try
                    {
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

        public string InsertIssue(IssueBO objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pwh_InsertIssue", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@master_key_id", SqlDbType.VarChar, 30).Value = objBO.MasterKeyId;
                    cmd.Parameters.Add("@item_id", SqlDbType.VarChar, 50).Value = objBO.item_id;
                    cmd.Parameters.Add("@qty", SqlDbType.Int).Value = objBO.Qty;
                    cmd.Parameters.Add("@unit_id", SqlDbType.VarChar).Value = objBO.UnitId;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 50).Value = objBO.LoginId;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 20).Value = objBO.CompId;
                    cmd.Parameters.Add("@alloted_to", SqlDbType.VarChar, 50).Value = objBO.AllotedTo;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@auto_id", SqlDbType.Int).Value = objBO.AutoId;
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

        public string InsertBestRateMaster(BestRateBo objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("pGS_InsertBestRateMaster", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@autoid", SqlDbType.Int).Value = objBO.autoid;
                    cmd.Parameters.Add("@VendorId", SqlDbType.VarChar, 20).Value = objBO.VendorId;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 20).Value = objBO.CompId;
                    cmd.Parameters.Add("@UnitId", SqlDbType.VarChar, 20).Value = objBO.UnitId;
                    cmd.Parameters.Add("@ItemId", SqlDbType.VarChar, 20).Value = objBO.ItemId;
                    cmd.Parameters.Add("@pack_type", SqlDbType.VarChar, 50).Value = objBO.pack_type;
                    cmd.Parameters.Add("@mfd_id", SqlDbType.VarChar, 50).Value = objBO.mfd_id;
                    cmd.Parameters.Add("@BestRate", SqlDbType.Decimal).Value = objBO.BestRate;
                    cmd.Parameters.Add("@RatePickup", SqlDbType.Int).Value = objBO.RatePickup;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.login_id;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 200).Value = "";
                    cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
                    try
                    {
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

        public string InsertHIS_LIS_DoctorLink(Doctorlink objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pGS_InsertHIS_LIS_DoctorLink", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;

                    cmd.Parameters.Add("@LIS_DoctorId", SqlDbType.VarChar, 20).Value = objBO.LIS_DoctorId;
                    cmd.Parameters.Add("@HIS_DoctorId", SqlDbType.VarChar, 20).Value = objBO.HIS_DoctorId;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.login_id;
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

        public dataSet ReportQueries(ReportDB objBO)
        {
            dataSet dsObj = new dataSet();
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pGS_ReportQueries", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@UnitId", SqlDbType.VarChar, 500).Value = objBO.UnitId;
                    cmd.Parameters.Add("@ObservationId", SqlDbType.VarChar, 500).Value = objBO.ObservationId;
                    cmd.Parameters.Add("@prm1", SqlDbType.VarChar, 500).Value = objBO.prm1;
                    cmd.Parameters.Add("@From", SqlDbType.Date).Value = objBO.From;
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


        public string InsertPanelMaster(PanelDb objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("pGS_InsertPanelMaster", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@Unitid", SqlDbType.VarChar, 20).Value = objBO.Unitid;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 20).Value = objBO.CompId;
                    cmd.Parameters.Add("@PanelId", SqlDbType.VarChar, 50).Value = objBO.PanelId;
                    cmd.Parameters.Add("@PanelName", SqlDbType.VarChar, 20).Value = objBO.PanelName;
                    cmd.Parameters.Add("@itemId", SqlDbType.VarChar, 50).Value = objBO.itemId;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 50).Value = objBO.login_id;
                    cmd.Parameters.Add("@Rate", SqlDbType.Decimal).Value = objBO.Rate;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 200).Value = "";
                    cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
                    try
                    {
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

        public string InsertPanelLinkRate(List<PanelExcelDb> objBO)
        {
            dataSet dsObj = new dataSet();
            string processInfo = string.Empty;
            string login_id = string.Empty;
            string Logic = string.Empty;
            DataTable dt = new DataTable();
            dt.Columns.Add("PanelId", typeof(string));
            dt.Columns.Add("ItemId", typeof(string));
            dt.Columns.Add("PanelRate", typeof(decimal));
            foreach (PanelExcelDb obj in objBO)
            {
                if (obj.PanelRate > 0)
                {
                    DataRow dr = dt.NewRow();
                    dr["PanelId"] = obj.PanelId;
                    dr["ItemId"] = obj.itemId;
                    dr["PanelRate"] = obj.PanelRate;
                    login_id = obj.login_id;
                    Logic = obj.Logic;
                    dt.Rows.Add(dr);
                }

            }
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pGS_InsertPanelRateLink", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.AddWithValue("@udt_PanelRate", dt);
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 15).Value = login_id;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = Logic;
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


        public string GS_InsertProRateLink(List<Proratelink> objBO)
        {
            string processInfo = string.Empty;
            string Proid = string.Empty;
            string Logic = string.Empty;
            string LoginId = string.Empty;
            if (objBO.Count > 0)
            {

                DataTable dt = new DataTable();
                dt.Columns.Add("Month_Name", typeof(string));
                dt.Columns.Add("FinYear", typeof(string));
                dt.Columns.Add("TargetAmount", typeof(decimal));
                foreach (Proratelink obj in objBO)
                {
                    Proid = obj.ProId;
                    Logic = obj.Logic;
                    LoginId = obj.login_id;
                    DataRow dr = dt.NewRow();
                    dr["Month_Name"] = obj.Month_Name != null ? Convert.ToDateTime(obj.Month_Name).ToString("yyyy-MM-dd") : string.Empty;
                    dr["FinYear"] = obj.FinYear;
                    dr["TargetAmount"] = obj.TargetAmount;
                    dt.Rows.Add(dr);

                }
                using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
                {
                    using (SqlCommand cmd = new SqlCommand("pGS_InsertProRateLink", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandTimeout = 2500;
                        cmd.Parameters.AddWithValue("@udt_ProRate", dt);
                        cmd.Parameters.Add("@ProId", SqlDbType.VarChar, 50).Value = Proid;
                        cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 50).Value = LoginId;
                        cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = Logic;
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
            return processInfo;
        }


        public string UpdateCityRateDetails(List<CityExcelDb> objBO)
        {
            dataSet dsObj = new dataSet();
            string processInfo = string.Empty;
            string login_id = string.Empty;
            string Logic = string.Empty;
            string Unitid = string.Empty;
            string RateListId = string.Empty;
            string CompId = string.Empty;
            DataTable dt = new DataTable();
            dt.Columns.Add("RateLIstId", typeof(string));
            dt.Columns.Add("ItemId", typeof(string));
            dt.Columns.Add("MRPRate", typeof(decimal));
            dt.Columns.Add("CityRate", typeof(decimal));
            dt.Columns.Add("RateType", typeof(string));
            foreach (CityExcelDb obj in objBO)
            {
                if (obj.CityRate > 0)
                {
                    DataRow dr = dt.NewRow();
                    dr["RateLIstId"] = '-';
                    dr["ItemId"] = obj.itemId;
                    dr["MRPRate"] = obj.MRPRate;
                    dr["CityRate"] = obj.CityRate;
                    dr["RateType"] = obj.RateType;
                    login_id = obj.login_id;
                    Unitid = obj.Unitid;
                    RateListId = obj.RateLIstId;
                    CompId = obj.CompId;
                    Logic = obj.Logic;
                    dt.Rows.Add(dr);
                }

            }
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pGS_ExcelUploadCityRate", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.AddWithValue("@udt_CityRate", dt);
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 15).Value = login_id;
                    cmd.Parameters.Add("@UnitId", SqlDbType.VarChar, 15).Value = Unitid;
                    cmd.Parameters.Add("@RateListId", SqlDbType.VarChar, 50).Value = RateListId;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 50).Value = CompId;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = Logic;
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

        public string GS_InsertDoctorMaster(ipDoctor objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("pGS_InsertDoctorMaster", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@Unitid", SqlDbType.VarChar, 20).Value = objBO.Unitid;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 20).Value = objBO.CompId;
                    cmd.Parameters.Add("@ClientId", SqlDbType.VarChar, 50).Value = objBO.ClientId;
                    cmd.Parameters.Add("@DoctorId", SqlDbType.VarChar, 20).Value = objBO.DoctorId;
                    cmd.Parameters.Add("@DoctorName", SqlDbType.VarChar, 100).Value = objBO.DoctorName;
                    cmd.Parameters.Add("@MobileNo", SqlDbType.VarChar, 10).Value = objBO.MobileNo;
                    cmd.Parameters.Add("@Specialization", SqlDbType.VarChar, 200).Value = objBO.Specialization;
                    cmd.Parameters.Add("@Degree", SqlDbType.VarChar, 200).Value = objBO.Degree;
                    cmd.Parameters.Add("@LoginId", SqlDbType.VarChar, 10).Value = objBO.LoginId;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 200).Value = "";
                    cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
                    try
                    {
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


        public dataSet Diag_ClientQueries(GeneralStoreQueries objBO)
        {
            dataSet dsObj = new dataSet();
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pDiag_ClientQueries", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@hosp_id", SqlDbType.VarChar, 10).Value = objBO.hosp_id;
                    cmd.Parameters.Add("@mfd_id", SqlDbType.VarChar, 7).Value = objBO.mfd_id;
                    cmd.Parameters.Add("@vendor_id", SqlDbType.VarChar, 10).Value = objBO.vendor_id;
                    cmd.Parameters.Add("@mfd_name", SqlDbType.VarChar, 50).Value = objBO.mfd_name;
                    cmd.Parameters.Add("@MainCategory", SqlDbType.VarChar, 50).Value = objBO.MainCategory;
                    cmd.Parameters.Add("@item_name", SqlDbType.VarChar, 50).Value = objBO.item_name;
                    cmd.Parameters.Add("@prm_1", SqlDbType.VarChar, 50).Value = objBO.prm_1;
                    cmd.Parameters.Add("@contact_no", SqlDbType.VarChar, 12).Value = objBO.contact_no;
                    cmd.Parameters.Add("@address", SqlDbType.VarChar, 100).Value = objBO.address;
                    cmd.Parameters.Add("@country_id", SqlDbType.Int).Value = objBO.country_id;
                    cmd.Parameters.Add("@state_code", SqlDbType.Int).Value = objBO.state_id;
                    cmd.Parameters.Add("@remark", SqlDbType.VarChar, 100).Value = objBO.remark;
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

        public string Diag_InsertClientMasterNew(IpClient objBO)
        {
            dataSet dsObj = new dataSet();
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pDiag_InsertClientMasterNew", con))
                {

                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@UnitId", SqlDbType.VarChar, 20).Value = objBO.UnitId;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 20).Value = objBO.CompId;
                    cmd.Parameters.Add("@ClientId", SqlDbType.VarChar, 20).Value = objBO.ClientId;
                    cmd.Parameters.Add("@ClientName", SqlDbType.VarChar, 100).Value = objBO.ClientName;
                    cmd.Parameters.Add("@ClientType", SqlDbType.VarChar, 20).Value = objBO.ClientType;
                    cmd.Parameters.Add("@CityName", SqlDbType.VarChar, 100).Value = objBO.CityName;
                    cmd.Parameters.Add("@StateName", SqlDbType.VarChar, 100).Value = objBO.StateName;
                    cmd.Parameters.Add("@Address", SqlDbType.VarChar, 5000).Value = objBO.Address;
                    cmd.Parameters.Add("@PINCode", SqlDbType.VarChar, 10).Value = objBO.PINCode;
                    cmd.Parameters.Add("@EmailId", SqlDbType.VarChar, 50).Value = objBO.EmailId;
                    cmd.Parameters.Add("@LoginId", SqlDbType.VarChar, 50).Value = objBO.LoginId;
                    cmd.Parameters.Add("@ClientGroupName", SqlDbType.VarChar, 50).Value = objBO.ClientGroupName;
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

        public string Diag_InsertClientPair(ipClientPer objMaster, List<ipClientPair> objPairList)
        {
            dataSet dsObj = new dataSet();
            string processInfo = string.Empty;
            DataTable dt = new DataTable();
            dt.Columns.Add("PaymentType", typeof(string));
            dt.Columns.Add("CreditLimit", typeof(decimal));
            dt.Columns.Add("CreditDays", typeof(string));
            dt.Columns.Add("CityRateListId", typeof(string));
            dt.Columns.Add("ClientRateListId", typeof(string));
            dt.Columns.Add("ExtLedgerId", typeof(string));
            if (objPairList.Count > 0)
            {
                foreach (ipClientPair obj in objPairList)
                {

                    DataRow dr = dt.NewRow();
                    dr["PaymentType"] = obj.PaymentType;
                    dr["CreditLimit"] = obj.CreditLimit;
                    dr["CreditDays"] = obj.CreditDays;
                    dr["CityRateListId"] = obj.CityRateListId;
                    dr["ClientRateListId"] = obj.ClientRateListId;
                    dr["ExtLedgerId"] = obj.ExtLedgerId;
                    dt.Rows.Add(dr);

                }
            }
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pDiag_InsertClientPair", con))
                {

                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.AddWithValue("@udt_ClientPair", dt);
                    cmd.Parameters.Add("@ClientId", SqlDbType.VarChar, 20).Value = objMaster.ClientId;
                    cmd.Parameters.Add("@UnitId ", SqlDbType.VarChar, 25).Value = objMaster.UnitId;
                    cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 20).Value = objMaster.CompId;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 50).Value = objMaster.login_id;
                    cmd.Parameters.Add("@logic", SqlDbType.VarChar, 50).Value = objMaster.logic;
                    cmd.Parameters.Add("@prm1", SqlDbType.VarChar, 50).Value = objMaster.prm1;
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
    }
}