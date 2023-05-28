
uniform sampler2D tDiffuse;
uniform float amount;
uniform float angle;

varying vec2 vUv;
varying vec3 vPos;

void main() {

  float circ = smoothstep(0.0, 1.0, length(vUv - vec2(0.5)));
  float y = step(0.5, vUv.y);

  vec2 offset = amount * vec2( cos(angle), sin(angle));
  vec4 cr = texture2D(tDiffuse, vUv + offset * circ);
  vec4 cga = texture2D(tDiffuse, vUv);
  vec4 cb = texture2D(tDiffuse, vUv - offset * circ);
  gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);
  // gl_FragColor = vec4(gl_FragCoord.st, 0.0, 1.0);


}