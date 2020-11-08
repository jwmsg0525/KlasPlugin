
const updateTable = (list)=>{
    const title = $('#title')
    title.html(`미수강 강의[마감순]`) 
    const tb  =$('#_tb')
    tb.html('')
    list.sort((a, b) => {
        var Va = new Date(a.endDate)
        var Vb = new Date(b.endDate)
        if (Va < Vb) return -1;
        if (Va > Vb) return 1;
        return 0;
    })
    
    list = list.filter(e=>{ //수강 시간 이상 나오는거 안보여주기
        return new Date(e.startDate) <= new Date()
    })

    list.map(e=>{
        const row = $(`<tr style="cursor:pointer"></tr>`)
        const td1 = $(`<td></td>`)

        row.click(()=>{
            chrome.windows.create({
                url:`https://klas.kw.ac.kr/spv/lis/lctre/viewer/LctreCntntsViewSpvPage.do?grcode=${e.grcode}&subj=${e.subj}&year=${e.year}&hakgi=${e.hakgi}&bunban=${e.bunban}&module=${e.module}&lesson=${e.lesson}&oid=${e.oid}&ptime=&weeklyseq=${e.weeklyseq}&weeklysubseq=${e.weeklysubseq}&totalTime=${e.totalTime}&prog=${e.prog}&profYN=N&previewYN=N`,
                type:'popup'
            },(win)=>{
                chrome.windows.getAll({windowTypes:['popup']},(wins)=>{
                    wins.forEach(e => {
                        if(e.id == 0) return
                        if(e.id != win.id)
                            chrome.windows.remove(e.id)
                    });
                })
            })
        })

        td1.html(e.sbjt||e.sdesc||e.moduletitle)
        if(new Date(e.endDate) < new Date()){
            td1.html('<a style="color:#f00; font-weight:bold;">[결석]</a> <a style="font-weight:bold;">'+(e.sbjt||e.sdesc||e.moduletitle+"</a>"))
        }
        row.append(td1)
        tb.append(row)
        
        return {title:e.title}
    })
    if(list.length == 0){
        const row = $(`<tr style="cursor:pointer"></tr>`)
        const td1 = $(`<td colspan="2"></td>`)
        td1.html("남은 남은 강의가 없습니다.")
        row.append(td1)
        tb.append(row)
    }
}

getHome(async res => {
    var subjects = res.data.atnlcSbjectList
    var lessons = []
    for (const e of subjects) {
        const obj = {
            yearhakgi: e.yearhakgi,
            selectSubj: e.subj,
        }

        getLessonData(obj,async res=>{
            console.log(res.data)
            newdata = res.data.filter(e=>{
                if(e.evltnSe!='lesson') return false
                if(e.startDate > new Date()) return false
                if(e.prog >=100) return false
                if(e.isonoff != 'ON') return false
                return true
            })
            lessons = [...lessons, ...newdata]
            updateTable(lessons)
        })
    }
})


