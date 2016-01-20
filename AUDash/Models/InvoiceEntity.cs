using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AUDash.Models
{
    public class InvoiceEntity
    {
        public string FunctionArea { get; set; }
        public int Client { get; set; }
        public string ClientName { get; set; }
        public string Country { get; set; }
        public string CountryName { get; set; }
        public string Cluster { get; set; }
        public string MemberFirms { get; set; }
        public string Industry { get; set; }
        public string LCSP { get; set; }
        public string Sector { get; set; }
        public string WBSElement { get; set; }
        public string PD { get; set; }
        public string BillingManager { get; set; }
        public string BillingPartner { get; set; }
        public string ProjectController { get; set; }
        public string ProjectManager { get; set; }
        public string ProjectPartner { get; set; }
        public string ServiceArea { get; set; }
        public string ServiceLine { get; set; }
        public int FiscalYear { get; set; }
        public int Period { get; set; }
        public decimal ServiceHrsR10YTD { get; set; }
        public decimal NSRYTDR10 { get; set; }
        public decimal FX { get; set; }
        public decimal AUDNSR { get; set; }
        public decimal DiscRateYTDR10 { get; set; }
        public decimal NSRPerHrYTDR10 { get; set; }
        public string MFUS { get; set; }
        public int ServiceHrsR10AP { get; set; }
      
    }
}