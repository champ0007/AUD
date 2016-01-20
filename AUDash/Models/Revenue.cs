using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AUDash.Models
{
    public class Revenue
    {
        public int FiscalYear { get; set; }
        public int Period { get; set; }
        public decimal TotalRevenue { get; set; }        
        public string Cluster { get; set; }

    }

    public class ValueMini
    {
        public string value { get; set; }
    }

    public class LabelMini
    {
        public string label { get; set; }
    }

    public class ChartData
    {
        public string seriesname { get; set; }
        public List<ValueMini> data { get; set; }
    }
}