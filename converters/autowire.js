/***

	Autowirer. Automatically hooks up the most likely uniform inputs to mouse, etc.

***/ 

var 
	// false denotes the input hasn't been changed.
	// TODO: or should it be that the draw func sets them to false to denote it's been used?
	inputValues = [false, false, false, false];

	var buttonIdx = 0;
	mouseTrackerOnStart = function (ev) {
			buttonIdx = (ev.which - 1) * 2;

			inputValues[0 + buttonIdx] = ev.clientX;
			inputValues[1 + buttonIdx] = ev.clientY;
		},
	mouseTrackerOnDrag = function (ev) {
			inputValues[0 + buttonIdx] = ev.clientX;
			inputValues[1 + buttonIdx] = ev.clientY;
		},		
	mouseTrackerOnEnd = function (ev) {
			inputValues[0 + buttonIdx] = false;
			inputValues[1 + buttonIdx] = false;
		},
	mouseTracker = $('body')
		.on('mousedown', mouseTrackerOnStart)
		.on('mousemove', mouseTrackerOnDrag)
		.on('mouseup', mouseTrackerOnEnd),

	autowire = function autowire(effect, options) {
		var name, input,

			origDrawFunc = effect.draw,

			qualifiedInputs = [],

			screenH = $(window).innerHeight(),
			screenW = $(window).innerWidth(),

			curInput = 0;
			getNextInput = function getNextInput() {
				var div = curInput % 2 ? screenH : screenW; // normalize
				return inputValues[curInput++ % inputValues.length] / div;
			};
		
		if (effect.inputs) {
			for (name in effect.inputs) {
				input = effect.inputs[name];

				if (input.uniform) {

					if (curInput < inputValues.length) {
						qualifiedInputs.push(input);
					} 
				}
			}
		}

		effect.draw = function (shader, model, uniforms, frameBuffer, parent) {
			var input, nextVal;

			curInput = 0;
			for (var i = 0; i < qualifiedInputs.length; i++) {
				input = qualifiedInputs[i]; 
				nextVal = getNextInput();

				// don't change if they didn't
				if (nextVal === false) continue;

				switch (input.type) {
					case 'vector':
						if (input.dimensions == 2) {
							uniforms[input.uniform] = [nextVal, getNextInput()]; // erm, yeah, just hope this is an even num of inputs
						}
						break;
					case 'number':
							uniforms[input.uniform] = nextVal;
						break;
					case 'enum':
							// TODO
						break;
				} 
			}


			if (origDrawFunc) {
				origDrawFunc.apply(this, arguments); 
			}
			else {
				parent(shader, model, uniforms, frameBuffer);
			}
		};

		return effect;
	};