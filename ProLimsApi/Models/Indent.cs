using System;
using System.Collections.Generic;

namespace ProLimsApi.Models
{
    public class ipIndent
    {
        public int AutoId { get; set; }
        public int Qty { get; set; }
        public string WarehouseId { get; set; }
        public string CompId { get; set; }
        public string UnitId { get; set; }
        public string po_no { get; set; }
        public string TrnNo { get; set; }
        public string ItemId { get; set; }
        public string PackType { get; set; }
        public string MasterKeyId { get; set; }
        public string Prm1 { get; set; }
        public string LotNo { get; set; }
        public string Prm2 { get; set; }
        public string ReturnSource { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public string Logic { get; set; }
        public string LoginId { get; set; }
        public string OutPutType { get; set; }
    }
    public class HealthCardInfo
    {
        public string autoId { get; set; }
        public string UnitId { get; set; }
        public string labcode { get; set; }
        public string card_no { get; set; }
        public string member_id { get; set; }
        public string m_type { get; set; }
        public string cust_name { get; set; }
        public string gender { get; set; }
        public string dob { get; set; }
        public string mobileno { get; set; }
        public string UHID { get; set; }
        public string area { get; set; }
        public string Locality { get; set; }
        public string district { get; set; }
        public string state { get; set; }
        public string email { get; set; }
        public string prm_1 { get; set; }
        public string from { get; set; }
        public string to { get; set; }
        public string pin { get; set; }
        public string logic { get; set; }
        public string login_id { get; set; }
    }
    public class AppAttendance
    {
        public string CentreId { get; set; }
        public string emp_code { get; set; }
        public string CurLat { get; set; }
        public string CurLong { get; set; }
        public string AppName { get; set; }
        public string Logic { get; set; }
    }
    public class ManualPO_Tran
    {
        public ipIndent objBO { get; set; }
        public List<ManualPO> item { get; set; }
    }
    public class ManualPO
    {
        public string ItemId { get; set; }
        public string PackType { get; set; }
        public int Qty { get; set; }
    }
    public class GRNInfo : ipIndent
    {
        public string Grn_type { get; set; }
        public string Vendor_Code { get; set; }
        public string po_no { get; set; }
        public string Inv_No { get; set; }
        public DateTime Inv_Date { get; set; }
        public string NatureOfPurchase { get; set; }
        public string eWayBillNo { get; set; }
        public DateTime eWayBillDate { get; set; }
        public decimal TaxableAmount { get; set; }
        public decimal TaxableRate { get; set; }
        public decimal Tax { get; set; }
        public string GrnNo { get; set; }
        public string Remark { get; set; }
        public string CreatedBy { get; set; }
    }
    public class GRNItem
    {
        public int AutoId { get; set; }
        public string Item_id { get; set; }
        public string barcodeNo { get; set; }
        public string hsn { get; set; }
        public string mfd_id { get; set; }
        public string Batch_No { get; set; }
        public DateTime Exp_Date { get; set; }
        public string pack_type { get; set; }
        public int pack_qty { get; set; }
        public decimal MRP { get; set; }
        public decimal trade { get; set; }
        public decimal Quantity { get; set; }
        public decimal It_Free { get; set; }
        public decimal DisPer { get; set; }
        public int Tax_id { get; set; }
        public decimal BestRate { get; set; }
        public string ItemType { get; set; }
    }
    public class DispatchBO : ipIndent
    {
        public string DispatchTo { get; set; }
        public string IndentNo { get; set; }
    }

    public class IndentBO : ipIndent
    {
        public string indent_no { get; set; }
        public string PONo { get; set; }
        public string GrnNo { get; set; }
        public string VendorId { get; set; }
        public string PackType { get; set; }
        public int PackQuantity { get; set; }
        public int qty { get; set; }
        public string result { get; set; }
        public decimal uDailyAvg { get; set; }
        public decimal UnitStock { get; set; }
        public string Remark { get; set; }
        public string OutPutType { get; set; }
        public string IndentType { get; set; }
    }
    public class GRNRequest
    {
        public GRNInfo objBO { get; set; }
        public List<GRNItem> items { get; set; }
    }
}