var lines = [];
$(document).ready(function () {

    $("#canvas").on("imageuploaded", function (event) {
        var imageurl = $("#canvas")[0].toDataURL('image/png');
        fetch(imageurl)
            .then(res => res.blob())
            .then(blob => {

                ocr(blob, function (data) {
                    if (data && data.result) {
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
                                $("#lines").append("<p>" + lines[index].line + "</p>");
                            }
                            else {
                                translate(lines[index], "line", function (originaltext, result, line) {
                                    if (result && result.translatedtext) {
                                        line.translatedtext = result.translatedtext;
                                        $("#lines").append("<p>" + "<b>" + data.language + ":</b> " + originaltext + "<b>en:</b> " + result.translatedtext + "</p>");
                                    }
                                });
                            }
                        }
                    }
                });
            });
    });

    $("#canvas").on('click', function (e) {
        var rect = collides(e.offsetX, e.offsetY);
        if (rect) {
            $("#selected-line-result").html('<p>' + rect.line + (rect.translatedtext !== (null || undefined) ? ' <b>en:</b> ' + rect.translatedtext : '') + '</p>');
            imagesearch(rect.line, function (data) {
                if (data && data.result) {
                    data = data.result;
                    if(data.value.length>0)
                    {
                       $('.carousel-inner').html('');
                    }
                    for (let index = 0; index < data.value.length; index++) {
                        var item = '<div class="item"><img src="{src}"/></div>'.replace('{src}', data.value[index].thumbnailUrl);
                        var li = ' <li data-target="#carousel" data-slide-to="{index}" ></li>'.replace('{index}', index);
                        $(item).appendTo('.carousel-inner');
                        $(li).appendTo('.carousel-indicators');
                    }
                    $('#carousel').removeClass('hidden');
                    $('.item').first().addClass('active');
                    $('.carousel-indicators > li').first().addClass('active');
                    $("#carousel").carousel();
                }
                else
                {
                    var previewitem='<div class="item active"><img src="/assets/img/preview.png" alt="Slide 1" /></div>';
                    $(previewitem).appendTo('.carousel-inner');
                }
            });
        } else {
            console.log('no collision');
        }
    });
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

    let api_url = 'http://localhost:7071/api/OCR';
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

    var translateobj = {
        'text': obj[property],
        'to': 'en'
    };
    let api_url = 'http://localhost:7071/api/Translate';

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

    let api_url = 'http://localhost:7071/api/BingImageSearch';
    $.ajax({
        url: api_url,
        data:
            {
                'q': q,
                'count': 5
            },
        success: function (data, status) {
            callback(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            callback();
        }

    });






}



