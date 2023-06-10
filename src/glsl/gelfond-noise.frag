varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform float opacity;
uniform float uTime;

float gelfondRandom( vec2 p )
{
	vec2 k1 = vec2(
		23.14069263277926, // e^pi (Gelfond's constant)
		2.665144142690225 // 2^sqrt(2) (Gelfonda€“Schneider constant)
	);
	return fract( cos( dot( p, k1 ) ) * 12345.6789 );
}

void main() {
  vec3 color = texture2D(tDiffuse, vUv).rgb;
  // float noise = gelfondRandom(vUv);
  vec2 noiseUv = vUv;
  noiseUv.y *= gelfondRandom(vec2(noiseUv.y, 0.4));
  color += gelfondRandom(noiseUv) * 0.2;
  gl_FragColor = vec4(color, opacity);
}