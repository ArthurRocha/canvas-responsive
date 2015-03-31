// http://www.w3schools.com/html/html5_canvas.asp
// testar com x e y
/*
//--------CONTAGEM DE FILHOS
var count = 0;
function countChildren(element) {
	var children = element.children;
	if (!children || children.length === 0) {
		return;
	}
	count += children.length
	for (var index = 0 ; index < children.length ; index++) {
		countChildren(children[index])
	}
};
countChildren(document.body);
console.log(count);
 */

//		NORMALIZE
//(function() {
//	 String.prototype.makeSuffixRegExp = function (suffix, caseInsensitive) {
//	  return new RegExp(
//	      String(suffix).replace(/[$%()*+.?\[\\\]{|}]/g, "\\$&") + "$",
//	      caseInsensitive ? "i" : "");
//	}
//	String.prototype.endsWith = function(suffix) { // TODO COMPARE PERFORMANCE
//	    //return this.indexOf(suffix, this.length - suffix.length) !== -1;
//		// str.lastIndexOf(suffix) == str.length - suffix.length
////		return this.match("^" + suffix) !== null;
//		return String.prototype.makeSuffixRegExp(this, false).test(suffix);
//	};
//})();
//

/*
 * TODO - REACT
 * 
 * Rever questão de mover elemento para uma DIV - posição relativa de cada Canvas para seus filhos
 * 
 * 
 * EVENTO RESIZE
 * 
 * cada Canvas possui seu DIV correspondente
 * cada filho do canvas possui um rectangle correspondente?
 * 
 * INPUT
 * mensagem inline - balão - TODO - Material Google
 * 
 * DRAG AND DROP - conversa para troca de filhos entre elementos canvas
 * 	<canvas drag-drop
 * 	<canvas drag  
 * 	<canvas drop
 * 	canDrag - poder soltar - encaixar - sinalizar areas com css
 * 
 * EVENTOS DE SINALIZAÇÃO PARA O USUARIO
 * - CIRCULAR ELEMENTOS - FORMAR CÍRCULO POR VOLTA DOS ELEMENTOS
 * - BRILHO POR VOLTA DOS ELEMENTOS
 * - PISCAR
 * 
 * 
 * 
 * http://code.tutsplus.com/articles/21-ridiculously-impressive-html5-canvas-experiments--net-14210
 * 
 */
(function() {
	var $class = window.DefaultAttributeValues = function(sourceAttrName, targetAttrName, value) {
// $super.constructor.call(this);
		this.sourceAttrName = sourceAttrName; 
		this.targetAttrName = targetAttrName; 
		this.value = value;
	};
	var $proto = $class.prototype;

	$proto.sourceAttrName = null;
	$proto.targetAttrName = null;
	$proto.value = null;
	
})();

