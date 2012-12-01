(function (window, undefined) {
"use strict";

window.Seriously = window.Seriously ||
	{ plugin: function (name, opt) { this[name] = opt; } };


Seriously.plugin('interferences', (function () {

	return CreateHerokuPlugin({
		initialize: function(parent) {
			parent();
		},
		shader: function(inputs, shaderSource, utilities) {
			// from http://glsl.heroku.com/e#4882.1
			// @timb			
			shaderSource.fragment = 
				'#ifdef GL_ES\n' +
				'precision mediump float;\n' +
				'#endif\n' +
				'\n' +
				'uniform float time;\n' +
				'uniform vec2 mouse;\n' +
				'uniform vec2 resolution;\n' +
				'\n' +
				'float rand(vec2 co){\n' +
				'    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\n' +
				'}\n' +
				'\n' +
				'void main( void ) {\n' +
				'	\n' +
				'	vec2 position = ( gl_FragCoord.xy / resolution.xy );\n' +
				'	\n' +
				'	\n' +
				'	float maxbarlength = (mouse.x * mouse.y * (200.0 + (sin(time+position.x+position.y)*sin(time)*mouse.y*mouse.x*300.0) ));\n' +
				'	\n' +
				'	float px = mouse.x + position.x;\n' +
				'	float py = mouse.y + position.y;\n' +
				'	\n' +
				'	float randxy1 = rand(vec2(floor(gl_FragCoord.x / maxbarlength), py))  * ((1.0 - mouse.x) * ((sin(time)+10.0)*5.0) );\n' +
				'	float randxy2 = rand(vec2(px, floor(gl_FragCoord.y / maxbarlength))) * ((1.0 - mouse.y) * ((sin(time)+10.0)*5.0) );\n' +
				'	\n' +
				'	float sx = floor(gl_FragCoord.x / (randxy1 * maxbarlength));\n' +
				'	float sy = floor(gl_FragCoord.y / (randxy2 * maxbarlength));\n' +
				'\n' +
				'	float s = (sx + sy) ;\n' +
				'	\n' +
				'	float r1 = rand(vec2(s, s)) * s + (1.0 - s);\n' +
				'	float r2 = rand(vec2(s+1.0, s+1.0)) * s + (1.0 - s);\n' +
				'	float r3 = rand(vec2(s+2.0, s+2.0)) * s + (1.0 - s);\n' +
				'	\n' +
				'	float rr = (r1 + mouse.y) / 2.0;\n' +
				'	float rg = (r2 + mouse.x) / 2.0;\n' +
				'	\n' +
				'	gl_FragColor = vec4( rr, rg, r3,  1.0);\n' +
				'	\n' +
				'}\n';
			
			return shaderSource;
		},
		inPlace: true,
		// use the shortcut standard input names
		inputs: ['time', 'mouse', 'resolution'],
		description: 'Dancing bars by @timb',
		title: 'Interferences'
	});
}()) );

}(window));
