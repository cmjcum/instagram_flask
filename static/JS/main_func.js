// ... 버튼 모달창 열기
function popOpen() {
    var modalPop = $('.modal-wrap');
    var modalBg = $('.modal-bg');
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