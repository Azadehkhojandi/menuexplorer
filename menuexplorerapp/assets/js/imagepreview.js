//https://bootsnipp.com/snippets/eNbOa
//https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images

$(document).ready(function () {
    $(document).on('change', '.btn-file :file', function () {
        var input = $(this),
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [label]);
    });

    $('.btn-file :file').on('fileselect', function (event, label) {

        var input = $(this).parents('.input-group').find(':text'),
            log = label;

        if (input.length) {
            input.val(log);
        } else {
            if (log) alert(log);
        }

    });


    function readURL(input) {
        let max_width = $(".form-group").width()

        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var context = $("#canvas")[0].getContext('2d');
                var image = new Image();
                image.onload = function () {
                    image.height = (max_width / image.width) * image.height;
                    image.width = max_width;
                    $("#canvas")[0].width = image.width;
                    $("#canvas")[0].height = image.height;
                    context.drawImage(image, 0, 0, image.width, image.height);
                    $("#canvas").trigger("imageuploaded");
                };
                var snap = e.target.result;
                image.src = snap;
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#imgInp").change(function () {
        readURL(this);
    });
});