using System;

namespace ProLimsApi.Models
{
    public class GeneralStoreDTO
    {
        public class ipQueries
        {
            public Nullable<int> ID { get; set; }
            public string Logic { get; set; }
            public string Result { get; set; }
            public bool Flag { get; set; }
            public bool IsActive { get; set; }
            public string login_id { get; set; }
            public string warehouseCartId { get; set; }
            public string prm_1 { get; set; }
            public string prm_2 { get; set; }
            public DateTime? CreatedOn { get; set; }
        }
        public class GeneralStoreQueries : ipQueries
        {
            public int auto_id { get; set; }
            public string hosp_id { get; set; }
            public string mfd_id { get; set; }
            public string vendor_id { get; set; }
            public string MainCategory { get; set; }
            public string mfd_name { get; set; }
            public string contact_no { get; set; }
            public string address { get; set; }
            public int country_id { get; set; }
            public int state_id { get; set; }
            public int city_id { get; set; }
            public string remark { get; set; }
            public string status { get; set; }
            public string item_name { get; set; }
            public string OutPutType { get; set; }
        }
        public class ManufacturerBO : ipQueries
        {
            public int auto_id { get; set; }
            public string hosp_id { get; set; }
            public string mfd_id { get; set; }
            public string vendor_id { get; set; }
            public string MainCategory { get; set; }
            public string mfd_name { get; set; }
            public string contact_no { get; set; }
            public string address { get; set; }
            public int country_id { get; set; }
            public int state_id { get; set; }
            public int city_id { get; set; }
            public string remark { get; set; }
            public string status { get; set; }
        }
        public class VendorMasterBO : ipQueries
        {
            public int auto_id { get; set; }
            public string vendor_id { get; set; }
            public string hosp_id { get; set; }
            public string vendor_name { get; set; }
            public string contact_person { get; set; }
            public string address1 { get; set; }
            public string address2 { get; set; }
            public string address3 { get; set; }
            public string city { get; set; }
            public string state { get; set; }
            public string country { get; set; }
            public string pin { get; set; }
            public string ledgerid { get; set; }
            public string contact_no { get; set; }
            public string email { get; set; }
            public string payment_mode { get; set; }
            public int payment_days { get; set; }
            public string gst_no { get; set; }
            public string drug_lic_no { get; set; }
            public string notes { get; set; }
            public string active_flag { get; set; }
        }
        public class ItemMasterBO
        {
            public int auto_id { get; set; }
            public string hosp_id { get; set; }
            public string hsn { get; set; }
            public string MfdId { get; set; }
            public string MfdName { get; set; }
            public string ItemType { get; set; }
            public string GroupId { get; set; }
            public string ItemId { get; set; }
            public string ItemName { get; set; }
            public int pack_id { get; set; }
            public string pack_type { get; set; }
            public int pack_qty { get; set; }
            public string Category { get; set; }
            public string CategoryId { get; set; }
            public int rol { get; set; }
            public int MOQ { get; set; }
            public string freeToStaff { get; set; }
            public decimal rate { get; set; }
            public decimal taxPerc { get; set; }
            public string Remark { get; set; }
            public string ShelfNo { get; set; }
            public string StatusFlag { get; set; }
            public string purchase_flag { get; set; }
            public string login_id { get; set; }
            public string Logic { get; set; }
        }
        public class PurchaseQueriesBO
        {
            public string purchId { get; set; }
            public string VendorCode { get; set; }
            public string item_name { get; set; }
            public DateTime? from { get; set; }
            public DateTime? to { get; set; }
            public string OutPutType { get; set; }
            public string prm_1 { get; set; }
            public string Logic { get; set; }
            public string login_id { get; set; }
            public string warehouseCartId { get; set; }
            public string Purch_id { get; set; }
        }
        public class GroupMasterBO
        {
            public int Autoid { get; set; }
            public string GroupId { get; set; }
            public string Unitid { get; set; }
            public string GroupName { get; set; }
            public string TestPerfNos { get; set; }
            public string prm1 { get; set; }
            public string prm2 { get; set; }
            public string login_id { get; set; }
            public string itemId { get; set; }
            public string Logic { get; set; }
            public string PackType { get; set; }
        }
        public class PurchaseInsertBO
        {
            public int Auto_Id { get; set; }
            public string unit_id { get; set; }
            public string comp_code { get; set; }
            public string poNumber { get; set; }
            public string pur_type { get; set; }
            public string Vendor_Code { get; set; }
            public string Inv_No { get; set; }
            public DateTime Inv_Date { get; set; }
            public string eWayBillNo { get; set; }
            public string NatureOfPurchase { get; set; }
            public DateTime? eWayBillDate { get; set; }
            public string Item_id { get; set; }
            public string barcodeNo { get; set; }
            public string hsn { get; set; }
            public string mfd_id { get; set; }
            public string Batch_No { get; set; }
            public string Exp_Date { get; set; }
            public string pack_type { get; set; }
            public int pack_qty { get; set; }
            public int qty { get; set; }
            public decimal MRP { get; set; }
            public decimal trade { get; set; }
            public decimal Quantity { get; set; }
            public decimal It_Free { get; set; }
            public decimal DisPer { get; set; }
            public decimal Tax_id { get; set; }
            public decimal BestRate { get; set; }
            public decimal plusminus { get; set; }
            public decimal adj_amt { get; set; }
            public string credit_cash { get; set; }
            public string Remark { get; set; }
            public string CreatedBy { get; set; }
            public string Purch_id { get; set; }
            public string login_id { get; set; }
        }
        public class DiascountReprocessBO
        {
            public string purch_id { get; set; }
            public string discount_amount { get; set; }
            public string login_id { get; set; }
            public string Logic { get; set; }
        }
        public class ReportBO
        {
            public DateTime from { get; set; }
            public DateTime to { get; set; }
            public string ItemIds { get; set; }
            public string ReportType { get; set; }
            public string ProcName { get; set; }
            public string CartId { get; set; }
            public string Category { get; set; }
            public string from_cart { get; set; }
            public string to_cart { get; set; }
            public string ItemId { get; set; }
            public string vendorID { get; set; }
            public Nullable<int> ID { get; set; }
            public string Logic { get; set; }
            public string Result { get; set; }
            public bool Flag { get; set; }
            public bool IsActive { get; set; }
            public string login_id { get; set; }
            public string warehouseCartId { get; set; }
            public string prm_1 { get; set; }
            public string prm_2 { get; set; }
            public DateTime? CreatedOn { get; set; }
        }
        public class SubmitStatus
        {
            public int Status { get; set; }
            public string Message { get; set; }
            public string AppintmentId { get; set; }
            public string purchId { get; set; }
            public string virtual_path { get; set; }
        }
        public class ipDocumentInfo
        {
            public string HospitalId { get; set; }
            public string TranId { get; set; }
            public string TrnType { get; set; }
            public string ImageName { get; set; }
            public string ImageType { get; set; }
            public string login_id { get; set; }
        }

