using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;

namespace AUDash
{
    /// <summary>
    /// Summary description for SendMail
    /// </summary>
    [WebService(Namespace = "AUDashboard")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
     [System.Web.Script.Services.ScriptService]
    public class SendMail : System.Web.Services.WebService
    {
        private string SendReport(string path)
        {
            string fromaddr = "vibhav.lko@gmail.com";
            string toaddr = "vibdwivedi@deloitte.com";//"vibs.dy@gmail.com";
            string password = "vahbiv123";


            MailMessage msg = new MailMessage();
            msg.Subject = "Username &password";
            LinkedResource logo = new LinkedResource(path, "image/png");
            logo.ContentId = "DashboardStatus";

            //Html formatting for showing image
            AlternateView av1 = AlternateView.CreateAlternateViewFromString("<html><body>"
                + "<img src=cid:DashboardStatus></body></html>", null, MediaTypeNames.Text.Html);
        
            msg.AlternateViews.Add(av1);
            av1.LinkedResources.Add(logo);
            msg.IsBodyHtml = true;
            msg.From = new MailAddress(fromaddr);
            msg.To.Add(new MailAddress(toaddr));
            SmtpClient smtp = new SmtpClient();
            smtp.Host = "smtp.gmail.com";
            smtp.Port = 587;
            smtp.UseDefaultCredentials = false;
            smtp.EnableSsl = true;
            NetworkCredential nc = new NetworkCredential(fromaddr, password);
            smtp.Credentials = nc;
            string message = "";
            try
            {
                smtp.Send(msg);
                message = "mail sent.";
            }
            catch (Exception e)
            {
                message = "Message: " + e.Message + "Inner Exception: " + e.InnerException;
            }
            //finally
            //{
            //    Context.Response.Clear();
            //    Context.Response.ContentType = "application/json";
            //    Context.Response.Write(JsonConvert.SerializeObject(message));
            //}
            return message;
        }

        // Get Dashboard screenshot and mail it to concerned people.
        [WebMethod]
        public void UploadPic(string imageData)
        {
            string mailStatusPic = HttpContext.Current.Server.MapPath("Reports\\" + DateTime.Now.ToString("ddMMMyyyy") + "Report.png");

            if (File.Exists(mailStatusPic))
            {
                File.Delete(mailStatusPic);
            }

            using(FileStream fs = new FileStream(mailStatusPic, FileMode.Create))
            {
                using(BinaryWriter bw =new BinaryWriter(fs))
                {
                    byte[] data = Convert.FromBase64String(imageData);
                    bw.Write(data);
                    bw.Close();
                }
            }

            // now send mail to stakeholders
            string message = SendReport(mailStatusPic);
            Context.Response.Clear();
            Context.Response.ContentType = "appliaction/json";
            Context.Response.Write(JsonConvert.SerializeObject(message));
        }
    }
}
