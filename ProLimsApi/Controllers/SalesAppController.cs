using ProLimsApi.Models;
using ProLimsApi.Repository.SalesApp;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ProLimsApi.Controllers
{
    [RoutePrefix("api/SalesApp")]
    public class SalesAppController : ApiController
    {
        private readonly SalesApp salesApp = new SalesApp();

        [HttpPost]
        [Route("SalesApp_InsertDoctorVisit")]
        public HttpResponseMessage SalesApp_InsertDoctorVisit([FromBody] ipSalesAppBO obj)
        {
            string result = salesApp.SalesApp_InsertDoctorVisit(obj);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [HttpPost]
        [Route("SalesApp_DoctorVisitQueries")]
        public HttpResponseMessage SalesApp_DoctorVisitQueries([FromBody] ipSalesAppBO obj)
        {
            dataSet ds = salesApp.SalesApp_DoctorVisitQueries(obj);
            return Request.CreateResponse(HttpStatusCode.OK, ds);
        }
    }
}
