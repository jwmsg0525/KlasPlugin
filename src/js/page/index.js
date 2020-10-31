var toYear = new Date().getFullYear()
var toMonth = new Date().getMonth() +1
var toDate = new Date().getDate()



getSchdul({year:toYear, month:toMonth},(res)=>{
    const title = $('#title')
    title.html(`${toYear}년 ${toMonth}월 일정`) 
    const tb  =$('#_tb')
    tb.html('')
    res.data.tableList.map(e=>{
        if(e.ended.split('-').slice(1,3)[1]<toDate) return null
        const row = $(`<tr></tr>`)
        const td1 = $(`<td ></td>`)
        const td2 = $(`<td class="text-left"></td>`)
        
        td1.html(e.ended.split('-').slice(1,3).join('/'))
        td2.html(e.title)
        
        row.append(td1)
        row.append(td2)
        tb.append(row)
        
        return {ended:e.ended,title:e.title}
    })
    
})

