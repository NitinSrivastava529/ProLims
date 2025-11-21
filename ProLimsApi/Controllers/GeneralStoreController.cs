using ExcelDataReader;
using Newtonsoft.Json;
using PharmacyAPI.Repository.Utility;
using ProLimsApi.Models;
using ProLimsApi.Repository.GeneralStore;
using ProLimsApi.Repository.Utility;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using static ProLimsApi.Models.GeneralStoreDTO;

namespace ProLimsApi.Controllers
{
    [RoutePrefix("api/GeneralStore")]
    public class GeneralStoreController : ApiController
    {
        private readonly Master master = new Master();
        private readonly Package packRepo = new Package();

        [HttpPost]
        [Route("MasterQueries")]
        public HttpResponseMessage MasterQueries([FromBody] GeneralStoreQueries obj)
        {
            if (obj.OutPutType == "Excel")
            {
                dataSet ds = master.MasterQueries(obj);
                ExcelGenerator objj = new ExcelGenerator();
                return objj.GetExcelFile(ds.ResultSet);
            }
            else
            {
                dataSet data = master.MasterQueries(obj);
                return Request.CreateResponse(HttpStatusCode.OK, data);
            }
        }
        [HttpPost]
        [Route("InsertUpdateVendorMaster")]
        public HttpResponseMessage InsertUpdateVendorMaster([FromBody] VendorMasterBO obj)
        {
            string data = master.InsertUpdateVendorMaster(obj);
            return Request.CreateResponse(HttpStatusCode.OK, data);
        }
        [HttpPost]
        [Route("InsertUpdateManufacturer")]
        public HttpResponseMessage InsertUpdateManufacturer([FromBody] ManufacturerBO objBO)
        {
            string Result = master.InsertUpdateManufacturer(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, Result);
        }

        [HttpPost]
        [Route("InsertUpdateItemMaster")]
        public HttpResponseMessage Cant_InsertUpdateItemMaster([FromBody] ItemMasterBO objBO)
        {
            string Result = master.InsertUpdateItemMaster(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, Result);
        }
        [HttpPost]
        [Route("InsertLinkPackManufacturerToItem")]
        public HttpResponseMessage InsertLinkPackManufacturerToItem([FromBody] ItemMasterBO objBO)
        {
            string Result = master.InsertLinkPackManufacturerToItem(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, Result);
        }

        [HttpPost]
        [Route("PurchaseQueries")]
        public HttpResponseMessage PurchaseQueries([FromBody] PurchaseQueriesBO objBO)
        {

            if (objBO.OutPutType == "Excel")
            {
                dataSet ds = master.PurchaseQueries(objBO);
                ExcelGenerator obj = new Repository.Utility.ExcelGenerator();
                return obj.GetExcelFile(ds.ResultSet);
            }
            else
            {
                dataSet ds = master.PurchaseQueries(objBO);
                return Request.CreateResponse(HttpStatusCode.OK, ds);
            }

        }

        [HttpPost]
        [Route("InsertGroupMaster")]
        public HttpResponseMessage InsertGroupMaster([FromBody] GroupMasterBO objBO)
        {
            string Result = master.InsertGroupMaster(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, Result);
        }

