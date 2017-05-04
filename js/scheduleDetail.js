// ダブルクリックによる詳細画面の表示
function initializeDetailFromScheduleClick(date, startTime) {
    
    // 初期表示用開始時間と終了時間
    var endTime = getEndTime(startTime, 60);

    document.getElementById("timeFrom").value   =formatTimeWithColon(startTime);
    document.getElementById("timeTo").value     =formatTimeWithColon(endTime);
    document.getElementById("date").value       =formatDateWithHyphen(date);
    document.getElementById("floatboxId").value ="";
}

// floatboxから予定詳細画面を表示する場合
function initializeDetailFromFloatbox(floatbox) {
    
    for(var i=0; i<scheduleList.length; i++) {
        
        if (floatbox.attr("id")==scheduleList[i].id) {
            
            scheduleDetailDisplay();
            
            document.getElementById("date").value       =scheduleList[i].date;
            document.getElementById("timeFrom").value   =formatTimeWithColon(scheduleList[i].timeFrom);
            document.getElementById("timeTo").value     =formatTimeWithColon(scheduleList[i].timeTo);
            document.getElementById("title").value      =scheduleList[i].title;
            document.getElementById("location").value   =scheduleList[i].location;
            document.getElementById("staff").value      =scheduleList[i].staff;
            document.getElementById("content").value    =scheduleList[i].content;
            document.getElementById("floatboxId").value =scheduleList[i].id;
            
            $( "#modal-close" ).unbind().click( function(){
                // 詳細画面クローズ
                scheduleDetailClose();
            });
            
            //[#modal-overlay]、または[#modal-close]をクリックしたら…
            $( "#modal-overlay" ).unbind().click( function(){

                //[#modal-content]と[#modal-overlay]をフェードアウトした後に…
                $( "#modal-content,#modal-overlay" ).fadeOut( 100 , function(){
                    //[#modal-overlay]を削除する
                    $('#modal-overlay').remove();
                 });
            });
        }
    }
}

// 予定表詳細画面を表示する
function scheduleDetailDisplay() {
    
    if( $( "#modal-overlay" )[0] ) return false;

    //オーバーレイを出現させる
    $( "body" ).append( '<div id="modal-overlay"></div>' );
    $( "#modal-overlay" ).fadeIn( 500 );

    //コンテンツをセンタリングする
    centeringModalSyncer("#modal-content");

    //コンテンツをフェードインする
    $( "#modal-content" ).fadeIn( 500 );
}

// 予定を保存する
function saveSchedule(scheduleDetail) {
    
    scheduleList.push(scheduleDetail);
}


// 予定を更新する。
function updateScheduleByDoubleClick(scheduleDetail) {
    
    for(var i=0; i<scheduleList.length; i++) {
        
        if (scheduleDetail.id==scheduleList[i].id) {
            
            scheduleList[i].date = scheduleDetail.date;
            scheduleList[i].timeFrom = scheduleDetail.timeFrom;
            scheduleList[i].timeTo = scheduleDetail.timeTo;
            scheduleList[i].title = scheduleDetail.title;
            scheduleList[i].location = scheduleDetail.location;
            scheduleList[i].staff = scheduleDetail.staff;
            scheduleList[i].content = scheduleDetail.content;
        }
    }
}

// Floatboxをドラッグ後にスケジュールを更新する
function updateScheduleByDrag(scheduleDetail, targetTD) {
    
    var tdID = targetTD.getAttribute("id");
    
    for(var i=0; i<scheduleList.length; i++) {
        
        if (scheduleDetail.id==scheduleList[i].id) {

            scheduleList[i].timeTo = getEndTime(
                tdID.substr(9,4), 
                getTimeDiff(scheduleDetail.timeFrom, scheduleDetail.timeTo)
            );
            
            scheduleList[i].date = formatDateWithHyphen(tdID.substr(0,8));
            scheduleList[i].timeFrom = tdID.substr(9,4);
            
            scheduleDetail.date = scheduleList[i].date;
            scheduleDetail.timeFrom = scheduleList[i].timeFrom;
            scheduleDetail.timeTo = scheduleList[i].timeTo;
        }
    }
}

// Floatboxをリサイジング後にスケジュールを更新する。
function updateScheduleByResizing(scheduleDetail, time) {
    
    for(var i=0; i<scheduleList.length; i++) {
        
        if (scheduleDetail.id==scheduleList[i].id) {

            scheduleList[i].timeTo = getEndTime(
                scheduleDetail.timeFrom,
                time*30
            );
        }
    }
}

// 予定を削除する。
function deleteSchedule(scheduleDetail) {
    

}

// Floatbox既に作られていたかをチェックする。
function floatboxExists() {
    
    // 予定詳細画面にFloatboxIDを持つかを確認する。
    if (document.getElementById("floatboxId").value == "") {
        return false;
    }
    
    return true;
}

// 詳細画面クローズ
function scheduleDetailClose() {
    
    //[#modal-content]と[#modal-overlay]をフェードアウトした後に…
    $( "#modal-content,#modal-overlay" ).fadeOut( 100 , function(){
        //[#modal-overlay]を削除する
        $('#modal-overlay').remove();
     });

    var scheduleDetail = {};

    // Floatboxが既に存在している場合
    if (floatboxExists()) {
        
        var preDate = getPreDate(document.getElementById("floatboxId").value);

        scheduleDetail = {
            id:         document.getElementById("floatboxId").value,
            date:       document.getElementById("date").value,
            timeFrom:   formatTimeWithoutColon(document.getElementById("timeFrom").value),
            timeTo:     formatTimeWithoutColon(document.getElementById("timeTo").value),
            title:      document.getElementById("title").value,
            location:   document.getElementById("location").value,
            staff:      document.getElementById("staff").value,
            content:    document.getElementById("content").value
        };

        updateScheduleByDoubleClick(scheduleDetail);
        updateDivOfFloatBox(scheduleDetail);
        refreshAllFloatboxByDate(preDate);

    // Floatboxがない場合
    } else {

        floatboxCnt = floatboxCnt + 1;

        scheduleDetail = {
            id:         "floatbox_" + floatboxCnt,
            date:       document.getElementById("date").value,
            timeFrom:   formatTimeWithoutColon(document.getElementById("timeFrom").value),
            timeTo:     formatTimeWithoutColon(document.getElementById("timeTo").value),
            title:      document.getElementById("title").value,
            location:   document.getElementById("location").value,
            staff:      document.getElementById("staff").value,
            content:    document.getElementById("content").value
        };

        // 予定表を保存する
        saveSchedule(scheduleDetail);

        // FloatBox（DIV）を新規作成する。
        createDivOfFloatBox(
            $( "#scheduleBox" ),
            scheduleDetail.id,
            scheduleDetail.title,
            scheduleDetail.location
        );
    }

    var targetTD = $("#" + formatDateWithoutHyphen(scheduleDetail.date) + "_" + scheduleDetail.timeFrom);

    moveFloatbox(targetTD, scheduleDetail);
}

// 更新前日付を取得する
function getPreDate(floatboxID) {
    
    for(var i=0; i<scheduleList.length; i++) {
        
        if (floatboxID==scheduleList[i].id) {
            
            return scheduleList[i].date;
        }
    }
}