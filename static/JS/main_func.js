// ... 페이지 로딩시 호출 함수
$(document).ready(function () {
    getFeed()
})


// ... 기본 링크
function goHome() {
    window.location.href = "/";
}

function goUser() {
    window.location.href = "/user";
}

// ... 피드 불러오기
function getFeed() {
    $("#card_box").empty()
    $.ajax({
        type: "GET",
        url: "/feed",
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let posts = response["posts"]
                for (let i = 0; i < posts.length; i++) {
                    let post = posts[i]
                    let post_date = new Date(post["post_date"])
                    let time_before = time2str(post_date)

                    let html_temp_img = `<div class="card" id="${post['_id']}">
                                            <!--게시글 헤더-->
                                            <div class="card-body">
                                                <div class="card_header">
                                                    <div class="human"></div>
                                                    <div class="nickname">${post['user_id']}<br><span class="gray_s">${post['location']}</span></div>
                                                </div>
                                                <button class="dot-dot-dot btn-open-popup" onclick="popOpen()"></button>
                                            </div>
                                            <!--게시글 이미지-->
                                            <img src="../static/img/post_1-1.jpg" class="card-img-top post_img">
                                            <!--게시글 이미지 하단 아이콘-->
                                            <div class="post_icon">
                                                <div class="post_icon_left">
                                                    <div class="unlike click" onclick="updateLike(this)"></div>
                                                    <div class="comment"></div>
                                                    <div class="direct"></div>
                                                </div>
                                                <div class="post_icon_right">
                                                    <div class="bookmark"></div>
                                                </div>
                                            </div>
                                            <!--댓글 본문-->
                                            <div class="comment-box">
                                                    <p><span class="bold">좋아요 3개</span></p>
                                                    <div class="feed-information">
                                                        <span class="id">${post['user_id']} </span>
                                                        <span class="feed-content black">${post['desc']}</span>
                                                    </div>                                                    
                                                    <div class="click gray_r" id="comment-open" onclick="getComment(this)">댓글 보기</div>
                                                    <div id="comments"></div>
                                                    <br><div class="gray_s">${time_before}</div>
                                                </div>
                                            <!--댓글 달기-->
                                            <ul class="list-group list-group-flush">
                                                <ul class="list-group list-group-flush">
                                                    <li class="list-group-item">
                                                        <div class="emoji"></div>
                                                        <input type="text" onkeyup="inputComment(this)" class="reply" id="reply" placeholder="댓글 달기...">
                                                        <button type="button" disabled="false" onclick="postComment(this)" class="btn btn-outline-info btn-sm">게시</button>
                                                    </li>
                                                </ul>
                                            </ul>
                                        </div>`
                    let html_temp_carousel = `<div class="card">
                                                <!--게시글 헤더-->
                                                <div class="card-body">
                                                    <div class="card_header">
                                                        <div class="human"></div>
                                                        <div class="nickname">${post['user_id']}<br><span class="gray_s">${post['location']}</span></div>
                                                    </div>
                                                    <button class="dot-dot-dot btn-open-popup" onclick="popOpen()"></button>
                                                </div>
                                                <!--게시글 이미지-->
                                                <div id="carouselExampleIndicators1" class="carousel slide" data-interval="false">
                                                    <!--인디케이터-->
                                                    <div class="carousel-indicators">
                                                        <button type="button" data-bs-target="#carouselExampleCaptions1" data-bs-slide-to="0"
                                                                class="active" aria-current="true" aria-label="Slide 1"></button>
                                                        <button type="button" data-bs-target="#carouselExampleCaptions1" data-bs-slide-to="1"
                                                                aria-label="Slide 2"></button>
                                                        <button type="button" data-bs-target="#carouselExampleCaptions1" data-bs-slide-to="2"
                                                                aria-label="Slide 3"></button>
                                                        <button type="button" data-bs-target="#carouselExampleCaptions1" data-bs-slide-to="3"
                                                                aria-label="Slide 4"></button>
                                                        <button type="button" data-bs-target="#carouselExampleCaptions1" data-bs-slide-to="4"
                                                                aria-label="Slide 5"></button>
                                                        <button type="button" data-bs-target="#carouselExampleCaptions1" data-bs-slide-to="5"
                                                                aria-label="Slide 6"></button>
                                                    </div>
                                                    <!--이미지영역-->
                                                    <div class="carousel-inner">
                                                        <div class="carousel-item active">
                                                            <img src="../static/img/post_1-1.jpg" class="d-block w-100" alt="...">
                                                        </div>
                                                        <div class="carousel-item">
                                                            <img src="../static/img/post_1-2.jpg" class="d-block w-100" alt="...">
                                                        </div>
                                                        <div class="carousel-item">
                                                            <img src="../static/img/post_1-3.jpg" class="d-block w-100" alt="...">
                                                        </div>
                                                        <div class="carousel-item">
                                                            <img src="../static/img/post_1-4.jpg" class="d-block w-100" alt="...">
                                                        </div>
                                                        <div class="carousel-item">
                                                            <img src="../static/img/post_1-5.jpg" class="d-block w-100" alt="...">
                                                        </div>
                                                        <div class="carousel-item">
                                                            <img src="../static/img/post_1-6.jpg" class="d-block w-100" alt="...">
                                                        </div>
                                                    </div>
                                                    <!--좌우 넘기기 버튼 영역-->
                                                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators1"
                                                            data-bs-slide="prev">
                                                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                                        <span class="visually-hidden">Previous</span>
                                                    </button>
                                                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators1"
                                                            data-bs-slide="next">
                                                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                                        <span class="visually-hidden">Next</span>
                                                    </button>
                                                </div>
                                                <!--게시글 이미지 하단 아이콘-->
                                                <div class="post_icon">
                                                    <div class="post_icon_left">
                                                        <div class="like"></div>
                                                        <div class="comment"></div>
                                                        <div class="direct"></div>
                                                    </div>
                                                    <div class="post_icon_right">
                                                        <div class="bookmark"></div>
                                                    </div>
                                                </div>
                                                <div class="box">
                                                    <p><span class="bold">좋아요 3개</span></p>
                                                    <div class="feed-information">
                                                        <span class="id">${post['user_id']} </span>
                                                        <span class="feed-content black">${post['desc']}</span>
                                                    </div>
                                                    <div class="click gray_r" id="comments" onclick="getComment()">댓글 보기</div>
                                                    <br><div class="gray_s">${post['post_date']}</div>
                                                </div>
                                                <!--댓글 달기-->
                                                <ul class="list-group list-group-flush">
                                                    <li class="list-group-item">
                                                        <div class="emoji"></div>
                                                        <input type="text" onkeyup="inputComment(this)" class="reply" id="reply" placeholder="댓글 달기...">
                                                        <button type="button" disabled="false" onclick="postComment()" class="btn btn-outline-info btn-sm">게시</button>
                                                    </li>
                                                </ul>
                                            </div>`
                    $("#card_box").append(html_temp_img)
                }
            }
        }
    })
}
// 하트를 누르면 함수가 실행되는 곳에 있는 클래스를 like 클래스로 바꾸고 좋아요 카운트 +1
// post_id는 어디서받아와
//

