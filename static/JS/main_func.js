// ... 버튼 모달창 열기
function popOpen() {
    var modalPop = $('.modal-wrap');
    var modalBg = $('#modal');
    $(modalPop).show();
    $(modalBg).show();

    $('html').css({
        overflow: 'hidden',
        height: 'auto'
    });
}

// ... 버튼 모달창 닫기
function popClose() {
    var modalPop = $('.modal-wrap');
    var modalBg = $('.modal-bg');

    $(modalPop).hide();
    $(modalBg).hide();

    $('html').removeAttr('style');
}


function selectImages(event) {
    $('#modal_post_display_image').empty();
    $('#image_upload_button').hide();
    let sel_files = [];
    let files = event.target.files;
    let fileArr = Array.prototype.slice.call(files);
    let index = 0;

    let carousel = `<div id="carousel_upload" class="carousel slide" data-bs-ride="carousel" data-bs-interval="false">
                          <div id="carousel_upload_inner" class="carousel-inner">
                          </div>
                          <button class="carousel-control-prev" type="button" data-bs-target="#carousel_upload" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                          </button>
                          <button class="carousel-control-next" type="button" data-bs-target="#carousel_upload" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                          </button>
                        </div>`

    $('#modal_post_display_image').append(carousel)

    fileArr.forEach(function (f) {
        sel_files.push(f);
        let reader = new FileReader();
        reader.onload = function (e) {
            let temp = ``
            if(index == 0) {
                temp = `<div class="carousel-item active">
                              <img src=${e.target.result} class="d-block w-100" alt="...">
                            </div>`
                index++;
            }
            else {
                temp = `<div class="carousel-item">
                              <img src=${e.target.result} class="d-block w-100" alt="...">
                            </div>`
            }

            $('#carousel_upload_inner').append(temp);
        };
        reader.readAsDataURL(f);
    })
    $('.modal-post-text').show();
    $('#button_post').show();
}

function initPostModal() {
    $('#modal_post').addClass('is-active');
    $('#modal_post_display_image').empty();
    $('#image_upload_button').show();

    $('.modal-post-text').hide();
    $('#button_post').hide();
}