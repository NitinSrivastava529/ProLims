using System.Configuration;

namespace ProLimsApi.Repository.Utility
{
    public class GlobalConfig
    {
        public static string strConnLimsDB = ConfigurationManager.ConnectionStrings["strConnLimsDB"].ToString();
        public static string strConnHR = ConfigurationManager.ConnectionStrings["strConnHR"].ToString();
        public static string strConnCSD = ConfigurationManager.ConnectionStrings["strConnCSD"].ToString();
        public static string ConStr_eManagement = ConfigurationManager.ConnectionStrings["ConStr_eManagement"].ToString();
        public static string strConnMGM = ConfigurationManager.ConnectionStrings["strConnMGM"].ToString();
        public static string strConnMobileApp = ConfigurationManager.ConnectionStrings["strConnMobileApp"].ToString();
        public static string ConStr_LISByItDose = ConfigurationManager.ConnectionStrings["ConStr_LISByItDose"].ToString();
    }
}