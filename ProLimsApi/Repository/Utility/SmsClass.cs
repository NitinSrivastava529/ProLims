using PharmacyAPI.Repository.Utility;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;

namespace PharmacyAPI.Repository.Utilities
{
    public class SmsClass
    {
        public string SendSmsByTemplateId(string MobileNoByComaSeperated, string msg, string TemplateId)
        {
            String responseFromServer = string.Empty;
            string providerName = string.Empty;
            string url = "";
            string Provider = string.Empty;
            try
            {
                //test
                string smstext = string.Empty;

                smstext = msg + "&user=CHANDANH&pswd=Chand%5E01&sender=CHANDN&PE_ID=1001969186191969669&Template_ID=" + TemplateId + "";
                url = "https://smsgw.tatatel.co.in:9095/campaignService/campaigns/qs?recipient=" + MobileNoByComaSeperated + "&dr=true&msg=" + smstext;

                WebRequest request = WebRequest.Create(url);
                request.Method = "GET";
                //request.ContentLength = sURL.Length;
                request.Credentials = CredentialCache.DefaultCredentials;
                HttpWebResponse response1 = (HttpWebResponse)request.GetResponse();
                Stream dataStream = response1.GetResponseStream();
                StreamReader reader = new StreamReader(dataStream);
                responseFromServer = reader.ReadToEnd();
                reader.Close();
                dataStream.Close();
                response1.Close();

                TataResponse response = JsonConvert.DeserializeObject<TataResponse>(responseFromServer);
                if (response.jobId.Length > 4)
                    responseFromServer = "Sent";
                else
                {
                    responseFromServer = "TATA Response:" + responseFromServer;
                }
            }
            catch (Exception ex)
            {
                responseFromServer = "System Response:" + ex.Message;
            }
            return responseFromServer;
        }
        public string GetOTPToValidateMobile(string mobile_no)
        {
            string result = string.Empty;
            try
            {
                string OTP = Utility.OTPGenerator.GenerateRandomOTP(4);
                string sms = "Your one time verification code to validate your mobile is "+ OTP + " - Team Chandan";
                Utilities.SmsClass smsService = new Utilities.SmsClass();
                string responsemessage = smsService.SendSms(mobile_no, sms);
                result = OTP;                
            }
            catch (Exception ex) { result = ex.Message; }
            return result;
        }
        
        public string SendSms(string MobileNoByComaSeperated, string msg)
        {
            String responseFromServer = string.Empty;
            try
            {
                string url = "https://http.myvfirst.com/smpp/sendsms?username=chndnotphtp&password=chn2130O&to=" + MobileNoByComaSeperated + "&from=chandn&text=" + msg + "";
                //string url = "http://www.myvaluefirst.com/smpp/sendsms?username=chndnotphtp&password=chn2130O&to=" + MobileNoByComaSeperated + "&from=chandn&text=" + msg + "";
                //string url = "https://push.sanketik.net//api/push?accesskey=8YeoMztmrqYWFZCNM7SUM6jWNkPWN7&to=" + MobileNoByComaSeperated + "&text=" + msg + "&from=CHCARE";
                WebRequest request = WebRequest.Create(url);
                request.Method = "GET";
                //request.ContentLength = sURL.Length;
                request.Credentials = CredentialCache.DefaultCredentials;
                HttpWebResponse response1 = (HttpWebResponse)request.GetResponse();
                Stream dataStream = response1.GetResponseStream();
                StreamReader reader = new StreamReader(dataStream);
                responseFromServer = reader.ReadToEnd();
                reader.Close();
                dataStream.Close();
                response1.Close();

            }
            catch (Exception ex) {
                responseFromServer = ex.Message;
            }
            return responseFromServer;
        }
    }
}