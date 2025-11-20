
using PharmacyAPI.Repository.Utilities;

namespace PharmacyAPI.Repository.Utility
{
    public static class SmsDataLayer
    {
        static SmsClass sms = new SmsClass();
        public static string MemberVerification(ipSMS objBO)
        {
            string msg = objBO.Otp + " is your chandan member verification code";
            string smsresponse = sms.SendSmsByTemplateId(objBO.MobileNo, msg, "1007368458238551885");
            if (!string.IsNullOrEmpty(smsresponse))
            {
                return smsresponse;
            }
            else
            {
                return "OTP not send, please try again";
            }
        }
    }
}