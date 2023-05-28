precision mediump float;

varying vec2 vUv;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

#pragma glslify: random = require(glsl-random)

void main() {
  vec2 uv = vUv;

  float num = random(uv);

  vec3 color = uColor1;

  if (num > 0.33 && num <= 0.66) {
    color = uColor2;
  } else if (num > 0.66) {
    color = uColor3;
  }

  float alpha = 1.0 - smoothstep(-0.2, 0.5, length(gl_PointCoord - vec2(0.5)));

  float gradient = smoothstep(0.1, 0.5, uv.y);

  gl_FragColor = vec4(color, alpha * gradient);
}