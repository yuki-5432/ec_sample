import * as THREE from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { RefObject } from 'react'
import BaseCanvas from './baseCanvas'
import { DoubleSide, RawShaderMaterial } from 'three'
// import vert from '../glsl/particle.vert'
// import frag from '../glsl/particle.frag'

class Particle extends BaseCanvas {
  public controls!: TrackballControls
  private vert!: string
  private frag!: string
  private shaderMaterial!: RawShaderMaterial

  constructor(ref: RefObject<Element>) {
    super(ref)

    this.setRenderer()
    this.setCamera()
    this.setScene()
    this.setShader()
    this.setMesh()
    this.setControls()
    this.animate()
  }

  private setShader(): void {
    this.vert = `
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

varying vec2 vUv;

void main() {
  vUv = uv;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  gl_PointSize = 20.0;
  gl_Position = projectionMatrix * mvPosition;
}
    `

    this.frag = `
precision mediump float;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  vec3 color = vec3(uv.x, 0.0, uv.y);
  gl_FragColor = vec4(color, 1.0);
}
    `
  }

  public setMesh(): void {
    const geometry = new THREE.PlaneGeometry(300, 1000, 30, 100)
    const material = new THREE.MeshNormalMaterial({
      side: DoubleSide,
    })
    this.shaderMaterial = new THREE.RawShaderMaterial({
      vertexShader: this.vert,
      fragmentShader: this.frag,
      uniforms: {
        uTime: {
          value: 0,
        },
      },
    })
    console.log(geometry)
    const mesh = new THREE.Points(geometry, this.shaderMaterial)
    this.scene.add(mesh)
  }

  public setControls(): void {
    this.controls = new TrackballControls(this.camera, this.canvas)
  }

  public animate(): void {
    this.renderer.render(this.scene, this.camera)
    this.controls.update()

    this.shaderMaterial.uniforms.uTime.value = window.performance.now()

    requestAnimationFrame(this.animate.bind(this))
  }
}

export default Particle
