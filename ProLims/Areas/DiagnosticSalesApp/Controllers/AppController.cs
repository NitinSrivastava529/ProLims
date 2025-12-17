using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProLims.Areas.DiagnosticSalesApp.Controllers
{
    public class AppController : Controller
    {
        // GET: DiagnosticSalesApp/App
        public ActionResult Login()
        {
            return View();
        }
        public ActionResult Dashboard()
        {
            return View();
        }
        public ActionResult GeoTaggingForReferral()
        {
            return View();
        }
    }
}