    uniform sampler2D tDiffuse;
    uniform sampler2D uNoiseTexture;
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      vec4 noise = texture2D(uNoiseTexture, vUv + uTime * 0.01);
      vec4 color = texel + noise * 0.1;
      color.rgb = mix(color.rgb, vec3(dot(color.rgb, vec3(0.3, 0.59, 0.11))), 0.3);
      color.rgb *= 1.5;
      gl_FragColor = color;
    }