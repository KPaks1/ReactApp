﻿using System;
using System.Collections.Generic;

namespace ReactApp.DbModels
{
    public partial class Activity
    {
        public string Key { get; set; } = null!;
        public string Activity1 { get; set; } = null!;
        public decimal? Accessibility { get; set; }
        public string? Type { get; set; }
        public decimal? Price { get; set; }
        public string? Link { get; set; }
        public string UserId { get; set; } = null!;

        public virtual AspNetUser User { get; set; } = null!;
    }
}