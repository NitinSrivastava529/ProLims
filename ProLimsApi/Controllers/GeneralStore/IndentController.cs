using ProLimsApi.Models;
using ProLimsApi.Repository.GeneralStore;
using ProLimsApi.Repository.Utility;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ProLimsApi.Controllers.GeneralStore
{
    [RoutePrefix("api/Indent")]
    public class IndentController : ApiController
    {
        private Indent repository = new Indent();
        [HttpPost]
        [Route("Indent_Queries")]
        public HttpResponseMessage Indent_Queries([FromBody] IndentBO objBO)
        {
            if (objBO.OutPutType == "Excel")
            {
                dataSet ds = repository.Indent_Queries(objBO);
                ExcelGenerator obj = new ExcelGenerator();
                return obj.GetExcelFile(ds.ResultSet);
            }
            else
            {
                dataSet ds = repository.Indent_Queries(objBO);
                return Request.CreateResponse(HttpStatusCode.OK, ds);
            }
        }

        [HttpPost]
        [Route("GS_InsertModifyIndent")]
        public HttpResponseMessage GS_InsertModifyIndent([FromBody] IndentBO objBO)
        {
            string result = "";
            result = repository.GS_InsertModifyIndent(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [HttpPost]
        [Route("GS_IndentProcessingQueries")]
        public HttpResponseMessage GS_IndentProcessingQueries([FromBody] IndentBO objBO)
        {
            dataSet ds = repository.GS_IndentProcessingQueries(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, ds);
        }
        [HttpPost]
        [Route("GS_IndentProcInsertUpdate")]
        public HttpResponseMessage GS_IndentProcInsertUpdate([FromBody] IndentBO objBO)
        {
            string result = repository.GS_IndentProcInsertUpdate(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [HttpPost]
        [Route("GS_PurchaseOrderQueries")]
        public HttpResponseMessage GS_PurchaseOrderQueries([FromBody] IndentBO objBO)
        {
            if (objBO.OutPutType == "Excel")
            {
                dataSet ds = repository.GS_PurchaseOrderQueries(objBO);
                ExcelGenerator obj = new ExcelGenerator();
                return obj.GetExcelFile(ds.ResultSet);
            }
            else
            {
                dataSet ds = repository.GS_PurchaseOrderQueries(objBO);
                return Request.CreateResponse(HttpStatusCode.OK, ds);
            }          
        }
        [HttpPost]
        [Route("GS_GeneratePurchaseOrder")]
        public HttpResponseMessage GS_GeneratePurchaseOrder([FromBody] IndentBO objBO)
        {
            string result = repository.GS_GeneratePurchaseOrder(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [HttpPost]
        [Route("wh_GRNInsert")]
        public HttpResponseMessage wh_GRNInsert([FromBody] GRNRequest obj)
        {
            string result = repository.wh_GRNInsert(obj.objBO, obj.items);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [HttpPost]
        [Route("wh_GRNPosting")]
        public HttpResponseMessage wh_GRNPosting([FromBody] IndentBO obj)
        {
            string result = repository.wh_GRNPosting(obj);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [HttpPost]
        [Route("GS_DispatchQueries")]
        public HttpResponseMessage GS_DispatchQueries([FromBody] DispatchBO objBO)
        {
            if (objBO.OutPutType == "Excel")
            {
                dataSet ds = repository.GS_DispatchQueries(objBO);
                ExcelGenerator obj = new ExcelGenerator();
                return obj.GetExcelFile(ds.ResultSet);
            }
            else
            {
                dataSet ds = repository.GS_DispatchQueries(objBO);
                return Request.CreateResponse(HttpStatusCode.OK, ds);
            }
        }
        [HttpPost]
        [Route("wh_DispatchComplete")]
        public HttpResponseMessage wh_DispatchComplete([FromBody] ipIndent obj)
        {
            string result = repository.wh_DispatchComplete(obj);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [HttpPost]
        [Route("GS_GenerateManualPO")]
        public HttpResponseMessage GS_GenerateManualPO([FromBody] ManualPO_Tran obj)
        {
            string result = repository.GS_GenerateManualPO(obj.objBO, obj.item);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
    }
}
