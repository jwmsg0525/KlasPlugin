// #-- Page Functions --#
// 1. updateTable : data to html rows
// 2. filterWork : api call data processing
// #--------------------#
const updateTable = (list) => {
	const title = $('#title')
	const tb = $('#_tb')
	
	title.html(`미제출 과제[마감순]`)
	tb.html('')

	// If List Length Equal 0
	if (list.length == 0) {
		const row = $('<tr>', { style: 'cursor:pointer' })
			.append('<td>', { colspan: 2, text: '남은 과제가 없습니다' })
		tb.append(row)
	}
	
	// List sorted
	list.sort((a, b) => {
		var Va = new Date(a.reexpiredate || a.expiredate)
		var Vb = new Date(b.reexpiredate || a.expiredate)
		if (Va < Vb) return -1
		if (Va > Vb) return 1
		return 0
	})

	// List to html
	list.map(e => {
		const row = $('<tr>', { style: 'cursor:pointer' })
			.append( $('<td>', { class: 'text-left', text: e.title }) )
			.append( $('<td>', { class: 'text-left', text: e.profNm }) )
		
		row.click(() => {
			chrome.tabs.create({
				url: `https://klas.kw.ac.kr/std/lis/evltn/TaskInsertStdPage.do?selectedGrcode=&isopen=${e.isopen}&selectChangeYn=&selectedYearhakgi=${e.yearhakgi}&selectedSubj=${e.subj}&seq=&ordseq=${e.ordseq}&selectYearhakgi=${e.yearhakgi}&selectSubj=${e.subj}&weeklyseq=${e.weeklyseq}&weeklysubseq=${e.weeklysubseq}`
			})
		})

		tb.append(row)

		return { title: e.title }
	})
}

const filterWork = (obj, data) => {
	const convert = data.map(e => {
		return {
			...e,
			profNm: obj.profNm,
			yearhakgi: obj.yearhakgi,
			subj: obj.subj
		}
	})

	const result = convert.filter(e => {
		if (new Date(e.reexpiredate || e.expiredate) < new Date()) return false
		if (new Date(e.startdate) > new Date()) return false
		if (e.submityn == 'Y') return false
		return true
	})

	return result
}

// getHome Function
getHome(async res => {
	const subjects = res.data.atnlcSbjectList
	let works = []
	
	for (const e of subjects) {
		const obj = {
			yearhakgi: e.yearhakgi,
			subj: e.subj,
			subjNm: e.subjNm,
			hakjungno: e.hakjungno,
			profNm: e.profNm
		}

		getHomework(obj, async res => {
			works.push(...filterWork(obj, res.data))
			updateTable(works)
		})

		getHomeworkProject(obj, async res => {
			works.push(...filterWork(obj, res.data))
			updateTable(works)
		})
	}
})
