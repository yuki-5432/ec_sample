precision mediump float;

varying vec2 vUv;

uniform sampler2D uTexture01;
uniform sampler2D uTexture02;
uniform sampler2D uTexture03;
uniform sampler2D uTexture04;
uniform sampler2D uCurrentTexture;
uniform sampler2D uNextTexture;
uniform float uProgress;

// #pragma glslify: snoise = require(glsl-noise/simplex/3d)

void main() {
  vec2 uv = vUv;

  vec4 currentTexture = texture2D(uCurrentTexture, uv);
  vec4 nextTexture = texture2D(uNextTexture, uv);

  vec4 color = mix(currentTexture, nextTexture, uProgress);
  // gl_FragColor = vec4(vUv, 0.0, 1.0);
  gl_FragColor = color;
  if (gl_FragColor.r < 0.1 && gl_FragColor.g < 0.1 && gl_FragColor.b < 0.1) discard;
  // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}