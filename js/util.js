// HHMMと経過時間（分単位）からHHMM形式の終了時間を返却する
function getEndTime(startTime, 	elapsedTime) {
    
    var date = new Date();
    date.setHours(startTime.substr(0,2));
    date.setMinutes(startTime.substr(2,2));

    date.setMinutes(date.getMinutes() + elapsedTime);
    
    return ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2);
}

// 指定日と経過日から結果日を返却する
function getElapsedDay(startDay, elapsedDay) {
    
    var date = new Date();
    date.setFullYear(startDay.getFullYear());
    date.setMonth(startDay.getMonth());
    date.setDate(startDay.getDate() + elapsedDay);
    
    return date;
}

// 画面のセンタリングを実行する関数
function centeringModalSyncer(tagId) {

    //画面(ウィンドウ)の幅、高さを取得
    var w = $( window ).width() ;
    var h = $( window ).height() ;

    // コンテンツ(#modal-content)の幅、高さを取得
    var cw = $( tagId ).outerWidth();
    var ch = $( tagId).outerHeight();

    //センタリングを実行する
    $( tagId ).css( {"left": ((w - cw)/2) + "px","top": ((h - ch)/2) + "px"} ) ;

}

// 年月日時分秒からDate型日付を取得する
function getDate(year, month, day, hour, minute, second) {
    
    var date = new Date();
    
    date.setFullYear(year);
    date.setMonth(month);
    date.setDate(day);
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(second);
    
    return date;
}

// 高さの取得
function getHeight(targetTD, timeFrom, timeTo) {
    
    var dtFrom = getDate(2017,
                         1, 
                         targetTD.attr("id").substr(0,2), 
                         timeFrom.substr(0,2), 
                         timeFrom.substr(2,2), 
                         0);
    
    var dtTo = getDate(2017,
                       1,
                       targetTD.attr("id").substr(0,2),
                       timeTo.substr(0,2),
                       timeTo.substr(2,2),
                       0);
    
    
    return ((dtTo-dtFrom)/(1000*60)) * ((targetTD.height()+12)/30);
}

// floatboxを新規作成する。
function createDivOfFloatBox(parent, floatboxID, title, location) {
    
    parent.append("<div id='" + floatboxID + "'><div class='handle'>" + title + "</div><div class='message'>" + location + "</div></div>"); 
}

// floatboxを更新する。
function updateDivOfFloatBox(scheduleDetail) {
    
    $("#" + scheduleDetail.id + " div.handle").text(scheduleDetail.title);
    $("#" + scheduleDetail.id + " div.message").text(scheduleDetail.location);
}

// 時間差を取得する
function getTimeDiff(startTime, endTime) {
    
    var startDate = new Date();
    startDate.setHours(startTime.substr(0,2));
    startDate.setMinutes(startTime.substr(2,2));
    
    var endDate = new Date();
    endDate.setHours(endTime.substr(0,2));
    endDate.setMinutes(endTime.substr(2,2));
    
    return (endDate-startDate)/(1000*60);
}

// yyyymmddをyyyy-mm-ddに変換
function formatDateWithHyphen(date) {
    return date.substr(0,4) + "-" + date.substr(4, 2) + "-" + date.substr(6, 2);
}

// yyyy-mm-ddをyyyymmddに変換
function formatDateWithoutHyphen(date) {
    return date.replace(/-/g , "" );
}

// HHMMをHH:MMに変換
function formatTimeWithColon(time) {
    return time.substr(0,2) + ":" + time.substr(2, 2);
}

// HH:MMをHHMMに変換
function formatTimeWithoutColon(time) {
    return time.replace(/:/g , "" );
}

// 対象項目の高さを取得する
function getTargetHeight(target) {
    
    return Number(target.css("height").replace(/px/g , "" ));
}

// 画面リサイズ後に全FloatBox再表示する。
function reloadAllFloatbox(event) {
    
    for(var i=0; i<scheduleList.length; i++) {
        
        var tdID = formatDateWithoutHyphen(scheduleList[i].date) + 
                                                             "_" + 
                                                             scheduleList[i].timeFrom;
        
        var targetTD = $("#" + tdID);
        var floatbox = $("#" + scheduleList[i].id);
        
        // 時間の差を高さに変換する。
        var height = getTimeDiff(
                                scheduleList[i].timeFrom, 
                                scheduleList[i].timeTo
                                )/30 * (getTargetHeight(targetTD)+12);
        
        var hasConflictedItem = false;
        for (var j=0; j<scheduleList.length; j++) {
            
            if (isConflicted(scheduleList[i], scheduleList[j])) {
                relocateConflictedItemsByIntial(scheduleList[i], scheduleList[j], targetTD);
                hasConflictedItem = true;
                break;
            }
        }
        
        if (!hasConflictedItem) {
            //alert(targetTD.position().left);
            // FloatBoxの位置、幅、高さを設定する。
            floatbox.css({
                        'top':      targetTD.position().top,
                        'left':     targetTD.position().left,
                        'width':    targetTD.width() + 21,
                        'height':   height
            });
        }
        
    }
}

