precision mediump float;

varying float vRandomValue;
varying vec2 vUv;

void main() {
  float alpha = smoothstep(0.3, 0.5, 1.0 - length(gl_PointCoord - vec2(0.5)));
  float light = 0.3 / length(gl_PointCoord - vec2(0.5));
  vec3 color = vec3(light);
  color *= vec3(0.8549, 0.0784, 0.6471);
  // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  gl_FragColor = vec4(color, alpha * (0.2 + vRandomValue * 0.8));
}