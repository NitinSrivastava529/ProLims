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
    }
}
