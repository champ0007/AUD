using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AUDash.Models
{
    public class FXMaster
    {
        public int Period { get; set; }
        public int FiscalYear { get; set; }
        public decimal FXRate { get; set; }
    }

    public class ClusterWBSMapping
    {
        public string cluster { get; set; }
        public string WBSElement { get; set; }
    }
}