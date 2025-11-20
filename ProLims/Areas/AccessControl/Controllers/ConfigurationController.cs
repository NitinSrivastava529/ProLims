using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProLims.Areas.AccessControl.Controllers
{
    public class ConfigurationController : Controller
    {
        public ActionResult Dashboard()
        {
            return View();
        }
        public ActionResult MenuAllotment()
        {
            return View();
        }
        public ActionResult MenuMaster()
        {
            return View();
        }
        public ActionResult UserWiseMenuAllotment()
        {
            return View();
        }
    }
}