// 全Floatboxをロードする
function loadAllFloatbox() {
    
    floatboxCnt = scheduleInitialList.length;
    
    for(var i=0; i<scheduleInitialList.length; i++) {
        
        createDivOfFloatBox(
                $( "#scheduleBox" ),
                scheduleInitialList[i].id,
                scheduleInitialList[i].title,
                scheduleInitialList[i].location
        );
        var targetTD = $("#" + 
                         formatDateWithoutHyphen(scheduleInitialList[i].date) + 
                         "_" + 
                         scheduleInitialList[i].timeFrom);
        
        saveSchedule(scheduleInitialList[i]);
        
        moveFloatbox(targetTD, scheduleInitialList[i]);
    }
}

// 同一時間帯に別の予定が存在するかをチェックする
function isConflicted(schedule1, schedule2) {
    
    // 日が別、また自分自身の場合、比較せずに終了
    if (schedule1.date != schedule2.date || schedule1.id == schedule2.id) return false;
    
    var dateFrom1 = getDate(
                        schedule1.date.substr(0,4),
                        schedule1.date.substr(5,2),
                        schedule1.date.substr(8,2),
                        schedule1.timeFrom.substr(0,2),
                        schedule1.timeFrom.substr(2,2),
                        0);
    
    var dateFrom2 = getDate(
                        schedule2.date.substr(0,4),
                        schedule2.date.substr(5,2),
                        schedule2.date.substr(8,2),
                        schedule2.timeFrom.substr(0,2),
                        schedule2.timeFrom.substr(2,2),
                        0);
    
    var dateTo1 = getDate(
                        schedule1.date.substr(0,4),
                        schedule1.date.substr(5,2),
                        schedule1.date.substr(8,2),
                        schedule1.timeTo.substr(0,2),
                        schedule1.timeTo.substr(2,2),
                        0);
    
    var dateTo2 = getDate(
                        schedule2.date.substr(0,4),
                        schedule2.date.substr(5,2),
                        schedule2.date.substr(8,2),
                        schedule2.timeTo.substr(0,2),
                        schedule2.timeTo.substr(2,2),
                        0);
    
    if (dateFrom1.getTime()==dateFrom2.getTime() || 
        dateTo1.getTime()==dateTo2.getTime())       return true;
    
    if (dateFrom1.getTime() < dateFrom2.getTime() &&
        dateTo1.getTime() > dateFrom2.getTime())   return true;
    
    if (dateFrom1.getTime() > dateFrom2.getTime() &&
        dateFrom1.getTime() < dateTo2.getTime())       return true;

    return false;
}

// 同一時間帯に別の予定が入った場合に、floatboxのサイズを調整する。
function relocateConflictedItems(scheduleDetail1, scheduleDetail2, elm) {
    var floatbox1 = $("#"+scheduleDetail1.id);
    var floatbox2 = $("#"+scheduleDetail2.id);
    var td = $( "#" + elm.id);
    
    if (scheduleDetail1.timeFrom <= scheduleDetail2.timeFrom) {
        
        floatbox1.css('top',    td.position().top)
                 .css('left',    td.position().left)
                 .css('width',   (td.width() + 21)/2)
                 .css('z-index', 1)
                 .tooltip('enable')
                 .show();


        floatbox2.css('left',    td.position().left+(td.width() + 22)/2)
                 .css('width',   (td.width() + 21)/2);
        
    } else {
        
        floatbox1.css('top',    td.position().top)
                 .css('left',    td.position().left + (td.width() + 21)/2)
                 .css('width',   (td.width() + 21)/2)
                 .css('z-index', 1)
                 .tooltip('enable')
                 .show();
        
        floatbox2.css('width',   (td.width() + 21)/2);
    }
}

