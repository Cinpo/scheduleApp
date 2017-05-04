var scheduleInitialList = [
    {   
        id:"floatbox_1",
        date:"2017-01-10",
        timeFrom:"0900",
        timeTo:"1000",
        title:"金融案件",
        location:"A会議室",
        staff:"鈴木 太郎",
        content:"ヨドバシカメラ金融案件です。ご出席願いいます。"
    },
    {
        id:"floatbox_2",
        date:"2017-01-09",
        timeFrom:"1100",
        timeTo:"1400",
        title:"残課題対応",
        location:"B1会議室",
        staff:"高橋 次郎",
        content:"残課題対応について"
    },
    {
        id:"floatbox_3",
        date:"2017-01-09",
        timeFrom:"1530",
        timeTo:"1630",
        title:"不動産案件",
        location:"B会議室",
        staff:"高橋 次郎",
        content:"NTTデータ不動産案件について"
    },
    {
        id:"floatbox_4",
        date:"2017-01-09",
        timeFrom:"1730",
        timeTo:"1830",
        title:"打ち合わせ",
        location:"B会議室",
        staff:"高橋 次郎",
        content:"NTTデータ不動産案件について"
    },
    {
        id:"floatbox_5",
        date:"2017-01-11",
        timeFrom:"1300",
        timeTo:"1400",
        title:"残課題棚卸し",
        location:"B会議室",
        staff:"高橋 次郎",
        content:"NTTデータ不動産案件について"
    },
    {
        id:"floatbox_6",
        date:"2017-01-13",
        timeFrom:"1300",
        timeTo:"1400",
        title:"年度計画",
        location:"A会議室",
        staff:"高橋 次郎",
        content:"件名通り"
    }
];

// 表示用Floatboxリスト
var scheduleList = [];

// クリックで選択した項目
var selectedItemsList = [];

// コピーされた項目
var copiedItemsList = [];

var selectedTD;

// 予定ボックスの数
var floatboxCnt = 0;