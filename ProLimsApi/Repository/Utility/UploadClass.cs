using ProLimsApi.Repository.Utility;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using static ProLimsApi.Models.GeneralStoreDTO;

namespace PharmacyAPI.Repository.Utility
{
    public class UploadClass
    {
        public string SaveReport(out string virtualPath, string VisitNo, byte[] pdfByte)
        {
            string result = string.Empty;
            string Month = System.DateTime.Now.ToString("MM-yyyy");
            string directory = "F:\\Document\\B2B\\" + Month + "\\";
            string Path = directory + VisitNo + ".pdf";
            try
            {
                if (!Directory.Exists(directory))
                    Directory.CreateDirectory(directory);

                File.WriteAllBytes(Path, pdfByte);
                result = "Success";
                virtualPath = "https://prolims.in/Document/B2B/" + Month + "/" + VisitNo + ".pdf";
            }
            catch (Exception ex) { result = ex.Message; virtualPath = ""; }
            return virtualPath;
        }
        public static string UploadInternalMalDocument(out string outFileName, out string vertual_path, string extention, byte[] ImageByte, string empcode)
        {
            outFileName = "Error";
            string result = "Not Saved";
            string fileName = empcode.Replace("-", "") + DateTime.Now.ToString("ddMMyyyyhhmmss") + "." + extention;
            vertual_path = "/InternalMail/" + System.DateTime.Now.Year +"/"+System.DateTime.Now.Month + "/";
            string directory = "I:\\InternalMail\\" + System.DateTime.Now.Year + "\\" + System.DateTime.Now.Month + "\\";
            try
            {
                if (!Directory.Exists(directory))
                    Directory.CreateDirectory(directory);
                outFileName = directory + fileName;
                vertual_path= vertual_path + fileName;
                File.WriteAllBytes(outFileName, ImageByte);
                result = "Success";
            }
            catch (Exception ex)
            { result = ex.Message; }
            return result;
        }        

        public string UploadDocumentByPath(byte[] data, string doc_path)
        {
            string msg = "";
            string[] t = doc_path.Split('\\');
            string Location = "";
            for (int i = 0; i < t.Length - 1; i++)
            {
                Location += t[i] + "\\";
            }
            try
            {
                if (System.IO.Directory.Exists(Location))
                {
                    System.IO.File.WriteAllBytes(doc_path, data);
                }
                else
                {
                    System.IO.Directory.CreateDirectory(Location);
                    System.IO.File.WriteAllBytes(doc_path, data);
                }
                msg = "OK";
            }
            catch (Exception ex) { msg = ex.Message; }
            return msg;

        }
        public SubmitStatus UploadDocument(string TrnType, string TranId, string ImageType, byte[] ImageByte, string login_id)
        {
            string processInfo = string.Empty;
            SubmitStatus ss = new SubmitStatus();
            string virtual_path = string.Empty; string physical_path = string.Empty;
            string ImageName = TranId.Replace("/", "").Replace("-", "");
            processInfo = UploadDocumentInfo(out physical_path, out virtual_path, TranId, ImageByte, ImageName, ImageType);
            if (processInfo.Contains("Success"))
            {
                using (SqlConnection con = new SqlConnection(GlobalConfig.strConnLimsDB))
                {
                    using (SqlCommand cmd = new SqlCommand("pGSInsert_UploadedDocumentInfo", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandTimeout = 2500;
                        cmd.Parameters.Add("@TrnType", SqlDbType.VarChar, 50).Value = TrnType;
                        cmd.Parameters.Add("@TranId ", SqlDbType.VarChar, 20).Value = TranId;
                        cmd.Parameters.Add("@virtual_path", SqlDbType.VarChar, 200).Value = virtual_path;
                        cmd.Parameters.Add("@physical_path", SqlDbType.VarChar, 200).Value = physical_path;
                        cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 15).Value = login_id;
                        cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = "Upload";
                        cmd.Parameters.Add("@result", SqlDbType.VarChar, 200).Value = "";
                        cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
                        try
                        {
                            con.Open();
                            cmd.ExecuteNonQuery();
                            processInfo = (string)cmd.Parameters["@result"].Value.ToString();
                            if (processInfo.Contains("Success"))
                            {
                                ss.Status = 1;
                                ss.Message = processInfo;
                                ss.purchId = TranId;
                                ss.virtual_path = virtual_path;
                            }
                        }
                        catch (SqlException sqlEx)
                        {
                            ss.Status = 0;
                            ss.purchId = TranId;
                            ss.Message = sqlEx.Message;
                        }
                        finally { con.Close(); }
                    }
                    return ss;
                }
            }
            else
            {
                ss.Status = 0;
                ss.Message = processInfo;
            }
            return ss;
        }

        public static string UploadDocumentInfo(out string outFileName, out string vertual_path, string Appointmentid, byte[] imageByte, string ImageName, string imageType)
        {
            outFileName = "Error";
            string result = "Not Saved";
            vertual_path = "http://exprohelp.com/HospDoc/GeneralStore/Purchase/" + ImageName + "." + imageType;
            string directory = "I:\\Hospital\\GeneralStore\\Purchase\\";
            try
            {
                if (!Directory.Exists(directory))
                    Directory.CreateDirectory(directory);

                outFileName = directory + ImageName + "." + imageType;
                File.WriteAllBytes(outFileName, imageByte);
                result = "Success";
            }
            catch (Exception ex) { result = ex.Message; }
            return result;
        }
    }
}