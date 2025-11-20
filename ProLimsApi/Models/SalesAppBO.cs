using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProLimsApi.Models
{
    public class ipSalesAppBO
    {
        public string DoctorId { get; set; }
        public string ProId { get; set; }
        public string from { get; set; }
        public string to { get; set; }
        public string Prm1 { get; set; }
        public string Prm2 { get; set; }
        public string latitude { get; set; }
        public string longitude { get; set; }
        public string VisitRemark { get; set; }
        public string loginId { get; set; }
        public string Logic { get; set; }
    }
}