        public class GRNInsertBO
        {
            public string CompId { get; set; }
            public string UnitId { get; set; }
            public string Grn_type { get; set; }
            public string Vendor_Code { get; set; }
            public string Inv_No { get; set; }
            public DateTime Inv_Date { get; set; }
            public string NatureOfPurchase { get; set; }
            public string eWayBillNo { get; set; }
            public DateTime eWayBillDate { get; set; }
            public string Remark { get; set; }
            public string CreatedBy { get; set; }
            public string PayMode { get; set; }
            public string GrnNo { get; set; }
            public string freightType { get; set; }
            public decimal freightCharges { get; set; }

            public string Item_id { get; set; }
            public string barcodeNo { get; set; }
            public string hsn { get; set; }
            public string mfd_id { get; set; }
            public string Batch_No { get; set; }
            public string Exp_Date { get; set; }
            public string pack_type { get; set; }
            public int pack_qty { get; set; }
            public int qty { get; set; }
            public decimal MRP { get; set; }
            public decimal trade { get; set; }
            public decimal Quantity { get; set; }
            public decimal It_Free { get; set; }
            public decimal DisPer { get; set; }
            public int Tax_id { get; set; }
            public decimal BestRate { get; set; }
        }

        public class OtherChargesBo
        {
            public int Autoid { get; set; }
            public string GrnNo { get; set; }
            public string Item_id { get; set; }
            public decimal TaxableAmount { get; set; }
            public decimal taxRate { get; set; }
            public decimal Tax { get; set; }
            public string prm2 { get; set; }
            public string prm1 { get; set; }
            public string vendor_code { get; set; }
            public string login_id { get; set; }
            public string Logic { get; set; }


        }

