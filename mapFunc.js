//var ikedaLatLng = new google.maps.LatLng(35.890358,136.344221);

//var onomichiLatLng = new google.maps.LatLng(34.404839,133.193653);

var defpos = [34.300451, 133.147356,"生口島北インターチェンジ"];

var map;

function initMap(){
  if (navigator.geolocation) {
       navigator.geolocation.watchPosition(
       function(pos) {
	       
        showItems(pos.coords.latitude,pos.coords.longitude);

             /*test用*/
//	      showItems(defpos[0], defpos[1]);	    
	},
	function(err) {
        	var errmes = [ "", "許可されてません", "判定できません", "タイムアウト" ];
		console.log(errmes[err]);
		ignoreGPS();
          },
	  {
		enableHighAccuracy: true,
		timeout: 10000, // タイムアウト10秒
		maximumAge: 0 // nmsec前のデータを使う、0でキャッシュしない
	   }
	);
	} else {
		ignoreGPS();
    }
};

var ignoreGPS = function() {
	alert("位置が取得できません。\n" + defpos[2] + "にいるとして調べます");
	showItems(defpos[0], defpos[1]);
};

var showItems = function(clat,clng) {

   var mapId ={
       zoom: 14,
       center: new google.maps.LatLng(clat,clng),
       mapTypeControlOptions: {
       mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
       }
    };

    map = new google.maps.Map(document.getElementById("map"),mapId);

    var styleOptions = [
    {
      "stylers": [
    { "weight": 3.1 },
    { "saturation": 42 },
    { "lightness": 23 },
    { "hue": "#ffcc00" },
    { "gamma": 0.84 }
    ]
    }
    ]
    
    var styledMapOptions = { name: '現在地' }
    var sampleType = new google.maps.StyledMapType(styleOptions, styledMapOptions);
    map.mapTypes.set('map_style', sampleType);
    map.setMapTypeId('map_style');

    setGeoMarker(clat,clng);

    loadArtObj();
};

var loadArtObj = function() {
	var url = "data/art.csv";
	getCSV(url, function(data) {
        for(var i=0;i<data.length;++i){
           setMarker(data[i][1],data[i][2],data[i][3],setIconImgArt(i));
          }
        });
};

var setArtStaticMap = function(mQuery) {
    var APIKEY = "AIzaSyD3infBvJeAdiM6KqqBTS0i5jCnzIDWp8o";
    var s = "https://maps.googleapis.com/maps/api/staticmap?";
    s += "key=" + APIKEY + "&";
    s+= "size=600x300&scale=2&zoom=12&maptype=roadmap&";
    s += "center=34.292832%2C133.106863&"
    s += mQuery;
    s += "sensor=false";

    var gmap = document.getElementById("gmap");
    gmap.src = s;
};    

/*公共クラウドの全国データ*/
function setMarkerTS(name,lat, lng, info, link){

    var latlng = new google.maps.LatLng(lat,lng);
    var marker = new google.maps.Marker({
	position: latlng,
	map: map
    });

    var s = name; 
    if(link){
	s = '<a traget=_blank href='+link+'>'+name+'</a>';
    }
    if(info){
	s += '<div class="marker">'+info+'</div>';
    }

    var infoWindow = new google.maps.InfoWindow({
	content: s
            
    });
    
    google.maps.event.addListener(marker,'mouseover',function(){
	infoWindow.open(map, marker);
    });

    google.maps.event.addListener(marker,'mouseout',function(){
	infoWindow.close();
    });
}

/*名称と緯度・経度のみ表示*/
function setMarker(label,lat, lng, img){

    var latlng = new google.maps.LatLng(lat,lng);
/*    var image = {
	url:img,
	scaledSize : new google.maps.Size(32, 32)
	}*/
    var marker = new google.maps.Marker({
	position: latlng,
	map: map,
	icon:img
    });

    var s = label; 

    var infoWindow = new google.maps.InfoWindow({
	content: s
     });
    
    google.maps.event.addListener(marker,'mouseover',function(){
	infoWindow.open(map, marker);
    });

    google.maps.event.addListener(marker,'mouseout',function(){
	infoWindow.close();
    });

}

