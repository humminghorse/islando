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
