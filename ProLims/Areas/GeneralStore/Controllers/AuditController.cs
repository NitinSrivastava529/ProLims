using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProLims.Areas.GeneralStore.Controllers
{
    public class AuditController : Controller
    {
        // GET: GeneralStore/Audit
        public ActionResult CreateAudit()
        {
            return View();
        }
        public ActionResult DoAudit()
        {
            return View();
        }
        public ActionResult AuditReport()
        {
            return View();
        }
    }
}