$(document).ready(function () {
    // show_follow();
    showUserInfo();
    downloadImage();
});

// function show_follow() {
//     $.ajax({
//         type: "GET",
//         url: "/profile",
//         data: {},
//         success: function (response) {
//             alert(response["msg"])
//         }
//     });
// }

function showUserInfo() {
    $.ajax({
        type: "GET",
        url: "/api/profile",
        data: {},
        success: function (response) {
            alert(response["msg"])
        }
    });
}

// 이미지 로딩
function downloadImage() {
    $.ajax({
        type: 'GET',
        url: '/prifile/download',
        data: {},
        success: function (response) {
            let rows = response['image']
            console.log(rows)

            for (let i = 0; i < rows.length; i++) {
                let id = rows[i]
                let temp = `<div class="my_post"><img src="data:image/*;base64, ${id}"></div>`
                $('#article_box').append(temp)
            }
        }
    })
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