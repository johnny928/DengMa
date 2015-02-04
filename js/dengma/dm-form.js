var createDom = function(tname,arr){
	var tem = document.createElement(tname);
	for(var e in arr){
		tem[e] = arr[e];
	};
	return tem;
}
var gselect = function(obj,arr){
	var i=0;
	for(i=obj.length-1;i>=0;i--){
		if(!obj.options[i].classList.contains("dm-not-remove")){
			obj.options.remove(i);
		}
	}
	console.log(arr);
	for(i=0;i<arr.length;i++){
		console.log(arr[i].desc+','+arr[i].value);
		obj.options.add(new Option(arr[i].desc,arr[i].value));
	};
};
var oderDetailList = function(arr){
	var i=0,k=0,oli=mui("#orders_list li"),olist=mui("#orders_list")[0],p_tem,eli,ea,ediv,orders=arr.orders;
	for(i=0;i<oli.length;i++){
		if(oli[i].classList.contains("dm-data")){
			oli[i].remove();
		}
	}
	for(i=0;i<orders.length;i++){
		eli = createDom("li",{className:'dm-data mui-table-view-cell mui-media'});
		ea = createDom("a",{href:"##",id:orders[i].gcode});
		ediv = createDom("div",{className:"mui-media-body"});
		
		p_tem = createDom("span",{textContent:orders[i].gname});
		ediv.appendChild(p_tem);
		
		p_tem = createDom("span",{textContent:("数量："+orders[i].num_order),className:"mui-pull-right"});
		ediv.appendChild(p_tem);
		
		p_tem = createDom("span",{textContent:("售价："+orders[i].selling_price),className:"mui-pull-right"});
		ediv.appendChild(p_tem);
		
		p_tem = createDom("p",{textContent:("入货价："+orders[i].purchase_price+"\t标价："+orders[i].marked_price),className:"mui-ellipsis"});
		ediv.appendChild(p_tem);
		
		ea.appendChild(ediv);
		eli.appendChild(ea);
		olist.appendChild(eli);
	}
	
}