// コンフリクト項目を再配置する。
function relocateConflictedItemsByIntial(scheduleDetail1, scheduleDetail2, elm) {
    var floatbox1 = $("#"+scheduleDetail1.id);
    var floatbox2 = $("#"+scheduleDetail2.id);
    var td = $( "#" + elm.id);
    
    if (scheduleDetail1.timeFrom < scheduleDetail2.timeFrom) {
        
        // FloatBoxの位置、幅、高さを設定する。
        floatbox1.css({
                    'position':           'absolute', 
                    'background-color':   '#F4F9EE', 
                    'border':             '1px solid gray', 
                    'padding':            '0px', 
                    'z-index':            '1',
                    'top':                elm.position().top,
                    'left':               elm.position().left,
                    'width':              (elm.width() + 21)/2,
                    'height':             getHeight(
                                                elm, 
                                                scheduleDetail1.timeFrom, 
                                                scheduleDetail1.timeTo
                                            )
        });
        
    } else if (scheduleDetail1.timeFrom > scheduleDetail2.timeFrom) {
        
        // FloatBoxの位置、幅、高さを設定する。
        floatbox1.css({
                    'position':           'absolute', 
                    'background-color':   '#F4F9EE', 
                    'border':             '1px solid gray', 
                    'padding':            '0px', 
                    'z-index':            '1',
                    'top':                elm.position().top,
                    'left':               elm.position().left + (elm.width() + 21)/2,
                    'width':              (elm.width() + 21)/2,
                    'height':             getHeight(
                                                elm, 
                                                scheduleDetail1.timeFrom, 
                                                scheduleDetail1.timeTo
                                            )
        });
        
    } else {
        
        if (floatbox1.attr("id") < floatbox2.attr("id")) {
            
            // FloatBoxの位置、幅、高さを設定する。
            floatbox1.css({
                        'position':           'absolute', 
                        'background-color':   '#F4F9EE', 
                        'border':             '1px solid gray', 
                        'padding':            '0px', 
                        'z-index':            '1',
                        'top':                elm.position().top,
                        'left':               elm.position().left,
                        'width':              (elm.width() + 21)/2,
                        'height':             getHeight(
                                                    elm, 
                                                    scheduleDetail1.timeFrom, 
                                                    scheduleDetail1.timeTo
                                                )
            });
            
        } else {
            
            // FloatBoxの位置、幅、高さを設定する。
            floatbox1.css({
                        'position':           'absolute', 
                        'background-color':   '#F4F9EE', 
                        'border':             '1px solid gray', 
                        'padding':            '0px', 
                        'z-index':            '1',
                        'top':                elm.position().top,
                        'left':               elm.position().left + (elm.width() + 21)/2,
                        'width':              (elm.width() + 21)/2,
                        'height':             getHeight(
                                                    elm, 
                                                    scheduleDetail1.timeFrom, 
                                                    scheduleDetail1.timeTo
                                                )
            });
            
        }
        
    }
}

// 指定日の全floatboxをリフレッシュする。
function refreshAllFloatboxByDate(date) {
    
    for (var i=0; i<scheduleList.length; i++) {
        
        if (scheduleList[i].date == date) {
            
            var targetTD = $("#" + formatDateWithoutHyphen(scheduleList[i].date) + "_" + scheduleList[i].timeFrom);
            
            var hasConflictedItem = false;
            
            for (var j=0; j<scheduleList.length; j++)  {
                
                if (scheduleList[j].date == date) {
                    
                    if (isConflicted(scheduleList[i], scheduleList[j])) {
                        relocateConflictedItemsByIntial(scheduleList[i], scheduleList[j], targetTD);
                        hasConflictedItem = true;
                    }
                }
            }
            
            if (!hasConflictedItem) {
                $("#" + scheduleList[i].id).css({
                                                 'width': targetTD.width()+21,
                                                 'left':targetTD.position().left
                                                })
            }
        }
        
    }
    
}

// 選択済みの項目を非選択する
function unselectItem(scheduleDetail) {
    for (var i=0; i<selectedItemsList.length; i++) {
        var floatbox = $("#" + selectedItemsList[i].id);
        floatbox.css('background-color', '#F4F9EE');
    }
    selectedItemsList = [];
}

// 指定日の週間の初日を取得する
function getFirstDayOfWeek(targetDate) {
    
    var resultDate = new Date();
    resultDate.setFullYear(targetDate.getFullYear());
    resultDate.setMonth(targetDate.getMonth());
    resultDate.setDate(targetDate.getDate());
    
    var week = targetDate.getDay();
    
    resultDate.setDate(resultDate.getDate() - week);
    
    return resultDate;
}

// 指定日の週間の最終日を取得する
function getLastDayOfWeek(targetDate) {
    
    var resultDate = targetDate;
    resultDate.setFullYear(targetDate.getFullYear());
    resultDate.setMonth(targetDate.getMonth());
    resultDate.setDate(targetDate.getDate());
    
    var week = targetDate.getDay();
    
    resultDate.setDate(resultDate.getDate() + (7 - week));
    
    return resultDate;
}