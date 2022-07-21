using System;
using System.Collections.Generic;

namespace ReactApp.DbModels
{
    [Serializable]
    public partial class Note
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string? UserId { get; set; }
        public DateTime CreateTimestamp { get; set; }
        public DateTime UpdateTimestamp { get; set; }

        public virtual AspNetUser? User { get; set; }
    }
}
