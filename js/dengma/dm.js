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
							createtime:'TEXT(19)'}},
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
