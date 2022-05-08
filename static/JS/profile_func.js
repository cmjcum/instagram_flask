// $(document).ready(function () {
//     show_follow();
// });

function show_follow() {
    $.ajax({
        type: "GET",
        url: "/profile",
        data: {},
        success: function (response) {
            alert(response["msg"])
        }
    });
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