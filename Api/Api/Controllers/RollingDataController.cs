using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
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


        [Route("{from}/{to}", Name = "GetData")]
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<RollingData>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<IEnumerable<RollingData>>> Getdata(string from, string to)
        {
            
            var url = $"https://api.bmreports.com/BMRS/FREQ/v1?APIKey=mh3aanl0chb8emd&FromDateTime={from}&ToDateTime={to}&ServiceType=csv";
            using (var client = new HttpClient())
            {
                var response = await client.GetAsync(url);

                var res = await response.Content.ReadAsStringAsync();
                if (res.StartsWith("<?xml"))
                {
                    return Ok(new List<RollingData> { });
                }
              
                var data= res.Split("\n")[1..^1]
                    .Select(record=> {
                        var arr = record.Split(',');
                        var dt = arr[1];
                        var date = $"{dt[0..4]}-{dt[4..6]}-{dt[6..8]}";
                        var time = $"{dt[8..10]}:{dt[10..12]}:{dt[12..14]}";
                        return new RollingData(date, time, float.Parse(arr[2]));
                    });
                return Ok(data);
                
            }
           
        }
    }
}
