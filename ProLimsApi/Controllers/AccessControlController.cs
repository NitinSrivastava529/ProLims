using ProLimsApi.Models;
using ProLimsApi.Repository.AccessControl;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ProLimsApi.Controllers
{
    [RoutePrefix("api/AccessControl")]
    public class AccessControlController : ApiController
    {
        private readonly Authentication authentication = new Authentication();

        [HttpPost]
        [Route("Auth_ConfigQueries")]
        public HttpResponseMessage Auth_ConfigQueries([FromBody] ipAuthentication obj)
        {
            dataSet data = authentication.Auth_ConfigQueries(obj);
            return Request.CreateResponse(HttpStatusCode.OK, data);
        }
        [HttpPost]
        [Route("Config_InsertUpdate")]
        public HttpResponseMessage Config_InsertUpdate([FromBody] ipAuthentication obj)
        {
            string result = authentication.Config_InsertUpdate(obj);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
    }
}
