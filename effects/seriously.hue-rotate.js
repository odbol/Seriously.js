(function (window, undefined) {
"use strict";

window.Seriously = window.Seriously ||
	{ plugin: function (name, opt) { this[name] = opt; } };


Seriously.plugin('hue-rotate', (function () {

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
				'uniform sampler2D tex0;  \n' + 
				'  \n' + 
				'const mat3 rgb2yiq = mat3(0.299, 0.587, 0.114, 0.595716, -0.274453, -0.321263, 0.211456, -0.522591, 0.311135);  \n' + 
				'const mat3 yiq2rgb = mat3(1.0, 0.9563, 0.6210, 1.0, -0.2721, -0.6474, 1.0, -1.1070, 1.7046);  \n' + 
				'uniform float time;  \n' + 
				'uniform vec2 mouse;  \n' + 

				'varying vec2 vTexCoord;\n' +
				'varying vec4 vPosition;\n' +

				'vec3 rotate_hue(float angle, vec3 color) {	  \n' + 
				'	vec3 yColor = rgb2yiq * color;   \n' + 
				'	  \n' + 
				'	float originalHue = atan(yColor.b, yColor.g);  \n' + 
				'	float finalHue = originalHue + angle;  \n' + 
				'	  \n' + 
				'	float chroma = sqrt(yColor.b*yColor.b+yColor.g*yColor.g);  \n' + 
				'	  \n' + 
				'	vec3 yFinalColor = vec3(yColor.r, chroma * cos(finalHue), chroma * sin(finalHue));  \n' + 
				'	  \n' + 
				'	return yiq2rgb*yFinalColor;  \n' + 
				'}  \n' + 
				'  \n' + 
				'void main() {  \n' + 
				'	float angle = mod(time * mouse.x * 0.2, 3.1415 * 2.0);// mouse.x * 3.1415;//1.0;//  \n' + 
				'	  \n' +
				'	vec3 yColor = rotate_hue(angle, texture2D(tex0, vTexCoord).rgb);   \n' + 
				'  \n' + 
				'	gl_FragColor    = vec4(yColor.r, 1.0, 0.0, 1.0);  \n' + //vec4(yColor, 1.0);  \n' + 
				'}  \n';

			
			return shaderSource;
		},
		inPlace: true,
		// use the shortcut standard input names
		inputs: ['time', 'mouse', 'tex0'],
		description: 'Rotates hue automatically.',
		title: 'Hue Rotator'
	});
}()) );

}(window));
