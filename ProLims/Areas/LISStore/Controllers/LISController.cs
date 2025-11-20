using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProLims.Areas.LISStore.Controllers
{
    public class LISController : Controller
    {
        // GET: LISStore/LIS
        public ActionResult ProDashBoard()
        {
            return View();
        }

        public ActionResult PanelRate()
        {
            return View();
        }
        public ActionResult PanelRateGenerate()
        {
            return View();
        }
    }
}