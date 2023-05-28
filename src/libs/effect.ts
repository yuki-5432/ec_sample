import vert from '../glsl/effect.vert'
import frag from '../glsl/effect.frag'

const effectRGB = {
  uniforms: {
    tDiffuse: { value: null },
    amount: { value: 0.01 },
    angle: { value: 0.0 },
  },
  vertexShader: vert,
  fragmentShader: frag,
}

export default effectRGB
