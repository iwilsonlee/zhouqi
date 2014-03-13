/**
 * 获取并返回一组checkbox中被选中的值
 * @param objectsArray
 * @returns 被选中的值，如: a,b,c
 */
function getCheckedBoxesValue(objectsArray) {
	var tmpValue = new Array();
	var j = 0;
	for(var i=0;i<objectsArray.length;i++){
		if (objectsArray[i].checked) {
			tmpValue[j] = objectsArray[i].value;
			j++;
		}
	}
	return tmpValue.join();
}

/**
 * 获取jquery.ztree-3.2中所选取的节点的值,以逗号分隔
 * @param treeObj jquery.ztree-3.2树对象
 * @returns 被选中的值，如: a,b,c
 */
function getCheckedNodesValueFromTree(treeObj){
	var nodes = treeObj.getCheckedNodes();
	var tmpValue = new Array();
	if(nodes!=undefined && nodes.length>0){
		for(var i=0;i<nodes.length;i++){
			tmpValue[i] = nodes[i].id;
		}
	}
	return tmpValue.join();
}

/**
 * 刷新验证码图片
 * @param imageId 图片ID
 */
function refreshCaptchaImage(imageId){     
    var imgSrc = $("#"+imageId);     
    var srcTemp = imgSrc.attr("src").split("=");
    //时间戳     
    //为了使每次生成图片不一致，即不让浏览器读缓存，所以需要加上时间戳     
    var timestamp = (new Date()).valueOf();     
    imgSrc.attr("src",srcTemp[0]+"="+timestamp);
}

var digitArray = new Array('0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f');

function toHex( n ) {
	var result = '';
	var start = true;
	
	for ( var i=32; i>0; ) {
		i -= 4;
		var digit = ( n >> i ) & 0xf;
		if (!start || digit != 0) {
		    start = false;
		    result += digitArray[digit];
		}
	}
	
	if(result == ''){
		return '0';
	}else{
		if(result.length==7){
			return '0'+result;
		}else{
			return result;
		}
	}
}