$(document).ready(function () {
    getFeed()
    getFollower()
    getFollowing()
})

// ... 피드 불러오기
function getFeed(user_id) {
    if (user_id == undefined) {
        user_id = ""
    }
    $("#article_box").empty()
    $.ajax({
        type: "GET",
        url: `/feed?user_id_give=${user_id}`,
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
                let follower_id = response["follower_id"]
                for (let i = 0; i < follower_id.length; i++) {
                    let follower_user_id = follower_id[i]
                    let html_temp = `<div class="follow_info">
                                        <div class="follow_profile">
                                            <div class="profile"></div>
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
                let following_id = response["following_id"]
                for (let i = 0; i < following_id.length; i++) {
                    let following_user_id = following_id[i]
                    let html_temp = `<div class="follow_info">
                                        <div class="follow_profile">
                                            <div class="profile"></div>
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