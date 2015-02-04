var DbHelper={
	Dm:null,
	DicSql:{
		Goods:{sql:'select gcode value,gname desc from Goods;',arg:[]},
		Clients:{sql:'select ccode value,cname desc from Clients;',arg:[]},
		Supplier:{sql:'select scode value,sname desc from Supplier;',arg:[]}
	},
	DbControl:null,
	DicCache:{},//{key:[{value:'',desc:''},{value:'',desc:''}]}
	instance:function(dm){
		if(!DbHelper.DbControl){
			DbHelper.Dm = dm;//dm;
			var dbc={};
			dbc.getDic = function(key,cb,flash){
				if(DbHelper.DicCache[key]&&!flash){
					cb(DbHelper.DicCache[key]);
				}
				if(DbHelper.DicSql[key]){
					DbHelper.Dm.DB.query(DbHelper.DicSql[key].sql,DbHelper.DicSql[key].arg,function(arr){
						var d = [];
						for(var i=0;arr&&i<arr.length;i++){
							d.push({value:arr[i].value,desc:arr[i].desc});
						}
						DbHelper.DicCache[key]=d;
						cb(DbHelper.DicCache[key]);
					});
				}else{
					cb(null);
				}
			};
			dbc.getDicValue = function(key,desc,cb,flash){
				var cb_tem = function(){
					var res;
					for(var i=0;i<DbHelper.DicCache[key].length;i++){
						if(desc==DbHelper.DicCache[key][i].desc){
							res = DbHelper.DicCache[key][i].value;
						}
					}
					cb(res);
				}
				if(!DbHelper.DicCache[key]||flash){
					this.getDic(key,function(arr){
						cb_tem();
					},flash);
				}else{
					cb_tem();
				}
			};
			dbc.getDicDesc = function(key,value,cb,flash){
				var cb_tem = function(){
					var res;
					for(var i=0;i<DbHelper.DicCache[key].length;i++){
						if(value==DbHelper.DicCache[key][i].value){
							res = DbHelper.DicCache[key][i].desc;
						}
					}
					cb(res);
				}
				if(!DbHelper.DicCache[key]||flash){
					this.getDic(key,function(arr){
						cb_tem();
					},flash);
				}else{
					cb_tem();
				}
			};
			dbc.queryOrderByDate = function(args,callback){
				//var e = {ordercode:"O-X1",cname:"",totalprice:"总价",glist:[{gname:"",num_order:"6"},{gname:"",num_order:"6"}]};
				var begin=args.begin,end=args.end,orderby=args.orderby;
				var e = {};
				var glist = [];
				//查订单列表（TotalOrder:订单号，客人编号，总价【合计】）
				var olist_sql = "select ordercode,(select cname from clients c where c.ccode=t.ccode) cname,(select sum(selling_price) from orders o where o.ordercode=t.ordercode) totalprice from totalorder t where date(t.createtime)>=date(?) and date(t.createtime)<=date(?) order by t.createtime "+(orderby=="desc"?"desc":"asc")+";";
				//根据订单列表循环，分别查出各订单涉及的商品名与数量
				var glist_sql = "select (select gname from goods g where g.gcode=t.gcode) gname,num_order from orders t where t.ordercode=?;";
				DbHelper.Dm.DB.query(olist_sql,[begin,end],function(arr){
					console.log("[qo]:arr="+arr);
					glist=arr;
					var tem = function(_i){
						DbHelper.Dm.DB.query(glist_sql,[glist[_i].ordercode],function(info){
							glist[_i].glist=info;
							console.log("[qg]:_i="+_i);
							if(_i==(glist.length-1)){
								callback(glist);
							}else{
								tem(_i+1);
							}
						});
					}(0);
				});
				return glist;
			};
			dbc.getOrderDetail = function(ocode,callback){
				var arr = [{sql:"select ordercode,ccode,(select cname from clients a where a.ccode=t.ccode) cname from totalorder t where ordercode=?",args:[ocode]},
					{sql:"select ccode value,cname desc from clients",args:[]},
					{sql:"select (select gname from goods g where g.gcode=t.gcode) gname,gcode,purchase_price,marked_price,selling_price,num_order,freight from orders t where ordercode=?",args:[],setArgs:function(r){
						return [r[0][0].ordercode];
					}}
				];
				DbHelper.Dm.DB.batchSyn(arr,function(r){
						callback({totalorder:r[0],clients:r[1],orders:r[2]});
					});
			}
			DbHelper.DbControl = dbc;
			return dbc;
		}else{
			return DbHelper.DbControl;
		}
	}
}
