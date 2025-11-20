using ProLims.App_Start;
using ProLims.Repository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using static ProLimsApi.Models.GeneralStoreDTO;

namespace ProLims.Areas.Diagnostics.Controllers
{
    public class PrintController : Controller
    {
        public FileResult ServiceReceipt(string visitNo, string ActiveUser)
        {
            PdfGenerator pdfConverter = new PdfGenerator();
            ServiceQueries obj = new ServiceQueries();
            obj.prm_1 = visitNo;
            obj.Logic = "PrintServiceReceipt";
            ProLimsApi.Models.dataSet dsResult = APIProxy.CallWebApiMethod("Service/Diag_ServiceQueries", obj);

            string CompanyName = "";
            string HospitalPhone = "";
            string HospitalEmail = "";
            string FullAddress = "";
            string gstNo = "";

            DataSet ds = dsResult.ResultSet;
            string _result = string.Empty;
            StringBuilder b = new StringBuilder();
            StringBuilder h = new StringBuilder();
            decimal GrossAmount = 0;
            decimal discount = 0;
            decimal NetAmount = 0;
            decimal Tax = 0;
            decimal AdlDiscount = 0;
            decimal NetPayable = 0;
            decimal Balance = 0;
            string appNo = string.Empty;
            string preparedBy = string.Empty;
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    CompanyName = dr["CompanyName"].ToString();
                    HospitalPhone = dr["ContactInfo"].ToString();
                    HospitalEmail = "care@chandanhospital.in";
                    FullAddress = dr["Full_Address"].ToString();
                    gstNo = dr["gst_no"].ToString();
                }
            }
            if (ds.Tables.Count > 0 && ds.Tables[1].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[1].Rows)
                {
                    preparedBy = dr["preparedBy"].ToString();
                    GrossAmount = Convert.ToDecimal(dr["GrossAmount"]);
                    discount = Convert.ToDecimal(dr["PanelDiscount"]);
                    NetAmount = Convert.ToDecimal(dr["NetAmount"]);
                    AdlDiscount = Convert.ToDecimal(dr["AdlDiscount"]);
               

                  
                    b.Append("<h1 style='text-align:center;text-decoration: underline;margin-bottom:-8px'>" + CompanyName + "</h1>");
                    b.Append("<h2 style='text-align:center;font-weight:bold;font-size:19px;'>Address :" + FullAddress + "</h3>");
                    b.Append("<h2 style='text-align:center;font-weight:bold;font-size:19px;'>GST No : " + gstNo + " &nbsp;,&nbsp;Phone No : " + HospitalPhone + "</h3>");
                   
                    //b.Append("<h2 style='text-align:center;font-size:21px;'></h2>");
                    b.Append("<h3 style='text-align:center;font-weight:bold;text-decoration: underline;'>Bill Receipt</h3>");
                    b.Append("<p><hr style='margin-top:-14px;margin-bottom:-14px;border:1px solid #000'></p>");
                    b.Append("<table style='width:100%;font-size:15px;text-align:left;border:0px solid #dcdcdc;margin-bottom:-15px'>");
                    b.Append("<tr>");
                    b.Append("<td>Visit No.</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["VisitNo"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td>UHID No.</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["UHID"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td>Name</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["patient_name"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td>Receipt No.</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["ReceiptNo"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td>Age/Gender</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["Age"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td>Booking Time</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["EntryDateTime"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td>Contact No.</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["mobile_no"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td>Expected Reporting Time</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["ReportDateTime"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td>Referred By</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td style='text-transform:uppercase'>" + dr["ref_name"].ToString() + "</td>");
                    b.Append("<td>&nbsp;</td>");
                    b.Append("<td>Contract By</td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td style='text-transform:uppercase'>" + dr["ClientName"].ToString() + "</td>");
                    b.Append("</tr>");

                    b.Append("</table>");
                }
            }
            b.Append("<table style='width:100%;font-size:15px;text-align:left;border:0px solid #dcdcdc;margin-top:10px;'>");
            b.Append("<tr>");
            b.Append("<th colspan='5'><hr style='margin-bottom:-6px;border:1px solid #000'></th>");
            b.Append("</tr>");
            b.Append("<tr>");
            b.Append("<th style='width:60%;padding:3px'>Particulars</th>");
            b.Append("<th style='width:10%;text-align:right;padding:5px'>Units</th>");
            b.Append("<th style='width:10%;text-align:right;padding:5px'>Rate(₹)</th>");
            b.Append("<th style='width:10%;text-align:right;padding:5px'>Discount(₹)</th>");
            b.Append("<th style='width:10%;text-align:right;padding:5px'>Amount(₹)</th>");
            b.Append("</tr>");
            b.Append("<tr>");
            b.Append("<th colspan='5'><hr style='margin-top:-4px;border:1px solid #000'></th>");
            b.Append("</tr>");
            //Body			
            string catNameTemp = string.Empty;
            if (ds.Tables.Count > 0 && ds.Tables[2].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[2].Rows)
                {

                    if (catNameTemp != dr["CatName"].ToString())
                    {
                        b.Append("<tr style='background:#ddd;'>");
                        b.Append("<td colspan='5' style='width:60%;font-size:15px !important'>" + dr["CatName"].ToString() + "</td>");
                        b.Append("</tr>");
                        catNameTemp = dr["CatName"].ToString();
                    }
                    b.Append("<tr>");
                    b.Append("<td style='width:60%;font-size:13px !important'>" + dr["ItemName"].ToString() + "</td>");
                    b.Append("<td style='width:10%;text-align:right'>" + dr["Qty"].ToString() + "</td>");
                    b.Append("<td style='width:10%;text-align:right'>" + Convert.ToDecimal(dr["Rate"]).ToString("F") + "</td>");
                    b.Append("<td style='width:10%;text-align:right'>" + Convert.ToDecimal(dr["discount"]).ToString("F") + "</td>");
                    b.Append("<td style='width:10%;text-align:right'>" + Convert.ToDecimal(dr["NetAmount"]).ToString("F") + "</td>");
                    b.Append("</tr>");
                }
                b.Append("<tr>");
                b.Append("<td colspan='5'><hr style='margin-bottom:1px;'></td>");
                b.Append("</tr>");
            }
            b.Append("</table>");

            b.Append("<div style='width:100%;float:left'>");
            b.Append("<div style='width:60%;float:left'>");
            if (ds.Tables.Count > 0 && ds.Tables[3].Rows.Count > 0)
            {
                b.Append("<table style='width:80%;font-size:14px;text-align:left;' border='1' cellspacing='0'>");
                b.Append("<tr>");
                b.Append("<th style='padding-left:5px'>Payment Mode</th>");
                b.Append("<th style='padding-left:5px'>Receipt Date</th>");
                b.Append("<th style='text-align:right'>Amount</th>");
                b.Append("</tr>");
                foreach (DataRow dr in ds.Tables[3].Rows)
                {
                    b.Append("<tr>");
                    b.Append("<td style='padding-left:5px'>" + dr["PayMode"].ToString() + "</td>");
                    b.Append("<td style='padding-left:5px'>" + dr["receiptDate"].ToString() + "</td>");
                    b.Append("<td style='text-align:right;padding-right:5px'>" + Convert.ToDecimal(dr["Amount"]).ToString("F") + "</td>");
                    b.Append("</tr>");
                }
                b.Append("</table>");
            }
           
            b.Append("</div>");
            b.Append("<div style='width:40%;float:right'>");
            b.Append("<table style='font-size:14px;float:right' border='0' cellspacing='0'>");
            b.Append("<tr style='font-size:16px'>");
            b.Append("<td colspan='3' style='width:80%;text-align:right'><b>Gross Amount : </b></td>");
            b.Append("<td style='width:20%;text-align:right;white-space: nowrap;'><b>" + GrossAmount.ToString("F") + "</b></td>");
            b.Append("</tr>");
            if (discount > 0)
            {
                b.Append("<tr style='font-size:16px'>");
                b.Append("<td colspan='3' style='width:80%;text-align:right'><b>Discount : </b></td>");
                b.Append("<td style='width:15%;text-align:right;white-space: nowrap;'><b>" + discount.ToString("F") + "</b></td>");
                b.Append("</tr>");
            }
            b.Append("<tr style='font-size:16px'>");
            b.Append("<td colspan='3' style='width:80%;text-align:right'><b>Net Amount : </b></td>");
            b.Append("<td style='width:15%;text-align:right;white-space: nowrap;'><b>" + NetAmount.ToString("F") + "</b></td>");
            b.Append("</tr>");

            b.Append("<tr style='font-size:16px'>");
            b.Append("<td colspan='3' style='width:80%;text-align:right'><b>AdlDiscount : </b></td>");
            b.Append("<td style='width:15%;text-align:right;white-space: nowrap;'><b>" + AdlDiscount.ToString("F") + "</b></td>");
            b.Append("</tr>");

            b.Append("<tr style='font-size:16px'>");
            b.Append("<td colspan='3' style='width:80%;text-align:right'><b>Payable : </b></td>");
            b.Append("<td style='width:15%;text-align:right;white-space: nowrap;'><b>" + NetAmount.ToString("F") + "</b></td>");
            b.Append("</tr>");

            b.Append("</table>");
            b.Append("</div>");
            b.Append("</div>");

            b.Append("<div style='width:100%;float:left'>");
            b.Append("<p style='font-size:14px'><b>Please download our Chandan24x7 App.</b></p>");
            b.Append("<p style='font-size:11px'>Note : This is a computerized Bill and does not require Seal & Sign</p>");
            b.Append("<p><hr style='margin-top:-14px;margin-bottom:-14px;border:1px solid #000'></p>");
            b.Append("<table style='font-size:13px;border:0px solid #dcdcdc;width:100%'>");
            b.Append("<tr>");
            b.Append("<td style='text-align:left'>Print Date & Time :" + DateTime.Now.ToString("dd-MM-yyyy hh:mm") + "</td>");
            b.Append("<td style='text-align:center'>Prepared By : " + preparedBy + "</td>");
            b.Append("<td style='text-align:right'>Printed By : " + ActiveUser + "</td>");
            b.Append("</tr>");
            b.Append("</table>");
            b.Append("</div>");

            //b.Append("<span style='text-aligh:center'>");
            //b.Append("<p style='font-size:13px'>09-Oct-2020 12:04PM</p>");
            //b.Append("<p style='font-size:13px'>Prepared By : Arshad Ahmad</p>");
            //b.Append("<p style='font-size:13px'>Printed By : Mr. Vijay Singh</p>");
            //b.Append("</span>");
            pdfConverter.Header_Enabled = false;
            pdfConverter.Footer_Enabled = false;
            pdfConverter.Header_Hight = 150;
            pdfConverter.PageMarginLeft = 10;
            pdfConverter.PageMarginRight = 10;
            pdfConverter.PageMarginBottom = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageName = "A5";
            pdfConverter.PageOrientation = "Portrait";
            return pdfConverter.ConvertToPdf(h.ToString(), b.ToString(), "-", "ServiceReceipt.pdf");
        }
        public FileResult PrintCityRateList(string RateId, string RateName)
        {
            PdfGenerator pdfConverter = new PdfGenerator();
            ServiceQueries obj = new ServiceQueries();
            obj.prm_1 = RateId;
            obj.Logic = "CityRateListPdf";
            ProLimsApi.Models.dataSet dsResult = APIProxy.CallWebApiMethod("GeneralStore/MasterQueries", obj);

            DataSet ds = dsResult.ResultSet;
            string _result = string.Empty;
            StringBuilder b = new StringBuilder();
            StringBuilder h = new StringBuilder();


            b.Append("<h1 style='text-align:center;text-decoration: underline;margin-bottom:-8px'>" + RateName + "</h1>");
            b.Append("<table  border='0' style='width:100%;font-size:11px;border-collapse: collapse;margin-top:10px'>");
            b.Append("<tr>");
            b.Append("<th style='width:10%;padding:3px;text-align:left;background:#ddd;'>Test Category</th>");
            b.Append("<th style='width:10%;padding:3px;text-align:left;background:#ddd;'>Item Id</th>");
            b.Append("<th style='width:50%;padding:3px;text-align:left;background:#ddd;'>Item Name</th>");
            b.Append("<th style='width:10%;text-align:right;padding:5px;background:#ddd;'>Rate </th>");
            b.Append("</tr>");
            //Body			
            string catNameTemp = string.Empty;
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {

                    if (catNameTemp != dr["GroupName"].ToString())
                    {
                        b.Append("<tr style='background:#a1f1a4;'>");
                        b.Append("<td colspan='5' style='width:60%;font-size:15px !important'>" + dr["GroupName"].ToString() + "</td>");
                        b.Append("</tr>");
                        catNameTemp = dr["GroupName"].ToString();
                    }
                    b.Append("<tr>");
                    b.Append("<td style='width:20%;font-size:13px !important'>" + dr["SubCategory"].ToString() + "</td>");
                    b.Append("<td style='width:20%;font-size:13px !important'>" + dr["ItemId"].ToString() + "</td>");
                    b.Append("<td style='width:50%;font-size:13px !important'>" + dr["ItemName"].ToString() + "</td>");
                    b.Append("<td style='width:10%;text-align:right'>" + dr["cityRate"].ToString() + "</td>");
                    b.Append("</tr>");
                }

                b.Append("<tr>");
                b.Append("<td colspan='5'><hr style='margin-bottom:1px;'></td>");
                b.Append("</tr>");
            }
            b.Append("</table>");
            pdfConverter.Header_Enabled = false;
            pdfConverter.Footer_Enabled = false;
            pdfConverter.Header_Hight = 150;
            pdfConverter.PageMarginLeft = 10;
            pdfConverter.PageMarginRight = 10;
            pdfConverter.PageMarginBottom = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageName = "A4";
            pdfConverter.PageOrientation = "Portrait";
            return pdfConverter.ConvertToPdf(h.ToString(), b.ToString(), "-", "CityRateListReport.pdf");
        }
    }
}