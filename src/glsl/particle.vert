uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;
attribute float randomSize;

uniform float uTime;

varying vec2 vUv;
varying float vTime;

#pragma glslify: random = require(glsl-random)

void main() {
  vUv = uv;
  vTime = uTime;

  vec3 pos = position;
  float angle = 0.008 * pos.y;
  float s = sin(angle);
  float c = cos(angle);
  pos *= mat3(
    c, 0.0, s,
    0.0, 1.0, 0.0,
    -s, 0.0, c
  );

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = max(3.0, (randomSize + (sin(uTime * (random(uv) * 0.004 + 0.001)))) * 500.0 * (1.0 / -mvPosition.z));
  gl_Position = projectionMatrix * mvPosition;
}