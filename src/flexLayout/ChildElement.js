/**
 *******************************************************************************************************
 *******	ChildElement
 *******************************************************************************************************
 */
(function() {
	var $class = flexLayout.ChildElement = function (node, nodeIsLayout, declaredTypeWidth, declaredValueWidth) {
		$super.constructor.call(this);
		this.node = node;
		this.widthType = declaredTypeWidth;
		this.widthValue = declaredValueWidth;
		this.isLayout = nodeIsLayout;
	};
	
	var $super = Object.prototype, 
		$proto = $class.prototype;
	
	$proto.node = null;
	$proto.widthType = null;
	$proto.widthValue = null;
	$proto.isLayout = null;
	
	$proto.buildChildAttr = function () {
	       // TODO LABEL AND MESSAGES
	};
	
	$proto.getHeight = function () {
		// TODO LABEL
		return this.node.offsetHeight;
	};
	
})();
