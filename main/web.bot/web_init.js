function lastbotmsg() {
    var msg = JSON.parse(posthttp('https://v2-bot-auth.cgslate.com/api/bot/get-messages', `{"bot_uuid":"0296339483100153","direction":"backward"}`, [`mobile,${localStorage.getItem('mobile')}`, `session-id,${localStorage.getItem('token')}`]))
    let payload = [];
    function load(payload, msg = msg.messages) {
        for (i = 0; i < msg.length; i++) {
            if (msg[i].type === 'article') {
                const x = msg[i].article[0].actions[0].website.payload.replaceAll("\'", "\"")
                if (!payload.includes(x)) { payload.push(x) }
            }
        }
        return payload
    }
    tokendata = JSON.stringify(msg.next_token)
    // i = 0
    // while (payload.length < 5) {
    var msg_u = JSON.parse(posthttp('https://v2-bot-auth.cgslate.com/api/bot/get-messages', `{"bot_uuid":"0296339483100153","direction":"backward","next_token":${tokendata}}`, [`mobile,${localStorage.getItem('mobile')}`, `session-id,${localStorage.getItem('token')}`]))
    load(payload, msg_u.messages)
    tokendata = JSON.stringify(msg_u.next_token)
    //     i++
    // }
    return payload
}
function GetTeacherData(lastmsglist, teacherDetails) {

    // data = `<button class="ui secondary fluid  button"><i class="icon double fan loading"></i>Loading</button>`;
    // container.innerHTML += data;
    get_bot_static = JSON.parse(posthttp('https://v2-bot-auth.cgslate.com/api/bot/get-bot-user-details', `{"bot_uuid":"0296339483100153"}`, [`mobile,${localStorage.getItem('mobile')}`, `session-id,${localStorage.getItem('token')}`]))
    div = document.createElement('div')
    div.classList = "ui menu segment"
    segement = `<span class="ui item small header">Teacher Details</span>`
    for (i in lastmsglist) {
        if (Object.keys(teacherDetails).includes(i)) {
            segement += `<a class="ui active item large basic label">${teacherDetails[i]}<div class="detail">${lastmsglist[i]}</div> </a>`
        }
    }
    segement += `<dialog id="activeimport">
    <button class="ui deny button" autofocus>Close</button> <button class="ui green button">Selected</button>
    <div class="ui file action input"><input accept=".csv,.txt" id="activeimport1" type="file"><label for="activeimport1" class="ui blue button">Choose FILE</label></div>
    </dialog>
    <a class="ui right item image label"><img class='ui rounded centered image' src="${get_bot_static.configuration.photo}"> ${get_bot_static.configuration.name} <span class="ui basic ${get_bot_static.configuration.status === "ACTIVE" ? "green" : "red"} basic label"> ${get_bot_static.subscriber_count} </span></a></div >`
    div.innerHTML += segement
    return div
}
function examdetails(data) {
    for (i of data) {
        payload = JSON.parse(i)
        var id = `${payload.subject.split(" ")[0].split(":")[0].replaceAll(/\s+/g, "_")}_${payload.grade}_${payload.section}_${payload.userMedium}`
        subtab = document.querySelector(`div.tab.segment[data-tab="${id}"]`)
        subtab.innerHTML = `<span>
            <a class="ui black basic label" data="${payload.examID}">Subject :<div class="detail">${payload.subject.split(":")[0]}</div></a>
            <a class="ui black basic label">Date :<div class="detail">${payload.subject.split(":")[1]}</div></a>
            <a class="ui black basic label">Grade :<div class="detail">${payload.grade}-${payload.section}</div></a>
            <a class="ui black basic label">Eduction Medium :<div class="detail">${payload.userMedium}</div></a>
        </span>
        <span style="float: right">
            <a class="ui blue basic tertiary label">Entry<div class="detail">Ready to Save</div></a>
            <a class="ui red basic tertiary label">Absent<div class="detail">Saved</div></a>
            <a class="ui green basic tertiary label">Present<div class="detail">Saved</div></a>
            <a class="ui  tertiary basic label">Not Saved</a>
        </span>
        <div class="ui segment scrolling content"><table class="ui sortable compact celled table" id="${id}_table"></table></div>`
    }
}
function fetchmenu(listdata) {
    const container = document.querySelector('#sx_model .content')
    element = []
    div = document.createElement('div')
    div.classList = "ui secondary pointing menu"
    x = `<div class="item">Select Your Exam: </div> `
    for (i of listdata) {
        payload = JSON.parse(i)
        var id = `${payload.subject.split(" ")[0].split(":")[0].replaceAll(/\s+/g, "_")}_${payload.grade}_${payload.section}_${payload.userMedium}`
        x += `<div class="item fluid" data-tab="${id}">${id}</div>`
    }
    div.innerHTML = x,
        container.appendChild(div)
    for (i of listdata) {
        payload = JSON.parse(i)
        var id = `${payload.subject.split(" ")[0].split(":")[0].replaceAll(/\s+/g, "_")}_${payload.grade}_${payload.section}_${payload.userMedium}`
        container.appendChild(createElementFromHTML(`<div class="ui tab segment" data-tab="${id}"></div>`))
    }
}
function fetch_table(id, exam, student) {
    tablegen = `<thead><tr><th>Sr No.</th><th>Student Name</th><th>Student ID</th><th>P/A</th>`
    for (i = 0; i < exam.length; i++) { tablegen += `<th>${exam[i].questionTitle}</th>` }
    tablegen += `  <th>Total</th><th>Submit</th></tr></thead><tbody>`;
    for (st = 0; st < student.length; st++) {
        tablegen += `<tr sid="${student[st].studentId}">
                    <td class="pi1 enter fluid" >${((st + 1) < 10) ? '0' + (st + 1).toString() : st + 1}</td>
                    <td class="pi1 enter fluid" >${student[st].name}</td>
                    <td class="pi1 enter fluid">${student[st].studentId}</td>
                    <td class="pi1 enter fluid left marked">
                    <div class="ui fitted slider checkbox"><input type="checkbox"><label></label></div></td>`
        for (i = 0; i < exam.length; i++) {
            tablegen += `<td><div class="ui fluid input"><input max="${find_obj_value(exam, 'questionTitle', `Q${i + 1}`, 'questionMaxScore')}" placeholder="${find_obj_value(exam, 'questionTitle', `Q${i + 1}`, 'questionTitle')}" min="0" type="number"></div></td>`
        }
        tablegen += `<td class="pi1 enter fluid">${student[st].scores ? (student[st].scores.status === 1 ? student[st].scores.obtainedMarks : 0) : 0}</td>
            <td><div class="ui fluid ${student[st].scores ? ((student[st].scores.status === 1) ? "green disabled" : "disabled") : ""} animated fade button" tabindex="0">
            <div class="visible content">Done?</i></div><div class="hidden content">Save</div></div></td></tr>`
    }
    tablegen += "</tbody>"
    document.querySelector(`#${id}`).innerHTML = tablegen
}
function load_marks_online(id, exam, student) {
    for (st = 0; st < student.length; st++) {
        if (student[st].scores) {
            if (student[st].scores.status === 1) {//p
                $(`#${id} tr[sid=${student[st].studentId}]`).addClass("green");
                $(`#${id} tr[sid=${student[st].studentId}] input[type="checkbox"]`).prop('checked', true);
                examdata = sort(student[st].scores.questions, "questionID")
                for (i = 0; i < examdata.length; i++) {
                    document.querySelectorAll(`#${id} tr[sid="${student[st].studentId}"] input[type="number"]`)[i].value = find_obj_value(examdata, 'questionTitle', `Q${i + 1}`, 'score')
                }
            } else {//a
                $(`#${id} tr[sid=${student[st].studentId}]`).addClass("red");
                document.querySelectorAll(`#${id} tr[sid="${student[st].studentId}"] input[type="number"]`).forEach(e => e.classList.add('disabled'))
                $(`#${id} tr[sid=${student[st].studentId}] input[type="checkbox"]`).prop('checked', false);
            }
        } else {
            $(`#${id} tr[sid=${student[st].studentId}]`).addClass("");
            $(`#${id} tr[sid=${student[st].studentId}] input[type="checkbox"]`).prop('checked', true);
        }
    }
}
function tablelisten(id, exam, student) {
    // document.querySelector('#sx_model .header').innerHTML = `<img class='ui rounded centered image' width="40" src=${chrome.runtime.getURL("images/icon.png")}></img>`
    document.querySelectorAll(`#${id} tr`).forEach(e => e.addEventListener('change', () => {
        m = 0; document.querySelectorAll(`#${id} tr[sid="${e.getAttribute('sid')}"] input[type="number"]`).forEach(mark => m += parseInt(mark.value))
        document.querySelector(`#${id} tr[sid="${e.getAttribute('sid')}"] td:nth-last-child(2)`).innerHTML = m;
        e.classList.contains('green') ? e.classList.remove('green') : ""
        !(e.classList.contains('blue')) ? e.classList.add('blue') : ""
        document.querySelector(`#${id} tr[sid="${e.getAttribute('sid')}"] .animated`).classList.remove('disabled', 'green')
    }))
    document.querySelectorAll(`#${id} tr[sid]`).forEach(e => {
        e.querySelector(`.slider.checkbox`).addEventListener('click', () => {
            x = e.querySelector(`input[type="checkbox"]`);
            inputs = e.querySelectorAll(`input[type="number"]`);
            x.checked ? x.parentNode.parentNode.classList.replace('red', "green") : x.parentNode.parentNode.classList.replace("green", 'red')
            x.checked ? inputs.forEach(i => i.parentNode.classList.remove('disabled')) : inputs.forEach(i => i.parentNode.classList.add('disabled'));
        });
        e.querySelector(`.button`).addEventListener('click', () => {
            btn = e.querySelector(`.button`);
            body = makebody(e, exam, student)
            sucesstoast(e.children[1].innerText, e.children[2].innerText + " saved", 2000);
            xhrst = true
            if (xhrst) {
                console.log(btn, e)
                btn.classList.add('green')
                e.classList.contains('blue') || e.classList.contains('red') ? e.classList.remove('blue', 'red') : ""
                e.classList.add('green')
                btn.classList.contains('disabled') ? "" : btn.classList.add(`disabled`)
            } else {
                btn.classList.contains('red') ? "" : btn.classList.add(`red`)
            }
            // document.querySelector(`tr[sid="${e.getAttribute('sid')}"] .animated`).classList.remove('disabled', 'green')
        })
    })
}
function makebody(trdata, exam, student) {
    suid = trdata.getAttribute('sid')
    arr = []
    maxsum = 0;
    sum = 0;
    trdata.querySelectorAll('input[type="number"]').forEach(e => arr.push(e.value))
    x = { "questions": [] };
    exam.forEach(e => {
        maxsum += e.questionMaxScore
        x.questions.push({
            "questionTitle": `${e.questionTitle}`, "questionID": String(e.questionID), "score": `${arr[parseInt(String(e.questionTitle).replace("Q", "")) - 1]}`
        })
    })
    x.questions.forEach(e => sum += parseInt(e.score))
    present = trdata.querySelector("input[type='checkbox']").checked ? 1 : 2
    body = `
    {
        "data": {
            "studentID": "${suid}",
            "examID": "${payload.examID}",
            "schoolCode": "${payload.schoolCode}",
            "section": "${payload.section}",
            "userMobile": "${payload.userMobile}",
            "teacherCode": "${payload.teacherCode}",
            "teacherName": "${payload.teacherName}",
            "userMedium": "${payload.userMedium}",
            "grade": "${payload.grade}",`
    if (present === 1) {
        body += `
            "scores": { "status": ${parseInt(present)},
                "totalMarks": ${parseInt(maxsum)},
                "obtainedMarks": ${parseInt(sum)},
                "questions":${JSON.stringify(x.questions)}
            }}}`
    } else {
        alert('Please Save manually -- Not Supported Yet!!')
    }
    body = body.replaceAll(/[\n\r]+/g, "");
    console.log(sleep(250).then(() => {
        x = posthttp(`https://saral-bot.convegenius.live/api/save-student-scores?token=${token}`, body)
    }
    ));
}
function sort(data, key) {
    return data.sort((a, b) => parseInt(a[key]) - parseInt(b[key]))
}
//trigger
function loading_data(token) {
    const container = document.querySelector('#sx_model .content')
    lastdata = lastbotmsg()
    const lists = { "schoolCode": "School Code :", "userMobile": "Teacher's Mobile :", "teacherCode": "Teacher's Code :", "teacherName": "Teacher's Name :" }
    //teacher data
    container.appendChild(GetTeacherData(JSON.parse(lastdata[0]), lists))
    document.querySelector(`#activeimport input`).addEventListener('input', () => outputFileContents('activeimport'))
    //GET exam MENU
    fetchmenu(lastdata)
    examdetails(lastdata)
    for (i of lastdata) {
        const payload = JSON.parse(i)
        var id = `${payload.subject.split(" ")[0].split(":")[0].replaceAll(/\s+/g, "_")}_${payload.grade}_${payload.section}_${payload.userMedium}`
        let exam = JSON.parse(httpGet(`https://saral-bot.convegenius.live/api/get-exam-details?token=${token}&examID=${payload.examID}`))
        var student = JSON.parse(httpGet(`https://saral-bot.convegenius.live/api/get-student-list?token=${token}&schoolCode=${payload.schoolCode}&grade=${payload.grade}&section=${payload.section}&examID=${payload.examID}`))
        // chrome.storage.sync.set(JSON.parse(`{${id}: "exam": ${exam},"student":${student}}`))
        fetch_table(`${id}_table`, exam, student)
        tablelisten(`${id}_table`, exam, student)
        load_marks_online(`${id}_table`, exam, student)
        $(`#${id}_table`).tablesort()
    }

    //GET TABLE FOR exam
    // fetch_table(`table class exam name`, exam, student)

    // Activate tab on hover
    $('.top .item').on('mouseenter', function () { $(this).tab('change tab', $(this).attr('id')) });
    // Initialize tabs
    $('.menu .item').tab();
}
function configuration() {
    loading_data(token = 'f9b9ba1f-bf3a-450e-8d67-6c2a9f7977f55')
}


