varying vec2 vUv;

uniform float opacity;
uniform sampler2D tDiffuse;
uniform float uTime;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d.glsl)

void main() {
  vec2 uv = vUv;

  float noise = snoise3(vec3(uv.x * 300.0 + floor(uTime * 20.0) * 2.0, uv.y * 300.0, floor(uTime * 20.0)));
  vec3 color = texture2D(tDiffuse, uv).rgb;
  color -= noise * 0.1 + 0.1;

  gl_FragColor = vec4(color, opacity);
}