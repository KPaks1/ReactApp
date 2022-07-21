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
    public class ActivitiesController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public ActivitiesController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Activity>>> GetActivities()
        {
            if (_context.Activities == null)
            {
                return NotFound();
            }

            return await _context.Activities.ToListAsync();
        }

        [HttpGet("{key}")]
        public async Task<ActionResult<Activity>> GetActivity(string key)
        {
            if (_context.Activities == null)
            {
                return NotFound();
            }
            var activity = await _context.Activities.FindAsync(key);

            if (activity == null)
            {
                return NotFound();
            }
            return activity;
        }

        [HttpGet("ByUser/{userId}")]
        public async Task<ActionResult<IEnumerable<Activity>>> GetAllUserActivities(string userId)
        {
            if (_context.Activities == null || _context.AspNetUsers == null)
            {
                return NotFound();
            }
            return await _context.Activities.Where(a => a.UserId == userId).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Activity>> PostActivity(Activity activity)
        {
            if (_context.Activities == null)
            {
                return Problem("Entity set 'DatabaseContext.Activities'  is null.");
            }
            Console.WriteLine(activity.Key);
            Console.WriteLine(activity.Name);
            Console.WriteLine(activity.Type);
            Console.WriteLine(activity.Price);
            Console.WriteLine(activity.Accessibility);
            Console.WriteLine(activity.Link);
            Console.WriteLine(activity.UserId);

            await _context.Activities.AddAsync(activity);
            await _context.SaveChangesAsync();
            

            return CreatedAtAction("GetActivity", activity.Key);

        }

    }
}
