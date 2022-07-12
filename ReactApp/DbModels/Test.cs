using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using ReactApp.DbModels;

namespace ReactApp.DbModels
{
    public partial class Test
    {
        public int TestId { get; set; }
        public string Test1 { get; set; } = null!;
    }
}
