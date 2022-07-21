using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp.DbModels;

namespace ReactApp.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BoredActivityController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public BoredActivityController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BoredActivity>>> GetActivities()
        {
            if (_context.BoredActivities == null)
            {
                return NotFound();
            }

            return await _context.BoredActivities.ToListAsync();
        }

        [HttpGet("{key}")]
        public async Task<ActionResult<BoredActivity>> GetActivity(string key)
        {
            if (_context.BoredActivities == null)
            {
                return NotFound();
            }
            var activity = await _context.BoredActivities.FindAsync(key);

            if (activity == null)
            {
                return NotFound();
            }
            return activity;
        }

        [HttpPost]
        public async Task<ActionResult<BoredActivity>> PostActivity(BoredActivity activity)
        {
            if (_context.Activities == null)
            {
                return Problem("Entity set 'DatabaseContext.Activities'  is null.");
            }
            await _context.BoredActivities.AddAsync(activity);
            var inserted = await _context.SaveChangesAsync();
            return (inserted == 1 ? CreatedAtAction("GetActivity", activity.Key) : BadRequest());

        }

    }
}
