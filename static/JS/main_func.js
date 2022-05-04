// ... 페이지 로딩시 호출 함수
$(document).ready(function(){
    showMoreButton()
    })


// ... 기본 링크
function goHome() {
    window.location.href = "/";
}


// ... 더보기 버튼 만드는 함수
    let feedArray = []

function showMoreButton() {
    let cntPost = $('.feed-content').length;

    for(let i=0; i<cntPost; i++) {
        let id = '#text' + i
        let text = $(id).text();
        feedArray[i] = text;

        if (text.length >= 30) {
            let text_short = text.substring(0, 30).trim() + "... ";
            let moreButton = `<Button onclick="moreButtonClick(this, ${i})" class="btn showMore">더 보기</Button>`;

            $(id).parents('.feed-content').append(moreButton)
            $(id).text(text_short)
        }
    }
}

// ... 더보기 버튼 클릭시 이벤트
function moreButtonClick(obj, i) {
    let textId = '#text' + i;
    $(obj).hide();
    $(textId).text(feedArray[i]);
}

// ... 피드 불러오기
function showFeed() {

}

// ... 댓글 불러오기
function showComment(){
    $.ajax({
        type: 'GET',
        url: '/',
        data: {},
        success: function (response) {
            let rows = response['comments']
            for (let i = 0; i < rows.length; i++) {
                let user_id = rows[i]['user_id']
                let comment = rows[i]['comment']
                let cmt_date = rows[i]['cmt_date']

                let temp_html = `<tr>
                                    <td>${user_id} ${comment}</td>
                                    <td>${cmt_date}</td>
                                </tr>`
                if ($('#comments').length >= 1) {
                    $('#comments').text('댓글 보기')
                    $('#comments').append(temp_html)
                }
                else{
                    $('#comments').text('').hide();
                }
            }
        }
    });
}

// ... 댓글 작성하기
function saveComment(){
    let comment = $('#input'.val)
    let cmt_date = new Date().getTime()

    form_data.append('post_id_give', post_id)
    form_data.append('comment_give', comment)
    form_data.append('cmt_date_give', cmt_date)

    $.ajax({
        type: "POST",
        url: "/",
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {
            alert(response["msg"])
            window.location.reload()
        }
    });
}

// ... 댓글 미입력시 버튼 비활성화
function inputComment(txt) {
    if ($(txt).val() != '') {
        $(txt).next('Button').attr('disabled', false);
    }
    else {
        $(txt).next('Button').attr('disabled', true);
    }

}


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