var gpsMarker = null;

/*GPSの位置表示*/
function setGeoMarker(lat, lng){

     var latlng = new google.maps.LatLng(lat,lng);
     var image = {
         url:"img/group.jpg",
	 scaledSize : new google.maps.Size(32, 32)
     }
    
    if(gpsMarker){
	gpsMarker.setMap(null);
    }
　　　gpsMarker = new google.maps.Marker({
	position: latlng,
	map: map,
	icon:image
    　});
   
/*    google.maps.event.addListener(gpsMarker,'mouseover',function(){
        infoWindow.open(map, gpsMarker);
    });

    google.maps.event.addListener(gpsMarker,'mouseout',function(){
	infoWindow.close();
    });

    var infoWindow = new google.maps.InfoWindow({
	content: "現在地"
    });
*/

  google.maps.event.addListener(gpsMarker,'click',function(){
      if(window.confirm("Instagramで投稿しますか？")){
          location.href = "instagram://app";
      }
  });

    
    new google.maps.Circle({
         map: map,
         center: latlng,
         radius: 500, // 単位はメートル
         strokeColor: '#0088ff',
         strokeOpacity: 0.8,
         strokeWeight: 1,
         fillColor: '#0088ff',
         fillOpacity: 0.2
    });

}

var dist1sw = 0;
var dist2sw = 0;
var dist3sw = 0;
var spot = 0;

/*
function getCSV(fileurl){
    var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
    req.open("get", fileurl, true); // アクセスするファイルを指定
    req.send(null); // HTTPリクエストの発行

    // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ	
    req.onload = function(){
        convertCSVtoArray2(req.responseText); // GPSデータとの距離計算あり

/*        if(type == "range")
            convertCSVtoArray(req.responseText,gPos); // GPSデータとの距離計算あり
	else
	   convertCSVtoArray2(req.responseText); // pin表示のみ 
    }
};
*/


// 読み込んだCSVデータを二次元配列に変換する関数convertCSVtoArray()の定義
function convertCSVtoArray2(str){ // 読み込んだCSVデータが文字列として渡される
    var result = []; // 最終的な二次元配列を入れるための配列
    var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成
 
    // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
    for(var i=0;i<tmp.length;++i){
        result[i] = tmp[i].split(',');
    }

    var img = "http://maps.google.co.jp/mapfiles/ms/icons/blue-dot.png";
    
    for(var i=0;i<tmp.length;++i){
        setMarker(result[i][1],result[i][2],result[i][3], img);
    } 
    // alert(result2[1][2]); 
    
};


// 読み込んだCSVデータを二次元配列に変換する関数convertCSVtoArray()の定義
function convertCSVtoArray(str,pos){ // 読み込んだCSVデータが文字列として渡される
    var result = []; // 最終的な二次元配列を入れるための配列
    var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成
    var dist = 0.500;
    var tmpdist;
    var tmpspot;
 
    // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
    for(var i=0;i<tmp.length;++i){
        result[i] = tmp[i].split(',');
    }

    var img = setIconImage(getUqueryToType());
    for(var i=0;i<tmp.length;++i){
//        setMarker(result[i][1],result[i][2],result[i][3],"http://maps.google.co.jp/mapfiles/ms/icons/red-dot.png");
        setMarker(result[i][1],result[i][2],result[i][3],setIconImageArt(result[i][0]));
        tmpdist = getDistance(pos.coords.latitude,pos.coords.longitude,result[i][2],result[i][3]);
        if (tmpdist < dist) {
            tmpspot = result[i][0];
            dist = tmpdist;
        }
    }
    
    if (tmpspot != spot) {
        spot = tmpspot;
        dist1sw = 0;
        dist2sw = 0;
        dist3sw = 0;
    }

    goVibrate(dist);

    // alert(result[1][2]); 
    
}

