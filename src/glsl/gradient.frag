precision mediump float;

// #pragma glslify: rotate3d = require(glsl-rotate/rotation-3d)

uniform float uTime;
uniform float uRadius;

varying vec2 vUv;
varying vec3 vPosition;

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

float lines(vec2 uv, float offset) {
  return smoothstep(
    0.0,
    0.5 + offset * 0.5,
    abs(0.5 * (sin(uv.x * 30.0) + offset * 2.0))
  );
}

float line2(vec2 uv, float offset) {
  return step(0.0, sin(uv.x * offset));
}

mat2 rotate2d(float angle) {
  return mat2(
    cos(angle), -sin(angle),
    sin(angle), cos(angle)
  );
}

void main() {
  vec2 uv = vUv;
  float noise = noise(normalize(vPosition) * 1.5 + uTime * 0.5);
  vec2 newUv = normalize(vPosition).xy * 0.2 * rotate2d(-noise);
  float line1 = lines(newUv, 0.5);
  float line2 = lines(newUv, 0.1);
  // float line = line2(newUv, 100.0);

  vec3 base1 = vec3(120.0 / 255.0, 158.0 / 255.0, 113.0 / 255.0);
  vec3 accent = vec3(0.0, 0.0, 0.0);
  vec3 base2 = vec3(224.0 / 255.0, 148.0 / 255.0, 66.0 / 255.0);

  vec3 mix1 = mix(base2, base1, line1);
  vec3 mix2 = mix(mix1, accent, line2);


  // gl_FragColor = vec4(noise, 0.0, 0.0, 1.0);
  // vec4 pos = vec4(vPosition, 1.0);
  // pos *= rotate3d(vec3(1.0, 0.0, 0.0), uTime);

  gl_FragColor = vec4(mix2, 1.0);
  // gl_FragColor = vec4(vec3(line2), 1.0);
}