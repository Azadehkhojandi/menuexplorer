#r "System.IO"
#r "System.Net.Http"
#r "Newtonsoft.Json"
#r "System.Configuration"

using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.IO;
using Newtonsoft.Json;
using System.Configuration;
public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
{
    try
    {
        var key = ConfigurationManager.AppSettings["ComputerVision_Key"];
        var data = req.Content.ReadAsStreamAsync().Result;

        using (var client = new HttpClient())
        {
            var path = "https://westus.api.cognitive.microsoft.com/vision/v1.0/ocr";
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", key);
            byte[] byteData = ((MemoryStream)data).ToArray();

            using (ByteArrayContent content = new ByteArrayContent(byteData))
            {
                // This example uses content type "application/octet-stream".
                // The other content types you can use are "application/json" and "multipart/form-data".
                content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

                // Execute the REST API call.
                var response = await client.PostAsync(path, content);

                // Get the JSON response.
                string contentString = await response.Content.ReadAsStringAsync();
                dynamic jsonresult = JsonConvert.DeserializeObject<dynamic>(contentString);
                return req.CreateResponse(HttpStatusCode.OK, new { result = jsonresult });

            }
        }

       
    }
    catch (Exception ex)
    {
        log.Error(ex.Message, ex);
        return req.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message });
    }
   
}