(function() {
	var $class = window.ResponsiveLayout = function(_element) {
		$super.constructor.call(this);
		this.rootElement = _element;
	};
	var $super = Object.prototype, 
		$proto = $class.prototype;

	$proto.rootElement = null;
//	$proto.parentNode = null;
	
	$proto.lsCanvas = null;
	$proto.lsVirtualCanvas = null;
	$proto.scheduleCanvas = null
	$proto.isBuildingVirtualTree = false;
	
	$proto.clearElements = function () {
		this.lsCanvas = [];
		this.lsVirtualCanvas = [];
		this.scheduleCanvas = null;
	};
	
	$proto.build = function () {
		if (!this.rootElement) {
			return ;
		}
		this.discoverElements();
	};
	
	//*******************************************************************************************************
	//*******	CONFIG DEFAULTS - TODO
	//*******************************************************************************************************
	
	$proto.configDefaultAttributes = function (child, defaultAttributes) {
		if (child.hasAttribute('width-default')) {
			var widthDefault = child['width-default'];
			widthDefault  = widthDefault + '%';
			this.recursiveDefaultValue(child, 'width', widthDefault);
		}
		if (child.hasAttribute('height-default')) {
			var heightDefault = child['height-default'];
			heightDefault = heightDefault + '%';
			this.recursiveDefaultValue(child, 'height', heightDefault);
		}
		var scope = this;
		(function (){
			var children = child.children;
			for (var index = 0 ; index < children.length ; index++) {
				var element = children[index];
				this.configDefaultAttributes(element, defaultAttributes);
			}
		})();
	};
	
	$proto.recursiveDefaultValue = function (targetElement, property, defaultValue) {
		if (targetElement) {
			var scope = this;
			(function (){
				if (!targetElement.hasAttribute(property)) {
					targetElement[property] = defaultValue;
				}
				if (targetElement.children) {
					for (var index = 0 ; index < targetElement.children.length ; index++) {
						scope.recursiveDefaultValue(targetElement.children[index], property, defaultValue);
					}
				}
			})();
		}
	};
	
	//*******************************************************************************************************
	//*******	CANVAS
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
	/*$proto.rebuildCanvasElements = function () {
		for (var index = 0 ; index < this.lsCanvas.lenght ; index++ ) {
			var canvasElement = this.lsCanvas[index];
			this._scheduleBuildCanvas(canvasElement);
		}
	};*/
	
	$proto._scheduleBuildCanvas = function (canvasElement) {
		var scope = this;
		if (this.scheduleCanvas == null) {
			this.scheduleCanvas = [];
			setTimeout(
					function(){
						scope._buildScheduledCanvas();
					}, 0);
		}
		if (!this.isBuildingVirtualTree) {
			this.lsCanvas.push(canvasElement);
			this.scheduleCanvas.push(canvasElement);
		}
	};
	
	$proto._buildScheduledCanvas = function () {
		for (var i = 0 ; i < this.scheduleCanvas.length ; i++) {
			var canvasElement = this.scheduleCanvas[i];
			var height = this._buildCanvasChildren(canvasElement);
			// TODO HEIGHT SCHEDULE
//			setTimeout(
//			function(){
//					canvasElement.style.height = heigth;
//					OR
//					scope._buildCanvasHeight(canvasElement, height);
//			}, 0);
		}
		this.scheduleCanvas = null;
	}
	
	/**
	 * line
	 * free
	 * física - mole, gelatinoso /com impacto e impulso
	 */
	$proto.getCanvasAlignType = function (canvasElement) {
		var layout = canvasElement.getAttribute('layout');
		return layout ? layout : 'line';
	};
	
	$proto._buildCanvasChildren = function (canvasElement) {
		var layout = this.getCanvasAlignType(canvasElement);
		if (layout === 'line') {
			this._printElementLines(canvasElement);
		} else if (layout === 'free') {
			alert('not implemented yet!');
		}
	};
	
	$proto._printElementLines = function(canvasElement) {
		var maxWidth = this.getLineWidth(canvasElement); // TODO não existe barra de rolagem
		var parentWidth = 100; // TODO
		var _xCurrent = 0;
		var _yCurrent = 0;
		var _xNextLine = 0; // CONSTANT - TODO PADDING
		var _yNextLine = 0;
		var widthRequired = null;
		var heightRequired = null;
		var element = null;
		var children = canvasElement.children;
		for (var index = 0 ; index < children.length ; index++) {
			element = children[index];
			if (!element) {
				alert('remover o TODO');
				continue ; // TODO ALGUMA VEZ EU ENTRO AQUI?
			}
			element.style.position = "absolute";
			
			//height
//			this._buildCanvasChildHeight(element, parentSize, _xNear, _yNear)
			;
//			if (true /*line break*/) {
//				_yCurrent
//			}
			
			// -------------------------------- TODO
//			var sizeType = this.getSizeType(element, 'height');
//			var sizeValue = this.getRelativeValueInt(element.getAttribute('height'));
//			if () {
//				
//			}
			heightRequired = 25;// TODO INPUT DIV AND OTHERS DEFAULT element.style.height;
			//width 
//			this._buildCanvasChildWidth(element, parentSize, _xNear, _yNear);
//			if (!element.hasAttribute('width')) {
//				return ;
//			}
			var sizeType = this.getSizeType(element, 'width');
			var sizeValue = this.getRelativeValueInt(element.getAttribute('width'));
			if (sizeType === '%') {
				widthRequired = (sizeValue / 100) * maxWidth;
			} else if (sizeType === 'px') {
				widthRequired = sizeValue;
			}
			if (_xCurrent + widthRequired > maxWidth) { // next line
				_xCurrent = _xNextLine;
				_yCurrent = _yNextLine;
				_yNextLine += element.style.height; // TODO CHECK
			}
			// --------------------------------
			element.style.width = widthRequired + 'px';
			element.style.left = _xCurrent + 'px';
			element.style.top = _yCurrent + 'px';
			_xCurrent += widthRequired;
			if (_yCurrent + heightRequired > _yNextLine) {
				_yNextLine = _yCurrent + heightRequired;
			}
		}
	};
	
	$proto._buildCanvasChildWidth = function(element) {
	};
	
	$proto._buildCanvasChildHeight = function () {
	}
	
	$proto.getLineWidth = function (element) {
		return this.getRelativeValueInt(element.style.width); // TODO
	}
	
	$proto.getSizeType = function (element, attribute) {
		var value = element.getAttribute(attribute) + '';
		if (value.endsWith('%')) {
			return '%';
		} else if (value.endsWith('%')) {
			return 'px';
		}
		return '%'; // DEFAULT
	};
	
	$proto.getRelativeValueInt = function (value) { // TODO sizeType
		if (!value) {
			return 100; // 100% default
		}
		if (value.endsWith('%')) {
			value = value.substring(0, value.length - 1);
		} else if (value.endsWith('px')) {
			value = value.substring(0, value.length - 2);
		}
		return parseInt(value); // DEFAULT
	};
	
	//*******************************************************************************************************
	//*******	DISCOVER
	//*******************************************************************************************************
	
	
	$proto.discoverElements = function () {
		this.clearElements();
		this._discoverAndRegisterElements(this.rootElement);
		this.createVirtualCanvas();
	};
	
	$proto.createVirtualCanvas = function () {
		var scope = this;
		setTimeout(function() {
			scope.isBuildingVirtualTree = true;
			for (var indexCanvas = 0 ; indexCanvas < scope.lsCanvas.length ; indexCanvas++) {
				var canvasElement = scope.lsCanvas[indexCanvas];
				var virtualCanvas = document.createElement("DIV");
				var lsChildrenTemp = []
				var offset = scope.getOffset(canvasElement);
				virtualCanvas.style.position = "absolute";
				virtualCanvas.style.left = offset.left + 'px';
				virtualCanvas.style.top = offset.top + 'px';
				// remove
				virtualCanvas.style.border = '1px solid red';
				// - remove
				for (var indexRegister = 0 ; indexRegister < canvasElement.children.length ; indexRegister ++ ) {
					lsChildrenTemp.push(canvasElement.children[indexRegister]);
				}
				for (var indexAppend = 0 ; indexAppend < lsChildrenTemp.length ; indexAppend ++ ) {
					virtualCanvas.appendChild(lsChildrenTemp[indexAppend]);
				}
				scope.lsVirtualCanvas.push(virtualCanvas);
			}
			for (var i = 0 ; i < scope.lsVirtualCanvas.length ; i ++ ) {
				scope.rootElement.appendChild(scope.lsVirtualCanvas[i]);
			}
			scope.isBuildingVirtualTree = false;
//			scope.rootElement.appendChild(scope.parentNode);
		}, 0);
	};
	
	$proto._discoverAndRegisterElements = function (_rootElement) {
		var children = null;
		if (!_rootElement || !_rootElement.children || (children = _rootElement.children).length === 0) {
			return;
		}
		for (var index = 0 ; index < children.length ; index++) {
			var element = children[index];
			this.registerElement(element);
			this._discoverAndRegisterElements(element);
		}
	};
	
	$proto.registerElement = function (element) {
		if (element) {
			if (element.nodeName === 'CANVAS') {
				this._scheduleBuildCanvas(element);
			} else if (element.nodeName === 'INPUT') {
				// TODO
			}
		}
	};
	
	$proto._findElementsByNodeName = function (children, _nodeName, _lsElements) {
		if (!children || children.length === 0) {
			return _lsElements;
		}
		var scope = this;
		(function (){
			for (var index = 0 ; index < children.length ; index++) {
				var element = children[index];
				if (element.nodeName === _nodeName) {
					_lsElements.push(element);
				}
				_lsElements = scope._findElementsByNodeName(element.children, _nodeName, _lsElements);
			}
		})();
		return _lsElements;
	};
	
	//var x = getOffset( document.getElementById('yourElId') ).left;
//	var rect = element.getBoundingClientRect();
//	console.log(rect.top, rect.right, rect.bottom, rect.left);
	$proto.getOffset = function ( el ) {
	    var _x = 0;
	    var _y = 0;
	    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
	        _x += el.offsetLeft - el.scrollLeft;
	        _y += el.offsetTop - el.scrollTop;
	        el = el.offsetParent;
	    }
	    return { top: _y, left: _x };
	};
	
})();

