using ProLimsApi.Models;
using ProLimsApi.Repository.GeneralStore;
using ProLimsApi.Repository.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ProLimsApi.Controllers
{
    [RoutePrefix("api/Finance")]
    public class FinanceController : ApiController
    {
        private Finance Repository = new Finance();
        [HttpPost]
        [Route("Diag_AccountingQueries")]
        public HttpResponseMessage Diag_AccountingQueries([FromBody] FinanceModal objBO)
        {

            if (objBO.OutPutType == "Excel")
            {
                dataSet ds = Repository.Diag_AccountingQueries(objBO);
                ExcelGenerator objj = new ExcelGenerator();
                return objj.GetExcelFile(ds.ResultSet);
            }
            else
            {
                dataSet ds = Repository.Diag_AccountingQueries(objBO);
                return Request.CreateResponse(HttpStatusCode.OK, ds);
            }
        }

        [HttpPost]
        [Route("Prolims_VoucherGeneration")]
        public HttpResponseMessage Prolims_VoucherGeneration([FromBody]ipRefresh objBO)
        {
            string result = Repository.Prolims_VoucherGeneration(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
    }
}
