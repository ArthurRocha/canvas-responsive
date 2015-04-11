/**
 *******************************************************************************************************
 *******	Util
 *******************************************************************************************************
 */
(function(){
	flexLayout.Util = function() {};
	
	flexLayout.Util.getOffset = function (el) {
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
	
	flexLayout.Util.delay = (function(){
		var timer = 0;
       return function(callback, ms){
    	   clearTimeout (timer);
           timer = setTimeout(callback, ms);
       };
	})();
	
	flexLayout.Util.getSizeType = function (element, attribute) {
		var value = element.getAttribute(attribute) + '';
		if (value == '' || value.endsWith('%')) {
			return '%';
		} else if (value.endsWith('px')) {
			return 'px';
		}
		return '%'; // default
	};
	
	flexLayout.Util.getSizeValueInt = function (value) { // TODO sizeType
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
