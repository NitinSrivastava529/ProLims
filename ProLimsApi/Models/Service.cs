using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProLimsApi.Models
{

    public class ipService
    {
        public Nullable<int> ID { get; set; }
        public string Logic { get; set; }
        public string Result { get; set; }
        public bool Flag { get; set; }
        public bool IsActive { get; set; }
        public string hosp_id { get; set; }
        public string login_id { get; set; }
        public string warehouseCartId { get; set; }
        public string prm_1 { get; set; }
        public string prm_2 { get; set; }
        public DateTime? CreatedOn { get; set; }
    }
    public class ippackagequery
    {

        public string Logic { get; set; }
        public string hosp_id { get; set; }
        public string login_id { get; set; }
        public string itemId { get; set; }
        public string PackageId { get; set; }
        public string InvestigationID { get; set; }
        public string TypeName { get; set; }
    }

    public class ipIvestigation : ipService
    {
        public string hosp_id { get; set; }
        public string Prm1 { get; set; }
        public string catid { get; set; }
        public string unitId { get; set; }
        public string compId { get; set; }
        public string subcateid { get; set; }
        public string ItemId { get; set; }
        public string investcode { get; set; }
        public string investname { get; set; }
        public string investreportname { get; set; }
        public string investtype { get; set; }
        public string bookfor { get; set; }
        public string repotytype { get; set; }
        public decimal rate { get; set; }
        public decimal cost { get; set; }
        public string maxtime { get; set; }
        public string extTestCode { get; set; }
        public string sampleoption { get; set; }
        public string sampleqty { get; set; }
        public string sampleremark { get; set; }
        public string sampletemp { get; set; }
        public string samplecontainer { get; set; }
        public string sampletype { get; set; }
        public string defaultsample { get; set; }
        public string testprep { get; set; }
        public string abouttest { get; set; }
        public string samplelinkdata { get; set; }
        public string isoutsource { get; set; }
        public string incrementflag { get; set; }
        public string promotionflag { get; set; }
        public string reportflag { get; set; }
        public string ignortat { get; set; }
        public string inoutrequired { get; set; }
        public string displayinweb { get; set; }
        public string consentflag { get; set; }
        public string printsampleinreport { get; set; }
        public string text { get; set; }
        public string Logic { get; set; }
        public string IsPopular { get; set; }
    }
    public class InvestigationDetails
    {
        public ipIvestigation objMaster { get; set; }
        public List<ippackagequery> objPackageList { get; set; }
    }
    public class ipCancellation
    {

        public string CompId { get; set; }
        public string UnitId { get; set; }
        public string ClientId { get; set; }
        public string OldVisitNo { get; set; }
        public string ItemIds { get; set; }
        public string DiscountRemark { get; set; }
        public string LoginId { get; set; }


    }
}