$(window).keyup(function(e){
    
    // Deleteボタン
    if(e.keyCode == 46) {
        var mousex = e.pageX;
        var mousey = e.pageY;
        
        for (var i=0; i<selectedItemsList.length; i++) {
            
            deleteSelectedItem(selectedItemsList[i]);
        }
    }
});

// 項目削除
function deleteSelectedItem(selectedItem) {
    
    // 削除対象要素
    var elm = document.getElementById(selectedItem.id);
    
    //自分を削除
    elm.parentNode.removeChild(elm);
    
    for (var i=0; i<scheduleList.length; i++) {
        
        if (selectedItem.id == scheduleList[i].id) {
            
            scheduleList.splice(i,1);
            
            return;
        }
        
    }
}

// Ctrl+C & Ctrl+Vの対応
$(window).keydown(function(e){
   
    if(e.ctrlKey) {
        
        // Cキーの場合
        if(e.keyCode == 67) { 
            
            updateCopiedItems(selectedItemsList);
        
        // Vキーの場合
        } else if(e.keyCode == 86) {
            
            pasteCopiedItems();
            
        }
    }
});

// コピーリスト更新
function updateCopiedItems(selectedItemsList) {
    
    // コピーリスト初期化
    copiedItemsList = [];
    
    for (var i=0; i<selectedItemsList.length; i++) {
        copiedItemsList.push(selectedItemsList[i]);
    }
}

// コピー済みの項目をペストする
function pasteCopiedItems() {
    
    for(var i=0; i<copiedItemsList.length; i++) {
        
        var scheduleDetail = {};
        floatboxCnt = floatboxCnt + 1;
        
        scheduleDetail = {
            id:         "floatbox_" + floatboxCnt,
            date:       formatDateWithHyphen(selectedTD.attr("id").substr(0,8)),
            timeFrom:   selectedTD.attr("id").substr(9,4),
            timeTo:     getEndTime(
                            selectedTD.attr("id").substr(9,4), 
                            getTimeDiff(copiedItemsList[i].timeFrom, copiedItemsList[i].timeTo)
                        ),
            title:      copiedItemsList[i].title,
            location:   copiedItemsList[i].location,
            staff:      copiedItemsList[i].staff,
            content:    copiedItemsList[i].content
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
        
        moveFloatbox(selectedTD, scheduleDetail);
    }
}



