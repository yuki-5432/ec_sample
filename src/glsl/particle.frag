precision mediump float;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  vec3 color = vec3(uv.x, 0.0, uv.y);

  gl_FragColor = vec4(color, 1.0);
}