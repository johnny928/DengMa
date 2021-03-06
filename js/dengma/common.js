function getArgs( ) {
     var args = new Object( );
     var query = location.search.substring(1);      // Get query string
     var pairs = query.split("&");                  // Break at ampersand
     for(var i = 0; i < pairs.length; i++) {
         var pos = pairs[i].indexOf('=');           // Look for "name=value"
         if (pos == -1) continue;                   // If not found, skip
         var argname = pairs[i].substring(0,pos); // Extract the name
         var value = pairs[i].substring(pos+1);     // Extract the value
         value = decodeURIComponent(value);         // Decode it, if needed
         args[argname] = value;                     // Store as a property
     }
     return args;                                   // Return the object
}

// 对Date的扩展，将 Date 转化为指定格式的String 
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function(fmt) 
{ //author: meizz 
  var o = { 
    "M+" : this.getMonth()+1,                 //月份 
    "d+" : this.getDate(),                    //日 
    "h+" : this.getHours(),                   //小时 
    "m+" : this.getMinutes(),                 //分 
    "s+" : this.getSeconds(),                 //秒 
    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
    "S"  : this.getMilliseconds()             //毫秒 
  }; 
  if(/(y+)/.test(fmt)) 
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o) 
    if(new RegExp("("+ k +")").test(fmt)) 
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
  return fmt; 
}


var sleep = function(sleepTime) {
	for(var start = Date.now(); Date.now() - start <= sleepTime; ) { } 
}

function getLastDay(year,month) { 
	var new_year = year; //取当前的年份 
	var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定） 
	if(month>12) { 
		new_month -=12; //月份减 
		new_year++; //年份增 
	} 
	var new_date = new Date(new_year,new_month,1); //取当年当月中的第一天 
	return (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期 
}