/****
	Converts shader code from glsl.heroku.com to be compatible with Seriously.

***/
var InputShortcuts = {};

InputShortcuts.getDefaultInput = function getDefaultInput (name) {
	var result = null;

	switch (name) {
		case 'mouse':
			result = {
				type: 'vector',
				dimensions: 2,
				defaultValue: [0,0]
			};
			break;
		case 'time':
			result = {
				type: 'number',
				defaultValue: 0
			};
			break;
		case 'resolution':
			result = {
				type: 'vector',
				dimensions: 2,
				defaultValue: [640,480]
			}; 
			break;
		case 'tex0':
		case 'source':
			result = {
				type: 'image'
			};
			break;
		default:
			console && console.log('WARNING: invalid input shortcut ' + name);
			result = {
				type: 'number',
				defaultValue: 1.0
			};					
	}

	// uniform is always same as the input name
	result.uniform = name;

	return result;
};

var DateNow = Date.now || function() {
					return +new Date();
				},

mousePos = {
	x: 0,
	y: 0
},
mouseTracker = $('body').on('mousemove', function (ev) {
	mousePos.x = ev.clientX;
	mousePos.y = ev.clientY;
}),

CreateHerokuPlugin = function (effect) {
	var name, input,
		parameters = {
			startTime : DateNow() 
		};
	
	if (effect.inputs) {
		for (name in effect.inputs) {
			input = effect.inputs[name];

			// must be a shortcut standard input, replace with default 
			if (typeof input == 'string') { 
				effect.inputs[name] = InputShortcuts.getDefaultInput(input);
			}
		}
	}

	effect.draw = effect.draw || function (shader, model, uniforms, frameBuffer, parent) {

			// add default inputs
			var time = DateNow() - parameters.startTime;

			uniforms.time = time / 1000;
			uniforms.mouse = [mousePos.x, mousePos.y];
			uniforms.resolution = [this.width, this.height];

			parent(shader, model, uniforms, frameBuffer);
		};

	return autowire(effect);
};