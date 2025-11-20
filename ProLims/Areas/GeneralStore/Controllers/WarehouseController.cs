using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProLims.Areas.GeneralStore.Controllers
{
    public class WarehouseController : Controller
    {       
        public ActionResult OrderVerification()
        {
            return View();
        }
        public ActionResult GeneratePO()
        {
            return View();
        }
        public ActionResult DirectGRN()
        {
            return View();
        }
        public ActionResult GRNByPO()
        {
            return View();
        }
        public ActionResult GRNByPO_Posting()
        {
            return View();
        }
        public ActionResult Dispatch()
        {
            return View();
        }
        public ActionResult Receive()
        {
            return View();
        }
        public ActionResult ManualPO()
        {
            return View();
        }
    }
}