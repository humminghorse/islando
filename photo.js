'use strict'

window.onload = function Createimg(){
  $.getJSON("./json/ikuchi.json", function(data){

    var img = document.getElementById("pic");
    // idがmainの要素を取得し、中身をリセットする
    var html = $("#figu");
    var location = $("#loca");

  for (var i = 0; i < data.length; i++){

    // var hoge_2 = $("#jpn");
    // var hoge_3 = $("#eng");

    /* 名称を表示 */
    var hoge = $("<h3>").text(data[i]["名称"]+" "+data[i]["名称(英語)"]);
    html.append(hoge);

      var imgdata = data[i]["画像URL"];  

      alert(imgdata);
      
      if(imgdata = "")
	  imgdata = "./img/no_image.png"
      
    /* 画像を表示 */
    var img = $("<img></img>", {
        width: 180,
        height: 200,
        src: imgdata,
        alt:  data[i]["名称"]
    });
    html.append(img);
    html.append("<br>");

      var ido = data[i]["緯度"];
      var kei = data[i]["経度"];
      var naviUrl = "http://maps.google.com/maps?saddr=現在地&daddr="+ido+","+kei+"&dirflag=d";
      var openNavi = "<a href="+naviUrl+">ここへ行く</a>";
      html.append(openNavi)  
      
    localStorage.setItem("ido"+i,data[i]["緯度"]);
    localStorage.setItem("kei"+i,data[i]["経度"]);

    }
  });
};
