using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace ProLimsApi.Models
{
    public class ipAuthentication
    {
        public string comp_id { get; set; }
        public string unit_id { get; set; }
        public string emp_code { get; set; }
        public string LoginId { get; set; }
        public string Password { get; set; }
        public string role_id { get; set; }
        public string menu_id { get; set; }
        public string menu_name { get; set; }
        public string sub_menu_id { get; set; }
        public string Prm1 { get; set; }
        public string Prm2 { get; set; }
        public string login_id { get; set; }
        public string Logic { get; set; }
    }
    public class dataSet
    {
        public string Msg { get; set; }
        public DataSet ResultSet { get; set; }
    }
}