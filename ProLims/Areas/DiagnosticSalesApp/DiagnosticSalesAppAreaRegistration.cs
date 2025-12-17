using System.Web.Mvc;

namespace ProLims.Areas.DiagnosticSalesApp
{
    public class DiagnosticSalesAppAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "DiagnosticSalesApp";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "DiagnosticSalesApp_default",
                "DiagnosticSalesApp/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}