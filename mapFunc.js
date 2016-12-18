
//var ikedaLatLng = new google.maps.LatLng(35.890358,136.344221);

//var onomichiLatLng = new google.maps.LatLng(34.404839,133.193653);

//生口島　34.292832,133.106863

function initMap(){

    var mapId ={
	zoom: 12,
	center: new google.maps.LatLng(34.292832,133.106863)
    };

    map = new google.maps.Map(document.getElementById("map"),mapId);
}

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
function setGeoMarker(r, lat, lng){

     var latlng = new google.maps.LatLng(lat,lng);
     var image = {
         url:"img/group.jpg",
	 scaledSize : new google.maps.Size(32, 32)
     }
    
    if(gpsMarker == null){
    
　　　gpsMarker = new google.maps.Marker({
	position: latlng,
	map: map,
	icon:image
    　});
    } else{
       /* GPSの位置更新  */
	gpsMarker.setPosition(latlng);
    }
    
    
    google.maps.event.addListener(gpsMarker,'mouseover',function(){
        infoWindow.open(map, gpsMarker);
    });

    google.maps.event.addListener(gpsMarker,'mouseout',function(){
	infoWindow.close();
    });

    var infoWindow = new google.maps.InfoWindow({
	content: "現在地"
    });

 /*   
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
*/
}

var dist1sw = 0;
var dist2sw = 0;
var dist3sw = 0;
var spot = 0;

function getCSV(latitude,longitude){
    var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
    req.open("get", "./data/art.csv", true); // アクセスするファイルを指定
    req.send(null); // HTTPリクエストの発行
	
    // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ	
    req.onload = function(){
	convertCSVtoArray(req.responseText,gPos); // 渡されるのは読み込んだCSVデータ
    }
}

// 読み込んだCSVデータを二次元配列に変換する関数convertCSVtoArray()の定義
function convertCSVtoArray(str,pos){ // 読み込んだCSVデータが文字列として渡される
    var result = []; // 最終的な二次元配列を入れるための配列
    var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成
    var dist = 500;
    var tmpdist;
    var tmpspot;
 
    // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
    for(var i=0;i<tmp.length;++i){
        result[i] = tmp[i].split(',');
    }

    var img = setIconImage(getUqueryToType());
    for(var i=0;i<tmp.length;++i){
        setMarker(result[i][1],result[i][2],result[i][3],"http://maps.google.co.jp/mapfiles/ms/icons/red-dot.png");
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

function goVibrate(dist) {
    var vibrate = navigator.vibrate || navigator.mozVibrate;

    if (dist >= 500) {
        return;
    }
    if (dist < 100) {
        if (dist1sw == 0) {
            navigator.vibrate([1000,100,1000,10,1000,10,1000,10,1000]);
            dist1sw = 1;
        }
    } else if (dist < 300) {
        if (dist2sw == 0) {
            navigator.vibrate([1000,100,1000,10,1000]);
            dist2sw = 1;
        }
    } else if (dist < 500) {
        if (dist3sw == 0) {
            navigator.vibrate(1000);
            dist3sw = 1;
        }
    }
}



