precision mediump float;

uniform sampler2D uPrevScene;
uniform sampler2D uNextScene;
uniform float uValue;

varying vec2 vUv;

vec2 distort(vec2 uv, float progress, float expo) {
  vec2 st = 2.0 * uv - 1.0;
  st /= (1.0 - progress * length(st) * expo);
  st = (st + 1.0) * 0.5;
  return st;
}

void main() {
  float progress = smoothstep(0.75, 1.0, uValue);

  vec2 uv1 = distort(vUv, -10.0 * pow(0.5 + 0.5 * uValue, 32.0), 4.0);
  vec2 uv2 = distort(vUv, -10.0 * (1.0 - progress), 4.0);
  vec3 prev = texture2D(uPrevScene, uv1).rgb;
  vec3 next = texture2D(uNextScene, uv2).rgb;

  float mixer = smoothstep(uValue * 1.3, uValue * 1.3 - 0.3, vUv.y);

  vec3 color = mix(prev, next, progress);

  // vec2 st = 2.0 * uv - 1.0;
  // float dist = 1.0 + 10.0 * uValue * length(st) * 4.0;
  // st /= dist;
  // st = (st + 1.0) * 0.5;

  gl_FragColor = vec4(color, 1.0);
}