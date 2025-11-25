using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProLims.Areas.B2B.Controllers
{
    public class PatientController : Controller
    {
        // GET: B2B/Patient
        public ActionResult Login()
        {
            return View();
        }
        public ActionResult Dashboard()
        {
            return View();
        }
        public ActionResult PatientRegistration()
        {
            return View();
        }
        public ActionResult SampleCollection()
        {
            return View();
        }
        public ActionResult PatientReport()
        {
            return View();
        }
        public ActionResult FinanceReport()
        {
            return View();
        }
        public ActionResult SampleCancellation()
        {
            return View();
        }
        public ActionResult DispatchSample()
        {
            return View();
        }
        public ActionResult DPR()
        {
            return View();
        }
        public ActionResult MarkAttendance()
        {
            return View();
        }
        public ActionResult BusinessEnquiry()
        {
            return View();
        }
    }
}