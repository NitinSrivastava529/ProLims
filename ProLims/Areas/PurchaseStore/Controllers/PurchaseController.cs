using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProLims.Areas.PurchaseStore.Controllers
{
    public class PurchaseController : Controller
    {
        // GET: PurchaseStore/Purchase
        public ActionResult PurchaseEntry()
        {
            return View();
        }
        public ActionResult PurchasePosting()
        {
            return View();
        }
        public ActionResult PurchaseBills()
        {
            return View();
        }
        public ActionResult PrintPurchaseBills()
        {
            return View();
        }
        public ActionResult IssueStock()
        {
            return View();
        }
        public ActionResult IssueStockReport()
        {
            return View();
        }
    }
}