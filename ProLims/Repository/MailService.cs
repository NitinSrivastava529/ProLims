using ProLimsApi.Models;
using System;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;

namespace ProLims.Repository
{
    public static class MailService
    {
        public class MailObject
        {
            public string subject { get; set; }
            public string body { get; set; }
            public string to { get; set; }
            public string fileName { get; set; }
            public byte[] fileByte { get; set; }
        }
        public static string SendMail(MailObject obj)
        {
            string result = string.Empty;
            try
            {
                // Configure the client
                SmtpClient client = new SmtpClient("smtpout.secureserver.net", 587)
                {
                    Credentials = new NetworkCredential("Info@promedipharmacy.com", "Promedi@2025"),
                    EnableSsl = true
                };


                // Create the email
                MailMessage mail = new MailMessage();
                mail.From = new MailAddress("Info@promedipharmacy.com");
                mail.To.Add(obj.to);
                mail.Subject = obj.subject;
                mail.Body = obj.body;
                mail.IsBodyHtml = true;

                // Attachment   
                if (obj.fileByte.Length > 100)
                {
                    MemoryStream ms = new MemoryStream(obj.fileByte);
                    Attachment attachment = new Attachment(ms, obj.fileName, MediaTypeNames.Application.Pdf);
                    mail.Attachments.Add(attachment);
                }

                // Send it
                client.Send(mail);
                result = "Email sent successfully.";
            }
            catch (Exception ex)
            {
                result = "Error sending email: " + ex.Message;
            }
            return result;
        }
    }
}