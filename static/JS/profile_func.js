$(document).ready(function () {
    getFeed()
    getFollower()
    getFollowing()
    showModalProfilePic()
})

// ... 피드 불러오기
function getFeed() {
    $("#article_box").empty()
    $.ajax({
        type: "GET",
        url: "/feed?user_id_give=me",
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let posts = response["posts"]
                for (let i = 0; i < posts.length; i++) {
                    let post = posts[i]
                    let url = post['photo'][0]
                    let html_temp_img = `<div class="my_post"><img src="${url}"></div>`
                    $("#article_box").append(html_temp_img)
                }
            }
        }
    })
}

// 팔로워 불러오기
function getFollower() {
    $.ajax({
        type: "GET",
        url: "/follower",
        data: {},
        success: function (response) {
                console.log(response)
                let follower_info = response["follower_info"]
                for (let i = 0; i < follower_info.length; i++) {
                    let follower_data = follower_info[i]
                    let follower_user_id = follower_data['user_id']
                    let follower_user_pic = follower_data['pic']
                    let html_temp = `<div class="follow_info">
                                        <div class="follow_profile">
                                            <div class="profile"><img src="${follower_user_pic}" onerror="this.style.display='none'"></div>
                                            <div class="nickname">${follower_user_id}</div>
                                        </div>
                                        <button type="button" class="btn_follow" onclick="follow(this)"><span class="gray_s">팔로우</span></button>
                                        <button type="button" class="btn_follow_del" onclick="followerDel(this)">삭제</button>
                                    </div>`
                    $("#follower_id_box").append(html_temp)
                }
        }
    })
}

// 팔로우 불러오기
function getFollowing() {
    $.ajax({
        type: "GET",
        url: "/following",
        data: {},
        success: function (response) {
                console.log(response)
                let following_info = response["following_info"]
                for (let i = 0; i < following_info.length; i++) {
                    let following_data = following_info[i]
                    let following_user_id = following_data['user_id']
                    let following_user_pic = following_data['pic']
                    let html_temp = `<div class="follow_info">
                                        <div class="follow_profile">
                                            <div class="profile"><img src="${following_user_pic}" onerror="this.style.display='none'"></div>
                                            <div class="nickname">${following_user_id}</div>
                                        </div>
                                        <button type="button" class="btn_follow_del" onclick="unfollow(this)">팔로잉</button>
                                    </div>`
                    $("#following_id_box").append(html_temp)
                }
        }
    })
}

// 팔로워삭제
function followerDel(obj) {
    let user_id = $(obj).prev().prev().children().next().text();
    console.log(user_id)
    $.ajax({
        type: 'POST',
        url: '/api/deleteFollower',
        data: { user_id_give: user_id },
        success: function (response) {
            window.location.reload();
        }
    });
}

// 팔로우
function follow(obj) {
    let user_id = $(obj).prev().children().next().text()
    console.log(user_id)

    $.ajax({
        type: "POST",
        url: "/api/follow",
        data: {
            id_give: user_id
        },
        success: function (response) {
            window.location.reload()
        }
    });
}

// 언팔로우
function unfollow(obj) {
    let user_id = $(obj).prev().children().next().text()
    console.log(user_id)

    $.ajax({
        type: "POST",
        url: "/api/unfollow",
        data: {
            id_give: user_id
        },
        success: function (response) {
            window.location.reload()
        }
    });
}


//로그아웃
function sign_out() {
    $.removeCookie('mytoken', {path: '/'});
    alert('로그아웃!')
    window.location.href = "/"
}

// 톱니바퀴 모달창 열기
function popOpen() {
    var modalPop = $('#modal-gear');
    var modalBg = $('.modal-bg');
    $(modalPop).show();
    $(modalBg).show();

    $('html').css({
        overflow: 'hidden',
        height: 'auto'
    });
}

// 팔로우 모달창 열기
function popFollowingOpen() {
    var modalPop = $('#modal-following');
    var modalBg = $('.modal-bg');
    $(modalPop).show();
    $(modalBg).show();

    $('html').css({
        overflow: 'hidden',
        height: 'auto'
    });
}

//팔로워 모달창 열기
function popFollowerOpen() {
    var modalPop = $('#modal-follower');
    var modalBg = $('.modal-bg');
    $(modalPop).show();
    $(modalBg).show();

    $('html').css({
        overflow: 'hidden',
        height: 'auto'
    });
}

// 모달창 닫기
function popClose() {
    var modalPop = $('.modal-wrap');
    var modalBg = $('.modal-bg');

    $(modalPop).hide();
    $(modalBg).hide();

    $('html').removeAttr('style');
}

// ... 기본 링크
function goHome() {
    window.location.href = "/";
}

function goUser() {
    window.location.href = "/user";
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
    console.log("init")
    $('#modal_post').addClass('is-active');
    $('#modal_post_display_image').empty();
    $('#image_upload_button').show();

    $('#modal_post_text').hide();
    $('#button_post').hide();
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
            if(pic == null) {
                $('.modal_profile_pic').attr("src", '../static/img/profile.jpg');
            }
            else {
               $('.modal_profile_pic').attr("src",pic);
            }
        }
    });
}