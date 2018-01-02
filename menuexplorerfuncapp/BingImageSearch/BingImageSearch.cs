using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;
using System.Configuration;

namespace menuexplorerfuncapp
{
    public static class BingImageSearch
    {
        [FunctionName("BingImageSearch")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequestMessage req,
            TraceWriter log)
        {
            try
            {
               
                var key = ConfigurationManager.AppSettings["BingImageSearch_Key"];

                var q = req.GetQueryNameValuePairs()
                    .FirstOrDefault(x => string.Compare(x.Key, "q", true) == 0)
                    .Value;

                var count = req.GetQueryNameValuePairs()
                    .FirstOrDefault(x => string.Compare(x.Key, "count", true) == 0)
                    .Value;
                // Get request body
                dynamic data = await req.Content.ReadAsAsync<object>();

                // Set name to query string or body data
                q = q ?? data?.q;
                count = count ?? data?.count;

                var qparams = $"q=\"{q}\"&count={count}&imageType=Photo";
               
                log.Info($"q:{q}");
                using (var client = new HttpClient())
                {
                    var path = $"https://api.cognitive.microsoft.com/bing/v7.0/images/search?{qparams}"  ;
                    log.Info($"path:{path}");
                    client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", key);
                    using (var response = await client.GetAsync(path))
                    {
                        string contentString = await response.Content.ReadAsStringAsync();
                        dynamic jsonresult = JsonConvert.DeserializeObject<dynamic>(contentString);
                        return req.CreateResponse(HttpStatusCode.OK, new {   q=q , count = count , result = jsonresult });

                    }
                }

            }
            catch (Exception ex)
            {
                log.Error(ex.Message,ex);
                return req.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message });
            }
        }
    }
}