/*
 * --------------------------------------------------------------------------------------------------------
 * onLoad - percorre a arvore de componentes e posiciona-os 'x' e 'y'.
 * --------------------------------------------------------------------------------------------------------
 */
window.onload = function() {
	var rl = window.rl = new ResponsiveLayout(document.body);
	rl.build();
	
	var _appendChild = Element.prototype.appendChild;
	Element.prototype.appendChild = function(){
		var element = arguments[0];
		window.rl.registerElement(element); // timeout dom changed event -
		_appendChild.apply(this, arguments);
	}
	// ------------------------------------------------------------------------------
	// -------------------------- TESTS
	// ------------------------------------------------------------------------------
	/*
	 * TODO UM CANVAS DENTRO DE OUTRO
	 */
//	(function() {
//		(function() {
//			var $class = window.ExampleClass1 = function() {
//				$super.constructor.call(this);
//				console.log('Construtor default');
//			};
//			var $super = Object.prototype, $proto = $class.prototype;
//
//			$proto.aCertainPublicField = null;
//		})();
//		var node = document.createElement("LI"); // Create a <li> node
//		var textnode = document.createTextNode("Water"); // Create a text node
//	 node.appendChild(textnode); // Append the text to <li> // TODO TESTAR APPEND
//	 document.getElementById("div1").appendChild(node); // Append <li> to <ul>
//	// with id="myList"
//	})();
};

(function() {
	// ------------------------------------------------------------------------------
	// -------------------------- TESTS
	// ------------------------------------------------------------------------------
	/*
	 * TODO UM CANVAS DENTRO DE OUTRO
	 */
//	(function() {
//		(function() {
//			var $class = window.ExampleClass1 = function() {
//				$super.constructor.call(this);
//				console.log('Construtor default');
//			};
//			var $super = Object.prototype, $proto = $class.prototype;
//
//			$proto.aCertainPublicField = null;
//		})();
//		var node = document.createElement("LI"); // Create a <li> node
//		var textnode = document.createTextNode("Water"); // Create a text node
//	 node.appendChild(textnode); // Append the text to <li> // TODO TESTAR APPEND
//	 document.getElementById("div1").appendChild(node); // Append <li> to <ul>
//	// with id="myList"
//	})();
	window.placeDiv = function (x_pos, y_pos, id) {
		  var d = document.getElementById(id ? id : 'myCanvas');
		  d.style.position = "absolute";
		  d.style.left = x_pos+'px';
		  d.style.top = y_pos+'px';
		}
})();


