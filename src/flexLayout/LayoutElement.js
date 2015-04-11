/**
 *******************************************************************************************************
 *******	LayoutElement
 *******************************************************************************************************
 */
(function() {
	var $class = flexLayout.LayoutElement = function (element) {
		$super.constructor.call(this);
		this.node = element;
		this.isParentAnLayout = element.parentElement.hasAttribute('layout');
		this._avoidBorderPadding = this.isParentAnLayout;
	};
	
	var $super = Object.prototype, 
		$proto = $class.prototype;
	
	//	VARS -----------------------------------------------------------------------------------------
	$proto.node = null;
	$proto.isParentAnLayout = null;
	$proto.lines = null;
	$proto._avoidBorderPadding = null;
	
	//	METHODS --------------------------------------------------------------------------------------
	
	// se não possuir o width definido deve assumir o width do style (parametrizar)
	$proto.buildLines = function () {
		var layoutElement = this.node;
		if (!this.isParentAnLayout) {
			this.buildLayoutWidth(layoutElement);
		}
		/*
		 * Os paddings sao aplicados aos filhos que nao sao do tipo layout
		 */
		var _horizontalPadding = 10;
		var _verticalPadding = 10;
		
		//
		this.layoutHeight = this.configLines(layoutElement, _horizontalPadding, _verticalPadding);
		// 50 % do padding aplicado a cada aresta
		/*_verticalPadding /= 2;
		_horizontalPadding /= 2;
		var linesHeight = this._buildLines(layoutElement, layoutWidth, _horizontalPadding, _verticalPadding);
		layoutElement.style.height = linesHeight + 'px';*/
	};
	
	$proto.buildLayoutWidth = function (layoutElement) {
		var parentWidth = layoutElement.parentElement.offsetWidth;
		var elementWidth;
		var sizeType = flexLayout.Util.getSizeType(layoutElement, 'width');
		var sizeValue = flexLayout.Util.getSizeValueInt(layoutElement.getAttribute('width'));
		if (sizeType === '%') {
			elementWidth = (sizeValue / 100) * parentWidth;
		} else if (sizeType === 'px') {
			elementWidth = sizeValue;
		}
		layoutElement.style.width = elementWidth + 'px';
	};
	
	// desconsidera o padding para montagem das linhas, até posicionar os elementos
	$proto.configLines = function (layoutElement, _horizontalPadding, _verticalPadding) {
		
		var parentOffset = {left : 0, top : 0};
		if (layoutElement.style.position !== 'absolute') {
			parentOffset = flexLayout.Util.getOffset(layoutElement);
		}
		
//			var layoutWidth = flexLayout.Util.getSizeValueInt(layoutElement.style.width);
		var _yPosition = parentOffset.top + (this._avoidBorderPadding ? 0 : _verticalPadding);
		var _xPosition = parentOffset.left + (this._avoidBorderPadding ? 0 : _horizontalPadding);
		var children = layoutElement.children;
		var currentLine = new flexLayout.Line(this, _horizontalPadding);
		currentLine.setOffset(_yPosition, _xPosition);
		var lines = [currentLine];
		var layoutHeight = (this._avoidBorderPadding ? 0 : _verticalPadding);
		var elementAdded;
		for (var i = 0; i < children.length ; i ++ ) {
			var childElement = children[i];
			elementAdded = currentLine.addElement(childElement);
			if (!elementAdded) {
				lineHeight = currentLine.buildLine();
				lineHeight += _verticalPadding;
				layoutHeight += lineHeight;
				_yPosition += lineHeight;
				currentLine = new flexLayout.Line(this, _horizontalPadding);
				currentLine.setOffset( { top : _yPosition, left : _xPosition } );
				currentLine.addElement(childElement);
				lines.push(currentLine);
			}
			
		}
		if (elementAdded == true) {
			lineHeight = currentLine.buildLine();
			layoutHeight += lineHeight;
			// TODO ADICIONAR PADDING ?
		}
		return layoutHeight;
		
	};

})();
