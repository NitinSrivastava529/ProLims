using MySql.Data.MySqlClient;
using ProLimsApi.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace ProLimsApi.Repository.Utility
{
    public class LISDBLayer
    {
        public ResultSet CheckRegDATE(string TestIds)
        {
            string[] t = TestIds.Split(',');
            string qry = string.Empty;
            qry += " SELECT lt.Date,(CASE WHEN lt.Date > '2022-12-31' THEN 'CurrentDB' ELSE 'BackupDB' END ) DBType,IntegrationType FROM f_ledgertransaction lt ";
            qry += " INNER JOIN patient_labinvestigation_opd plo ON plo.LedgerTransactionNo = lt.LedgerTransactionNo  INNER JOIN centre_master cm ON cm.CentreID=lt.CentreID ";
            qry += " WHERE test_id = " + t[0] + "";
            return ExecuteDataset1(qry);
        }
        public ResultSet ExecuteDataset1(string commandText)
        {
            MySqlConnection con = new MySqlConnection(GlobalConfig.ConStr_LISByItDose);
            ResultSet dsObj = new ResultSet();
            DataSet ds = new DataSet();
            MySqlCommand cmd = new MySqlCommand(commandText, con);
            cmd.CommandType = CommandType.Text;
            cmd.CommandTimeout = 2500;
            try
            {
                MySqlDataAdapter da = new MySqlDataAdapter(cmd);
                da.Fill(ds);
                dsObj.dataSet = ds;
                dsObj.Message = "Success";
                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    dsObj.Status = 1;
                else
                    dsObj.Status = 0;
            }
            catch (Exception ex)
            {
                dsObj.dataSet = new DataSet();
                dsObj.Message = ex.Message;
                dsObj.Status = 0;
            }
            return dsObj;
        }
        public dataSet DiagnosticBookingReportByVisitNo(string VisitNo)
        {
            string qry = string.Empty;
            qry += " SELECT cm.ReportPrintingName,cm.Address,cm.Mobile,cm.Landline,DATE_FORMAT(lt.Date,'%d-%m-%Y') Date,lt.LedgerTransactionNo,lt.LedgerTransactionID,pm.PName ,plo.Test_ID, ";
            qry += " im.Name TestName, IF(plo.Approved = 0, 'Pending', 'Ready') ReportStatus FROM f_ledgertransaction lt ";
            qry += " INNER JOIN patient_labinvestigation_opd plo ON plo.LedgerTransactionNo = lt.LedgerTransactionNo ";
            qry += " INNER JOIN investigation_master im ON im.Investigation_Id = plo.Investigation_ID and im.Reporting=1 ";
            qry += " INNER JOIN patient_master pm ON pm.Patient_ID = plo.Patient_ID ";
            qry += " INNER JOIN centre_master cm ON cm.Centreid = lt.Centreid  ";
            qry += " INNER JOIN doctor_referal dr ON dr.Doctor_id = lt.Doctor_id ";
            qry += " WHERE lt.IsCancel = 0 AND plo.IsRefund=0 AND lt.LedgerTransactionNo = '" + VisitNo + "'";
            qry += " ORDER BY lt.Date DESC ";
            return ExecuteDataset(qry);
        }
        public string ExecuteScalar(string qry)
        {
            string processInfo = string.Empty;
            MySqlConnection con = new MySqlConnection(GlobalConfig.ConStr_LISByItDose);
            MySqlCommand cmd = new MySqlCommand(qry, con);
            cmd.CommandType = CommandType.Text;
            cmd.CommandTimeout = 2500;
            try
            {
                con.Open();
                if (cmd.ExecuteNonQuery() > 0)
                {
                    processInfo = "Successfully Saved";
                }
                else
                {
                    processInfo = "Not Saved";
                }
            }
            catch (MySqlException MySqlEx)
            {
                if (!MySqlEx.ToString().Contains("Violation of PRIMARY KEY"))
                    processInfo = "Error Found   : " + MySqlEx.Message;
                else
                    processInfo = " ";
            }
            finally { con.Close(); }
            return processInfo;
        }
        public dataSet ExecuteDataset(string commandText)
        {
            MySqlConnection con = new MySqlConnection(GlobalConfig.ConStr_LISByItDose);
            dataSet dsObj = new dataSet();
            DataSet ds = new DataSet();
            MySqlCommand cmd = new MySqlCommand(commandText, con);
            cmd.CommandType = CommandType.Text;
            cmd.CommandTimeout = 2500;
            try
            {
                MySqlDataAdapter da = new MySqlDataAdapter(cmd);
                da.Fill(ds);
                dsObj.ResultSet = ds;
                dsObj.Msg = "Success";
            }
            catch (Exception ex)
            {
                dsObj.ResultSet = null;
                dsObj.Msg = ex.Message;
            }
            return dsObj;
        }

        public dataSet ITDose_TestInfoQueries(ipIvestigation ip)
        {
            string qry = "";

            if (ip.Logic == "ByTestCode")
            {
                qry = " SELECT im.ItemID Investigation_Id, im.TypeName TestName, im.testcode,sc.Name AS SubCatName ";
                qry += " FROM F_ITEMMASTER im  LEFT OUTER JOIN INVESTIGATION_MASTER t ON im.ItemID = t.Investigation_Id  ";
                qry += " INNER JOIN f_subcategorymaster SC ON SC.SubCategoryID = IM.SubCategoryID ";
                qry += "WHERE im.testcode = '" + ip.Prm1 + "' AND  im.IsActive=1 ";
            }
            else if (ip.Logic == "ByTestSearch")
            {
                qry = "SELECT Investigation_Id, im.TypeName TestName, im.testcode, sc.Name AS SubCatName ";
                qry += "FROM F_ITEMMASTER im  LEFT OUTER JOIN INVESTIGATION_MASTER t ON im.ItemID = t.Investigation_Id ";
                qry += "INNER JOIN f_subcategorymaster SC ON SC.SubCategoryID = IM.SubCategoryID";
                qry += "WHERE t.Name like '%" + ip.Prm1 + "%'";
            }
            else if (ip.Logic == "PackageList")
            {
                qry += " SELECT im.ItemID PackageId, im.TestCode PackageCode, plm.`Name` PackageName,IF(fim.`Bill_Category`= 0, 'No Category', bcm.`Name`) Bill_Category, ";
                qry += " IF(im.`IsActive` = 1, 'YES', 'NO') IsActive,fim.ItemID TestId, fim.TestCode,fim.`TypeName` TestName,IF(fim.`IsActive` = 1, 'YES', 'NO') Test_IsActive ";
                qry += " ,im.BaseRate,(SELECT Rate FROM f_ratelist r  WHERE r.`ItemID` = im.`ItemID`  AND r.`Panel_ID` = 78 LIMIT 1 ) MRP,  ";
                qry += " (SELECT Rate FROM f_ratelist r  WHERE r.`ItemID` = im.`ItemID`  AND r.`Panel_ID` = 79 LIMIT 1 ) NetRate ";
                qry += " FROM  f_itemmaster im ";
                qry += " INNER JOIN package_labdetail pld ON pld.PlabID = im.Type_ID ";
                qry += " INNER JOIN packagelab_master plm ON plm.`PlabID`= im.`Type_ID`  ";
                qry += " INNER JOIN `f_itemmaster` fim ON pld.`InvestigationID`= fim.`Type_ID`   ";
                qry += " LEFT JOIN billingCategory_master bcm ON fim.`Bill_Category`= bcm.`ID` WHERE  im.ItemID='" + ip.Prm1 + "' and plm.IsActive = 1 AND pld.IsActive = 1 AND im.isactive = 1 ";
                qry += " GROUP BY pld.plabid,pld.InvestigationID ORDER BY im.`TypeName`   ";

            }
            else if (ip.Logic == "PackageCodeWise")
            {
                qry += " SELECT im.ItemID,im.TestCode,plm.Name ItemName, fim.SubCategoryID,'N/A' default_sample,'Not Required' SampleOption,";
                qry += " 'Package' Bill_Category,  ";
                qry += " IF(im.IsActive = 1, 'YES', 'NO') IsActive,fim.ItemID TestId,";
                qry += " fim.TestCode,fim.TypeName TestName, IF(fim.IsActive = 1, 'YES', 'NO') Test_IsActive  ,im.BaseRate,";
                qry += " (SELECT Rate FROM f_ratelist r  WHERE r.ItemID = im.ItemID  AND r.Panel_ID = 78 LIMIT 1 ) MRP";
                qry += " FROM  f_itemmaster im  INNER JOIN package_labdetail pld ON pld.PlabID = im.Type_ID";
                qry += " INNER JOIN packagelab_master plm ON plm.PlabID = im.Type_ID";
                qry += " INNER JOIN f_itemmaster fim ON pld.InvestigationID = fim.Type_ID";
                qry += " WHERE im.ItemID = '" + ip.Prm1 + "' AND plm.IsActive = 1";
                qry += " AND pld.IsActive = 1 AND im.isactive = 1  GROUP BY pld.plabid,pld.InvestigationID ORDER BY im.TypeName";
            }
            else if (ip.Logic == "GetSample")
            {
                qry += " SELECT sampletypeid, sm.sampleName FROM investigations_sampletype t ";
                qry += " INNER JOIN sampletype_master sm ON sm.id = t.sampletypeid ";
                qry += " WHERE Investigation_id = " + ip.Prm1 + " ";
            }
            else if (ip.Logic == "InvestigationCodeWise")
            {
                qry += "SELECT im.ItemID PackageId, im.TestCode PackageCode, plm.Name PackageName, fim.SubCategoryID,";
                qry += "'Package' Bill_Category, ";
                qry += "IF(im.IsActive = 1, 'YES', 'NO') IsActive,fim.ItemID TestId,";
                qry += "fim.TestCode,fim.TypeName TestName, IF(fim.IsActive = 1, 'YES', 'NO') Test_IsActive  ,im.BaseRate,";
                qry += "(SELECT Rate FROM f_ratelist r  WHERE r.ItemID = im.ItemID  AND r.Panel_ID = 78 LIMIT 1 ) MRP";
                qry += "FROM  f_itemmaster im  INNER JOIN package_labdetail pld ON pld.PlabID = im.Type_ID";
                qry += "INNER JOIN packagelab_master plm ON plm.PlabID = im.Type_ID";
                qry += "INNER JOIN f_itemmaster fim ON pld.InvestigationID = fim.Type_ID";
                qry += "WHERE im.ItemID = '" + ip.Prm1 + "'  AND plm.IsActive = 1";
                qry += "AND pld.IsActive = 1 AND im.isactive = 1  GROUP BY pld.plabid,pld.InvestigationID ORDER BY im.TypeName";
            }
            return ExecuteDataset(qry);
        }
    }
}