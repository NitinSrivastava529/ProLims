using ProLimsApi.Models;
using ProLimsApi.Repository.B2B;
using ProLimsApi.Repository.Utility;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Http;

namespace ProLimsApi.Controllers.B2B
{
    [RoutePrefix("api/Patient")]
    public class PatientController : ApiController
    {
        private readonly B2BRepository repository = new B2BRepository();

        [HttpPost]
        [Route("B2B_PatientQueries")]
        public HttpResponseMessage B2B_PatientQueries([FromBody] B2BModel obj)
        {
            dataSet data = repository.B2B_PatientQueries(obj);
            return Request.CreateResponse(HttpStatusCode.OK, data);
        }
        [HttpPost]
        [Route("pB2B_AnalysisQueries")]
        public HttpResponseMessage pB2B_AnalysisQueries([FromBody] B2BModel obj)
        {
            if (obj.OutPutType == "Excel")
            {
                dataSet data = repository.pB2B_AnalysisQueries(obj);
                ExcelGenerator objj = new ExcelGenerator();
                return objj.GetExcelFile(data.ResultSet);
            }
            else
            {
                dataSet data = repository.pB2B_AnalysisQueries(obj);
                return Request.CreateResponse(HttpStatusCode.OK, data);
            }           
        }
        [HttpPost]
        [Route("Diag_TestBooking")]
        public HttpResponseMessage Diag_TestBooking([FromBody] TestBooking obj)
        {
            string data = repository.Diag_TestBooking(obj.diagTestBooking, obj.TestBookingItems, obj.Receipt);
            return Request.CreateResponse(HttpStatusCode.OK, data);
        }
        [HttpPost]
        [Route("Geo_AppAttendanceMarking")]
        public HttpResponseMessage Geo_AppAttendanceMarking([FromBody]AppAttendance objBO)
        {
            string data = repository.Geo_AppAttendanceMarking(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, data);
        }
        [HttpPost]
        [Route("Diag_SampleCollection")]
        public HttpResponseMessage Diag_SampleCollection([FromBody]List<SampleCollection> obj)
        {
            string data = repository.Diag_SampleCollection(obj);
            return Request.CreateResponse(HttpStatusCode.OK, data);
        }
        [HttpPost]
        [Route("DiagnosticBookingReportByVisitNo")]
        public HttpResponseMessage DiagnosticBookingReportByVisitNo([FromBody] B2BModel objBO)
        {
            string result = repository.DiagnosticBookingReportByVisitNo(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [HttpPost]
        [Route("CreateChandanCareCard")]
        public HttpResponseMessage CreateChandanCareCard([FromBody] HealthCardInfo objBO)
        {
            string result = repository.CreateChandanCareCard(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [HttpPost]
        [Route("DownloadLISReport")]
        public HttpResponseMessage DownloadLISReport(B2BModel ipProfile)
        {
            string result = repository.DownloadLISReport(ipProfile);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [HttpPost]
        [Route("UploadB2BDocument")]
        public async Task<string> B2BDocument()
        {         
            string response = string.Empty;                     
            try
            {
                var filesReadToProvider = await Request.Content.ReadAsMultipartAsync();
                var json = await filesReadToProvider.Contents[0].ReadAsStringAsync();
                string extention = await filesReadToProvider.Contents[0].ReadAsStringAsync();
                byte[] fileBytes = await filesReadToProvider.Contents[1].ReadAsByteArrayAsync();
                if (fileBytes.Length > 20)
                {
                    var ImageName = "RCPT_" + DateTime.Now.ToString("yyyyMMddTHHmmssfffffff") + '.' + extention;
                    response = ChandanAWS.B2BDocument(fileBytes, "." + extention, ImageName);                   
                }
            }
            catch (Exception ex)
            {
                response = "Error|" + ex.Message;
            }
            return response;
        }
        [HttpPost]
        [Route("InsertBusinessEnquiry")]
        public HttpResponseMessage InsertBusinessEnquiry([FromBody]BusinessEnquiry obj)
        {
            string result = repository.InsertBusinessEnquiry(obj);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
    }
}
