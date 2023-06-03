uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform float uTime;
uniform float uDistortion;
uniform float uDistX;
uniform float uDistY;
uniform float uDistZ;

varying vec2 vUv;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d.glsl)

vec3 snoiseVec3( vec3 x ){

  float s  = snoise3(vec3( x ));
  float s1 = snoise3(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
  float s2 = snoise3(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
  vec3 c = vec3( s , s1 , s2 );
  return c;

}


vec3 curlNoise( vec3 p ){

  const float e = .1;
  vec3 dx = vec3( e   , 0.0 , 0.0 );
  vec3 dy = vec3( 0.0 , e   , 0.0 );
  vec3 dz = vec3( 0.0 , 0.0 , e   );

  vec3 p_x0 = snoiseVec3( p - dx );
  vec3 p_x1 = snoiseVec3( p + dx );
  vec3 p_y0 = snoiseVec3( p - dy );
  vec3 p_y1 = snoiseVec3( p + dy );
  vec3 p_z0 = snoiseVec3( p - dz );
  vec3 p_z1 = snoiseVec3( p + dz );

  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

  const float divisor = 1.0 / ( 2.0 * e );
  return normalize( vec3( x , y , z ) * divisor );

}


void main() {
  vUv = uv;

  vec3 distortion = vec3(position.x * 2.0, position.y, 1.0) * curlNoise(vec3(position.x * 7.54 + uTime * 0.4, position.y * 3.85 + uTime * 0.4, (position.x + position.y) * 3.5));
  // vec3 distortion = vec3(position.x * 2.0, position.y, 1.0) * curlNoise(vec3(position.x * uDistX + uTime * 0.4, position.y * uDistY + uTime * 0.2, (position.x + position.y) * uDistZ));
  // vec3 distortion = position * curlNoise(vec3(position.x * uDistX + uTime * 0.4, position.y * uDistY + uTime, 0.0 * uDistZ));

  vec3 finalPosition = position + distortion * uDistortion;
  // vec3 finalPosition = position + distortion * uDistortion;

  vec4 modelViewPosition = modelViewMatrix * vec4(finalPosition, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
  gl_PointSize = 1.0;
}