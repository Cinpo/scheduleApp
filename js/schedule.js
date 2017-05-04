// マウス通過時
function td_default(tblID){
    var vTd = tblID + " td";
    var vTdCloseOfBusiness = tblID + " td.closeOfBusiness";
    $(vTd).css("background-color","#FFFFFF");
    $(vTdCloseOfBusiness).css("background-color","#DCDCDC");
    
    $(vTd).mouseover(function(){
        $(this).css("background-color","#CCFFCC") .css("cursor","pointer")
    });
    $(vTd).mouseout(function(){
        if ($(this).attr("class") == "closeOfBusiness"){
            $(this).css("background-color","#DCDCDC") .css("cursor","normal")
        } else {
            $(this).css("background-color","#FFFFFF") .css("cursor","normal")
        }
        
    });
}

// シングルクリック
function td_click(tdID){
    tdID.css("background-color","#e49e61");
    tdID.mouseover(function(){
        $(this).css("background-color","#CCFFCC") .css("cursor","pointer")
    });
    tdID.mouseout(function(){
        $(this).css("background-color","#e49e61") .css("cursor","normal")
    })
    
    unselectItem(scheduleDetail);
    selectedTD = tdID;
    
    
    // ダミー
    intialScheduleBoard();
}

// ダブルクリック
function td_dblclick(tdID) {
    
    tdID.blur();
    scheduleDetailDisplay();
    unselectItem(scheduleDetail);
    
    initializeDetailFromScheduleClick(
        tdID.attr("id").substr(0,8),
        tdID.attr("id").substr(9,4)
    );

    //[#modal-overlay]、または[#modal-close]をクリックしたら…
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

// スケジュールボードを初期化する
function intialScheduleBoard() {
    
    var currentDate = new Date();
    var firstDayOfWeek, lastDayOfWeek;
    
    var yobi= new Array("日","月","火","水","木","金","土");
    
    firstDayOfWeek = getFirstDayOfWeek(currentDate);
    
    for (var i=0; i<=7; i++) {
        
        var weekDate = getElapsedDay(firstDayOfWeek, i);

        
        
    }
    
    
}