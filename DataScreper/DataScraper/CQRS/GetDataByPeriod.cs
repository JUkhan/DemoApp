using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;

namespace DataScraper.CQRS
{
    public class GetDataByPeriod
    {
        public record Query(string from, string to) : IRequest<IEnumerable<RollingData>> { }

        public class Handler : IRequestHandler<Query, IEnumerable<RollingData>>
        {
            public async Task<IEnumerable<RollingData>> Handle(Query request, CancellationToken cancellationToken)
            {
                var url = $"https://api.bmreports.com/BMRS/FREQ/v1?APIKey=mh3aanl0chb8emd&FromDateTime={request.from}&ToDateTime={request.to}&ServiceType=csv";
                using (var client = new HttpClient())
                {
                    var response = await client.GetAsync(url);

                    var res = await response.Content.ReadAsStringAsync();
                    //if (res.StartsWith("<?xml"))
                    //{
                    //    return null;
                    //}

                    var data = res.Split("\n")[1..^1]
                        .Select(record => {
                            var arr = record.Split(',');
                            var dt = arr[1];
                            var date = $"{dt[0..4]}-{dt[4..6]}-{dt[6..8]}";
                            var time = $"{dt[8..10]}:{dt[10..12]}:{dt[12..14]}";
                            return new RollingData(date, time, float.Parse(arr[2]));
                        });
                    return data;

                }
            }
        }

        //public record Response(IEnumerable<RollingData>Data);

        public record RollingData(string Date, string Time, float Frequency);


        public class GenerateQueryValidator : AbstractValidator<Query>
        {
            public GenerateQueryValidator()
            {
                RuleFor(x => x.from).MaximumLength(21);
                // etc.
            }
        }
    }
}
