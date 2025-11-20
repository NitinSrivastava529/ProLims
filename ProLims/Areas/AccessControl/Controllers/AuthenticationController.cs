using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProLims.Areas.AccessControl.Controllers
{
    public class AuthenticationController : Controller
    {      
        public ActionResult Login()
        {
            return View();
        }
        public ActionResult B2BLogin()
        {
            return View();
        }
    }
}