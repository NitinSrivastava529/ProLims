using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProLimsApi.Models
{
    public class AuditModal
    {
        public class AuditBO
        {
            public string DeptId { get; set; }
            public string CartId { get; set; }
            public string ItemId { get; set; }
            public string MasterKeyId { get; set; }
            public string AuditNo { get; set; }
            public string login_id { get; set; }
            public string Logic { get; set; }
            public string UnitId { get; set; }
            public string CompId { get; set; }
        }
        public class AuditMasterBO
        {
            public string CartId { get; set; }
            public string audit_no { get; set; }
            public string audit_remark { get; set; }
            public string IsOpen { get; set; }
            public string login_id { get; set; }
            public string Logic { get; set; }
            public string UnitId { get; set; }
            public string CompId { get; set; }
        }
        public class AuditInfoBO
        {
            public int HospId { get; set; }
            public int AutoId { get; set; }
            public string CartId { get; set; }
            public string ItemId { get; set; }
            public string MasterKeyId { get; set; }
            public string AuditType { get; set; }
            public string AuditNo { get; set; }
            public string batchNo { get; set; }
            public string Logic { get; set; }
            public string login_id { get; set; }
            public DateTime exp_date { get; set; }
            public decimal mrp { get; set; }
            public Int64 CartStock { get; set; }
            public Int64 Qty { get; set; }

            public string UnitId { get; set; }
            public string CompId { get; set; }
        }
    }


}