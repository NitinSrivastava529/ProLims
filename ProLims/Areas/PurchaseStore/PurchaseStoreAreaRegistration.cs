using System.Web.Mvc;

namespace ProLims.Areas.PurchaseStore
{
    public class PurchaseStoreAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "PurchaseStore";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "PurchaseStore_default",
                "PurchaseStore/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}