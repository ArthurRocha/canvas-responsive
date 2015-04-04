(function() {
	var $class = window.lFormMessage = function(type, element, message) {
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
	var $class = window.lFormLine = function() {
		$super.constructor.call(this);
		this.lsElements = []; // DOM Form children 
		this.currentX = 0; // Current position
		this.messages = []; // lFormMessage
	};
	var $super = Object.prototype, 
		$proto = $class.prototype;
	
	$proto.lsElements = null;
	$proto.widthLine = null; // ??
	$proto.currentX = null; // ??
	$proto.messages = null;
	
	$proto.addElement = function (element, widthType, widthValue, width) { // TODO REMOVE WIDTH
		this.lsElements.push({	'element':element, 
								'widthType':widthType, 
								'widthValue':widthValue,
								'width': width
								});
	};
	
	$proto.length = function () {
		return this.lsElements.length;
	};
	
})();

(function() {
	var $class = window.ResponsiveLayout = function(_element) { // lForm
		$super.constructor.call(this);
		this.rootElement = _element;
	};
	var $super = Object.prototype, 
		$proto = $class.prototype;

	$proto.rootElement = null;
	
	$proto.lsForm = null;
	$proto.lsFormSchedule = null
	
	$proto.clearElements = function () {
		this.lsForm = [];
		this.lsFormSchedule = null;
	};
	
	$proto.build = function () {
		if (!this.rootElement) {
			return ;
		}
		this.registerElements(this.rootElement);
	};
	
	//*******************************************************************************************************
	//*******	LFORM
	//*******************************************************************************************************
	/*
	 * CHILDREN - DIV
	 * 
	 * width
	 * height
	 * align = top / button / middle
	 * 
	 * 
	 * 
	 */
	$proto.rebuildElements = function () {
		var _lsForm = this.lsForm;
		this.clearElements();
		for (var index = 0 ; index < _lsForm.length ; index++ ) {
			var formElement = _lsForm[index];
			this._scheduleBuildForm(formElement);
		}
	};
	
	$proto._scheduleBuildForm = function (element) {
		var scope = this;
		if (this.lsFormSchedule == null) {
			this.lsFormSchedule = [];
			setTimeout(
					function(){
						scope._buildForms();
					}, 0);
		}
		this.lsForm.push(element);
		this.lsFormSchedule.push(element);
	};
	
	$proto._buildForms = function () {
		for (var i = 0 ; i < this.lsFormSchedule.length ; i++) {
			var formElement = this.lsFormSchedule[i];
			this.buildLayoutOffset(formElement); // set time out para renderizar os forms?
		}
		this.lsFormSchedule = null;
	};
	// TODO form para layout e processar form de verdade
	$proto.buildLayoutOffset = function (layoutElement) {
		//WIDTH
		// if parent is an form return because this size was setted by this parent
		if (!layoutElement.parentElement.hasAttribute('layout')) {
			this.buildLayoutWidth(layoutElement);
		}
		var _horizontalPadding = 10;
		var _verticalPadding = 10;
		
		var children = layoutElement.children;
		var layoutWidth = this.getSizeValueInt(layoutElement.style.width);
		var _xPosition = 0;
		var lines = [new lFormLine()];
		for (var i = 0; i < children.length ; i ++ ) {
			var child = children[i];
			_xPosition = this.configLines(lines, child, layoutWidth, _xPosition);
		}
		
		var linesHeight = this.buildLines(layoutElement, lines, layoutWidth, _horizontalPadding, 10);
		layoutElement.style.height = linesHeight + 'px';
		//HEIGHT
//		var maxHeight = formElement.parentElement.offsetHeight;
//		var heightRequired;
//		sizeType = this.getSizeType(formElement, 'height');
//		sizeValue = this.getSizeValueInt(formElement.getAttribute('height'));
//		if (sizeType === '%') {
//			heightRequired = (sizeValue / 100) * maxHeight;
//		} else if (sizeType === 'px') {
//			heightRequired = sizeValue;
//		}
//		formElement.style.height = heightRequired + 'px';
		
//		var offset = this.getOffset(canvasElement);
//		canvasElement.style.position = "absolute";
//		canvasElement.style.left = offset.left + 'px';
//		canvasElement.style.top = offset.top + 'px';
//		canvasElement.style.top = offset.top + 'px';
	};
	
	$proto.buildLayoutWidth = function (formElement) {
		var parentWidth = formElement.parentElement.offsetWidth;
		var elementWidth;
		var sizeType = this.getSizeType(formElement, 'width');
		var sizeValue = this.getSizeValueInt(formElement.getAttribute('width'));
		if (sizeType === '%') {
			elementWidth = (sizeValue / 100) * parentWidth;
		} else if (sizeType === 'px') {
			elementWidth = sizeValue;
		}
		formElement.style.width = elementWidth + 'px';
	};
	
	$proto.buildLines = function (layoutElement, lines, layoutWidth, _horizontalPadding, _verticalPadding) {
		var parentOffset = {left : 0, top : 0};
		if (layoutElement.style.position !== 'absolute') {
			parentOffset = LUtil.getOffset(layoutElement);
		}
		var _yPosition = parentOffset.top;
		for (var i = 0 ; i < lines.length; i ++ ) {
			var line = lines[i];
			var lsElements = line.lsElements;
			var lineLength = lsElements.length;
			var lineWidth = layoutWidth - ((lineLength - 1) * _horizontalPadding);
			var maxHeight = 0;
			var _xPosition = parentOffset.left;
			for (var indexElement = 0 ; indexElement < lineLength ; indexElement ++ ) {
				var elementConf = lsElements[indexElement]; // {element, widthType, widthValue, width}
				var element = elementConf.element;
				var widthType = elementConf.widthType;
				var widthValue = elementConf.widthValue;
				var elementWidth;
				if (widthType === '%') {
					elementWidth = (widthValue / 100) * lineWidth;
				} else {// if (widthType === 'px') {
					elementWidth = widthValue;
				}
				element.style.position = "absolute";
				element.style.left = _xPosition + 'px';
				element.style.top = _yPosition + 'px';
				element.style.width = elementWidth + 'px';
				_xPosition += (elementWidth + _horizontalPadding);
				
				if (element.offsetHeight > maxHeight) {
					maxHeight = element.offsetHeight;
				}
			}
			_yPosition += (maxHeight + _verticalPadding);
		}
		return _yPosition - parentOffset.top;
	};
	
	// desconsidera o padding para montagem das linhas, até posicionar os elementos
	$proto.configLines = function (lines, childElement, parentWidth, _xPosition) {
		var currentLine = lines[lines.length - 1]; // lFormLine
		var elementWidth;
		var sizeType = this.getSizeType(childElement, 'width');
		var sizeValue = this.getSizeValueInt(childElement.getAttribute('width'));
		if (sizeType === '%') {
			elementWidth = parentWidth * (sizeValue / 100);
		} else if (sizeType === 'px') {
			elementWidth = sizeValue;
		}
		
		if (_xPosition + elementWidth > parentWidth) {
			_xPosition = 0;
			currentLine = new lFormLine();
			lines.push(currentLine);
		}
		// TODO MESSAGES
		currentLine.addElement(childElement, sizeType, sizeValue);
		return _xPosition + elementWidth;
	};
	
	$proto.getSizeType = function (element, attribute) {
		var value = element.getAttribute(attribute) + '';
		if (value == '' || value.endsWith('%')) {
			return '%';
		} else if (value.endsWith('px')) {
			return 'px';
		}
		return '%'; // default
	};
	
	$proto.getSizeValueInt = function (value) { // TODO sizeType
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
	
	//*******************************************************************************************************
	//*******	REGISTER
	//*******************************************************************************************************
	
	
	$proto.registerElements = function (_rootElement) {
		this.clearElements();
		this._findAndRegisterElements(_rootElement);
	};
	
	$proto._findAndRegisterElements = function (_rootElement) {
		var children = null;
		if (_rootElement == undefined || _rootElement.children == undefined || (children = _rootElement.children).length === 0) {
			return;
		}
		for (var index = 0 ; index < children.length ; index++) {
			var element = children[index];
			this.registerElement(element);
			this._findAndRegisterElements(element);
		}
	};
	
	$proto.registerElement = function (element) {
		if (element) {
			if (element.hasAttribute('layout')) {
				this._scheduleBuildForm(element);
			} else if (element.nodeName === 'INPUT') {
				// TODO
			}
		}
	};
	
})();

(function(){
	//*******************************************************************************************************
	//*******	UTIL
	//*******************************************************************************************************
	window.LUtil = function () {};

	LUtil.getOffset = function ( el ) {
	    var _x = 0;
	    var _y = 0;
	    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
	        _x += el.offsetLeft; - el.scrollLeft;
	        _y += el.offsetTop; - el.scrollTop;
	        el = el.offsetParent;
	    }
	    return { top: _y, left: _x };
	};
	
	LUtil.delay = (function(){
		var timer = 0;
       return function(callback, ms){
    	   clearTimeout (timer);
           timer = setTimeout(callback, ms);
       };
	})();
})();
/*
 * --------------------------------------------------------------------------------------------------------
 * onLoad - percorre a arvore de componentes e posiciona-os 'x' e 'y'.
 * --------------------------------------------------------------------------------------------------------
 */
(function(){
	window.rl = new ResponsiveLayout(document.body);
	window.onload = function() {
		this.rl.build();
	};

	window.onresize = function () {
		LUtil.delay(function(){
			window.rl.rebuildElements();
		}, 100);
	}
})();