// ... 좋아요
// function updateLike(post_id) {
//
//
//     $.ajax({
//         type: "GET",
//         url: "/api/like",
//         data: {post_id_give: post_id, action_give: 'unlike'},
//         success: function (response) {
//
//         }
//     })
// }



// ... 댓글 불러오기
function getComment(obj) {
    $(obj).hide()
    let post_id = $(obj).closest('.card').attr('id')
    $.ajax({
        type: 'GET',
        url: '/api/comment?post_id_give=' + post_id,
        data: {},
        success: function (response) {
            let comments = response['comments']
            for (let i = 0; i < comments.length; i++) {
                let user_id = comments[i]['user_id']
                let comment = comments[i]['comment']
                let cmt_date = new Date(comments[i]['cmt_date'])
                let time_before = time2str(cmt_date)

                let temp_html = `<div>
                                    <span class="black"><strong>${user_id}</strong> ${comment}</span>
                                    <span class="gray_s">${time_before}</span>
                                </div>`
                $(obj).next().append(temp_html)
            }
        }
    });
}

// ... 댓글 작성하기
function postComment(obj) {
    let comment = $(obj).prev().val()
    let cmt_date = new Date().toISOString()
    let post_id = $(obj).closest('.card').attr('id')

    $.ajax({
        type: "POST",
        url: "/api/comment",
        data: {
            post_id_give: post_id,
            comment_give: comment,
            cmt_date_give: cmt_date
        },
        success: function (response) {
            alert(response["msg"])
            window.location.reload()
        }
    });
}


function time2str(date) {
    let today = new Date()
    let time = (today - date) / 1000 / 60

    if (time < 60) {
        return parseInt(time) + "분 전"
    }
    time = time / 60
    if (time < 24 ) {
        return parseInt(time) + "시간 전"
    }
    time = time / 24
    if (time < 7 ) {
        return parseInt(time) + "일 전"
    }
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}


// ... 댓글 미입력시 버튼 비활성화
function inputComment(txt) {
    if ($(txt).val() != '') {
        $(txt).next('Button').attr('disabled', false);
    } else {
        $(txt).next('Button').attr('disabled', true);
    }
}


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

// 포스팅 모달 함수
function selectImages(event) {
    $('#modal_post_display_image').empty();
    $('#image_upload_button').hide();
    let sel_files = [];
    let files = event.target.files;
    let fileArr = Array.prototype.slice.call(files);
    let index = 0;

    let temp_img_html = ``

    if(fileArr.length == 1) {
        temp_img_html = `<div id="carousel_upload" class="carousel slide" data-bs-ride="carousel" data-bs-interval="false">
                          <div id="carousel_upload_inner" class="carousel-inner"></div></div>`
    }
    else {
        temp_img_html = `<div id="carousel_upload" class="carousel slide" data-bs-ride="carousel" data-bs-interval="false">
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
    }

    $('#modal_post_display_image').append(temp_img_html)

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

function postFeed() {
    let form = $('#post_form')[0];
    let formData = new FormData(form);

    $.ajax({
        type: 'POST',
        url: '/api/feed',
        data: formData,
        // enctype: 'multipart/form-data',
        cache: false,
        processData: false,
        contentType: false,
        success: function (response) {
            alert(response['msg']);
            window.location.href = '/';
        },
        error: function (e) {
            console.log("ERROR: ", e);
            alert("fail");
            window.location.href = '/'
        }
    });
}

function initPostModal() {
    $('#modal_post').addClass('is-active');
    $('#modal_post_display_image').empty();
    $('#image_upload_button').show();

    $('.modal-post-text').hide();
    $('#button_post').hide();
}

// 모달 종류 선택 -> 내가 작성한 피드의 모달인지 아닌지
function getModalType() {
    $.ajax({
        type: 'GET',
        url: '/api/getModal',
        data: {},
        success: function(response) {
            if(response['type'] == 'user') {
                $('#modal_user').addClass('is-active');
            }
            else {
                popOpen();
            }
        }
    });

}

// 피드 수정 모달
function initModifyModal() {
    $('#modal_user').removeClass('is-active');
    $('#modal_modify').addClass('is-active');
}

function loadModifyModal() {

    $.ajax({
        type: 'GET',
        url: '/api/loadModify?post_id_give=',
        data: {},
        success: function (response) {

        }

    });
}

function deleteModal() {

}