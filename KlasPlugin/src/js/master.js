// Constants
const base_url = 'https://klas.kw.ac.kr'


// #-- Base Function --#
var callAPI = (path, data, callback) => {
	return axios.post(base_url + path, data, {
			withCredentials: true,
			headers: {
				'Accept': 'application/json'
			}
		})
		.then(callback).catch((err) => {
			console.log(err)
		})
}


// #-- CallBack Functions --#
// 1. getHome
// 2. getScdul
// 3. getNotice
// 4. getHomework
// 5. getHomeworkProject
// 6. putLessonProg
// 7. getLessonData
// 8. getUserInfo
// 9. login
// 10. logout
// 11. autoLogin
// #------------------------#
const getHome = async (callback) => {
	callAPI('/std/cmn/frame/StdHome.do', {}, callback)
}

const getSchdul = async (object, callback) => {
	var data = {
		'schdulYear': object.year,
		'schdulMonth': object.month
	}
	callAPI('/std/cmn/frame/SchdulStdList.do', data, callback)
}

const getNotice = async (object, callback) => {
	var data = {
		'selectYearhakgi': object.yearhakgi,
		'selectSubj': object.subj,
		'selectChangeYn': 'Y',
		'subjNm': object.subjNm + ' (' + object.hakjungno + ') - ' + object.profNm,
		'subj': {
			'value': object.subj,
			'label': object.subjNm + ' (' + object.hakjungno + ') - ' + object.profNm
		}
	}
	callAPI('/std/lis/sport/d052b8f845784c639f036b102fdc3023/BoardStdList.do', data, callback)
}

const getHomework = async (object, callback) => {
	var data = {
		'selectYearhakgi': object.yearhakgi,
		'selectSubj': object.subj,
		'selectChangeYn': 'Y',
		'subjNm': object.subjNm + ' (' + object.hakjungno + ') - ' + object.profNm,
		'subj': {
			'value': object.subj,
			'label': object.subjNm + ' (' + object.hakjungno + ') - ' + object.profNm
		}
	}

	callAPI('/std/lis/evltn/TaskStdList.do', data, callback)
}

const getHomeworkProject = async (object, callback) => {
	var data = {
		'selectYearhakgi': object.yearhakgi,
		'selectSubj': object.subj,
		'selectChangeYn': 'Y',
	}

	callAPI('/std/lis/evltn/PrjctStdList.do', data, callback)
}

const putLessonProg = async (object, callback) => {
	var data = {
		year: object.year,
		subj: object.subj,
		bunban: object.bunban,
		hakgi: object.hakgi,
		module: object.module,
		lesson: object.lesson,
		oid: object.oid,
		weeklyseq: object.weeklyseq,
		weeklysubseq: object.weeklysubseq,
		grcode: object.grcode,
		isendfile: object.isendfile
	}
	callAPI('/spv/lis/lctre/viewer/UpdateProgress.do', data, callback)
}

const getLessonData = async (object, callback) => {
	var data = {
		'list': [],
		'selectYearhakgi': object.yearhakgi,
		'selectSubj': object.selectSubj,
		'selectChangeYn': 'Y',
		'grcode': '',
		'subj': '',
		'year': '',
		'hakgi': '',
		'bunban': '',
		'lrnSn': '',
		'width': '',
		'height': '',
		'lrnSttus': 'N',
		'lrnStatus': 'N',
		'pageInit': false,
		'size': '',
		'totMbList': [],
		'platform': ''
	}
	callAPI('/std/lis/evltn/SelectOnlineCntntsStdList.do', data, callback)
}

const getUserInfo = async (callback) => {
	const data = {
		'infoData': '',
		'emailHost': '',
		'emailHostDirect': '',
		'email': '',
		'bankList': [],
		'homePostno': '',
		'homeAddr1': '',
		'homeAddr2': '',
		'handPhoneno': '',
		'homePhoneno': '',
		'bankCode': '',
		'bankbookNo': '',
		'emailId': '',
		'calendarOpt': '',
		'ymdList': '',
		'birthYear': '',
		'birthMonth': '',
		'birthDay': '',
		'yundalOpt': '',
		'oldPassword': '',
		'newPassword': '',
		'newPassword2': '',
		'pwdUpdateCheck': '',
		'insertBirthday': '',
		'orgBirthDay': '',
		'pwdCheck': '',
		'password': '',
		'bankOpt': '',
		'birthdayOpt': '',
		'mblOpen': 'N',
		'hpOpenOpt': 'N'
	}
	callAPI('/std/ads/admst/IdModifySpvInfo.do', {}, callback)
}

const logout = async (callback) => {
	callAPI('/usr/cmn/login/Logout.do', {}, callback)
}

const login = (user_id, user_pw, callback) => {
	chrome.windows.create({
		url: base_url
	}, (win) => {
		if (['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'].indexOf(window.navigator.platform) != -1) {
			chrome.windows.update(window.id, {
				focused: true
			})
		}

		chrome.cookies.getAll({
			url: base_url
		}, function (e) {
			document.cookie = e.map(el => `${el.name}=${el.value}`).join(';').replace(' ', '') + ';'
			window.my_session = e.map(el => `${el.name}=${el.value}`).join(';').replace(' ', '') + ';'
		})
		chrome.windows.remove(win.id)
	});
	callAPI('/usr/cmn/login/LoginSecurity.do', {}, (res) => {
		var login = JSON.stringify({
			'loginId': user_id,
			'loginPwd': user_pw,
			'storeIdYn': 'N'
		});
		var encrypt = new JSEncrypt();
		encrypt.setPublicKey(res.data.publicKey);
		var loginToken = encrypt.encrypt(login);
		var data = {
			'loginToken': loginToken,
			'redirectUrl': '',
			'redirectTabUrl': ''
		}
		callAPI('/usr/cmn/login/LoginConfirm.do', data, callback)
	})
}

const autoLogin = () => {
	const current_path = location.pathname.split('/')
	const current_docu = current_path[current_path.length - 1]
	if (current_docu == 'setting.html') return false
	chrome.cookies.getAll({
		url: base_url
	}, function (e) {
		document.cookie = e.map(el => `${el.name}=${el.value}`).join(';').replace(' ', '') + ';'
		window.my_session = e.map(el => `${el.name}=${el.value}`).join(';').replace(' ', '') + ';'
	})
	chrome.storage.local.get(['user_id', 'user_pw'], function (result) {
		if (result.user_id == null || result.user_pw == null || result.user_id == '' || result.user_pw == '') {
			return location.href = './setting.html'
		}
	})
	getUserInfo((res) => {

		if (res.headers['content-type'] == 'text/html;charset=UTF-8') {
			chrome.storage.local.get(['user_id', 'user_pw'], function (result) {
				login(result.user_id, result.user_pw, (res) => {
					if (res.data.errorCount == 0) {
						if (res.data.response.certOpt == 'Y') {
							alert('임시 비밀번호를 먼저 변경해주세요.')
						} else {
							console.log('로그인에 성공했습니다.')
							location.reload()
						}
					} else {
						console.log(res)
						alert('로그인 오류가 존재합니다.')
						location.href = './setting.html'
					}
				})
			});

		}
	})
}

// Main Program
autoLogin()