using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProLimsApi.Models
{
    public class FinanceModal
    {
        public string CompId { get; set; }
        public string UnitId { get; set; }
        public string from { get; set; }
        public string to { get; set; }
        public string Logic { get; set; }
        public string OutPutType { get; set; }
    }
    public class ipRefresh
    {
        public string unit_Id { get; set; }
        public string vchdate { get; set; }
    }
}