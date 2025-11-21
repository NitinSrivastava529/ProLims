using ProLims.App_Start;
using ProLims.Repository;
using ProLimsApi.Models;
using System;
using System.Data;
using System.Text;
using System.Web.Mvc;
using static ProLimsApi.Models.GeneralStoreDTO;

namespace ProLims.Areas.GeneralStore.Controllers
{
    public class PrintController : Controller
    {
        public FileResult PrintGRN(string GrnNo)
        {
            PdfGenerator pdfConverter = new PdfGenerator();
            IndentBO obj = new IndentBO();
            obj.CompId = "-";
            obj.UnitId = "-";
            obj.indent_no = "-";
            obj.PONo = "-";
            obj.GrnNo = GrnNo;
            obj.VendorId = "-";
            obj.From = "1900/01/01";
            obj.To = "1900/01/01";
            obj.ItemId = "-";
            obj.Prm1 = "-";
            obj.LoginId = "-";
            obj.Logic = "PrintGRN";
            dataSet dsResult = APIProxy.CallWebApiMethod("Indent/GS_PurchaseOrderQueries", obj);
            DataSet ds = dsResult.ResultSet;
            string _result = string.Empty;
            StringBuilder b = new StringBuilder();
            StringBuilder h = new StringBuilder();
            b.Append("<h1 style='text-align:center;font-weight:bold;text-decoration: underline;'>Provisional Purchase Bill</h1>");
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    b.Append("<h3 style='text-align:left'>Purchase Bill Information</h3>");
                    b.Append("<table style='width:100%;font-size:14px;text-align:left;background:#ececec;'>");
                    b.Append("<tr>");
                    b.Append("<td><b>Vendor Name</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["vendorName"].ToString() + "</td>");
                    b.Append("<td colspan='4'>&nbsp;</td>");
                    b.Append("<td><b>Invoice Date</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["Inv_Date"].ToString().Substring(0, 10) + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td><b>Unit Name</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["unit_name"].ToString() + "</td>");
                    b.Append("<td colspan='4'>&nbsp;</td>");
                    b.Append("<td><b>Invoice No</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["Inv_No"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td><b>District,State</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["Address"].ToString() + "</td>");
                    b.Append("<td colspan='4'>&nbsp;</td>");
                    b.Append("<td><b>GRN No</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["GRNNo"].ToString() + "</td>");
                    b.Append("</tr>");

                    b.Append("<tr>");
                    b.Append("<td><b>eWay Bill Date</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["eWayBillDate"].ToString() + "</td>");
                    b.Append("<td colspan='4'>&nbsp;</td>");
                    b.Append("<td><b>eWay Bill No</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["eWayBillNo"].ToString() + " </td>");
                    b.Append("</tr>");

                    //b.Append("<tr>");
                    //b.Append("<td><b>GSTN No</b></td>");
                    //b.Append("<td><b>:</b></td>");
                    //b.Append("<td>" + dr["gst_no"].ToString() + "</td>");
                    //b.Append("<td colspan='4'>&nbsp;</td>");
                    //b.Append("<td><b>Feeding Date</b></td>");
                    //b.Append("<td><b>:</b></td>");
                    //b.Append("<td>" + dr["Doc_Date"].ToString() + " </td>");
                    //b.Append("</tr>");

                    b.Append("</tr>");
                    b.Append("</table>");
                }
            }
            b.Append("<table border='1' style='width:100%;font-size:11px;border-collapse: collapse;margin-top:5px'>");
            b.Append("<tr>");
            b.Append("<th style='width:40%;text-align:left;padding-left:4px;'>Item Name</th>");
            b.Append("<th style='white-space: nowrap;'>HSN Code</th>");
            b.Append("<th style='text-align:right;padding-right:4px;'>Batch</th>");
            b.Append("<th style='text-align:right;padding-right:4px;'>Pack</th>");
            b.Append("<th style='white-space: nowrap'>Pack Qty</th>");
            b.Append("<th style='text-align:right;padding-right:4px;'>Expiry</th>");
            b.Append("<th style='text-align:right;padding-right:4px;'>Trade</th>");
            b.Append("<th style='text-align:right;padding-right:4px;'>NPR</th>");
            b.Append("<th style='text-align:right;padding-right:4px;'>Qty</th>");
            b.Append("<th style='text-align:right;padding-right:4px;'>Free</th>");
            b.Append("<th style='text-align:right;padding-right:4px;'>GST</th>");
            b.Append("<th style='text-align:right;padding-right:4px;'>Disc</th>");
            b.Append("<th style='text-align:right;padding-right:4px;'>Amount</th>");
            b.Append("</tr>");
            //Body			
            if (ds.Tables.Count > 0 && ds.Tables[1].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[1].Rows)
                {
                    b.Append("<tr>");
                    b.Append("<td style='padding-left:4px;'>" + dr["item_name"].ToString() + "</td>");
                    b.Append("<td style='text-align:right;white-space: nowrap;padding-right:4px;'>" + dr["hsn"].ToString() + "</td>");
                    b.Append("<td style='text-align:right;white-space: nowrap;padding-right:4px;'>" + dr["Batch_No"].ToString() + "</td>");
                    b.Append("<td style='text-align:right;white-space: nowrap;padding-right:4px;'>" + dr["pack_type"].ToString() + "</td>");
                    b.Append("<td style='text-align:right;padding-right:4px;'>" + dr["pack_qty"].ToString() + "</td>");
                    b.Append("<td style='text-align:center;white-space: nowrap;padding-right:4px;'>" + dr["Exp_Date"].ToString() + "</td>");
                    b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["trade"]) + "</td>");
                    b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["npr"]) + "</td>");
                    b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["Quantity"]) + "</td>");
                    b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["It_Free"]) + "</td>");
                    b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["tax_amount"]) + "</td>");
                    b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["DisAmount"]) + "</td>");
                    b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["amount"]) + "</td>");
                    b.Append("</tr>");
                }
            }
            b.Append("</table>");
            b.Append("<br/>");
            b.Append("<div style='display:flex;width:100%'>");
            b.Append("<table border='1' style='width:68%;font-size:12px;border-collapse: collapse;margin-right:15px;float:left'>");
            b.Append("<tr>");
            b.Append("<th>Oth.Charges</th>");
            b.Append("<th style='text-align:right;padding-right:4px;'>Tax.Amt</th>");
            b.Append("<th style='text-align:right;padding-right:4px;'>Tax.Rate</th>");
            b.Append("<th style='text-align:right;padding-right:4px;'>Tax</th>");
            b.Append("<th style='text-align:right;padding-right:4px;'>CGST</th>");
            b.Append("<th style='text-align:right;padding-right:4px;'>SGST</th>");
            b.Append("<th style='text-align:right;padding-right:4px;'>IGST</th>");
            b.Append("</tr>");
            if (ds.Tables.Count > 0 && ds.Tables[2].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[2].Rows)
                {
                    b.Append("<tr>");
                    b.Append("<td style='text-align:right;padding-right:4px;'>" + dr["item_name"].ToString() + "</td>");
                    b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["TaxableAmount"]) + "</td>");
                    b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["TaxRate"]) + "</td>");
                    b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["Tax"]) + "</td>");
                    b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["CGST"]) + "</td>");
                    b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["SGST"]) + "</td>");
                    b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["IGST"]) + "</td>");
                    b.Append("</tr>");
                }
            }

            if (ds.Tables.Count > 0 && ds.Tables[3].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[3].Rows)
                {
                    b.AppendLine("<table style='width:30%;float:right;border-collapse:collapse;margin-top:0px;font-size:13px'>");
                    b.AppendLine("<tr><td style='font-weight:bold;text-align:right;padding:5px;border:1px solid #ccc;'>Taxable Amount</td><td style='text-align:right;padding:5px;border:1px solid #ccc;'>₹" + Convert.ToInt32(dr["TaxableAmount"]) + "</td></tr>");
                    b.AppendLine("<tr><td style='font-weight:bold;text-align:right;padding:5px;border:1px solid #ccc;'>CGST</td><td style='text-align:right;padding:5px;border:1px solid #ccc;'>₹" + Convert.ToInt32(dr["CGST"]) + "</td></tr>");
                    b.AppendLine("<tr><td style='font-weight:bold;text-align:right;padding:5px;border:1px solid #ccc;'>SGST</td><td style='text-align:right;padding:5px;border:1px solid #ccc;'>₹" + Convert.ToInt32(dr["SGST"]) + "</td></tr>");
                    b.AppendLine("<tr><td style='font-weight:bold;text-align:right;padding:5px;border:1px solid #ccc;'>IGST</td><td style='text-align:right;padding:5px;border:1px solid #ccc;'>₹" + Convert.ToInt32(dr["IGST"]) + "</td></tr>");
                    b.AppendLine("<tr><td style='font-weight:bold;text-align:right;padding:5px;border:1px solid #ccc;'>Discount</td><td style='text-align:right;padding:5px;border:1px solid #ccc;'>₹" + Convert.ToInt32(dr["Discount"]) + "</td></tr>");
                    b.AppendLine("<tr style='background-color:#ddd;font-weight:bold;color:#000;'><td style='text-align:right;padding:5px;border:1px solid #ccc;'>Total Amount</td><td style='text-align:right;padding:5px;border:1px solid #ccc;'>₹" + Convert.ToInt32(dr["TotalValue"]) + "</td></tr>");
                    b.AppendLine("</table>");
                }
            }
            //b.Append("<table border='1' style='width:40%;font-size:12px;border-collapse: collapse;float:right'>");
            //b.Append("<tr>");
            //b.Append("<th style='text-align:right;padding-right:4px;'>Taxable Amount</th>");
            //b.Append("<th style='text-align:right;padding-right:4px;'>CGST</th>");
            //b.Append("<th style='text-align:right;padding-right:4px;'>SGST</th>");
            //b.Append("<th style='text-align:right;padding-right:4px;'>IGST</th>");
            //b.Append("<th style='text-align:right;padding-right:4px;'>Discount</th>");
            //b.Append("<th style='text-align:right;padding-right:4px;'>Total Amt</th>");
            //b.Append("</tr>");
            //if (ds.Tables.Count > 0 && ds.Tables[3].Rows.Count > 0)
            //{
            //    foreach (DataRow dr in ds.Tables[3].Rows)
            //    {
            //        b.Append("<tr>");
            //        b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["TaxableAmount"]) + "</td>");
            //        b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["CGST"]) + "</td>");
            //        b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["SGST"]) + "</td>");
            //        b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["IGST"]) + "</td>");
            //        b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["Discount"]) + "</td>");
            //        b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["TotalValue"]) + "</td>");
            //        b.Append("</tr>");
            //    }
            //}
            b.Append("</div>");
            pdfConverter.Header_Enabled = false;
            pdfConverter.Footer_Enabled = true;
            pdfConverter.Footer_Hight = 17;
            pdfConverter.Header_Hight = 70;
            pdfConverter.PageMarginLeft = 10;
            pdfConverter.PageMarginRight = 10;
            pdfConverter.PageMarginBottom = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageName = "A4";
            pdfConverter.PageOrientation = "Portrait";
            return pdfConverter.ConvertToPdf(h.ToString(), b.ToString(), "-", "Purchase-Invoice.pdf");
        }
        public FileResult PrintPurchaseOrder(string po_no)
        {
            PdfGenerator pdfConverter = new PdfGenerator();
            IndentBO obj = new IndentBO();
            obj.CompId = "-";
            obj.UnitId = "-";
            obj.indent_no = "-";
            obj.PONo = "-";
            obj.GrnNo = "-";
            obj.VendorId = "-";
            obj.From = "1900/01/01";
            obj.To = "1900/01/01";
            obj.ItemId = "-";
            obj.Prm1 = "-";
            obj.LoginId = "-";
            obj.Logic = "PrintPO";
            dataSet dsResult = APIProxy.CallWebApiMethod("Indent/GS_PurchaseOrderQueries", obj);
            DataSet ds = dsResult.ResultSet;
            string _result = string.Empty;
            StringBuilder sb = new StringBuilder();
            StringBuilder h = new StringBuilder();

            sb.AppendLine("<!DOCTYPE html>");
            sb.AppendLine("<html lang='en'>");
            sb.AppendLine("<head>");
            sb.AppendLine("<meta charset='UTF-8'>");
            sb.AppendLine("<meta name='viewport' content='width=device-width, initial-scale=1'>");
            sb.AppendLine("<title>Foobar Labs - Purchase Order</title>");
            sb.AppendLine("</head>");
            sb.AppendLine("<body style='font-family:Segoe UI, Arial, sans-serif;margin:0;padding:20px;background-color:#fff;color:#333;'>");

            // Header
            sb.AppendLine("<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;'>");
            sb.AppendLine("<img src='https://png.pngitem.com/pimgs/s/192-1924509_chandan-hospital-faizabad-lucknow-emblem-hd-png-download.png' alt='Foobar Labs Logo' style='height:50px;'>");
            sb.AppendLine("<div style='text-align:right;font-size:24px;font-weight:bold;'>Purchase Order</div>");
            sb.AppendLine("</div>");
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    // Info Table
                    sb.AppendLine("<table style='width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px'>");
                    sb.AppendLine("<tr>");
                    sb.AppendLine("<td style='padding:5px;vertical-align:top;border:1px solid #ddd;'>");
                    sb.AppendLine("<strong style='color:#000;'>Order By</strong><br>" + dr["OrderBy"].ToString());
                    sb.AppendLine("</td>");
                    sb.AppendLine("<td style='padding:5px;vertical-align:top;border:1px solid #ddd;'>");
                    sb.AppendLine("<strong style='color:#000;'>Order To</strong><br>" + dr["OrderTo"].ToString());
                    sb.AppendLine("</td>");
                    sb.AppendLine("<td style='width:40%;padding:5px;vertical-align:top;border:1px solid #ddd;'>");
                    sb.AppendLine("<strong style='color:#000;'>Invoice Details</strong><br>" + dr["InvoiceNo"].ToString());
                    sb.AppendLine("</td>");
                    sb.AppendLine("</tr>");
                    sb.AppendLine("</table>");
                }
            }
            // Items Table
            sb.AppendLine("<table style='width:100%;border-collapse:collapse;font-size:13px'>");
            sb.AppendLine("<thead>");
            sb.AppendLine("<tr>");
            sb.AppendLine("<th style='background-color:#bde3f7;color:#000;padding:5px;border:1px solid #ccc;'>Item # / Item description</th>");
            sb.AppendLine("<th style='background-color:#bde3f7;color:#000;padding:5px;border:1px solid #ccc;'>Quantity</th>");
            sb.AppendLine("<th style='background-color:#bde3f7;color:#000;padding:5px;border:1px solid #ccc;'>Trade</th>");
            sb.AppendLine("<th style='background-color:#bde3f7;color:#000;padding:5px;border:1px solid #ccc;'>Tax</th>");
            sb.AppendLine("<th style='background-color:#bde3f7;color:#000;padding:5px;border:1px solid #ccc;'>Amount</th>");
            sb.AppendLine("</tr>");
            sb.AppendLine("</thead>");
            sb.AppendLine("<tbody>");
            if (ds.Tables.Count > 0 && ds.Tables[1].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[1].Rows)
                {
                    sb.AppendLine("<tr>");
                    sb.AppendLine("<td style='padding:5px;border:1px solid #ccc;'>" + dr["item_name"].ToString() + "</td>");
                    sb.AppendLine("<td style='padding:5px;border:1px solid #ccc;'>" + dr["FinalPO"].ToString() + "</td>");
                    sb.AppendLine("<td style='padding:5px;border:1px solid #ccc;'>" + dr["trade"].ToString() + "</td>");
                    sb.AppendLine("<td style='padding:5px;border:1px solid #ccc;'>" + dr["Tax"].ToString() + " %</td>");
                    sb.AppendLine("<td style='padding:5px;border:1px solid #ccc;'>" + dr["Amount"].ToString() + "</td>");
                    sb.AppendLine("</tr>");
                }
            }
            // Summary Table
            if (ds.Tables.Count > 0 && ds.Tables[2].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[2].Rows)
                {
                    sb.AppendLine("<table style='width:40%;float:right;border-collapse:collapse;margin-top:20px;font-size:13px'>");
                    sb.AppendLine("<tr><td style='font-weight:bold;text-align:right;padding:5px;border:1px solid #ccc;'>Sub Total</td><td style='text-align:right;padding:5px;border:1px solid #ccc;'>₹ " + dr["SubTotal"].ToString() + "</td></tr>");
                    sb.AppendLine("<tr><td style='font-weight:bold;text-align:right;padding:5px;border:1px solid #ccc;'>Discount(10%)</td><td style='text-align:right;padding:5px;border:1px solid #ccc;'>₹" + dr["Discount"].ToString() + "</td></tr>");
                    sb.AppendLine("<tr><td style='font-weight:bold;text-align:right;padding:5px;border:1px solid #ccc;'>Taxable Amount</td><td style='text-align:right;padding:5px;border:1px solid #ccc;'>₹ " + dr["TaxableAmount"].ToString() + "</td></tr>");
                    sb.AppendLine("<tr style='background-color:#d7f2fa;font-weight:bold;color:#000;'><td style='text-align:right;padding:5px;border:1px solid #ccc;'>Total Due Amount</td><td style='text-align:right;padding:5px;border:1px solid #ccc;'>₹" + dr["TotalDueAmount"].ToString() + "</td></tr>");
                    sb.AppendLine("</table>");
                }
            }
            sb.AppendLine("<p style='font-size:13px'><strong>Invoice Total in Words:</strong> Forty Two Thousand Four Hundred and Eighty Five Only</p>");

            // Terms
            sb.AppendLine("<div style='clear:both;margin-top:40px;font-size:13px'>");
            sb.AppendLine("<h3>Terms and Conditions</h3>");
            sb.AppendLine("<ol>");
            sb.AppendLine("<li>Please pay within 15 days from the date of invoice; overdue interest of 1% will be charged on delayed payments.</li>");
            sb.AppendLine("<li>Please quote invoice number when remitting funds.</li>");
            sb.AppendLine("</ol>");
            sb.AppendLine("</div>");

            // Signature
            sb.AppendLine("<div style='margin-top:50px;font-size:13px'>");
            sb.AppendLine("<p>Authorized Signature</p>");
            sb.AppendLine("</div>");


            sb.AppendLine("</body>");
            sb.AppendLine("</html>");


            pdfConverter.Header_Enabled = false;
            pdfConverter.Footer_Enabled = true;
            pdfConverter.Footer_Hight = 17;
            pdfConverter.Header_Hight = 70;
            pdfConverter.PageMarginLeft = 10;
            pdfConverter.PageMarginRight = 10;
            pdfConverter.PageMarginBottom = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageName = "A4";
            pdfConverter.PageOrientation = "Portrait";
            return pdfConverter.ConvertToPdf(h.ToString(), sb.ToString(), "-", "Purchase-Invoice.pdf");
        }
        public JsonResult SendPoMail(string po_no, string email)
        {
            IndentBO obj = new IndentBO();
            obj.CompId = "-";
            obj.UnitId = "-";
            obj.indent_no = "-";
            obj.PONo = "-";
            obj.GrnNo = "-";
            obj.VendorId = "-";
            obj.From = "1900/01/01";
            obj.To = "1900/01/01";
            obj.ItemId = "-";
            obj.Prm1 = "-";
            obj.LoginId = "-";
            obj.Logic = "PrintPO";
            dataSet dsResult = APIProxy.CallWebApiMethod("Indent/GS_PurchaseOrderQueries", obj);
            DataSet ds = dsResult.ResultSet;

            StringBuilder sb = new StringBuilder();
            sb.AppendLine("<div style='text-align:center;font-weight:bold;width:80%;border:1px solid #ddd;padding:10px;display:block'>");
            sb.AppendLine("<h2 style='text-align:center;font-weight:bold;width:100%'>Purchase Order Details</h2>");
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    // Info Table
                    sb.AppendLine("<table style='width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px'>");
                    sb.AppendLine("<tr>");
                    sb.AppendLine("<td style='padding:5px;vertical-align:top;border:1px solid #ddd;'>");
                    sb.AppendLine("<strong style='color:#000;'>Order By</strong><br>" + dr["OrderBy"].ToString());
                    sb.AppendLine("</td>");
                    sb.AppendLine("<td style='padding:5px;vertical-align:top;border:1px solid #ddd;'>");
                    sb.AppendLine("<strong style='color:#000;'>Order To</strong><br>" + dr["OrderTo"].ToString());
                    sb.AppendLine("</td>");
                    sb.AppendLine("<td style='width:40%;padding:5px;vertical-align:top;border:1px solid #ddd;'>");
                    sb.AppendLine("<strong style='color:#000;'>Invoice Details</strong><br>" + dr["InvoiceNo"].ToString());
                    sb.AppendLine("</td>");
                    sb.AppendLine("</tr>");
                    sb.AppendLine("</table>");
                }
            }
            // Items Table
            sb.AppendLine("<table style='width:100%;border-collapse:collapse;font-size:13px'>");
            sb.AppendLine("<thead>");
            sb.AppendLine("<tr>");
            sb.AppendLine("<th style='background-color:#bde3f7;color:#000;padding:5px;border:1px solid #ccc;'>Item # / Item description</th>");
            sb.AppendLine("<th style='background-color:#bde3f7;color:#000;padding:5px;border:1px solid #ccc;'>Quantity</th>");
            sb.AppendLine("<th style='background-color:#bde3f7;color:#000;padding:5px;border:1px solid #ccc;'>Trade</th>");
            sb.AppendLine("<th style='background-color:#bde3f7;color:#000;padding:5px;border:1px solid #ccc;'>Tax</th>");
            sb.AppendLine("<th style='background-color:#bde3f7;color:#000;padding:5px;border:1px solid #ccc;'>Amount</th>");
            sb.AppendLine("</tr>");
            sb.AppendLine("</thead>");
            sb.AppendLine("<tbody>");
            if (ds.Tables.Count > 0 && ds.Tables[1].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[1].Rows)
                {
                    sb.AppendLine("<tr>");
                    sb.AppendLine("<td style='padding:5px;border:1px solid #ccc;'>" + dr["item_name"].ToString() + "</td>");
                    sb.AppendLine("<td style='padding:5px;border:1px solid #ccc;'>" + dr["FinalPO"].ToString() + "</td>");
                    sb.AppendLine("<td style='padding:5px;border:1px solid #ccc;'>" + dr["trade"].ToString() + "</td>");
                    sb.AppendLine("<td style='padding:5px;border:1px solid #ccc;'>" + dr["Tax"].ToString() + " %</td>");
                    sb.AppendLine("<td style='padding:5px;border:1px solid #ccc;'>" + dr["Amount"].ToString() + "</td>");
                    sb.AppendLine("</tr>");
                }
            }
            // Summary Table
            if (ds.Tables.Count > 0 && ds.Tables[2].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[2].Rows)
                {
                    sb.AppendLine("<table style='width:60%;border-collapse:collapse;margin-top:20px;font-size:13px'>");
                    sb.AppendLine("<tr><td style='font-weight:bold;text-align:right;padding:5px;border:1px solid #ccc;'>Sub Total</td><td style='text-align:right;padding:5px;border:1px solid #ccc;'>₹ " + dr["SubTotal"].ToString() + "</td></tr>");
                    sb.AppendLine("<tr><td style='font-weight:bold;text-align:right;padding:5px;border:1px solid #ccc;'>Discount(10%)</td><td style='text-align:right;padding:5px;border:1px solid #ccc;'>₹" + dr["Discount"].ToString() + "</td></tr>");
                    sb.AppendLine("<tr><td style='font-weight:bold;text-align:right;padding:5px;border:1px solid #ccc;'>Taxable Amount</td><td style='text-align:right;padding:5px;border:1px solid #ccc;'>₹ " + dr["TaxableAmount"].ToString() + "</td></tr>");
                    sb.AppendLine("<tr style='background-color:#d7f2fa;font-weight:bold;color:#000;'><td style='text-align:right;padding:5px;border:1px solid #ccc;'>Total Due Amount</td><td style='text-align:right;padding:5px;border:1px solid #ccc;'>₹" + dr["TotalDueAmount"].ToString() + "</td></tr>");
                    sb.AppendLine("</table>");
                }
            }
            sb.AppendLine("<p style='font-size:13px'><strong>Invoice Total in Words:</strong> Forty Two Thousand Four Hundred and Eighty Five Only</p>");
            //sb.AppendLine("<table style='width:60%;border-collapse:collapse;margin-top:20px;font-size:13px'>");
            //sb.AppendLine("<tr><td style='font-weight:bold;text-align:right;padding:5px;border:1px solid #ccc;'>Sub Total</td><td style='text-align:right;padding:5px;border:1px solid #ccc;'>₹40,000</td></tr>");
            //sb.AppendLine("<tr><td style='font-weight:bold;text-align:right;padding:5px;border:1px solid #ccc;'>Discount(10%)</td><td style='text-align:right;padding:5px;border:1px solid #ccc;'>₹4,000</td></tr>");
            //sb.AppendLine("<tr><td style='font-weight:bold;text-align:right;padding:5px;border:1px solid #ccc;'>Taxable Amount</td><td style='text-align:right;padding:5px;border:1px solid #ccc;'>₹36,000</td></tr>");
            //sb.AppendLine("<tr style='background-color:#d7f2fa;font-weight:bold;color:#000;'><td style='text-align:right;padding:5px;border:1px solid #ccc;'>Total Due Amount</td><td style='text-align:right;padding:5px;border:1px solid #ccc;'>₹42,485</td></tr>");
            //sb.AppendLine("</table>");
            sb.AppendLine("<br><label style='color:#1b71ef;font-weight:bold;'>Please Find PO Receipt Attachment Below-</label>");
            sb.AppendLine("</div>");
            if (PrintPurchaseOrder("") is FileContentResult data)
            {
                byte[] fileBytes = data.FileContents;
                var mail = new MailService.MailObject()
                {
                    subject = "PO Receipt From Chandan Hospital: " + po_no,
                    //body = ">>>>>Purchase Order Details<<<<<<<< <br>PO No : " + po_no + " <br>Sub Total : 1280.00 <br>Discount : 200.00 <br>Taxable Amount : 25.00 <br>Total Due Amount : 1585.00 <br>Please Find PO Receipt Attached below",
                    body = sb.ToString(),
                    to = email,
                    fileName = "PO_Receipt.pdf",
                    fileByte = fileBytes,
                };
                MailService.SendMail(mail);
            }
            return Json(new { message = "Success!" });
        }

        public FileResult PrintRateList(string clientid, string clientName)
        {
            PdfGenerator pdfConverter = new PdfGenerator();
            ServiceQueries obj = new ServiceQueries();
            obj.prm_1 = clientid;
            obj.Logic = "ClientwiseExcelList";
            ProLimsApi.Models.dataSet dsResult = APIProxy.CallWebApiMethod("GeneralStore/Diag_ClientQueries", obj);

            DataSet ds = dsResult.ResultSet;
            string _result = string.Empty;
            StringBuilder b = new StringBuilder();
            StringBuilder h = new StringBuilder();


            b.Append("<h1 style='text-align:center;text-decoration: underline;margin-bottom:-8px'>" + clientName + "</h1>");
            b.Append("<table  border='0' style='width:100%;font-size:11px;border-collapse: collapse;margin-top:10px'>");
            b.Append("<tr>");
            b.Append("<th style='width:10%;padding:3px;text-align:left;background:#ddd;'>Test Category</th>");
            b.Append("<th style='width:10%;padding:3px;text-align:left;background:#ddd;'>Item Id</th>");
            b.Append("<th style='width:50%;padding:3px;text-align:left;background:#ddd;'>Item Name</th>");
            b.Append("<th style='width:10%;text-align:right;padding:5px;background:#ddd;'>City Rate </th>");
            b.Append("<th style='width:10%;text-align:right;padding:5px;background:#ddd;'>Panel Rate</th>");
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
                    b.Append("<td style='width:10%;font-size:13px !important'>" + dr["SubCategory"].ToString() + "</td>");
                    b.Append("<td style='width:10%;font-size:13px !important'>" + dr["ItemId"].ToString() + "</td>");
                    b.Append("<td style='width:50%;font-size:13px !important'>" + dr["ItemName"].ToString() + "</td>");
                    b.Append("<td style='width:10%;text-align:right'>" + dr["Cityrate"].ToString() + "</td>");
                    b.Append("<td style='width:10%;text-align:right'>" + dr["panel_rate"].ToString() + "</td>");
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
            return pdfConverter.ConvertToPdf(h.ToString(), b.ToString(), "-", "Report.pdf");
        }
    }
}