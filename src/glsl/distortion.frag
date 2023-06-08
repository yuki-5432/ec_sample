precision mediump float;

uniform sampler2D uTexture;
uniform sampler2D uDisp;
uniform float uTime;
uniform float uProgress;
varying vec2 vUv;

void main() {
  vec4 displacement = texture2D(uDisp, vUv.yx);
  vec2 dispUv = vec2(vUv.x + sin(vUv.y * 20.0 + uTime * 3.0) * 0.05 * uProgress, vUv.y);
  vec2 dispUv2 = vec2(vUv.x, vUv.y);
  dispUv2.y = mix(vUv.y, displacement.r - 0.1, uProgress);
  float r = texture2D(uTexture, dispUv2 + 0.005 * uProgress).r;
  float g = texture2D(uTexture, dispUv2).g;
  float b = texture2D(uTexture, dispUv2 - 0.005 * uProgress).b;
  vec3 color = vec3(r, g, b);
  gl_FragColor = vec4(color, 1.0);
}