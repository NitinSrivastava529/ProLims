using PharmacyAPI.Repository.Utility;
using ProLimsApi.Models;
using ProLimsApi.Repository.Utility;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Http;

namespace ProLimsApi.Repository.B2B
{
    public class B2BRepository
    {
        UploadClass updObj = new UploadClass();
        LISDBLayer itdoxy = new LISDBLayer();
        public string CreateChandanCareCard(HealthCardInfo ipapp)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_eManagement))
            {
                using (SqlCommand cmd = new SqlCommand("pInsert_ChandanCareCard", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@UnitId", SqlDbType.VarChar, 10).Value = ipapp.UnitId;
                    cmd.Parameters.Add("@card_no", SqlDbType.VarChar, 20).Value = ipapp.card_no;
                    cmd.Parameters.Add("@cust_name", SqlDbType.VarChar, 50).Value = ipapp.cust_name;
                    cmd.Parameters.Add("@gender", SqlDbType.VarChar, 10).Value = ipapp.gender;
                    cmd.Parameters.Add("@dob", SqlDbType.VarChar, 10).Value = ipapp.dob;
                    cmd.Parameters.Add("@mobileno", SqlDbType.VarChar, 10).Value = ipapp.mobileno;
                    cmd.Parameters.Add("@area", SqlDbType.VarChar, 200).Value = ipapp.area;
                    cmd.Parameters.Add("@Locality", SqlDbType.VarChar, 200).Value = ipapp.Locality;
                    cmd.Parameters.Add("@district", SqlDbType.VarChar, 50).Value = ipapp.district;
                    cmd.Parameters.Add("@state", SqlDbType.VarChar, 50).Value = ipapp.state;
                    cmd.Parameters.Add("@email", SqlDbType.VarChar, 50).Value = ipapp.email;
                    cmd.Parameters.Add("@pin", SqlDbType.VarChar, 20).Value = ipapp.pin;
                    cmd.Parameters.Add("@logic", SqlDbType.VarChar, 50).Value = ipapp.logic;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = ipapp.login_id;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 500).Value = "";
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
        public string Geo_AppAttendanceMarking(AppAttendance objBO)
        {
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnHR))
            {
                using (SqlCommand cmd = new SqlCommand("pGeo_AppAttendanceMarking", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@CentreId", SqlDbType.VarChar, 10).Value = objBO.CentreId;
                    cmd.Parameters.Add("@emp_code", SqlDbType.VarChar, 20).Value = objBO.emp_code;
                    cmd.Parameters.Add("@CurLat", SqlDbType.VarChar, 50).Value = objBO.CurLat;
                    cmd.Parameters.Add("@CurLong", SqlDbType.VarChar, 50).Value = objBO.CurLong;
                    cmd.Parameters.Add("@AppName", SqlDbType.VarChar, 20).Value = objBO.AppName;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 300).Value = "";
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
        public string DownloadLISReport(B2BModel ipProfile)
        {
            string result = string.Empty;
            string virtualPath = string.Empty;
            ReportResult resultRep = new ReportResult();
            HttpResponseMessage response = new HttpResponseMessage();
            try
            {
                System.Net.WebClient Client = new System.Net.WebClient();
                ResultSet rs = itdoxy.CheckRegDATE(ipProfile.TestIds);
                string Url = string.Empty;
                if (rs.dataSet.Tables[0].Rows.Count > 0)
                {
                    if (rs.dataSet.Tables[0].Rows[0]["DBType"].ToString() == "BackupDB")
                    {
                        if (rs.dataSet.Tables[0].Rows[0]["IntegrationType"].ToString() == "NHM-UK")
                            Url = "http://chandanlims.com/Chandan/Design/Lab/labreportnew_NhmUkArchive1.aspx?IsPrev=0&PHead=1&testid=" + ipProfile.TestIds + "&Mobile=1";
                        else
                            Url = "http://chandanlims.com/Chandan/Design/Lab/labreportnewArcheive.aspx?IsPrev=0&PHead=1&testid=" + ipProfile.TestIds + "&Mobile=1";
                    }
                    else
                    {
                        if (rs.dataSet.Tables[0].Rows[0]["IntegrationType"].ToString() == "NHM-UK")
                            Url = "http://chandanlims.com/Chandan/Design/Lab/labreportnew_NhmUk.aspx?IsPrev=0&PHead=1&testid=" + ipProfile.TestIds + "&Mobile=1";
                        else if (rs.dataSet.Tables[0].Rows[0]["IntegrationType"].ToString() == "SHA")
                            Url = "http://chandanlims.com/Chandan/Design/Lab/labreportnew_NhmSha.aspx?IsPrev=0&PHead=1&testid=" + ipProfile.TestIds + "&Mobile=1";
                        else
                            Url = "http://chandanlims.com/Chandan/Design/Lab/labreportnew.aspx?IsPrev=0&PHead="+ ipProfile.Prm1+ "&testid=" + ipProfile.TestIds + "&Mobile=1";
                    }
                }

                var bytes = Client.DownloadData(Url);
                result = updObj.SaveReport(out virtualPath, ipProfile.VisitNo, bytes);
            }
            catch (Exception ex)
            {
                result = ex.Message;
                resultRep.Status = 0;
                resultRep.ReportUrl = "";
                resultRep.Message = ex.Message;
            }
            return result;
        }
        public string DiagnosticBookingReportByVisitNo(B2BModel obj)
        {
            LISDBLayer objdb = new LISDBLayer();
            string str = "";

            //string id = Common.Decrypt(obj.TrnNo);
            string id = obj.VisitNo;
            dataSet result = new dataSet();

            result = objdb.DiagnosticBookingReportByVisitNo(id);
            if (result.ResultSet.Tables[0].Rows.Count > 0)
            {
                var visitList = result.ResultSet.Tables[0].AsEnumerable().Select(x => new { ReportPrintingName = x.Field<string>("ReportPrintingName"), Address = x.Field<string>("Address"), Mobile = x.Field<string>("Mobile"), Landline = x.Field<string>("Landline"), PatientName = x.Field<string>("PName"), LedgerTransactionNo = x.Field<string>("LedgerTransactionNo"), LedgerTransactionID = x.Field<int>("LedgerTransactionID"), entry_date = x.Field<string>("date") }).Distinct();
                try
                {
                    foreach (var t in visitList)
                    {
                        str += "<div class='panel-group' style='margin:-11px;margin-top:10px'>";
                        str += "<div class='panel panel-primary' >";
                       // string header = "<img src='/Content/img/NHM_logo.png' style='width: 100%'/><br/><h4>Address : " + t.Address + "</h4>";
                        //header += "<br/><a href='http://www.chandan24x7.com/' class='btn btn-warning' role='button'>Download Chandan24x7 App</a>";
                       // string logo = "<img src='https://exprohelp.com/UKNHM/Content/img/NHM_logo.png' style='width: 100%'/>";
                        str += "<div class='panel-heading' style='text-align:center'><h4 class='header'>Centre  : " + t.ReportPrintingName + "  <br/>Address : " + t.Address + "</h4></div>";
                        str += "<div class='panel-body'>";
                        str += "<table>";
                        str += "<tr><td style='width:35%'>Visit No : </td><td style='width:65%'>" + t.LedgerTransactionNo + "</td> </tr>";
                        str += "<tr><td style='width:35%'>Patient Name: </td><td style='width:65%'>" + t.PatientName + "</td> </tr>";
                        str += "<tr><td style='width:35%'>Reg.Date : </td><td style='width:65%'>" + t.entry_date + "</td> </tr>";
                        str += "</table>";
                        str += "</div>";
                        str += "</div>";
                        str += "<div class='panel panel-info'>";
                        str += "<div class='panel-heading' style='text-align:center'>Test Information</div>";

                        //In Lab Report
                        var visitItemListInLab = result.ResultSet.Tables[0].AsEnumerable().Where(y => y.Field<string>("LedgerTransactionNo") == t.LedgerTransactionNo)
                        .Select(x => new
                        {
                            Test_ID = x.Field<int>("Test_ID"),
                            TestName = x.Field<string>("TestName"),
                            ReportStatus = x.Field<string>("ReportStatus"),
                        });
                        string Testids = string.Empty;
                        foreach (var ti in visitItemListInLab)
                        {
                            if (ti.ReportStatus.Contains("Ready"))
                                Testids = Testids + ti.Test_ID + ",";
                        }
                        str += "<div class='panel-body'>";

                        str += "<div class='card-header'>";
                        str += "<table style='width:100%'>";
                        str += "<tr>";
                        str += "<td style='width:8%'>Download Report</td>";
                        if (Testids.Length > 5)
                            str += "<td id='btnDownload' style='width:20%;text-align:center'><a name='" + t.LedgerTransactionNo + "' id='" + Testids + "' onclick='DownloadReport(this.name,this.id,1)' class='btn btn-warning btn-sm'>With Header<a/> &nbsp;&nbsp;<a name='" + t.LedgerTransactionNo + "' id='" + Testids + "' onclick='DownloadReport(this.name,this.id,0)' class='btn btn-info btn-sm'>Without Header<a/></td>";
                        else
                            str += "<td style='width:20%'></td>";

                        str += "</tr>";
                        str += "</table>";
                        str += "</div>";
                        str += "<div class='card-body' style='background: #ffffff;height:180px;overflow-y:scroll'>";
                        str += "<table class='table-bordered tab-content' style='width:100%'>";
                        foreach (var ti in visitItemListInLab)
                        {
                            str += "<tr>";
                            str += "<td style='width:70%;font-size:13px'>" + ti.TestName + "</td>";
                            str += "<td style='width:30%;font-size:13px;text-align:center'>" + ti.ReportStatus + "</td>";
                            str += "</tr>";
                        }
                        str += "</table>";
                        str += "</div>";
                        str += "</div></div>";

                        str += "</div>";
                    }
                }
                catch (Exception ex) { str = ex.Message; }
            }
            else
            {
                string VisitNo = string.Empty;
                string Patient = string.Empty;
                string TestName = string.Empty;
                string MobileNo = string.Empty;
                string Centre = string.Empty;
                string Address = string.Empty;
                string cr_date = string.Empty;
                B2BModel objBO = new B2BModel();
                objBO.VisitNo = obj.VisitNo;
                objBO.Logic = "PatientReport:ByVisitNo";
                dataSet testList = B2B_PatientQueries(objBO);
                try
                {
                    foreach (DataRow dr in testList.ResultSet.Tables[0].Rows)
                    {
                        VisitNo = dr["VisitNo"].ToString();
                        Patient = dr["PatientName"].ToString();
                        TestName = dr["TestName"].ToString();
                        MobileNo = dr["MobileNo"].ToString();
                        Centre = "-";
                        Address = "-";
                        cr_date = dr["cr_date"].ToString();
                    }
                    str += "<div class='panel-group' style='margin:-11px;margin-top:10px'>";
                    str += "<div class='panel panel-primary' >";
                    //str += "<div class='panel-heading' style='text-align:center'><img src='https://exprohelp.com/UKNHM/Content/img/NHM_logo.png' style='width: 100%;'/></div>";
                    str += "<div class='panel-body'>";
                    str += "<table>";
                    str += "<tr><td style='width:35%'>Visit No : </td><td style='width:65%'>" + VisitNo + "</td> </tr>";
                    str += "<tr><td style='width:35%'>Patient Name: </td><td style='width:65%'>" + Patient + "</td> </tr>";
                    str += "<tr><td style='width:35%'>Reg.Date : </td><td style='width:65%'>" + cr_date + "</td> </tr>";
                    str += "</table>";
                    str += "</div>";
                    str += "</div>";
                    str += "<div class='panel panel-info'>";
                    str += "<div class='panel-heading' style='text-align:center'>Test Information</div>";
                    str += "<div class='panel-body'>";
                    str += "<div class='card-body' style='background: #ffffff;height:180px;overflow-y:scroll'>";
                    str += "<table class='table-bordered tab-content' style='width:100%'>";
                    foreach (DataRow dr in testList.ResultSet.Tables[0].Rows)
                    {
                        str += "<tr>";
                        str += "<td style='width:70%;font-size:13px'>" + dr["TestName"].ToString() + "</td>";
                        str += "<td style='width:30%;font-size:13px;text-align:center'>" + dr["status"].ToString() + "</td>";
                        str += "</tr>";
                    }
                    str += "</table>";
                    str += "</div>";
                    str += "</div></div>";
                    str += "</div>";
                }
                catch (Exception ex) { str = ex.Message; }
            }

            return str;
        }
        public string Diag_SampleCollection(List<SampleCollection> items)
        {
            string processInfo = string.Empty;
            string VisitNo = string.Empty;
            string ClientId = string.Empty;
            string UnitId = string.Empty;
            string Prm1 = string.Empty;
            string Logic = string.Empty;
            string login_id = string.Empty;
            if (items.Count > 0)
            {
                DataTable dt = new DataTable();
                dt.Columns.Add("AutoTestId", typeof(int));
                dt.Columns.Add("testcode", typeof(string));
                dt.Columns.Add("sampleName", typeof(string));
                dt.Columns.Add("BarcodeNo", typeof(string));
                dt.Columns.Add("VialQty", typeof(int));
                foreach (SampleCollection obj in items)
                {
                    VisitNo = obj.VisitNo;
                    ClientId = obj.ClientId;
                    UnitId = obj.UnitId;
                    Prm1 = obj.Prm1;
                    login_id = obj.login_id;
                    Logic = obj.Logic;
                    DataRow dr = dt.NewRow();
                    dr["AutoTestId"] = obj.AutoTestId;
                    dr["testcode"] = obj.testcode;
                    dr["sampleName"] = obj.sampleName;
                    dr["BarcodeNo"] = obj.BarcodeNo;
                    dr["VialQty"] = obj.VialQty;
                    dt.Rows.Add(dr);
                }
                using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
                {
                    using (SqlCommand cmd = new SqlCommand("pDiag_SampleCollection", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandTimeout = 2500;
                        cmd.Parameters.Add("@VisitNo", SqlDbType.VarChar, 20).Value = VisitNo;
                        cmd.Parameters.Add("@ClientId", SqlDbType.VarChar, 20).Value = ClientId;
                        cmd.Parameters.Add("@UnitId", SqlDbType.VarChar, 20).Value = UnitId;
                        cmd.Parameters.Add("@Prm1", SqlDbType.VarChar, 100).Value = Prm1;
                        cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 20).Value = login_id;
                        cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = Logic;
                        cmd.Parameters.AddWithValue("UDT_SampleCollectedData", dt);
                        cmd.Parameters.Add("@result", SqlDbType.VarChar, 200).Value = "";
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
                    }
                }
            }
            return processInfo;
        }
        public string Diag_TestBooking(DiagTestBooking objBO, List<TestBookingItems> bookingItems, List<Receipt> receipt)
        {
            string processInfo = string.Empty;
            if (bookingItems.Count > 0)
            {
                DataTable dt = new DataTable();
                dt.Columns.Add("RateListId", typeof(string));
                dt.Columns.Add("ItemId", typeof(string));
                dt.Columns.Add("mrp_rate", typeof(decimal));
                dt.Columns.Add("panel_rate", typeof(decimal));
                dt.Columns.Add("adl_disc_amount", typeof(decimal));
                dt.Columns.Add("net_amount", typeof(decimal));
                dt.Columns.Add("IsUrgent", typeof(char));
                dt.Columns.Add("Remark", typeof(string));
                foreach (TestBookingItems obj in bookingItems)
                {
                    DataRow dr = dt.NewRow();
                    dr["RateListId"] = obj.RateListId;
                    dr["ItemId"] = obj.ItemId;
                    dr["mrp_rate"] = obj.mrp_rate;
                    dr["panel_rate"] = obj.panel_rate;
                    dr["adl_disc_amount"] = obj.adl_disc_amount;
                    dr["net_amount"] = obj.net_amount;
                    dr["IsUrgent"] = obj.IsUrgent;
                    dr["Remark"] = obj.Remark;
                    dt.Rows.Add(dr);
                }

                DataTable dt1 = new DataTable();
                dt1.Columns.Add("ReceiptNo", typeof(string));
                dt1.Columns.Add("PayMode", typeof(string));
                dt1.Columns.Add("CardNo", typeof(string));
                dt1.Columns.Add("BankName", typeof(string));
                dt1.Columns.Add("RefNo", typeof(string));
                dt1.Columns.Add("MachineId", typeof(string));
                dt1.Columns.Add("MachineName", typeof(string));
                dt1.Columns.Add("Amount", typeof(decimal));
                dt1.Columns.Add("OnlPaymentId", typeof(string));
                dt1.Columns.Add("OnlPayStatus", typeof(string));
                dt1.Columns.Add("OnlPayResponse", typeof(string));
                dt1.Columns.Add("OnlPaymentDate", typeof(DateTime));
                dt1.Columns.Add("login_id", typeof(string));
                if (receipt.Count > 0)
                {
                    foreach (Receipt obj in receipt)
                    {
                        DataRow dr = dt1.NewRow();
                        dr["ReceiptNo"] = obj.ReceiptNo;
                        dr["PayMode"] = obj.PayMode;
                        dr["CardNo"] = obj.CardNo;
                        dr["BankName"] = obj.BankName;
                        dr["RefNo"] = obj.RefNo;
                        dr["MachineId"] = obj.MachineId;
                        dr["MachineName"] = obj.MachineName;
                        dr["Amount"] = obj.Amount;
                        dr["OnlPaymentId"] = obj.OnlPaymentId;
                        dr["OnlPayStatus"] = obj.OnlPayStatus;
                        dr["OnlPayResponse"] = obj.OnlPayResponse;
                        dr["OnlPaymentDate"] = obj.OnlPaymentDate;
                        dr["login_id"] = obj.login_id;
                        dt1.Rows.Add(dr);
                    }
                }
                    using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
                    {
                        using (SqlCommand cmd = new SqlCommand("pDiag_TestBooking", con))
                        {
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.CommandTimeout = 2500;
                            cmd.Parameters.Add("@CompId", SqlDbType.VarChar, 10).Value = objBO.CompId;
                            cmd.Parameters.Add("@UnitId", SqlDbType.VarChar, 20).Value = objBO.UnitId;
                            cmd.Parameters.Add("@ClientId", SqlDbType.VarChar, 20).Value = objBO.ClientId;
                            cmd.Parameters.Add("@ipopType", SqlDbType.VarChar, 20).Value = objBO.ipopType;
                            cmd.Parameters.Add("@Title", SqlDbType.VarChar, 20).Value = objBO.Title;
                            cmd.Parameters.Add("@UHID", SqlDbType.VarChar, 20).Value = objBO.UHID;
                            cmd.Parameters.Add("@patient_name", SqlDbType.VarChar, 100).Value = objBO.patient_name;
                            cmd.Parameters.Add("@email", SqlDbType.VarChar, 30).Value = objBO.email;
                            cmd.Parameters.Add("@age", SqlDbType.Decimal).Value = objBO.age;
                            cmd.Parameters.Add("@ageType", SqlDbType.VarChar, 20).Value = objBO.ageType;
                            cmd.Parameters.Add("@gender", SqlDbType.VarChar, 20).Value = objBO.gender;
                            //cmd.Parameters.Add("@dob", SqlDbType.VarChar, 20).Value = objBO.dob;
                            cmd.Parameters.Add("@StateName", SqlDbType.VarChar,100).Value = objBO.StateName;
                            cmd.Parameters.Add("@district", SqlDbType.VarChar, 100).Value = objBO.district;
                            cmd.Parameters.Add("@locality", SqlDbType.VarChar, 100).Value = objBO.locality;
                            cmd.Parameters.Add("@address", SqlDbType.VarChar, 100).Value = objBO.address;
                            cmd.Parameters.Add("@CardNo", SqlDbType.VarChar, 100).Value = objBO.CardNo;
                            cmd.Parameters.Add("@mobile_no", SqlDbType.VarChar, 10).Value = objBO.mobile_no;
                            cmd.Parameters.Add("@RefCode", SqlDbType.VarChar, 10).Value = objBO.RefCode;
                            cmd.Parameters.Add("@Ref_name", SqlDbType.VarChar, 100).Value = objBO.Ref_name;                          
                            cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 20).Value = objBO.login_id;                         
                            cmd.Parameters.Add("@GenFrom", SqlDbType.VarChar).Value = objBO.GenFrom;
                            cmd.Parameters.Add("@HealthCardNo", SqlDbType.VarChar, 50).Value = objBO.HealthCardNo;
                            cmd.Parameters.Add("@PatientRemark", SqlDbType.VarChar, 200).Value = objBO.PatientRemark;
                            cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
                            cmd.Parameters.AddWithValue("UDT_TestBookingItems", dt);
                            cmd.Parameters.AddWithValue("udt_Receipt", dt1);
                            cmd.Parameters.Add("@result", SqlDbType.VarChar, 200).Value = "";
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
                        }
                    
                }
            }
            return processInfo;
        }
        public dataSet B2B_PatientQueries(B2BModel ip)
        {
            dataSet dsObj = new dataSet();
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pB2B_PatientQueries", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@unitId", SqlDbType.VarChar, 10).Value = ip.unitId;
                    cmd.Parameters.Add("@compId", SqlDbType.VarChar, 10).Value = ip.compId;
                    cmd.Parameters.Add("@clientId", SqlDbType.VarChar, 10).Value = ip.clientId;
                    cmd.Parameters.Add("@from", SqlDbType.Date).Value = ip.from;
                    cmd.Parameters.Add("@to", SqlDbType.Date).Value = ip.to;
                    cmd.Parameters.Add("@Prm1", SqlDbType.VarChar, 200).Value = ip.Prm1;
                    cmd.Parameters.Add("@Prm2", SqlDbType.VarChar, 200).Value = ip.Prm2;
                    cmd.Parameters.Add("@Prm3", SqlDbType.VarChar, 200).Value = ip.Prm3;
                    cmd.Parameters.Add("@loginId", SqlDbType.VarChar, 10).Value = ip.loginId;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = ip.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 200).Value = "";
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
        public dataSet pB2B_AnalysisQueries(B2BModel ip)
        {
            dataSet dsObj = new dataSet();
            using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
            {
                using (SqlCommand cmd = new SqlCommand("pB2B_AnalysisQueries", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@unitId", SqlDbType.VarChar, 10).Value = ip.unitId;
                    cmd.Parameters.Add("@compId", SqlDbType.VarChar, 10).Value = ip.compId;
                    cmd.Parameters.Add("@clientId", SqlDbType.VarChar, 10).Value = ip.clientId;
                    cmd.Parameters.Add("@from", SqlDbType.Date).Value = ip.from;
                    cmd.Parameters.Add("@to", SqlDbType.Date).Value = ip.to;
                    cmd.Parameters.Add("@Prm1", SqlDbType.VarChar, 200).Value = ip.Prm1;
                    cmd.Parameters.Add("@Prm2", SqlDbType.VarChar, 200).Value = ip.Prm2;
                    cmd.Parameters.Add("@Prm3", SqlDbType.VarChar, 200).Value = ip.Prm3;
                    cmd.Parameters.Add("@loginId", SqlDbType.VarChar, 10).Value = ip.loginId;
                    cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = ip.Logic;
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 200).Value = "";
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