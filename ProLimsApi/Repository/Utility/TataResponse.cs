using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PharmacyAPI.Repository.Utility
{
    public class TataResponse
    {
        public string jobId { get; set; }
        public bool requireApproval { get; set; }
        public string jobCost { get; set; }
        public int totalCnt { get; set; }
        public int recepientCnt { get; set; }
        public string campaignId { get; set; }
        public string cusTmId { get; set; }
        public string username { get; set; }
    }
    public class ipSMS
    {
        public string MobileNo { get; set; }
        public string Prm1 { get; set; }
        public string Otp { get; set; }
    }
}