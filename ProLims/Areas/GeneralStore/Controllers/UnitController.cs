using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProLims.Areas.GeneralStore.Controllers
{
    public class UnitController : Controller
    {
        // GET: GeneralStore/Unit
        public ActionResult UnitIndent()
        {
            return View();
        }
        public ActionResult UnitIssue()
        {
            return View();
        }
    }
}