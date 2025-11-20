using ProLimsApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ProLimsApi.Repository.GeneralStore;
using static ProLimsApi.Models.AuditModal;
using ProLimsApi.Repository.Utility;

namespace ProLimsApi.Controllers
{
    [RoutePrefix("api/Audit")]
    public class AuditController : ApiController
    {
        private readonly Audit Auditmaster = new Audit();
        [HttpPost]
        [Route("AuditQueries")]
        public HttpResponseMessage AuditQueries([FromBody] AuditBO objBO)
        {
            dataSet ds = Auditmaster.AuditQueries(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, ds);
        }

        [HttpPost]
        [Route("InsertAuditMaster")]
        public HttpResponseMessage InsertAuditMaster([FromBody] AuditMasterBO objBO)
        {
            string result = Auditmaster.InsertAuditMaster(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpPost]
        [Route("InsertAuditInfo")]
        public HttpResponseMessage InsertAuditInfo([FromBody] AuditInfoBO objBO)
        {
            string result = Auditmaster.InsertAuditInfo(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpPost]
        [Route("DownloadAuditReport")]
        public HttpResponseMessage DownloadAuditReport([FromBody] AuditBO objBO)
        {
            dataSet ds = Auditmaster.AuditQueries(objBO);
            ExcelGenerator obj= new ExcelGenerator();
            return obj.GetExcelFile(ds.ResultSet);
        }

        [HttpPost]
        [Route("AuditCompletion")]
        public HttpResponseMessage AuditCompletion([FromBody] AuditInfoBO objBO)
        {
            string result = Auditmaster.AuditCompletion(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
    }
}
