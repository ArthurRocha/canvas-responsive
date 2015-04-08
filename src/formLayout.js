(function () {
	var flexLayout = {};
	window.flexLayout = flexLayout;
	(function(){
		//*******************************************************************************************************
		//*******	UTIL
		//*******************************************************************************************************
		flexLayout.LUtil = function() {};
		
		flexLayout.LUtil.getOffset = function (el) {
			/*var elRect = el.getBoundingClientRect(); // DESCONSIDERA BARRA DE ROLAGEM
			return { top: elRect.top, left: elRect.left };*/
		    var _left = 0;
		    var _top = 0;
		    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
		        _left += el.offsetLeft; - el.scrollLeft;
		        _top += el.offsetTop; - el.scrollTop;
		        el = el.offsetParent;
		    }
		    return { top: _top, left: _left };
		};
		
		flexLayout.LUtil.delay = (function(){
			var timer = 0;
	       return function(callback, ms){
	    	   clearTimeout (timer);
	           timer = setTimeout(callback, ms);
	       };
		})();
		
		flexLayout.LUtil.getSizeType = function (element, attribute) {
			var value = element.getAttribute(attribute) + '';
			if (value == '' || value.endsWith('%')) {
				return '%';
			} else if (value.endsWith('px')) {
				return 'px';
			}
			return '%'; // default
		};
		
		flexLayout.LUtil.getSizeValueInt = function (value) { // TODO sizeType
			if (value == null) {
				return 100; // 100% default
			}
			value = value + '';
			if (value.endsWith('%')) {
				value = value.substring(0, value.length - 1);
			} else if (value.endsWith('px')) {
				value = value.substring(0, value.length - 2);
			}
			return parseInt(value); // DEFAULT
		};
		
	})();
	
	(function() {
		//*******************************************************************************************************
		//*******	Message
		//*******************************************************************************************************
		var $class = flexLayout.Message = function(type, element, message) {
			$super.constructor.call(this);
			this.type = type;
			this.message = message;
		};
		var $super = Object.prototype, 
			$proto = $class.prototype;
		
		$proto.type = null;
		$proto.message = null;
		$proto.element = null;
		
	})();
	
	(function() {
		//*******************************************************************************************************
		//*******	ChildElement
		//*******************************************************************************************************
		var $class = flexLayout.ChildElement = function () {
			$super.constructor.call(this);
		};
		
		var $super = Object.prototype, 
			$proto = $class.prototype;
		
		$proto.parentLayout = null;
		$proto.node = null;
		$proto.widthType = null;
		$proto.widthValue = null;
		$proto.isLayout = null;
		
		$proto.build = function (parentLayout, node, widthType, widthValue) {
		       this.parentLayout = parentLayout;
		       this.node = node;
		       this.widthType = widthType;
		       this.widthValue = widthValue;
		       this.isLayout = node.hasAttribute('layout');
		       
		       return this;
		   };
		
	})();
	
	(function() {
		//*******************************************************************************************************
		//*******	Line
		//*******************************************************************************************************
		var $class = flexLayout.Line = function(parentLayout) {
			$super.constructor.call(this);
			this.parentLayout = parentLayout;
			this.children = []; // lChildElement
			this.currentX = 0; // Current position
			this.messages = []; // LFormMessage
			this._countChildrenLayout = 0;
		};
		var $super = Object.prototype, 
			$proto = $class.prototype;
		
		$proto.parentLayout = null;
		$proto.children = null;
		$proto.widthLine = null; // ??
		$proto.currentX = null; // ??
		$proto.messages = null;
		$proto._countChildrenLayout = null;
		
		$proto.addElement = function (node, widthType, widthValue) {
			var childElement = new flexLayout.ChildElement();
			childElement.build(this.parentLayout, node, widthType, widthValue);
			if (childElement.isLayout) {
				this._countChildrenLayout++;
			}
			this.children.push(childElement);
		};
		
		$proto.getElements = function () {
			return this.children;
		};
		
		$proto.getElementsLayoutCount = function () {
			return this._countChildrenLayout;
		};
		
		$proto.size = function () {
			return this.children.length;
		};
		
	})();
	
	(function() {
		//*******************************************************************************************************
		//*******	LayoutElement
		//*******************************************************************************************************
		var $class = flexLayout.LayoutElement = function (element) {
			$super.constructor.call(this);
			this.node = element;
			this.isParentAnLayout = element.parentElement.hasAttribute('layout');
		};
		
		var $super = Object.prototype, 
			$proto = $class.prototype;
		
		$proto.node = null;
		$proto.isParentAnLayout = null;
		$proto.lines = null;
		
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
			
			var children = layoutElement.children;
			var layoutWidth = flexLayout.LUtil.getSizeValueInt(layoutElement.style.width);
			this.lines = this.configLines(layoutWidth, children);
			// 50 % do padding aplicado a cada aresta
			_verticalPadding /= 2;
			_horizontalPadding /= 2;
			var linesHeight = this._buildLines(layoutElement, layoutWidth, _horizontalPadding, _verticalPadding);
			layoutElement.style.height = linesHeight + 'px';
		};
		
		$proto.buildLayoutWidth = function (formElement) {
			var parentWidth = formElement.parentElement.offsetWidth;
			var elementWidth;
			var sizeType = flexLayout.LUtil.getSizeType(formElement, 'width');
			var sizeValue = flexLayout.LUtil.getSizeValueInt(formElement.getAttribute('width'));
			if (sizeType === '%') {
				elementWidth = (sizeValue / 100) * parentWidth;
			} else if (sizeType === 'px') {
				elementWidth = sizeValue;
			}
			formElement.style.width = elementWidth + 'px';
		};

		$proto._buildLines = function (layoutElement, layoutWidth, _horizontalPadding, _verticalPadding, avoidBorderPadding) {
			
			var parentOffset = {left : 0, top : 0};
			if (layoutElement.style.position !== 'absolute') {
				parentOffset = flexLayout.LUtil.getOffset(layoutElement);
			}
	//		avoidBorderPadding = avoidBorderPadding && REFAZER PADDING
			var _yPosition = parentOffset.top + (avoidBorderPadding ? 0 : _verticalPadding);
			for (var i = 0 ; i < this.lines.length; i ++ ) {
				var line = this.lines[i];
				var lsElements = line.getElements();
				var childLayoutCount = line.getElementsLayoutCount();
				var lineLength = lsElements.length;
				var lineWidth = layoutWidth;
				var maxHeight = 0;
				var _xPosition = parentOffset.left + (avoidBorderPadding ? 0 : _horizontalPadding);
				for (var indexElement = 0 ; indexElement < lineLength ; indexElement ++ ) {
					var elementConf = lsElements[indexElement]; // {element, widthType, widthValue, width}
					var element = elementConf.node;
					element.style.position = "absolute";
					
					var widthType = elementConf.widthType;
					var widthValue = elementConf.widthValue;
					var elementWidth;
					if (widthType === '%') {
						elementWidth = (widthValue / 100) * lineWidth;
						if (!element.isLayout) {
							elementWidth -= (_horizontalPadding * 2);
						}
					} else {// if (widthType === 'px') {
						elementWidth = widthValue;
					}
					if (indexElement > 0 && !element.isLayout) { // padding left - primeiro item 'padding' calculado na declaração 
						_xPosition += _horizontalPadding;
					}
					
					element.style.left = _xPosition + 'px';
					element.style.width = elementWidth + 'px';
					_xPosition += elementWidth; // element with + padding right
					if (!element.isLayout) {
						_xPosition += _horizontalPadding;
					}
					
					element.style.top = _yPosition + 'px';
					
					if (element.offsetHeight > maxHeight) {
						maxHeight = element.offsetHeight;
					}
				}
				_yPosition += (maxHeight + _verticalPadding);
			}
			return _yPosition - parentOffset.top;
		};
		
		// desconsidera o padding para montagem das linhas, até posicionar os elementos
		$proto.configLines = function (parentWidth, children) {
			var lines = [new flexLayout.Line(this)];
			var _xPosition = 0;
			var countChildrenAsLayout = 0;
			var isChildAnLayout = false;
			for (var i = 0; i < children.length ; i ++ ) {
				var childElement = children[i];
				var currentLine = lines[lines.length - 1]; // lFormLine
				var elementWidth;
				var sizeType = flexLayout.LUtil.getSizeType(childElement, 'width');
				var sizeValue = flexLayout.LUtil.getSizeValueInt(childElement.getAttribute('width'));
				if (sizeType === '%') {
					elementWidth = parentWidth * (sizeValue / 100);
				} else if (sizeType === 'px') {
					elementWidth = sizeValue;
				}
				
				if (_xPosition + elementWidth > parentWidth + 1) {
					_xPosition = 0;
					currentLine = new flexLayout.Line(this);
					lines.push(currentLine);
				}
				// TODO MESSAGES
				// isChildAnLayout
				currentLine.addElement(childElement, sizeType, sizeValue);
				_xPosition = _xPosition + elementWidth
			}
			return lines;
		};
		
	})();
	
	(function() {
		//*******************************************************************************************************
		//*******	Register
		//*******************************************************************************************************
		var $class = flexLayout.Register = function(_element) { // lForm
			$super.constructor.call(this);
			this.rootElement = _element;
		};
		var $super = Object.prototype, 
			$proto = $class.prototype;
	
		$proto.rootElement = null;
		
		$proto.lsForm = null;
		$proto.lsLayoutSchedule = null
		
		$proto.clearElements = function () {
			this.lsForm = [];
			this.lsLayoutSchedule = null;
		};
		
		$proto.findAndProccess = function () {
			if (!this.rootElement) {
				return ;
			}
			this._registerElements(this.rootElement);
		};
		
		$proto.rebuildElements = function () {
			var _lsForm = this.lsForm;
			this.clearElements();
			for (var index = 0 ; index < _lsForm.length ; index++ ) {
				var formElement = _lsForm[index];
				this._scheduleBuildForm(formElement);
			}
		};
		
		$proto._registerElements = function (_rootElement) {
			this.clearElements();
			this._findAndRegisterElements(_rootElement);
		};
		
		$proto._scheduleBuildForm = function (element) {
			var scope = this;
			if (this.lsLayoutSchedule == null) {
				this.lsLayoutSchedule = [];
				setTimeout(
						function(){
							scope._buildForms();
						}, 0);
			}
			this.lsForm.push(element);
			this.lsLayoutSchedule.push(element);
		};
		
		$proto._buildForms = function () {
			var begin = new Date();
			for (var j = 0 ; j < 10 ; j ++) {// TODO IMPLEMENTAR - profundidade máxima simulada 10 - implementar identificação de maior profundidade
				for (var i = 0 ; i < this.lsLayoutSchedule.length ; i++) {
					var element = this.lsLayoutSchedule[i];
					var layoutElement = new flexLayout.LayoutElement(element);
					layoutElement.buildLines();
				}
			}
			console.log((new Date()).getTime() - begin.getTime());
			this.lsLayoutSchedule = null;
		};
		
		$proto._findAndRegisterElements = function (_rootElement) {
			var children = null;
			if (_rootElement == undefined || _rootElement.children == undefined || (children = _rootElement.children).length === 0) {
				return;
			}
			for (var index = 0 ; index < children.length ; index++) {
				var element = children[index];
				this._registerElement(element);
				this._findAndRegisterElements(element);
			}
		};
		
		$proto._registerElement = function (element) {
			if (element) {
				if (element.hasAttribute('layout')) {
					this._scheduleBuildForm(element);
				} else if (element.nodeName === 'INPUT') {
					// TODO
				}
			}
		};
		
	})();
	
	/*
	 * --------------------------------------------------------------------------------------------------------
	 * onLoad - percorre a arvore de componentes e posiciona os elementos por 'x' e 'y'.
	 * --------------------------------------------------------------------------------------------------------
	 */
	(function(){
		//*******************************************************************************************************
		//*******	onLoad
		//*******************************************************************************************************
		
		var flexLayoutResponsive = new flexLayout.Register(document.body);
		window.onload = function() {
			flexLayoutResponsive.findAndProccess();
		};
	
		window.onresize = function () {
			flexLayout.LUtil.delay(function(){
				flexLayoutResponsive.rebuildElements();
			}, 100);
		}
	})();
})();
