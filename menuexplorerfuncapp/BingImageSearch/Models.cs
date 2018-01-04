using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace menuexplorerfuncapp
{
    public class Instrumentation
    {
    }

    public class Thumbnail
    {
        public int width { get; set; }
        public int height { get; set; }
    }

    public class InsightsMetadata
    {
        public int pagesIncludingCount { get; set; }
        public int availableSizesCount { get; set; }
    }

    public class Value
    {
        public string webSearchUrl { get; set; }
        public string name { get; set; }
        public string thumbnailUrl { get; set; }
        public DateTime datePublished { get; set; }
        public string contentUrl { get; set; }
        public string hostPageUrl { get; set; }
        public string contentSize { get; set; }
        public string encodingFormat { get; set; }
        public string hostPageDisplayUrl { get; set; }
        public int width { get; set; }
        public int height { get; set; }
        public Thumbnail thumbnail { get; set; }
        public string imageInsightsToken { get; set; }
        public InsightsMetadata insightsMetadata { get; set; }
        public string imageId { get; set; }
        public string accentColor { get; set; }
    }

    public class BingImageSearchResult
    {
        public string _type { get; set; }
        public Instrumentation instrumentation { get; set; }
        public string webSearchUrl { get; set; }
        public int totalEstimatedMatches { get; set; }
        public int nextOffset { get; set; }
        public List<Value> value { get; set; }
    }
}
