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

var getDistance = function(lat1, lng1, lat2, lng2) {
	var dlat = (lat2 - lat1) * Math.PI / 180;
	var dlng = (lng2 - lng1) * Math.PI / 180;
	var a = Math.sin(dlat / 2) * Math.sin(dlat / 2)
		+ Math.cos(lat1 * Math.PI / 180)
		* Math.cos(lat2 * Math.PI / 180)
		* Math.sin(dlng / 2) * Math.sin(dlng / 2);
	return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 6371; // 6371 = R of the Earth in km
};
