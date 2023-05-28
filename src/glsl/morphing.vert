uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec3 catPosition;
attribute vec3 randomPosition;
attribute float randomValue;

varying vec2 vUv;
varying float vRandomValue;

uniform float uMorphing;
uniform float uRandomValue;

void main() {
  vUv = uv;
  vRandomValue = randomValue;

  vec3 firstPos = mix(mix(position, randomPosition, uRandomValue), catPosition, uMorphing);

  vec4 modelViewPosition = modelViewMatrix * vec4(firstPos, 1.0);

  gl_Position = projectionMatrix * modelViewPosition;
  gl_PointSize = 5.0 + (randomValue * 20.0);
}