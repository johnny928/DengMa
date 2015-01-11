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

function Dmdb(arr,cb){
	// 建立数据库
	// 注意：建立数据库是同步操作
	this.DB= WebsqlWrapper({
	      name: 'DMDB'
	    , displayName:'DengMa Database'
	    , version:'1.0'
	    , debug: true
	})
};
Dmdb.prototype = {
	Tables: [{name:"Clients",cols:{id:'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
									ccode:'TEXT(20) NOT NULL',
									cname:'TEXT(50) NOT NULL',
									desc:'TEXT(1000)',
									createtime:'TEXT(19)'}},
			{name:"Goods",cols:{id:'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
							gcode:'TEXT(20) NOT NULL',
							gname:'TEXT(200) NOT NULL',
							desc:'TEXT(1000)',
							remain:'INTEGER NOT NULL DEFAULT 0',
							createtime:'TEXT(19)',
							updatetime:'TEXT(19)'}},
			{name:"Orders",cols:{id:'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
							ordercode:'TEXT(50) NOT NULL',
							ccode:'TEXT(20)',
							gcode:'TEXT(20) NOT NULL',
							scode:'TEXT(20)',
							purchase_price:'INTEGER',
							marked_price:'INTEGER',
							selling_price:'INTEGER',
							freight:'INTEGER',
							num_order:'INTEGER',
							haspaid:'INTEGER NOT NULL',
							delivery_time:'TEXT(19)',
							active:'INTEGER NOT NULL',
							ordertime:'TEXT(19)',
							createtime:'TEXT(19)'}},
			{name:"Supplier",cols:{id:'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
									scode:'TEXT(20) NOT NULL',
									sname:'TEXT(200) NOT NULL',
									desc:'TEXT(1000)',
									createtime:'TEXT(19)'}},
			{name:"TotalOrder",cols:{id:'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
									ordercode:'TEXT(50) NOT NULL',
									ccode:'TEXT(20) NOT NULL',
									createtime:'TEXT(19) NOT NULL'}}
	],
	getFromA: function(arr,key){
		for(var i=0;i<arr.length;i++){
			var e = arr[i];
			if(e.name.toUpperCase()==key.toUpperCase()) return e;
		}
		return null;
	},
	tableCon: function(tbname,callback){
		var e = this.getFromA(this.Tables,tbname);
		this.DB.define(e.name,e.cols,callback);
	}
}
