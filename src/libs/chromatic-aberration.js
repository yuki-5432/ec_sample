import * as THREE from 'three'

/**
 * Two pass Gaussian blur filter (horizontal and vertical blur shaders)
 * - see http://www.cake23.de/traveling-wavefronts-lit-up.html
 *
 * - 9 samples per pass
 * - standard deviation 2.7
 * - "h" and "v" parameters should be set to "1 / width" and "1 / height"
 */

const chromaticAberrationShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: {
      value: new THREE.Vector2(0, 0),
    },
  },

  vertexShader: /* glsl */ `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

  fragmentShader: /* glsl */ `

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;

		varying vec2 vUv;


vec2 barrelDistortion(vec2 coord, float amt) {
	vec2 cc = coord - 0.5;
	float dist = dot(cc, cc);
	return coord + cc * dist * amt;
}

float sat( float t )
{
	return clamp( t, 0.0, 1.0 );
}

float linterp( float t ) {
	return sat( 1.0 - abs( 2.0*t - 1.0 ) );
}

float remap( float t, float a, float b ) {
	return sat( (t - a) / (b - a) );
}

vec4 spectrum_offset( float t ) {
	vec4 ret;
	float lo = step(t,0.5);
	float hi = 1.0-lo;
	float w = linterp( remap( t, 1.0/6.0, 5.0/6.0 ) );
	ret = vec4(lo,1.0,hi, 1.) * vec4(1.0-w, w, 1.0-w, 1.);

	return pow( ret, vec4(1.0/2.2) );
}

const float max_distort = 2.2;
const int num_iter = 12;
const float reci_num_iter_f = 1.0 / float(num_iter);

void main()
{
	vec2 uv=(gl_FragCoord.xy/resolution.xy*.5)+.25;
	uv = vUv;

	vec4 sumcol = vec4(0.0);
	vec4 sumw = vec4(0.0);
	for ( int i=0; i<num_iter;++i )
	{
		float t = float(i) * reci_num_iter_f;
		vec4 w = spectrum_offset( t );
		sumw += w;
		sumcol += w * texture2D( tDiffuse, barrelDistortion(uv, .6 * max_distort*t ) );
	}

	gl_FragColor = sumcol / sumw;
}
		`,
}

export default chromaticAberrationShader
