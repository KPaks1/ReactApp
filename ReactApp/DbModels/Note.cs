using System;
using System.Collections.Generic;

namespace ReactApp.DbModels
{
    public partial class Note
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
    }
}
