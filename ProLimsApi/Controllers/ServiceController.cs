using ProLimsApi.Models;
using ProLimsApi.Repository.GeneralStore;
using ProLimsApi.Repository.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using static ProLimsApi.Models.GeneralStoreDTO;

namespace ProLimsApi.Controllers
{
    [RoutePrefix("api/Service")]
    public class ServiceController : ApiController
    {
        private Service repository = new Service();
        private LISDBLayer LISRepository = new LISDBLayer();
        [HttpPost]
        [Route("Diag_ServiceQueries")]
        public HttpResponseMessage Diag_ServiceQueries([FromBody] ServiceQueries objBO)
        {

            if (objBO.OutPutType == "Excel")
            {
                dataSet ds = repository.Diag_ServiceQueries(objBO);
                ExcelGenerator objj = new ExcelGenerator();
                return objj.GetExcelFile(ds.ResultSet);
            }
            else
            {
                dataSet ds = repository.Diag_ServiceQueries(objBO);
                return Request.CreateResponse(HttpStatusCode.OK, ds);
            }
        }


        [HttpPost]
        [Route("Diag_InvestigationQueries")]
        public HttpResponseMessage Diag_InvestigationQueries([FromBody] ipIvestigation objBO)
        {
            dataSet ds = repository.Diag_InvestigationQueries(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, ds);
        }

        [HttpPost]
        [Route("Diag_InvestigationInsertUpdate")]
        public HttpResponseMessage Diag_InvestigationInsertUpdate([FromBody] ipIvestigation objBO)
        {
            string result = repository.Diag_InvestigationInsertUpdate(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [HttpPost]
        [Route("ITDose_TestInfoQueries")]
        public HttpResponseMessage ITDose_TestInfoQueries([FromBody] ipIvestigation objBO)
        {
            dataSet ds = LISRepository.ITDose_TestInfoQueries(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, ds);
        }
        [HttpPost]
        [Route("Diag_ImportFromLisPackage")]
        public HttpResponseMessage Diag_ImportFromLisPackage([FromBody]InvestigationDetails objBO)
        {
            string result = repository.Diag_ImportFromLisPackage(objBO.objMaster, objBO.objPackageList);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpPost]
        [Route("Diag_RefundBooking")]
        public HttpResponseMessage Diag_RefundBooking([FromBody]ipCancellation objBO)
        {
            string result = repository.Diag_RefundBooking(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [HttpPost]
        [Route("diag_PayModeCorrectionQueries")]
        public HttpResponseMessage diag_PayModeCorrectionQueries([FromBody] PayModeCorrectionBO objBO)
        {
            dataSet ds = repository.diag_PayModeCorrectionQueries(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, ds);
        }

        [HttpPost]
        [Route("diag_InsertPayModeCorrection")]
        public HttpResponseMessage diag_InsertPayModeCorrection([FromBody] List<PaymentBO> obj)
        {
            string result = repository.diag_InsertPayModeCorrection(obj);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
    }
}
