window.onload = function(){
	document.addEventListener("plusready",function(){
      	var main,menu, mask = mui.createMask(closeMenu);
		var showMenu = false,mode = 'main-move';
			 
      	mui.init({
			beforeback: back,
      		swipeBack : false
      	});
      	
      	//添加侧滑
		main = plus.webview.currentWebview();
      	//侧滑菜单默认隐藏，这样可以节省内存；
		menu = mui.preload({
			id: 'menu',
			url:'menu.html',
			styles: {
				left: 0,
				width: '70%',
				zindex: 9997
			}
		});

		function back() {
			if (showMenu) {
				//菜单处于显示状态，返回键应该先关闭菜单,阻止主窗口执行mui.back逻辑；
				closeMenu();
				return false;
			} else {
				//菜单处于隐藏状态，执行返回时，要先close菜单页面，然后继续执行mui.back逻辑关闭主窗口；
				menu.close('none');
				return true;
			}
		}
		/**
		 * 显示菜单菜单
		 */
		function openMenu() {
			if (!showMenu) {
				//侧滑菜单处于隐藏状态，则立即显示出来；
				//显示完毕后，根据不同动画效果移动窗体；
				menu.show('none', 0, function() {
					switch (mode){
						case 'main-move':
							//主窗体开始侧滑；
							main.setStyle({
								left: '70%',
								transition: {
									duration: 150
								}
							});
							break;
						case 'menu-move':
							menu.setStyle({
								left: '0%',
								transition: {
									duration: 150
								}
							});
							break;
						case 'all-move':
							main.setStyle({
								left: '70%',
								transition: {
									duration: 150
								}
							});
							menu.setStyle({
								left: '0%',
								transition: {
									duration: 150
								}
							});
							break;
					}
				});
				//显示遮罩
				mask.show();
				showMenu = true;
			}
		}
		/**
		 * 关闭侧滑菜单
		 */
		function closeMenu() {
			if (showMenu) {
				//关闭遮罩；
				mask.close();
				switch (mode){
					case 'main-move':
						//主窗体开始侧滑；
						main.setStyle({
							left: '0',
							transition: {
								duration: 150
							}
						});
						break;
					case 'menu-move':
						//主窗体开始侧滑；
						menu.setStyle({
							left: '-70%',
							transition: {
								duration: 150
							}
						});
						break;
					case 'all-move':
						//主窗体开始侧滑；
						main.setStyle({
							left: '0',
							transition: {
								duration: 150
							}
						});
						//menu页面同时移动
						menu.setStyle({
							left: '-70%',
							transition: {
								duration: 150
							}
						});
						
						break;
				}
				
				//等窗体动画结束后，隐藏菜单webview，节省资源；
				setTimeout(function() {
					menu.hide();
				}, 200);
				//改变标志位
				showMenu = false;
			}
		}

		 //点击左上角图标，打开侧滑菜单；
		//document.querySelector('.mui-icon-bars').addEventListener('tap', openMenu);
		 //在android4.4中的swipe事件，需要preventDefault一下，否则触发不正常
		 //故，在dragleft，dragright中preventDefault
		window.addEventListener('dragright', function(e) {
			e.detail.gesture.preventDefault();
		});
		window.addEventListener('dragleft', function(e) {
			e.detail.gesture.preventDefault();
		});
		 //主界面向右滑动，若菜单未显示，则显示菜单；否则不做任何操作；
		window.addEventListener("swiperight", openMenu);
		 //主界面向左滑动，若菜单已显示，则关闭菜单；否则，不做任何操作；
		window.addEventListener("swipeleft", closeMenu);
		 //menu页面向左滑动，关闭菜单；
		window.addEventListener("menu:swipeleft", closeMenu);

		//重写mui.menu方法，Android版本menu按键按下可自动打开、关闭侧滑菜单；
		mui.menu = function() {
			if (showMenu) {
				closeMenu();
			} else {
				openMenu();
			}
		};
		
				var backhandel=function() {
					//首页返回键处理
					//处理逻辑：1秒内，连续两次按返回键，则退出应用；
					var first = null;
					plus.key.addEventListener('backbutton', function(){
						//首次按键，提示‘再按一次退出应用’
						if(!first){
							first = new Date().getTime();
							mui.toast('再按一次退出应用');
							setTimeout(function(){
								first = null;
							},1000);
						}else{
							if(new Date().getTime()-first<1000){
								plus.runtime.quit();
							}
						}
					}, false);
					
				}();
				
	      		console.log("window onload main ");
	      		var mydm = new Dmdb();
	      		var dh = DbHelper.instance(mydm.init());
	      		var olist = mui("#order_list")[0];
	      		var cur = plus.webview.currentWebview();
	      		var query_date=cur.query_date,query_type=cur.query_type;
	      		
	      		if(!query_type){
	      			query_type = "date";
	      			query_date = (new Date()).Format("yyyy-MM-dd");
	      		}
      			mui("#query_type")[0].value = query_type;
      			mui("#query_date")[0].type = query_type;
      			mui("#query_date")[0].value = query_date;
	      		window.addEventListener('refresh',btn_queryByDay);
	      		
	      		console.log(mui("#order_list li").length);
	      		var btn_queryByDay = function(args){
	      			var q_date=args?args.query_date:"",q_type=args?args.query_type:"",v_arg={};
	      			var oli=mui("#order_list li");
	      			if(!q_type){
	      				q_type = mui("#query_type")[0].value;
	      				q_date = mui("#query_date")[0].value;
	      			}
	      			console.log("q_date="+q_date);
	      			q_date = new Date(q_date);
	      			console.log("date q_date="+q_date);
	      			var lastday=(getLastDay(q_date.getFullYear(),q_date.getMonth()+1));
	      			if(q_type=="date"){
	      				v_arg.begin = q_date.Format("yyyy-MM-dd");
	      				v_arg.end = q_date.Format("yyyy-MM-dd");
	      			}else if(q_type=="month"){
	      				v_arg.begin = q_date.Format("yyyy-MM-dd");
	      				v_arg.end = (new Date(q_date.getFullYear(),q_date.getMonth(),lastday)). Format("yyyy-MM-dd");
	      			}else{
	      				v_arg.begin = q_date.Format("yyyy-MM-dd");
	      				v_arg.end = (new Date(q_date.getFullYear(),q_date.getMonth()+11,lastday)). Format("yyyy-MM-dd");
	      			}
	      			v_arg.orderby = "desc";
	      			for(var i=0;i<oli.length;i++){
	      				if(oli[i].classList.contains("dm-data")){
	      					oli[i].remove();
	      				}
	      			}
	      			var g = dh.queryOrderByDate(v_arg,function(r){
	      				dh.queryProfitByDate(v_arg,function(arr){
	      					mui("#lr")[0].innerHTML = arr[0].profit;
	      					mui("#mcds")[0].innerHTML = arr[0].mcds;
	      				});
		      			var i=0,k=0;
		      			var eli,ea,ediv,p_tem,edel_btn;
		      			for(i=0;i<r.length;i++){
		      				eli = document.createElement("li");
		      				eli = createDom("li",{className:"dm-data mui-table-view-cell mui-media"});
		      				ea = createDom("a",{href:"##",id:r[i].ordercode});
		      				edel_btn = createDom("a",{className:"mui-btn mui-btn-negative",id:r[i].ordercode,innerHTML:"删除"});
		      				ea.onclick = function(e){
	      						//打开关于页面
								mui.openWindow({
									url: 'total_order.html', 
									id:'edit_order',
									extras:{
										ordercode:this.id
									}
								});
		      				};
		      				edel_btn.onclick = function(e){
	      						//打开关于页面
	      						var v_confirm = confirm("确定要删除：\n订单号：【"+this.id+"】\n的信息吗？");
	      						if(v_confirm){
	      							dh.deleteOrder({ordercode:this.id},function(){
	      								btn_queryByDay();
	      							});
	      						}
		      				};
		      				
		      				ediv = createDom("div",{className:"mui-media-body",innerHTML:r[i].ordercode});
		      				for(k=0;k<r[i].glist.length;k=k+2){
		      					var str = r[i].glist[k].gname+"【"+r[i].glist[k].num_order+"】";
		      					if(r[i].glist[k+1]){
		      						str = str+"\t"+r[i].glist[k+1].gname+"【"+r[i].glist[k+1].num_order+"】";
		      					}
		      					p_tem = createDom("p",{className:"mui-ellipsis",textContent:str});
								ediv.appendChild(p_tem);
			      				console.log("--->["+r[i].glist[k].gname+"]"+"["+r[i].glist[k].num_order+"]");
			      			}
		      				
		      				ea.appendChild(ediv);
		      				eli.appendChild(ea);
		      				eli.appendChild(edel_btn);
		      				olist.appendChild(eli);
		      			}
		      		});
	      		};
	      		btn_queryByDay();
	      		
	      		
	      		mui("#create_order")[0].onclick = function(e){
					//打开关于页面
					mui.openWindow({
						url: 'total_order.html', 
						id:'main_create_order',
						extras:{}
					});
	      		};
	      		
	      		mui("#query_type")[0].onchange = function(e){
	      			console.log(this.value);
	      			if(this.value=="date"){
	      				mui("#query_date")[0].type = "date";
	      				mui("#query_date")[0].value = (new Date()).Format("yyyy-MM-dd");
	      			}else if(this.value=="month"){
	      				mui("#query_date")[0].type = "month";
	      				mui("#query_date")[0].value = (new Date()).Format("yyyy-MM");
	      			}else if(this.value=="text"){
	      				mui("#query_date")[0].type = "text";
	      				mui("#query_date")[0].value = (new Date()).Format("yyyy");
	      			}
	      			btn_queryByDay({query_date:mui("#query_date")[0].value,query_type:mui("#query_type")[0].value});
	      		};
	      		
	      		mui("#query_date")[0].onchange = function(e){
	      			console.log("query_date onchange");
	      			btn_queryByDay({query_date:mui("#query_date")[0].value,query_type:mui("#query_type")[0].value});
	      		};
	      		mui("#query_refresh")[0].onclick = function(e){
	      			btn_queryByDay({query_date:mui("#query_date")[0].value,query_type:mui("#query_type")[0].value});
	      		};
      	},false);}