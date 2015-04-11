(function () {
	
	/**
	 *******************************************************************************************************
	 *******	Package
	 *******************************************************************************************************
	 */
	var flexLayout = {};
	window.flexLayout = flexLayout;
	
	/**
	 *******************************************************************************************************
	 *******	MAIN
	 *******************************************************************************************************
	 */
	(function(){
		window.onload = function() {
			this.flexLayoutResponsive = new flexLayout.Register(document.body);
			this.flexLayoutResponsive.findAndProccess();
		};
	
		window.onresize = function () {
			flexLayout.Util.delay(function(){
				window.flexLayoutResponsive.rebuildElements();
			}, 100);
		};
	})();
	
	/**
	 *******************************************************************************************************
	 *******	Register
	 *******************************************************************************************************
	 */
	(function() {
		var $class = flexLayout.Register = function(_element) {
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
				var layoutElement = _lsForm[index];
				this._scheduleBuildForm(layoutElement);
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
})();
