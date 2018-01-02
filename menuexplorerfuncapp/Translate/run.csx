#r "System.Web"
#r "System.XML"
#r "System.XML.Linq"
#r "System.Configuration"

using System.Xml.Linq;
using System.Net;
using System.Configuration;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
{
    
  var key = ConfigurationManager.AppSettings["TextTranslator_Key"];
    // parse query parameter

    string to = req.GetQueryNameValuePairs()
            .FirstOrDefault(q => string.Compare(q.Key, "to", true) == 0)
            .Value;

    string text = req.GetQueryNameValuePairs()
            .FirstOrDefault(q => string.Compare(q.Key, "text", true) == 0)
            .Value;

    // Get request body
    dynamic data = await req.Content.ReadAsAsync<object>();

    // Set name to query string or body data

    text = text ?? data?.text;
    to = to ?? data?.to;

    if (string.IsNullOrEmpty(text) || string.IsNullOrEmpty(to))
    {
        return req.CreateResponse(HttpStatusCode.BadRequest, "Please pass 'text' and 'to' on the query string or in the request body");
    }
    try
    {
        var qparams = "?text=\"" + text + "\"&to=" + to;



        using (var client = new HttpClient())
        {
            var path = "https://api.microsofttranslator.com/V2/Http.svc/Translate" + qparams;
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", key);
            using (var response = await client.GetAsync(path))
            {
                var result = await response.Content.ReadAsStringAsync();
                var xml = XDocument.Parse(result);
                var translatedtext = xml.Descendants().SingleOrDefault(x => x.Name.LocalName == "string")?.Value;
                return req.CreateResponse(HttpStatusCode.OK, new { translatedtext = translatedtext });
            }
        }
    }
    catch (Exception ex)
    {
        log.Error(ex.Message, ex);
        return req.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message });
    }





}
