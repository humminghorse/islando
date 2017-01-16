'use strict'


window.onload = function Createimg(){
  $.getJSON("https://kojix24.github.io/islando/json/ikuchi.json", function(data){

    var img = document.getElementById("pic");
    // idがmainの要素を取得し、中身をリセットする
    var html = $("#figu");
    var location = $("#loca");

  for (var i = 0; i < data.length; i++){

    // var hoge_2 = $("#jpn");
    // var hoge_3 = $("#eng");

    var img = $("<img></img>", {
        width: 180,
        height: 200,
        src: data[i]["画像URL"],
        alt:  data[i]["名称"]
    });
    html.append(img);

    var hoge = $("<h3>").text(data[i]["名称"]+" "+data[i]["名称(英語)"]);

    html.append(hoge);

    localStorage.setItem("ido"+i,data[i]["緯度"]);
    localStorage.setItem("kei"+i,data[i]["経度"]);

    }
  });
};
