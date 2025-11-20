using Microsoft.IdentityModel.Tokens;
using Microsoft.Owin;
using Microsoft.Owin.Security.Jwt;
using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
[assembly: OwinStartup(typeof(ProLimsApi.App_Start.Startup))]
namespace ProLimsApi.App_Start
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var key = Encoding.UTF8.GetBytes("wr23wrcqwf23ff424rcqqwr23wrcqwf23ff424rcqqwr23wrcqwf23ff424rcqq");

            app.UseJwtBearerAuthentication(new JwtBearerAuthenticationOptions
            {
                TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = "ProLimsApi",
                    ValidAudience = "ProLimsApiUsers",
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                }
            });
        }
    }
}