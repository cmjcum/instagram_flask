$(document).ready(function () {
    getFeed()
})

// ... 피드 불러오기
function getFeed() {
    $("#article_box").empty()
    $.ajax({
        type: "GET",
        url: "/feed",
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