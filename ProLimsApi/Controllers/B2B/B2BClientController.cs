using ProLimsApi.Models;
using ProLimsApi.Repository.B2B;
using ProLimsApi.Repository.Utility;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ProLimsApi.Controllers.B2B
{
    [RoutePrefix("api/B2BClient")]
    public class B2BClientController : ApiController
    {
        private readonly B2BClient repository = new B2BClient();

        [HttpPost]
        [Route("diag_SampleLabReceivingQueries")]
        public HttpResponseMessage diag_SampleLabReceivingQueries(ipsampleRecive objBO)
        {
            dataSet ds = repository.diag_SampleLabReceivingQueries(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, ds);
        }
        [HttpPost]
        [Route("PushJenaSekhoDataToLIS")]
        public HttpResponseMessage PushJenaSekhoDataToLIS([FromBody] ipsampleRecive objBO)
        {
            LISDBLayer ldr = new LISDBLayer();
            string result = ldr.PushJenaSekhoDataToLIS(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [HttpPost]
        [Route("B2B_JS_ShareQueries")]
        public HttpResponseMessage Diag_AccountingQueries([FromBody] B2BModel objBO)
        {

            if (objBO.OutPutType == "Excel")
            {
                dataSet ds = repository.B2B_JS_ShareQueries(objBO);
                ExcelGenerator objj = new ExcelGenerator();
                return objj.GetExcelFile(ds.ResultSet);
            }
            else
            {
                dataSet ds = repository.B2B_JS_ShareQueries(objBO);
                return Request.CreateResponse(HttpStatusCode.OK, ds);
            }
        }

    }
}
