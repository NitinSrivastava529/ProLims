using Microsoft.IdentityModel.Tokens;
using ProLimsApi.Models;
using ProLimsApi.Repository.AccessControl;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Web.Http;

namespace ProLimsApi.Controllers
{
    [RoutePrefix("api/auth")]
    public class AuthController : ApiController
    {
        private readonly Authentication authentication = new Authentication();
        [HttpPost]
        [Route("login")]
        public HttpResponseMessage Login([FromBody] ipAuthentication login)
        {
            dataSet data = authentication.Auth_ConfigQueries(login);
            if (data.ResultSet.Tables.Count > 1)
            {
                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("wr23wrcqwf23ff424rcqqwr23wrcqwf23ff424rcqqwr23wrcqwf23ff424rcqq"));
                var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

                var claims = new[]
                {
                    new Claim(ClaimTypes.Name, login.LoginId),
                    new Claim(ClaimTypes.Role, "Admin")
                };

                var token = new JwtSecurityToken(
                    issuer: "ProLimsApi",
                    audience: "ProLimsApiUsers",
                    expires: DateTime.Now.AddHours(2),
                    claims: claims,
                    signingCredentials: signingCredentials
                );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
                return Request.CreateResponse(HttpStatusCode.OK, new { token = tokenString, data.ResultSet });
            }
            return Request.CreateResponse(HttpStatusCode.OK, new { token = "", data });

        }
    }
}