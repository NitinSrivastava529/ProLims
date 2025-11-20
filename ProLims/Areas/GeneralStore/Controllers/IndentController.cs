using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProLims.Areas.GeneralStore.Controllers
{
    public class IndentController : Controller
    {
        // GET: GeneralStore/Indent
        public ActionResult IndentEntry()
        {
            return View();
        }
    }
}