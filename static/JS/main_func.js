// ... 페이지 로딩시 호출 함수
$(document).ready(function () {
    getFeed()
    showModalProfilePic()
})


// ... 기본 링크
function goHome() {
    window.location.href = "/";
}

function goUser() {
    window.location.href = "/user";
}

function goProfilePage(obj) {
    let writer_id = $(obj).next().children('#feed_writer_id').text()
    console.log(writer_id)
    window.location.href = `/user?writer_id_give=${writer_id}`;
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

                    let post_id_num = post['_id']
                    let carousel_id = 'carousel' + post_id_num

                    let temp_img_html = `<div id="${carousel_id}" class="carousel slide" data-bs-ride="carousel" data-bs-interval="false">
                                 <div id="carousel_inner" class="carousel-inner">`

                    for (let j = 0; j < post['photo'].length; j++) {

                        let temp = ``

                        if (j == 0) {
                            temp = `<div class="carousel-item active">
                                      <img src=${post['photo'][j]} class="d-block w-100" alt="...">
                                    </div>`
                        } else {
                            temp = `<div class="carousel-item">
                                      <img src=${post['photo'][j]} class="d-block w-100" alt="...">
                                    </div>`
                        }
                        temp_img_html = temp_img_html + temp
                    }
                    if (post['photo'].length == 1) {
                        temp_img_html = temp_img_html + `</div></div>`
                    } else {
                        temp_img_html = temp_img_html + `<!--좌우 넘기기 버튼 영역-->
                                             </div>
                                             <button class="carousel-control-prev" type="button" data-bs-target="#${carousel_id}" data-bs-slide="prev">
                                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                                <span class="visually-hidden">Previous</span>
                                             </button>
                                             <button class="carousel-control-next" type="button" data-bs-target="#${carousel_id}" data-bs-slide="next">
                                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                                <span class="visually-hidden">Next</span>
                                             </button>
                                         </div>`
                    }
                    let temp_like_html = ``

                    if (post["heart_by_me"] == true) {
                        temp_like_html = `<div class="like click" onclick="updateLike(this)"></div>`
                    } else {
                       temp_like_html = `<div class="unlike click" onclick="updateLike(this)"></div>`
                    }

                    let html_temp = `<div class="card" id="${post['_id']}">
                                <!--게시글 헤더-->
                                <div class="card-body">
                                    <div class="card_header">
                                        <div onclick="goProfilePage(this)" class="human"><img src="${post['pic']}"></div>
                                        <div class="nickname"><span id="feed_writer_id">${post['user_id']}</span><br><span class="gray_s">${post['location']}</span></div>
                                    </div>
                                    <button class="dot-dot-dot btn-open-popup" onclick="getModalType(this)"></button>
                                </div>
                                
                                <!--게시글 이미지-->
                                <div id="feed_img_box">${temp_img_html}</div>                                            
                                <!--<img src="../static/img/post_img/post_1-1.jpg" class="card-img-top post_img">-->

                                <!--게시글 이미지 하단 아이콘-->
                                <div class="post_icon">
                                    <div class="post_icon_left">
                                        ${temp_like_html}
                                        <div class="comment"></div>
                                        <div class="direct click"></div>
                                    </div>
                                    <div class="post_icon_right">
                                        <div class="bookmark"></div>
                                    </div>
                                </div>
                                <!--댓글 본문-->
                                <div class="comments_box">
                                    <p class="bold">좋아요 <span id="like_cnt">${post['like_cnt']}</span>개</p>
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

                    $("#card_box").append(html_temp)
                }
            }
        }
    })
}
// 하트를 누르면 (onclick) 함수가 실행되는 곳에 있는 클래스를 like 클래스로 바꾸고 좋아요 카운트 +1
// 카운트는 db의 like 테이블에서 post_id 의 개수를 셈
//

// ... 좋아요
function updateLike(obj) {
    let post_id = $(obj).closest('.card').attr('id')

    if ($(obj).hasClass('unlike')) {
        $.ajax({
            type: "POST",
            url: "/api/like",
            data: {post_id_give: post_id, action_give: 'like'},
            success: function (response) {
                console.log("like")
                console.log(response["count"])
                $(obj).addClass('like').removeClass('unlike')
                $(obj).closest('.post_icon').next().find('span#like_cnt').text(response["count"])
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: "/api/like",
            data: {post_id_give: post_id, action_give: 'unlike'},
            success: function (response) {
                console.log("unlike")
                $(obj).addClass('unlike').removeClass('like')
                $(obj).closest('.post_icon').next().find('span#like_cnt').text(response["count"])
            }
        })
    }
}


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
                                    <span class="black_b">${user_id}</span><span class="black"> ${comment}</span>
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
    $.ajax({
        type: 'GET',
        url: '/api/userInfo',
        data: {},
        success: function (response) {
            let user_info = response['user_info'];
            let user_id = user_info['user_id']
            $('#modal_post_id').text(user_id)
        }
    });

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
    $('#modal_post_text').show();
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
            $("#modal_post").removeClass("is-active");
            window.location.reload();
        },
        error: function (e) {
            console.log("ERROR: ", e);
            alert("fail");
            $("#modal_post").removeClass("is-active");
            window.location.reload();
        }
    });
}

function initPostModal() {
    $('#modal_post').addClass('is-active');
    $('#modal_post_display_image').empty();
    $('#image_upload_button').show();

    $('#modal_post_text').hide();
    $('#button_post').hide();
}

// 모달 종류 선택 -> 내가 작성한 피드의 모달인지 아닌지
function getModalType(obj) {
    let post_id = $(obj).closest('.card').attr('id')
    $.ajax({
        type: 'GET',
        url: `/api/getModal?post_id_give=${post_id}`,
        data: {},
        success: function(response) {
            if(response['type'] == 'writer') {
                $('#modal_writer').addClass('is-active');
                document.getElementById('modal_button_modify').addEventListener('click', function(){initModifyModal(post_id)}, { once: true })
                document.getElementById('modal_button_delete').addEventListener('click', function(){initDeleteModal(post_id)})
            }
            else {
                popOpen();
            }
        }
    });

}

// 피드 수정 모달
function initModifyModal(post_id) {
    $('#modal_writer').removeClass('is-active');
    $('#modal_modify').addClass('is-active');
    loadModifyModal(post_id);
}

function loadModifyModal(post_id) {
    document.getElementById('button_modify').addEventListener('click', function(){modifyFeed(post_id)}, { once: true })
    $('#modal_modify_display_image').empty()
    $.ajax({
        type: 'GET',
        url: `/api/loadModify?post_id_give=${post_id}`,
        data: {},
        success: function (response) {
            let post_info = response['post_info'];
            let image_arr = post_info['photo']
            let temp_img_html = ``;

            if(image_arr.length == 1) {
                temp_img_html = `<div id="carousel_modify" class="carousel slide" data-bs-ride="carousel" data-bs-interval="false">
                          <div id="carousel_modify_inner" class="carousel-inner"></div></div>`
            }
            else {
                temp_img_html = `<div id="carousel_modify" class="carousel slide" data-bs-ride="carousel" data-bs-interval="false">
                          <div id="carousel_modify_inner" class="carousel-inner">
                          </div>
                          <button class="carousel-control-prev" type="button" data-bs-target="#carousel_modify" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                          </button>
                          <button class="carousel-control-next" type="button" data-bs-target="#carousel_modify" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                          </button>
                        </div>`
            }

            $('#modal_modify_display_image').append(temp_img_html)

            for (let i = 0; i < image_arr.length; i++) {
                let temp = ``
                if (i == 0) {
                    temp = `<div class="carousel-item active">
                              <img src=${image_arr[i]} class="d-block w-100" alt="...">
                            </div>`
                }
                else {
                    temp = `<div class="carousel-item">
                              <img src=${image_arr[i]} class="d-block w-100" alt="...">
                            </div>`
                }

                $('#carousel_modify_inner').append(temp);
            }

            $('#modify_text').text(post_info['desc']);
            $('#modify_location').val(post_info['location']);
            $('#writer_id').text(post_info['user_id']);
        }

    });
}

function modifyFeed(post_id) {
    let desc = $('#modify_text').val();
    let location = $('#modify_location').val();

    $.ajax({
        type: 'POST',
        url: '/api/modifyFeed',
        data: { desc_give: desc,
                location_give: location,
                post_id_give: post_id },
        success: function (response) {
            alert(response['msg']);
            $("#modal_modify").removeClass("is-active");
            window.location.reload();
        }
    });
}

// 피드 삭제 모달
function initDeleteModal(post_id) {
    $('#modal_writer').removeClass('is-active');
    $('#modal_delete').addClass('is-active');
    document.getElementById('button_delete').addEventListener('click', function(){deleteFeed(post_id)})
}

function deleteFeed(post_id) {
    console.log(post_id)
    $.ajax({
       type: 'GET',
       url: `/api/deleteFeed?post_id_give=${post_id}`,
       data: {},
       success: function (response) {
           alert(response['msg']);
           $("#modal_delete").removeClass("is-active");
            window.location.reload();
       }
    });
}

// 모달에 사용자 프로필 사진 띄우는 함수
function showModalProfilePic() {
    $.ajax({
        type: 'GET',
        url: '/api/userInfo',
        data: {},
        success: function (response) {
            let user_info = response['user_info'];
            let pic = user_info['pic']
            if(pic == '') {
                $('.modal_profile_pic').attr("src", '../static/img/profile.jpg');
            }
            else {
               $('.modal_profile_pic').attr("src",pic);
            }
        }
    });
}

// 우측 메뉴에서 팔로우 버튼 눌렀을 때 실행하는 함수
function clickFollowButton(obj) {
    let recommend = $(obj).parent().prev().children('#recommend_user_id').text()
    $.ajax({
        type: 'POST',
        url: '/api/follow',
        data: { id_give: recommend },
        success: function (response) {
            window.location.reload();
        }
    });
}