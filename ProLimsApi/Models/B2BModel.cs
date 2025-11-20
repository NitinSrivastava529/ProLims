using System;
using System.Collections.Generic;
using System.Data;

namespace ProLimsApi.Models
{
    public class B2BModel
    {
        public string unitId { get; set; }
        public string compId { get; set; }
        public string clientId { get; set; }
        public string VisitNo { get; set; }
        public string OutPutType { get; set; }
        public string from { get; set; }
        public string to { get; set; }
        public string Prm1 { get; set; }
        public string TestIds { get; set; }
        public string Prm2 { get; set; }
        public string Prm3 { get; set; }
        public string loginId { get; set; }
        public string Logic { get; set; }
    }
    public class ResultSet
    {
        public int Status { get; set; }
        public string Message { get; set; }
        public DataSet dataSet { get; set; }
        public string response { get; set; }
        public int Flag { get; set; }
        public string Msg { get; set; }
    }
    public class ReportResult
    {
        public int Status { get; set; }
        public string Message { get; set; }
        public string ReportUrl { get; set; }
    }
    public class TestBooking
    {
        public DiagTestBooking diagTestBooking { get; set; }
        public List<TestBookingItems> TestBookingItems { get; set; }
        public List<Receipt> Receipt { get; set; }
    }
    public class Receipt
    {
        public string ReceiptNo { get; set; }
        public string PayMode { get; set; }
        public string CardNo { get; set; }
        public string BankName { get; set; }
        public string RefNo { get; set; }
        public string MachineId { get; set; }
        public string MachineName { get; set; }
        public decimal Amount { get; set; }
        public string OnlPaymentId { get; set; }
        public string OnlPayStatus { get; set; }
        public string OnlPayResponse { get; set; }
        public DateTime OnlPaymentDate { get; set; }
        public string login_id { get; set; }
    }
    public class SampleCollection {
        public string VisitNo { get; set; }
        public string ClientId { get; set; }
        public string UnitId { get; set; }
        public string Prm1 { get; set; }
        public string Logic { get; set; }
        public string login_id { get; set; }
        public int AutoTestId { get; set; }
        public string testcode { get; set; }
        public string sampleName { get; set; }
        public string BarcodeNo { get; set; }
        public int VialQty { get; set; }
    }

    public class TestBookingItems
    {
        public string RateListId { get; set; }
        public string ItemId { get; set; }
        public decimal mrp_rate { get; set; }
        public decimal panel_rate { get; set; }
        public decimal adl_disc_amount { get; set; }
        public decimal net_amount { get; set; }
        public char IsUrgent { get; set; }
        public string Remark { get; set; }
    }
    public class DiagTestBooking
    {
        public string CompId { get; set; }
        public string UnitId { get; set; }
        public string ClientId { get; set; }
        public string ipopType { get; set; }
        public string Title { get; set; }
        public string UHID { get; set; }
        public string patient_name { get; set; }
        public string email { get; set; }
        public decimal age { get; set; }
        public string ageType { get; set; }
        public string gender { get; set; }
        public string dob { get; set; }
        public string StateName { get; set; }
        public string district { get; set; }
        public string locality { get; set; }
        public string address { get; set; }
        public string CardNo { get; set; }
        public string mobile_no { get; set; }
        public string RefCode { get; set; }
        public string Ref_name { get; set; }
        public string discountBy { get; set; }
        public string discountType { get; set; }
        public string discount_remark { get; set; }
        public string login_id { get; set; }
        public string PanelId { get; set; }
        public string GenFrom { get; set; }
        public string HealthCardNo { get; set; }
        public string PatientRemark { get; set; }
        public string Logic { get; set; }
    }
}