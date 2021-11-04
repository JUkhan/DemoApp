using System.Net;
using System.Text.Json;
using MediatR;
using MediatR.Extensions.FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace DataScraper
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddMediatR(typeof(Startup).Assembly);
            services.AddFluentValidation(new[] { typeof(Startup).Assembly });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            //if (env.IsDevelopment())
            //{
            //    app.UseDeveloperExceptionPage();
            //}
            //else
            //{
            //    app.UseExceptionHandler("/Error");
            //}
            
            app.UseExceptionHandler(arg =>
            {
               
                arg.Run(async context =>
                {
                    context.Response.ContentType = "application/problem+json";
                    var errorDetails=   context.Features.Get<IExceptionHandlerFeature>();
                    var ss=context.Response.StatusCode ;

                    var problem = new ErrorMessage(Error: errorDetails.Error.Message);
                    //Serialize the problem details object to the Response as JSON (using System.Text.Json)
                    var stream = context.Response.Body;
                    await JsonSerializer.SerializeAsync(stream, problem);
                    //throw errorDetails.Error;
                });
            });
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
            
        }
    }

    public record ErrorMessage(string Error, int Status = 500);
}
