precision mediump float;

uniform float uTime;
uniform sampler2D uTexture;
uniform vec2 uMouseDiff;

varying vec2 vUv;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d.glsl)
#pragma glslify: pnoise3 = require(glsl-noise/simplex/3d.glsl)

void main() {
  float noise = smoothstep(0.0, 1.0, pnoise3(vec3(vUv * 10.0, uTime * 0.3)));
  float n = pnoise3(vec3(vec2(length(vUv - 0.5)) - uTime * 2.0, uTime * 0.1));

  vec2 center = vUv * 2.0 - 1.0;
  float centerLength = length(center) * 2.0;

  vec2 uv = vUv + (center / centerLength) * cos(centerLength * 12.0 - uTime * 12.0) * (uMouseDiff.x * uMouseDiff.y) * 0.1;
  // vec2 uv = vUv + center / centerLength;

  vec3 color = texture2D(uTexture, uv).rgb;

  gl_FragColor = vec4(n, 0.0, 0.0, 1.0);
}