        public class TrackingBO
        {
            public string UnitId { get; set; }
            public string from { get; set; }
            public string to { get; set; }
            public string GroupId { get; set; }
            public string Prm1 { get; set; }
            public string Logic { get; set; }
            public string ReportType { get; set; }
        }
        public class PackTypeBO
        {
            public int auto_id { get; set; }
            public string CompId { get; set; }
            public int autoid { get; set; }
            public string pack_type { get; set; }
            public string pack_qty { get; set; }
            public bool IsActive { get; set; }
            public string login_id { get; set; }
            public string Logic { get; set; }
        }
        public class HSNBO
        {
            public string CompId { get; set; }
            public string HSNCode { get; set; }
            public string HSNRemark { get; set; }
            public string login_id { get; set; }
            public string Logic { get; set; }
            public decimal Cgst_rate { get; set; }
            public decimal Sgst_rate { get; set; }
            public decimal Igst_rate { get; set; }
        }

        public class CategoryBO
        {
            public int auto_id { get; set; }
            public string hosp_id { get; set; }
            public string MainCategory { get; set; }
            public string CategoryId { get; set; }
            public string CategoryName { get; set; }
            public string login_id { get; set; }
            public bool IsActive { get; set; }
            public string Logic { get; set; }
            public string Prm1 { get; set; }
        }
        public class IPReport
        {
            public string ReportName { get; set; }
            public string Prm1 { get; set; }
            public string prm_2 { get; set; }
            public string Prm2 { get; set; }
            public string from { get; set; }
            public string To { get; set; }
            public string LoginId { get; set; }
            public string OutPutType { get; set; }
            public string UnitCode { get; set; }


        }

        public class IssueBO
        {
            public int Qty { get; set; }
            public string AllotedTo { get; set; }
            public int AutoId { get; set; }
            public string result { get; set; }

            public string CompId { get; set; }
            public string WarehouseId { get; set; }
            public string UnitId { get; set; }
            public string TrnNo { get; set; }
            public string ItemId { get; set; }
            public string MasterKeyId { get; set; }
            public string Prm1 { get; set; }
            public string Prm2 { get; set; }
            public string ReturnSource { get; set; }
            public string From { get; set; }
            public string To { get; set; }
            public string Logic { get; set; }
            public string LoginId { get; set; }
            public string OutPutType { get; set; }
            public string item_id { get; set; }
        }

        public class BestRateBo
        {
            public int autoid { get; set; }
            public string VendorId { get; set; }
            public string ItemId { get; set; }
            public string pack_type { get; set; }
            public string mfd_id { get; set; }
            public decimal BestRate { get; set; }
            public int RatePickup { get; set; }
            public string login_id { get; set; }
            public string Logic { get; set; }
            public string UnitId { get; set; }
            public string CompId { get; set; }
        }
        public class Doctorlink
        {

            public string LIS_DoctorId { get; set; }
            public string HIS_DoctorId { get; set; }
            public string login_id { get; set; }
            public string Logic { get; set; }
        }

