//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace AUDash.Database
{
    using System;
    using System.Collections.Generic;
    
    public partial class ProjectAllocationStatu
    {
        public ProjectAllocationStatu()
        {
            this.Resources = new HashSet<Resource>();
        }
    
        public string Id { get; set; }
        public string Status { get; set; }
    
        public virtual ICollection<Resource> Resources { get; set; }
    }
}
