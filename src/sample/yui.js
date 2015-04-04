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
