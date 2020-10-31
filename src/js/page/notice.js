
const updateTable = (list)=>{
    const title = $('#title')
    title.html(`공지사항[최근순]`) 
    const tb  =$('#_tb')
    tb.html('')
    list.sort((a, b) => {
        var Va = new Date(a.registDt)
        var Vb = new Date(b.registDt)
        if (Va < Vb) return 1;
        if (Va > Vb) return -1;
        return 0;
    })
    list.map(e=>{
        const row = $(`<tr style="cursor:pointer"></tr>`)
        const td1 = $(`<td class="text-left"></td>`)
        const td2 = $(`<td></td>`)

        row.click(()=>{
            chrome.tabs.create({
                url:`https://klas.kw.ac.kr/std/lis/sport/d052b8f845784c639f036b102fdc3023/BoardViewStdPage.do?boardNo=${e.boardNo}&selectedSubj=${e.subj}`
            })
        })
        
        td1.html(e.title)
        td2.html(e.userNm)
        
        row.append(td1)
        row.append(td2)
        tb.append(row)
        
        return {title:e.title}
    })
    if(list.length == 0){
        const row = $(`<tr style="cursor:pointer"></tr>`)
        const td1 = $(`<td colspan="2"></td>`)
        td1.html("공지사항이 없습니다.")
        row.append(td1)
        tb.append(row)
    }
}

getHome(async res => {
    var subjects = res.data.atnlcSbjectList
    var notices = []
    for (const e of subjects) {
        const obj = {
            yearhakgi: e.yearhakgi,
            subj: e.subj,
            subjNm: e.subjNm,
            hakjungno: e.hakjungno,
            profNm: e.profNm
        }
        await getNotice(obj, async res => {
            notices = [...notices, ...res.data.list]
            updateTable(notices)
        })
    }
})
