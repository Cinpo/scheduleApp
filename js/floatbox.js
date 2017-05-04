// 予定ボックスの新規生成
function moveFloatbox(targetTD, scheduleDetail) {

    var floatbox = $("#" + scheduleDetail.id);
    var handle = $("#" + scheduleDetail.id + " .handle");
    
    var leftDiff, topDiff,
        doc = $(document);
    var mousex, mousey, dragged;
    var hasConflictedItem = false;
    
    // 同一時間帯に別の予定が入った場合に、位置の調整を行う。
    for (var i=0; i<scheduleList.length; i++) {

        if (isConflicted(scheduleDetail, scheduleList[i])) {
            relocateConflictedItemsByIntial(scheduleDetail, scheduleList[i], targetTD);
            hasConflictedItem = true;
            break;
        }
    }
    
    if (!hasConflictedItem) {
        //alert(targetTD.position().left);
        // FloatBoxの位置、幅、高さを設定する。
        floatbox.css({
                    'position':           'absolute', 
                    'background-color':   '#F4F9EE', 
                    'border':             '1px solid gray', 
                    'padding':            '0px', 
                    'z-index':            '1',
                    'top':                targetTD.position().top,
                    'left':               targetTD.position().left,
                    'width':              targetTD.width() + 21,
                    'height':             getHeight(
                                                targetTD, 
                                                scheduleDetail.timeFrom, 
                                                scheduleDetail.timeTo
                                            )
        });
    }
    
    // handle欄のCSS設定値
    $('.handle').css({
                    'background-color':'#B0E0E6',
                    'color':'#000000',
                    'z-index':'1',
                    'padding':'5px 5px 5px',
                    'cursor':'move'
                    });
    
    // メッセージ欄のCSS設定値
    $('.message').css({
                    'padding':'5px',
                    'z-index':'1'
                      });
    
    // ツールチップの初期化定義
    floatbox.tooltip({
                    items: floatbox,
                    track: true,
                    content: updateTooltipContent,
                    show: { effect:"none", delay:0},
                    hide: { when: 'mouseout' }
                    });
    
    
    // ハンドル部分に対するイベント設定
    handle.on("mousedown", mouseDown);
    
    handle.click(function(){
        selectElm(scheduleDetail);
    });
    
    
    // 選択したものの色変更
    function selectElm(scheduleDetail){
        
        var hasAlreadySelected = false;
        
        unselectItem(scheduleDetail);
        
        if (!hasAlreadySelected) {
            floatbox.css('background', '#FFE4C4');
            selectedItemsList.push(scheduleDetail);
        }
        
        
    }

    // ドラッグ中
    function moving(event) {
        
        floatbox.css("left", (event.pageX - leftDiff) + "px")
                .css("top", (event.pageY - topDiff) + "px")
                .css("opacity", 0.7);

        mousex = event.pageX;
        mousey = event.pageY;
        dragged = true;
    }

    // ドラッグ終了時
    function dragEnd() {
        
        var hasConflictedItem = false;
        
        doc.off("mousemove mouseup");
        
        // シングルクリックでドラッグイベントの発生防止
        if (!dragged) return;
        
        floatbox.css("opacity", 1)
                .css("display", "none");
        
        var elm = document.elementFromPoint(mousex, mousey);
        var preDate = scheduleDetail.date;
        
        if (elm.tagName == "TD") {
            
            updateScheduleByDrag(scheduleDetail, elm);
            
            var td = $( "#" + elm.id);

            floatbox.css('top',     td.position().top)
                    .css('left',    td.position().left)
                    .css('width',   td.width() + 21)
                    .css('z-index', 1)
                    .show();

            floatbox.tooltip('enable');
            
        } else if (elm.tagName == "DIV") {
            
            var div;
            
            if (elm.id == "") {
                div = $("#" + elm.parentElement.id);
            } else {
                div = $("#" + elm.id);
            }
            
            div.css("opacity", 1)
               .css("display", "none");
            
            var elm2 = document.elementFromPoint(mousex, mousey);
            var td = $( "#" + elm2.id);
            
            
            updateScheduleByDrag(scheduleDetail, elm2);

            floatbox.css('top',     td.position().top)
                    .css('left',    td.position().left)
                    .css('width',   td.width() + 21)
                    .css('z-index', 1)
                    .show();

            floatbox.tooltip('enable');
            
            div.show();
            
        }
        refreshAllFloatboxByDate(scheduleDetail.date);
        refreshAllFloatboxByDate(preDate);
    }

    // マウスダウン時
    function mouseDown(event) {
        
        floatbox.tooltip('disable');
        floatbox.css('z-index', 10);
        
        dragged = false;
        
        leftDiff = event.pageX - floatbox.offset().left;
        topDiff = event.pageY - floatbox.offset().top;
        doc.on("mousemove", moving)
            .on("mouseup", dragEnd);
        
    }
    
    // .handleをダブルクリックしたらスケジュール詳細を表示させる。
    handle.dblclick(function() {
        initializeDetailFromFloatbox(floatbox);
    });
    
    
    // 縦方向にサイズを変更できるようにする
    floatbox.resizable({
        
        handles: 's',
        resize: function (event, ui) {
            
            var $this = $(event.currentTarget);
            // リアルタイムでツールチップを更新したい場合、下記のコメントを外す。
            //floatbox.tooltip("option", "content", updateTooltipContent);
        }
    });
    
    // ツールチェックの表示を更新する。
    function updateTooltipContent() {
        
        var height = getTargetHeight(floatbox);
        var timeFrom = formatTimeWithColon(scheduleDetail.timeFrom);
        var timeTo = getEndTime(
                        scheduleDetail.timeFrom,
                        height/(targetTD.height()+12) * 30
                     );
        
        return timeFrom + "～" + formatTimeWithColon(timeTo);
    }
    

    var rtime;
    var timeout = false;
    var delta = 100;
    
    // floatbox
    floatbox.resize(function(event) {
        
        // イベントを親要素への伝播することをやめる
        event.stopPropagation();
        
        rtime = new Date();
        if (timeout === false) {
            timeout = true;
            setTimeout(resizeend, delta);
        }
    });
    
    
    // リサイズ終了
    function resizeend() {
        
        // リサイズ中
        if (new Date() - rtime < delta) {
            
            setTimeout(resizeend, delta);
        
        // リサイズ終了時
        } else {
            timeout = false;
            
            var height = getTargetHeight(floatbox);
            var halfHourHeight = targetTD.height()+12;
            
            if (height % halfHourHeight ==0) {
                // ちょうどいいなら高さの補正はしません。
            } else {
                // 高さの補正を行う。
                var heightHosei = height + halfHourHeight - (height % halfHourHeight);
                
                floatbox.css("height", heightHosei);
                floatbox.tooltip("option", "content", updateTooltipContent);
                
                updateScheduleByResizing(scheduleDetail, heightHosei/halfHourHeight);
            }
        }               
    }
    
    
}