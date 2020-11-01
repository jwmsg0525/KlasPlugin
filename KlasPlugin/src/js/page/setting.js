chrome.storage.local.get(['user_id', 'user_pw'], function (result) {

    if (result.user_id == null || result.user_pw == null || result.user_id == '' || result.user_pw == '') {
        return $('#login_status').html('<a style="color:#f00" class="font-weight-bold">아이디 비밀번호 등록이 되어 있지 않습니다.</a>')
    }
    getUserInfo((res) => {
        if (res.headers['content-type'] == "text/html;charset=UTF-8") {
            return $('#login_status').html('<a style="color:#f00" class="font-weight-bold">로그인에 문제가 있습니다.</a>')
        }
        $('#login_status').html('성공적으로 로그인이 되어있는 상태 입니다.')
        $('#login_user').val(result.user_id)
        $('#login_pass').val(result.user_id)
    })
});





$('#login_save').click(() => {
    const user_id = $('#login_user').val()
    const user_pw = $('#login_pass').val()
    login(user_id, user_pw, (res) => {
        if (res.data.errorCount == 0) {
            if (res.data.response.certOpt == 'Y') {
                alert('임시비밀번호 상태입니다, Klas 에서 변경후 이용해 주세요')
            } else {
                alert("로그인에 성공했습니다.")
                chrome.storage.local.set({ user_id: user_id });
                chrome.storage.local.set({ user_pw: user_pw });
                location.reload()
            }
        } else {
            console.log(res)
            alert('로그인 오류가 존재합니다.', res)
            
            logout(() => {
                chrome.storage.local.set({ user_id: '' });
                chrome.storage.local.set({ user_pw: '' });
             })
            location.reload()
        }
    })
})

$('#logout').click(()=>{
    logout(() => { 
        chrome.storage.local.set({ user_id: '' });
        chrome.storage.local.set({ user_pw: '' });
        alert('로그아웃 되었습니다.')
        location.reload()
    })
})