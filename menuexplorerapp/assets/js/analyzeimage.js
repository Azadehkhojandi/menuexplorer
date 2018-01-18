var lines = [];
var config = {};

function loadconfig(callback) {

    let api_url = '/config';
    $.ajax({
        url: api_url,
        success: function (data, status) {
            config = data;
            if (callback) {
                callback(data);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (callback) {
                callback();
            }
        }

    });
}


$(document).ready(function () {

    $("#canvas").on("imageuploaded", function (event) {
        $(".loader").removeClass("hidden");
        var imageurl = $("#canvas")[0].toDataURL('image/png');
        fetch(imageurl)
            .then(res => res.blob())
            .then(blob => {

                reset();

                loadconfig(function (data) {
                    if (!data) {
                        console.error("cannot find the config for the location of cognitive services. If you run the application locally make sure .env file is not missing ");
                        return;
                    }
                    ocr(blob, function (data) {
                        $(".loader").addClass("hidden");
                        if (data && data.result) {
                            $('.menu-in-plain-text').removeClass('hidden');
                            data = data.result;

                            var context = $("#canvas")[0].getContext('2d');
                            lines = [];
                            for (var i = 0; i < data.regions.length; i++) {

                                for (var l = 0; l < data.regions[i].lines.length; l++) {
                                    var line = joinObj(data.regions[i].lines[l].words, "text");
                                    var linebox = data.regions[i].lines[l].boundingBox.split(",");
                                    lines.push({ line: line, box: linebox });
                                }
                            }

                            for (let index = 0; index < lines.length; index++) {

                                drawbox(context, lines[index].box, "rgba(0, 0, 200, 0.5)");
                                if (data.language === 'en') {
                                    $(".lines").append("<p> <span class='originaltext' data-language='en'>" + lines[index].line + "</span></p>");
                                }
                                else {
                                    translate(lines[index], "line", function (originaltext, result, line) {
                                        if (result && result.translatedtext) {
                                            line.translatedtext = result.translatedtext;
                                            $(".lines").append("<p>" + "<b>" + data.language + ":</b> <span class='originaltext' data-language='" + data.language + "'>" + originaltext + "</span> <b>en:</b>  <span class='originaltext' data-language='en'> " + result.translatedtext + "</span> </p>");
                                        }
                                    });
                                }
                            }
                        }
                    });


                }

                );
            });
    });

    $("#canvas").on('click', function (e) {
        $(".selected-line").addClass('hidden');
        var rect = collides(e.offsetX, e.offsetY);
        if (rect) {
            $(".selected-line").removeClass('hidden');
            $(".selected-line-result").html("<h2><span class='originaltext'>" + rect.line +"</span>"+ (rect.translatedtext !== (null || undefined) ? " <b>en:</b> <span class='originaltext'>" + rect.translatedtext+"</span>" : '') + '</h2>');
            $(".selected-line-photos").html('');
            imagesearch(rect.line, function (data) {
                if (data && data.result && data.result.value && data.result.value.length > 0) {
                    $('.selected-line-photos').removeClass('hidden');
                    data = data.result;
                    var colwidth = 12 / data.value.length;
                    for (let index = 0; index < data.value.length; index++) {
                        var item = '<div class="col-sm-12 col-md-{colwidth}"><img src="{src}" class="img-rounded" alt="{alt}"></div>'.replace('{colwidth}', colwidth).replace('{src}', data.value[index].thumbnailUrl).replace('{alt}', data.value[index].displayText);
                        $(item).appendTo('.selected-line-photos');
                    }
                }
                else {
                    $('.selected-line-photos').addClass('hidden');

                }
            });
        } else {
            console.log('no collision');
        }
    });

    function reset() {

        $('.menu-in-plain-text').addClass('hidden');
        $('.selected-line').addClass('hidden');
        $(".selected-line-result").html('');
        $(".selected-line-photos").html('');
        $(".lines").html('');

    }

    $('.lines').on('click', '.originaltext', function (e) {
        openSearch(this.textContent);
    });
    $('.selected-line-result').on('click', '.originaltext', function (e) {
        openSearch(this.textContent);
    });

    function openSearch(textContent)
    {
    var q = encodeURIComponent(textContent.trim().replace(/ +(?= )/g, ' ').replace(/\s+/g, "+"));
    var bingserach = 'https://www.bing.com/images/search?q={q}&FORM=HDRSC2'.replace('{q}', q);
    var googleserach = 'https://www.google.com.au/search?q={q}&tbm=isch'.replace('{q}', q);

    var wingoogle = window.open(googleserach, '_blank');
    var winbing = window.open(bingserach, '_blank');



    if (winbing) {
        winbing.focus();
    } else if (!wingoogle || !winbing) {
        //Browser has blocked it
        alert('Please allow popups for this website');
    }

    }


});
function joinObj(a, attr) {
    var out = [];
    for (var i = 0; i < a.length; i++) {
        out.push(a[i][attr]);
    }
    return out.join(" ");
}

function drawbox(context, box, color) {
    context.beginPath();
    context.rect(box[0], box[1], box[2], box[3]);
    context.fillStyle = color;
    context.closePath();
    context.fill();
}

function collides(x, y) {
    var lineCollision = null;
    for (var i = 0, len = lines.length; i < len; i++) {
        var box = lines[i].box;
        var left = box[0];
        var right = Number(box[0]) + Number(box[2]);
        var top = box[1];
        var bottom = Number(box[1]) + Number(box[3]);
        if (
            x >= left && x <= right && y >= top && y <= bottom
        ) {
            lineCollision = lines[i];
            return lineCollision;
        }
    }
    return lineCollision;
}

function ocr(blob, callback) {

    if (!config || !config.services || !config.services.OcrUrl) {
        console.error("config is missing - cannot find path to Ocr service");
        return;
    }

    let api_url = config.services.OcrUrl;

    let headers = {
        'Content-Type': 'application/octet-stream'
    };

    $.ajax({

        url: api_url,
        headers: headers,
        method: 'POST',
        contentType: false,
        processData: false,
        data: blob,
        success: function (data) {
            callback(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            callback();
        }

    });

}

function translate(obj, property, callback) {

    if (!config || !config.services || !config.services.TranslateUrl) {
        console.error("config is missing - cannot find path to Translate service");
        return;
    }

    let api_url = config.services.TranslateUrl;

    var translateobj = {
        'text': obj[property],
        'to': 'en'
    };


    $.ajax({
        url: api_url,
        method: 'POST',
        data: JSON.stringify(translateobj),
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (data, status) {
            callback(obj[property], data, obj);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            callback(obj[property], null, obj);
        }
    });
}

function imagesearch(q, callback) {

    if (!config || !config.services || !config.services.BingImageSearchUrl) {
        console.error("config is missing - cannot find path to Bing image search service");
        return;
    }

    let api_url = config.services.BingImageSearchUrl;

    $.ajax({
        url: api_url,
        data:
            {
                'q': q,
                'count': 6
            },
        success: function (data, status) {
            callback(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            callback();
        }

    });
}






