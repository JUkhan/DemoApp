using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using DataScraper.CQRS;
using MediatR;
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
        private readonly IMediator mediator;

        public RollingDataController(ILogger<RollingDataController> logger, IMediator mediator)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            this.mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }

        //[Route("{from}/{to}", Name = "GetData")]
        [HttpGet("{from}/{to}")]
        //[ProducesResponseType(typeof(IEnumerable<RollingData>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> Getdata(string from, string to)
        {
            var res = await mediator.Send(new GetDataByPeriod.Query(from, to));

            return res == null ? NotFound() : Ok(res);
        }
    }
}
