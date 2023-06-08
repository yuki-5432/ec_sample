		uniform float opacity;

		uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform float uTime;

		varying vec2 vUv;

    #pragma glslify: snoise2 = require(glsl-noise/simplex/2d.glsl)

		void main() {
      float aspect = uResolution.x / uResolution.y;
      vec2 uv = vUv;
      vec2 mouse = uMouse;
      uv -= 0.5;
      mouse -= 0.5;

      if (uResolution.x > uResolution.y) {
        uv.y /= aspect;
        mouse.y /= aspect;
      } else if (uResolution.x < uResolution.y) {
        uv.x *= aspect;
        mouse.x *= aspect;
      }

      float circle = 1.0 - length(uv - mouse) * 5.0;

      uv += 0.5;
      mouse += 0.5;

      vec2 direction = normalize(uv - mouse);

      circle = smoothstep(0.3, 1.2, circle);
      circle *= aspect;
      vec2 zoomUv = vUv + direction * circle * 0.05;
      vec2 zoomUv2 = mix(vUv, mouse, circle * 0.3);
      float r = texture2D(tDiffuse, vec2(zoomUv2.x, zoomUv2.y + circle * 0.01)).r;
      float g = texture2D(tDiffuse, vec2(zoomUv2.x, zoomUv2.y)).g;
      float b = texture2D(tDiffuse, vec2(zoomUv2.x, zoomUv2.y - circle * 0.01)).b;

      vec3 color = vec3(r, g, b);

      if (r > 0.1 && g > 0.1 && g > 0.1) {
        color += circle * 0.25;
      }

			gl_FragColor = vec4(color, 1.0);
			gl_FragColor.a *= opacity;
      // gl_FragColor = vec4(rgb, 1.0);
    }