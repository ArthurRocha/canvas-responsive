/**
 *******************************************************************************************************
 *******	Line
 *******************************************************************************************************
 */
(function() {
	var $class = flexLayout.Line = function(parentLayoutElement, horizontalPadding) {
		$super.constructor.call(this);
		this.parentLayoutElement = parentLayoutElement;
		this.parentWidth = parentLayoutElement.node.offsetWidth;
		this._horizontalPadding = horizontalPadding;
		
		this.children = []; // ChildElement
		this._xLastElement = 0; // position of next element on this line
//			this.messages = []; // Message
		this._countChildrenIsAnLayout = 0;
	};
	var $super = Object.prototype, 
		$proto = $class.prototype;
	
	$proto._offset = null;
	$proto.parentLayoutElement = null;
	$proto.parentWidth = null;
	$proto.children = null;
	$proto.height = null;
	$proto._xLastElement = null;
//		$proto.messages = null;
	$proto._countChildrenIsAnLayout = null;
	$proto._horizontalPadding = null
	
	$proto.setOffset = function (_top, _left) {
		this._offset = {'top': _top, 'left': _left};
	};
	
	$proto.getOffsetTop = function () {
		return this._offset.top;
	};
	
	$proto.getOffsetLeft = function () {
		return this._offset.left;
	};

	$proto.addElement = function (node) {
		var declaredTypeWidth = flexLayout.Util.getSizeType(node, 'width');
		var declaredValueWidth = flexLayout.Util.getSizeValueInt(node.getAttribute('width'));
		var elementWidth;
		if (declaredTypeWidth === '%') {
			elementWidth = this.parentWidth * (declaredValueWidth / 100);
		} else if (declaredTypeWidth === 'px') {
			elementWidth = sizeValue;
		}
		if (this._xLastElement + elementWidth > this.parentWidth) {
			return false;
		}
		var nodeIsLayout = node.hasAttribute('layout');
		if (nodeIsLayout) {
			this._countChildrenIsAnLayout++;
		}
		this._xLastElement += elementWidth;
//			this._xLastElement += this._horizontalPadding;
		var childElement = new flexLayout.ChildElement(node, nodeIsLayout, declaredTypeWidth, declaredValueWidth);
		childElement.buildChildAttr();
		
		if (childElement.getHeight() > this.height) {
			this.height = childElement.getHeight();
		}
		
		this.children.push(childElement);
		return true;
	};
	
	$proto.buildLine = function () {
		var _xPosition = this.getOffsetLeft();
		var elements = this.getElements();
		var elementsLayoutCount = this.getElementsLayoutCount();
		if (this.parentLayoutElement.isParentAnLayout) {
//			elementsLayoutCount--;
		}
		var totalWidthWithoutPadding = this.parentWidth;// - (elementsLayoutCount * this._horizontalPadding)
		var lastElementIsLayout = elements[elements.length - 1].isLayout; // childElement
		if (!lastElementIsLayout) {
			totalWidthWithoutPadding -= this._horizontalPadding;
		}
		for (var i = 0 ; i < elements.length; i ++ ) {
			var childElement = elements[i];
			var node = childElement.node;
			node.style.position = "absolute";
			
			var widthType = childElement.widthType;
			var widthValue = childElement.widthValue;
			var elementWidth;
			if (widthType === '%') {
				elementWidth = totalWidthWithoutPadding * (widthValue / 100);
				if (!childElement.isLayout) {
					elementWidth -= (this._horizontalPadding);
				}
			} else {// if (widthType === 'px') {
				elementWidth = widthValue;
			}
			if (!childElement.isLayout) { // padding left - primeiro item 'padding' calculado na declaração 
				_xPosition += this._horizontalPadding;
			}
			
			node.style.width = elementWidth + 'px';
			node.style.top = this.getOffsetTop() + 'px';
			node.style.left = _xPosition + 'px';
			_xPosition += elementWidth; // element with + padding right
		}
		return this.height;
	};
	
	$proto.getElements = function () {
		return this.children;
	};
	
	$proto.getElementsLayoutCount = function () {
		return this._countChildrenIsAnLayout;
	};
	
	$proto.size = function () {
		return this.children.length;
	};
	
})();