        [HttpPost]
        [Route("PurchaseInsert")]
        public HttpResponseMessage PurchaseInsert([FromBody] GRNInsertBO objBO)
        {
            string result = master.PurchaseInsert(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [HttpPost]
        [Route("GRNDiscountReprocess")]
        public HttpResponseMessage GRNDiscountReprocess([FromBody] DiascountReprocessBO objBO)
        {
            string result = master.GRNDiscountReprocess(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpPost]
        [Route("DeleteGRN")]
        public HttpResponseMessage DeleteGRN([FromBody] PurchaseInsertBO objBO)
        {
            string result = master.DeleteGRN(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [HttpPost]
        [Route("GRNPosting")]
        public HttpResponseMessage GRNPosting([FromBody] PurchaseInsertBO objBO)
        {
            string result = master.GRNPosting(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [HttpPost]
        [Route("GRNOtherCharges")]
        public HttpResponseMessage GRNOtherCharges([FromBody] OtherChargesBo objBO)
        {
            string result = master.GRNOtherCharges(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [HttpPost]
        [Route("PurchaseUploadDocument")]
        public async Task<HttpResponseMessage> UploadPurchaseDocument()
        {
            HttpResponseMessage response = new HttpResponseMessage();
            SubmitStatus ss = new SubmitStatus();
            UploadClass repository = new UploadClass();
            if (!Request.Content.IsMimeMultipartContent())
            {
                ss.Status = 0;
                ss.Message = "This is not multipart content";
                response = Request.CreateResponse(HttpStatusCode.UnsupportedMediaType, "This is not multipart content");
            }
            try
            {
                var filesReadToProvider = await Request.Content.ReadAsMultipartAsync();
                //Json String of object  ipUploadDocument to be send at first or 0 index parameter   
                var json = await filesReadToProvider.Contents[0].ReadAsStringAsync();
                ipDocumentInfo obj = JsonConvert.DeserializeObject<ipDocumentInfo>(json);
                //Image to be send at second or 1 index parameter  
                byte[] fileBytes = await filesReadToProvider.Contents[1].ReadAsByteArrayAsync();
                ss = repository.UploadDocument(obj.TrnType, obj.TranId, obj.ImageType, fileBytes, obj.login_id);
                response = Request.CreateResponse(HttpStatusCode.OK, ss);
            }
            catch (Exception ex)
            {
                ss.Status = 0;
                ss.Message = ex.Message;
                response = Request.CreateResponse(HttpStatusCode.OK, ss);
            }
            return response;
        }

        [HttpPost]
        [Route("KitOrTest_TrackingQueries")]
        public HttpResponseMessage KitOrTest_TrackingQueries([FromBody] TrackingBO obj)
        {

            if (obj.ReportType == "Excel")
            {
                dataSet data = master.KitOrTest_TrackingQueries(obj);
                ExcelGenerator objj = new ExcelGenerator();
                return objj.GetExcelFile(data.ResultSet);
            }
            else
            {
                dataSet data = master.KitOrTest_TrackingQueries(obj);
                return Request.CreateResponse(HttpStatusCode.OK, data);
            }
        }
        [HttpPost]
        [Route("InsertUpdatePackType")]
        public HttpResponseMessage InsertUpdatePackType([FromBody] PackTypeBO objBO)
        {
            string Result = master.InsertUpdatePackType(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, Result);
        }

        [HttpPost]
        [Route("InsertHSNMaster")]
        public HttpResponseMessage InsertHSNMaster([FromBody] HSNBO objBO)
        {
            string Result = master.InsertHSNMaster(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, Result);
        }


        [HttpPost]
        [Route("InsertUpdateCategory")]
        public HttpResponseMessage InsertUpdateCategory([FromBody] CategoryBO objBO)
        {
            string Result = master.InsertUpdateCategory(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, Result);
        }

        [HttpPost]
        [Route("Internal_AuditQuery")]
        public HttpResponseMessage Internal_AuditQuery([FromBody] IPReport objBO)
        {
            if (objBO.OutPutType == "Excel")
            {
                dataSet ds = master.Internal_AuditQuery(objBO);
                ExcelGenerator obj = new ExcelGenerator();
                return obj.GetExcelFile(ds.ResultSet);
            }
            else
            {
                dataSet ds = master.Internal_AuditQuery(objBO);
                return Request.CreateResponse(HttpStatusCode.OK, ds);
            }

        }

        [HttpPost]
        [Route("IssueQueries")]
        public HttpResponseMessage IssueQueries([FromBody] IssueBO objBO)
        {
            if (objBO.OutPutType == "Excel")
            {
                dataSet ds = master.IssueQueries(objBO);
                ExcelGenerator obj = new ExcelGenerator();
                return obj.GetExcelFile(ds.ResultSet);
            }
            else
            {
                dataSet ds = master.IssueQueries(objBO);
                return Request.CreateResponse(HttpStatusCode.OK, ds);
            }

        }

        [HttpPost]
        [Route("InsertIssue")]
        public HttpResponseMessage InsertIssue([FromBody] IssueBO objBO)
        {
            string result = "";
            result = master.InsertIssue(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpPost]
        [Route("InsertBestRateMaster")]
        public HttpResponseMessage InsertBestRateMaster([FromBody] BestRateBo objBO)
        {
            string Result = master.InsertBestRateMaster(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, Result);
        }

        [HttpPost]
        [Route("InsertHIS_LIS_DoctorLink")]
        public HttpResponseMessage InsertHIS_LIS_DoctorLink([FromBody] Doctorlink objBO)
        {
            string result = "";
            result = master.InsertHIS_LIS_DoctorLink(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpPost]
        [Route("ReportQueries")]
        public HttpResponseMessage ReportQueries([FromBody] ReportDB obj)
        {
            if (obj.OutPutType == "Excel")
            {
                dataSet ds = master.ReportQueries(obj);
                ExcelGenerator objj = new ExcelGenerator();
                return objj.GetExcelFile(ds.ResultSet);
            }
            else
            {
                dataSet data = master.ReportQueries(obj);
                return Request.CreateResponse(HttpStatusCode.OK, data);
            }
        }


        [Route("InsertPanelMaster")]
        public HttpResponseMessage InsertPanelMaster([FromBody] PanelDb objBO)
        {
            string Result = master.InsertPanelMaster(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, Result);
        }

        [Route("UploadPanelRateExcel")]
        [HttpPost]
        public string UploadPanelRateExcel()
        {
            try
            {
                string message = "";
                HttpResponseMessage ResponseMessage = null;
                var httpRequest = HttpContext.Current.Request;
                DataSet dsexcelRecords = new DataSet();
                IExcelDataReader reader = null;
                HttpPostedFile Inputfile = null;

                var LoginId = HttpContext.Current.Request.Params["LoginId"];
                var LogicName = HttpContext.Current.Request.Params["Logic"];

                Stream FileStream = null;

                if (httpRequest.Files.Count > 0)
                {
                    Inputfile = httpRequest.Files[0];
                    FileStream = Inputfile.InputStream;

                    if (Inputfile != null && FileStream != null)
                    {
                        if (Inputfile.FileName.EndsWith(".xls"))
                            reader = ExcelReaderFactory.CreateBinaryReader(FileStream);
                        else if (Inputfile.FileName.EndsWith(".xlsx"))
                            reader = ExcelReaderFactory.CreateOpenXmlReader(FileStream);
                        else
                            message = "The file format is not supported.";

                        dsexcelRecords = reader.AsDataSet();
                        reader.Close();

                        if (dsexcelRecords != null && dsexcelRecords.Tables.Count > 0)
                        {
                            DataTable dtPanelRate = dsexcelRecords.Tables[0];
                            List<PanelExcelDb> objBO = new List<PanelExcelDb>();
                            for (int i = 1; i < dtPanelRate.Rows.Count; i++)
                            {
                                if (dtPanelRate.Rows[i][0].ToString().Length > 0)
                                {
                                    PanelExcelDb obj = new PanelExcelDb();
                                    obj.PanelRate = Convert.ToDecimal(dtPanelRate.Rows[i][8]);
                                    obj.PanelId = dtPanelRate.Rows[i][0].ToString();
                                    obj.itemId = dtPanelRate.Rows[i][4].ToString();
                                    obj.login_id = LoginId;
                                    obj.Logic = LogicName;
                                    objBO.Add(obj);
                                }
                            }
                            message = master.InsertPanelLinkRate(objBO);
                        }
                        else
                            message = "Selected file is empty.";
                    }
                    else
                        message = "Invalid File.";
                }

                return message;
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("GS_InsertProRateLink")]
        public HttpResponseMessage GS_InsertProRateLink([FromBody] List<Proratelink> objBO)
        {
            string result = master.GS_InsertProRateLink(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [Route("UploadExcelCityRate")]
        [HttpPost]
        public string UploadExcelCityRate()
        {
            try
            {
                string message = "";
                HttpResponseMessage ResponseMessage = null;
                var httpRequest = HttpContext.Current.Request;
                DataSet dsexcelRecords = new DataSet();
                IExcelDataReader reader = null;
                HttpPostedFile Inputfile = null;
                var LoginId = HttpContext.Current.Request.Params["LoginId"];
                var UnitId = HttpContext.Current.Request.Params["UnitId"];
                var LogicName = HttpContext.Current.Request.Params["Logic"];
                var RateListId = HttpContext.Current.Request.Params["RateListId"];
                var CompId = HttpContext.Current.Request.Params["CompId"];

                Stream FileStream = null;

                if (httpRequest.Files.Count > 0)
                {
                    Inputfile = httpRequest.Files[0];
                    FileStream = Inputfile.InputStream;

                    if (Inputfile != null && FileStream != null)
                    {
                        if (Inputfile.FileName.EndsWith(".xls"))
                            reader = ExcelReaderFactory.CreateBinaryReader(FileStream);
                        else if (Inputfile.FileName.EndsWith(".xlsx"))
                            reader = ExcelReaderFactory.CreateOpenXmlReader(FileStream);
                        else
                            message = "The file format is not supported.";

                        dsexcelRecords = reader.AsDataSet();
                        reader.Close();

                        if (dsexcelRecords != null && dsexcelRecords.Tables.Count > 0)
                        {
                            DataTable dtPanelRate = dsexcelRecords.Tables[0];
                            List<CityExcelDb> objBO = new List<CityExcelDb>();
                            for (int i = 1; i < dtPanelRate.Rows.Count; i++)
                            {
                                if (dtPanelRate.Rows[i][0].ToString().Length > 0)
                                {
                                    CityExcelDb obj = new CityExcelDb();
                                    obj.itemId = dtPanelRate.Rows[i][0].ToString();
                                    obj.MRPRate = Convert.ToDecimal(dtPanelRate.Rows[i][2]);
                                    obj.CityRate = Convert.ToDecimal(dtPanelRate.Rows[i][3]);
                                    obj.RateType = dtPanelRate.Rows[i][4].ToString();
                                    obj.login_id = LoginId;
                                    obj.Unitid = UnitId;
                                    obj.RateLIstId = RateListId;
                                    obj.CompId = CompId;
                                    obj.Logic = LogicName;
                                    objBO.Add(obj);
                                }
                            }
                            message = master.UpdateCityRateDetails(objBO);
                        }
                        else
                            message = "Selected file is empty.";
                    }
                    else
                        message = "Invalid File.";
                }

                return message;
            }
            catch (Exception)
            {
                throw;
            }
        }

        #region PackageMaster
        [HttpPost]
        [Route("PackageQueries")]
        public HttpResponseMessage PackageMasterQueries([FromBody] LabPackage objBO)
        {
            dataSet ds = packRepo.PackageMasterQueries(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, ds);
        }

        [HttpPost]
        [Route("mPackageInsertUpdate")]
        public HttpResponseMessage PackageInsertUpdate([FromBody] LabPackage objBO)
        {
            string result = packRepo.PackageInsertUpdate(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpPost]
        [Route("mPackageLinkItems")]
        public HttpResponseMessage PackageLinkItems([FromBody] LabPackage objBO)
        {
            string result = packRepo.PackageLinkItems(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        #endregion

        #region ClientMaster
        [HttpPost]
        [Route("GS_InsertClientMaster")]
        public HttpResponseMessage GS_InsertClientMaster([FromBody] IpClient objBO)
        {
            string result = packRepo.GS_InsertClientMaster(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        #endregion


        [HttpPost]
        [Route("GS_InsertIdDoseClientMaster")]
        public HttpResponseMessage GS_InsertIdDoseClientMaster([FromBody] IpClient obj)
        {
            string response = packRepo.GS_InsertIdDoseClientMaster(obj);
            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        [HttpPost]
        [Route("GS_InsertDoctorMaster")]
        public HttpResponseMessage GS_InsertDoctorMaster([FromBody] ipDoctor obj)
        {
            string response = master.GS_InsertDoctorMaster(obj);
            return Request.CreateResponse(HttpStatusCode.OK, response);
        }


        [HttpPost]
        [Route("Diag_ClientQueries")]
        public HttpResponseMessage Diag_ClientQueries([FromBody] GeneralStoreQueries obj)
        {
            if (obj.OutPutType == "Excel")
            {
                dataSet ds = master.Diag_ClientQueries(obj);
                ExcelGenerator objj = new ExcelGenerator();
                return objj.GetExcelFile(ds.ResultSet);
            }
            else
            {
                dataSet data = master.Diag_ClientQueries(obj);
                return Request.CreateResponse(HttpStatusCode.OK, data);
            }
        }

        [HttpPost]
        [Route("Diag_InsertClientMasterNew")]
        public HttpResponseMessage Diag_InsertClientMasterNew([FromBody] IpClient objBO)
        {
            string result = master.Diag_InsertClientMasterNew(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [HttpPost]
        [Route("Diag_InsertClientPair")]
        public HttpResponseMessage Diag_InsertClientPair([FromBody]IpclientDetails objBO)
        {
            string result = master.Diag_InsertClientPair(objBO.objMaster, objBO.objPairList);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
    }
}
