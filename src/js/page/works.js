
const updateTable = (list)=>{
    const title = $('#title')
    title.html(`미제출 과제[마감순]`) 
    const tb  =$('#_tb')
    tb.html('')
    list.sort((a, b) => {
        var Va = new Date(a.reexpiredate||a.expiredate)
        var Vb = new Date(b.reexpiredate||a.expiredate)
        if (Va < Vb) return -1;
        if (Va > Vb) return 1;
        return 0;
    })
    list.map(e=>{
        const row = $(`<tr style="cursor:pointer"></tr>`)
        const td1 = $(`<td class="text-left"></td>`)
        const td2 = $(`<td></td>`)
        row.click(()=>{
            chrome.tabs.create({
                url:`https://klas.kw.ac.kr/std/lis/evltn/TaskInsertStdPage.do?selectedGrcode=&isopen=${e.isopen}&selectChangeYn=&selectedYearhakgi=${e.yearhakgi}&selectedSubj=${e.subj}&seq=&ordseq=${e.ordseq}&selectYearhakgi=${e.yearhakgi}&selectSubj=${e.subj}&weeklyseq=${e.weeklyseq}&weeklysubseq=${e.weeklysubseq}`
            })
        })

        td1.html(e.title)
        td2.html(e.profNm)

        row.append(td1)
        row.append(td2)
        tb.append(row)
        
        return {title:e.title}
    })
    if(list.length == 0){
        const row = $(`<tr style="cursor:pointer"></tr>`)
        const td1 = $(`<td colspan="2"></td>`)
        td1.html("남은 과제가 없습니다.")
        row.append(td1)
        tb.append(row)
    }
}

getHome(async res => {
    var subjects = res.data.atnlcSbjectList
    var works = []
    for (const e of subjects) {
        const obj = {
            yearhakgi: e.yearhakgi,
            subj: e.subj,
            subjNm: e.subjNm,
            hakjungno: e.hakjungno,
            profNm: e.profNm
        }
        await getHomework(obj, async res => {
            let newdata = res.data.map(e=>{return {...e,profNm:obj.profNm,yearhakgi:obj.yearhakgi,subj:obj.subj}})
            newdata = newdata.filter(e=>{
                if(new Date(e.reexpiredate||e.expiredate) < new Date()) return false
                if(new Date(e.startdate)>new Date()) return false
                if(e.submityn == 'Y') return false
                return true
            })
            works = [...works, ...newdata]
            updateTable(works)
        })
    }
})
