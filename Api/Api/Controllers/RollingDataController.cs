using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Api.Controllers
{

    public record RollingData(string Date, string Time, float Frequency);

    [ApiController]
    [Route("[controller]")]
    public class RollingDataController : ControllerBase
    {
        private readonly ILogger<RollingDataController> _logger;

        public RollingDataController(ILogger<RollingDataController> logger)
        {
            _logger = logger;
        }

      
        [HttpGet()]
        public async Task<IEnumerable<RollingData>> GetData()
        {
            var url = "https://api.bmreports.com/BMRS/FREQ/v1?APIKey=mh3aanl0chb8emd&FromDateTime=2021-11-01%2012:10:00&ToDateTime=2021-11-01%2012:50:00&ServiceType=csv";
            using (var client = new HttpClient())
            {
                var response = await client.GetAsync(url);

                var res = await response.Content.ReadAsStringAsync();
                //"FREQ,2021-11-01 10:00:00,50.049"
                return res.Split("\n")[1..^1]
                    .Select(record=> {
                        var arr = record.Split(',');
                        var dt = arr[1];
                        var date = $"{dt[0..4]}-{dt[4..6]}-{dt[6..8]}";
                        var time = $"{dt[8..10]}:{dt[10..12]}:{dt[12..14]}";
                        return new RollingData(date, time, float.Parse(arr[2]));
                    });
                
            }
           
        }
    }
}
