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
    
    public partial class Skill
    {
        public Skill()
        {
            this.ResourceSkillMaps = new HashSet<ResourceSkillMap>();
        }
    
        public string Id { get; set; }
        public string Skill1 { get; set; }
    
        public virtual ICollection<ResourceSkillMap> ResourceSkillMaps { get; set; }
    }
}