function getCSV_underground(){
    var req2 = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
    req2.open("get", "./data/underground.csv", true); // アクセスするファイルを指定
    req2.send(null); // HTTPリクエストの発行

    // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ   
    req2.onload = function(){
    convertCSVtoArray2(req2.responseText); // 渡されるのは読み込んだCSVデータ
    }
}


function goVibrate(dist) {
    var vibrate = navigator.vibrate || navigator.mozVibrate;

    if (dist >= 0.500) {
        return;
    }
    if (dist < 0.100) {
        if (dist1sw == 0) {
            navigator.vibrate([1000,1000,1000,100,1000,100,1000,100,1000]);
            dist1sw = 1;
        }
    } else if (dist < 0.300) {
        if (dist2sw == 0) {
            navigator.vibrate([1000,100,1000,100,1000]);
            dist2sw = 1;
        }
    } else if (dist < 0.500) {
        if (dist3sw == 0) {
            navigator.vibrate(1000);
            dist3sw = 1;
        }
    }
}

function setIconImgArt(no){

	if (no == 0)
               return {
 		   url:"img/0.png",
                   scaledSize : new google.maps.Size(30, 30)
                }
	if (no == 1)
               return {
 		   url:"img/1.png",
                  scaledSize : new google.maps.Size(30, 30)
                }
	if (no == 2)
               return {
 		   url:"img/2.png",
                   scaledSize : new google.maps.Size(30, 30)
                }
	if (no == 3)
               return {
 		   url: "img/3.png",
                   scaledSize : new google.maps.Size(30, 30)
                }
	if (no == 4)
               return {
 		   url: "img/4.png",
		   scaledSize : new google.maps.Size(30, 30)
                }
	if (no == 5)
               return {
 		   url: "img/5.png",
                   scaledSize : new google.maps.Size(30, 30)
                }
  	if (no == 6)
               return {
 		   url: "img/6.png",
                   scaledSize : new google.maps.Size(30, 30)
                }
  	if (no == 7)
               return {
 		   url: "img/7.png",
                   scaledSize : new google.maps.Size(30, 30)
                }
  	if (no == 8)
               return {
 		   url: "img/8.png",
                   scaledSize : new google.maps.Size(30, 30)
                }
  	if (no == 9)
               return {
 		   url: "img/9.png",
                   scaledSize : new google.maps.Size(30, 30)
                }
  	if (no == 10)
               return {
 		   url: "img/10.png",
                   scaledSize : new google.maps.Size(30, 30)
                }
  	if (no == 11)
               return {
 		   url: "img/11.png",
                   scaledSize : new google.maps.Size(30, 30)
                }
  	if (no == 12)
               return {
 		   url: "img/12.png",
                   scaledSize : new google.maps.Size(30, 30)
                }
  	if (no == 13)
               return {
 		   url: "img/13.png",
                   scaledSize : new google.maps.Size(30, 30)
                }
  	if (no == 14)
               return {
 		   url: "img/14.png",
                   scaledSize : new google.maps.Size(30, 30)
                }
  	if (no == 15)
               return {
 		   url: "img/15.png",
                   scaledSize : new google.maps.Size(30, 30)
                }
  	if (no == 16)
               return {
 		   url: "img/16.png",
                   scaledSize : new google.maps.Size(30, 30)
                }
        return "http://maps.google.co.jp/mapfiles/ms/icons/red-dot.png";
};

var getHTTP = function(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
	if (xhr.readyState == 4) {
		if (xhr.status == 0) {
			alert("通信に失敗しました。再読込してください。");
		} else {
         		if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
				//alert("受信:" + xhr.responseText);
         			callback(xhr.responseText);
			} else {
				alert("通信に失敗しました。再読込してください。<br>" + xhr.status);
			}
		}
	}
	};
	xhr.open("GET" , url);
	var senddata = null; // "送信テスト";
	xhr.send(senddata);
};

var getCSV = function(url, callback) {
	getHTTP(url, function(data) {
		var ss = data.split('\n');
		var list = [];
		for (var i = 0; i < ss.length; i++) {
			var ss2 = ss[i].split(',');
			list.push(ss2);
		}
            console.log(list);
		callback(list);
	});
};