        public class ReportDB
        {
            public string UnitId { get; set; }
            public string ObservationId { get; set; }
            public string From { get; set; }
            public string to { get; set; }
            public string prm1 { get; set; }
            public string Logic { get; set; }
            public string OutPutType { get; set; }
        }
        public class PanelDb
        {
            public string Unitid { get; set; }
            public string CompId { get; set; }
            public string PanelId { get; set; }
            public string PanelName { get; set; }
            public string itemId { get; set; }
            public string login_id { get; set; }
            public decimal Rate { get; set; }
            public string Logic { get; set; }
        }

        public class PanelExcelDb
        {
            public string Unitid { get; set; }
            public string CompId { get; set; }
            public string PanelId { get; set; }
            public string itemId { get; set; }
            public string login_id { get; set; }
            public decimal PanelRate { get; set; }
            public string Logic { get; set; }
        }
        public class Proratelink
        {
            public string ProId { get; set; }
            public string login_id { get; set; }
            public string Month_Name { get; set; }
            public string FinYear { get; set; }
            public string Logic { get; set; }
            public decimal TargetAmount { get; set; }
        }
        public class CityExcelDb
        {
            public string Unitid { get; set; }
            public string CompId { get; set; }
            public string RateLIstId { get; set; }
            public string itemId { get; set; }
            public string login_id { get; set; }
            public decimal CityRate { get; set; }
            public string Logic { get; set; }
            public string RateType { get; set; }
            public decimal MRPRate { get; set; }
        }

        public class LabPackage
        {
            public string unitId { get; set; }
            public string compId { get; set; }
            public string catid { get; set; }
            public string subcateid { get; set; }
            public string packageId { get; set; }
            public string packagename { get; set; }
            public string packagetype { get; set; }
            public string bookFor { get; set; }
            public string description { get; set; }
            public string type { get; set; }
            public string packageInvesttype { get; set; }
            public string itemid { get; set; }
            public string innerpackageid { get; set; }
            public string Logic { get; set; }
            public string Result { get; set; }
            public bool Flag { get; set; }
            public bool IsActive { get; set; }
            public string login_id { get; set; }
            public string warehouseCartId { get; set; }
            public string prm_1 { get; set; }
            public string prm_2 { get; set; }
            public string hosp_id { get; set; }
            public decimal rate { get; set; }

        }

        public class IpClient
        {
            public string UnitId { get; set; }
            public string CompId { get; set; }
            public string ClientId { get; set; }
            public string ClientName { get; set; }
            public string ClientType { get; set; }
            public string PaymentType { get; set; }
            public string CityName { get; set; }
            public string StateName { get; set; }
            public string Address { get; set; }
            public string PINCode { get; set; }
            public string EmailId { get; set; }
            public decimal CreditLimit { get; set; }
            public int CreditDays { get; set; }
            public string LoginId { get; set; }
            public string MRPRateListId { get; set; }
            public string ClientRateListId { get; set; }
            public string LedgerId { get; set; }
            public string TDSLedgerId { get; set; }
            public string ClientGroupName { get; set; }
            public string Psw { get; set; }
            public decimal TdsPerc { get; set; }
            public string Logic { get; set; }
        }

        public class ServiceQueries
        {
            public string SearcKey { get; set; }
            public string SearchValue { get; set; }
            public string CompId { get; set; }
            public string UnitId { get; set; }
            public string UHID { get; set; }
            public string prm_1 { get; set; }
            public string prm_2 { get; set; }
            public string from { get; set; }
            public string to { get; set; }
            public string ItemIds { get; set; }
            public string login_id { get; set; }
            public string Logic { get; set; }
            public string OutPutType { get; set; }
        }

        public class ipDoctor
        {
            public string Unitid { get; set; }
            public string CompId { get; set; }
            public string ClientId { get; set; }
            public string DoctorId { get; set; }
            public string DoctorName { get; set; }
            public string Specialization { get; set; }
            public string Degree { get; set; }
            public string MobileNo { get; set; }
            public string LoginId { get; set; }
            public string Logic { get; set; }

        }
    }
}