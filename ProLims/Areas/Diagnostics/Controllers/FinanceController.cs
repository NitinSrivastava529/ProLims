using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProLims.Areas.Diagnostics.Controllers
{
    public class FinanceController : Controller
    {
        // GET: Diagnostics/Finance
        public ActionResult AccountDetailsJS()
        {
            return View();
        }
        public ActionResult JsShareInfo()
        {
            return View();
        }
        public ActionResult JsReferralShareInfo()
        {
            return View();
        }
    }
}