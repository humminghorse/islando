/*　クエリをセットしてリロード　*/
var setUrlQuery = function(qId){

  window.location.search = qId;
};

/*  URLからクエリ取得  */
var getUrlQuery = function(){
 
  return  window.location.search.substring(1);
};

/* sparql用のurl作成 */
var querySPARQL = function(baseurl, q, callback) {

	var url = baseurl + "?query=" + encodeURIComponent(q) + "&output=json";
	url += "&callback=?";

       return url;					   
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
