import { RefObject } from 'react'
import BaseCanvas from './baseCanvas'
import {
  CubeCamera,
  DoubleSide,
  LinearMipMapLinearFilter,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  RGBAFormat,
  RawShaderMaterial,
  ShaderMaterial,
  SphereGeometry,
  Vector2,
  WebGLCubeRenderTarget,
  WebGLRenderTarget,
} from 'three'
import vert from '../glsl/gradient.vert'
import frag from '../glsl/gradient.frag'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import vert2 from '../glsl/gradient2.vert'
import frag2 from '../glsl/gradient2.frag'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import noise from '../glsl/gelfond-noise.frag'

export default class GradientCanvas extends BaseCanvas {
  shaderMaterial!: RawShaderMaterial
  controls!: OrbitControls
  radius: number
  shaderMaterial2!: ShaderMaterial
  cubeRenderTarget!: WebGLCubeRenderTarget
  cubeCamera!: CubeCamera
  smallSphere!: Mesh
  composer!: EffectComposer
  noiseShaderPass!: ShaderPass
  mouse: Vector2

  constructor(ref: RefObject<Element>) {
    super(ref)

    this.radius = Math.max(this.w, this.h)
    this.mouse = new Vector2(0, 0)

    this.setRenderer()
    this.setScene()
    this.setCamera()
    this.camera.position.z = this.radius * 0.8
    this.setComposer()
    this.setControls()
    this.setMesh()
    this.mouseMove()
    this.setGUI()
    this.animate()
  }

  public setControls(): void {
    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true
  }

  protected setMesh(): void {
    const sphereGeometry = new SphereGeometry(this.radius, 100, 100)
    this.shaderMaterial = new RawShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      // wireframe: true,
      uniforms: {
        uTime: {
          value: 0,
        },
        uRadius: {
          value: this.radius,
        },
      },
      side: DoubleSide,
    })
    const phongMaterial = new MeshPhongMaterial({})
    const basicMaterial = new MeshBasicMaterial({ color: 0xffffff })
    const nomalMaterial = new MeshNormalMaterial()

    const sphere = new Mesh(sphereGeometry, this.shaderMaterial)
    this.scene.add(sphere)

    this.cubeRenderTarget = new WebGLCubeRenderTarget(128, {
      generateMipmaps: true,
      minFilter: LinearMipMapLinearFilter,
    })
    this.cubeCamera = new CubeCamera(0.1, 10000, this.cubeRenderTarget)
    this.scene.add(this.cubeCamera)

    const radius2 = Math.max(this.w / 2, this.h / 2)
    const sphereGeometry2 = new SphereGeometry(radius2, 40, 40)
    this.shaderMaterial2 = new ShaderMaterial({
      vertexShader: vert2,
      fragmentShader: frag2,
      uniforms: {
        mRefractionRatio: { value: 1.02 },
        mFresnelBias: { value: 0.1 },
        mFresnelPower: { value: 2.0 },
        mFresnelScale: { value: 1.0 },
        tCube: { value: null },
      },
    })
    this.smallSphere = new Mesh(sphereGeometry2, this.shaderMaterial2)
    this.smallSphere.position.set(this.w * 0.4, this.h * 0.4, 0)
    this.scene.add(this.smallSphere)
  }

  public setGUI(): void {
    const gui = new GUI()
    const param = {
      mRefractionRatio: 1.02,
      mFresnelBias: 0.1,
      mFresnelPower: 2.0,
      mFresnelScale: 1.0,
    }
    gui.add(param, 'mRefractionRatio', 0.8, 1.2).onChange((value: string) => {
      this.shaderMaterial2.uniforms.mRefractionRatio.value = Number(value)
    })
    gui.add(param, 'mFresnelBias', 0, 1).onChange((value: string) => {
      this.shaderMaterial2.uniforms.mFresnelBias.value = Number(value)
    })
    gui.add(param, 'mFresnelPower', 0, 5).onChange((value: string) => {
      this.shaderMaterial2.uniforms.mFresnelPower.value = Number(value)
    })
    gui.add(param, 'mFresnelScale', 0, 2).onChange((value: string) => {
      this.shaderMaterial2.uniforms.mFresnelScale.value = Number(value)
    })
  }

  public setComposer(): void {
    this.composer = new EffectComposer(this.renderer)
    const renderPass = new RenderPass(this.scene, this.camera)
    const noiseShader: any = CopyShader
    noiseShader.fragmentShader = noise
    noiseShader.uniforms = {
      tDiffuse: {
        value: null,
      },
      opacity: {
        value: 1.0,
      },
      uTime: {
        value: 0,
      },
    }
    this.noiseShaderPass = new ShaderPass(noiseShader)
    this.composer.addPass(renderPass)
    this.composer.addPass(this.noiseShaderPass)
  }

  protected mouseMove(): void {
    this.canvas.addEventListener('mousemove', (e) => {
      const x = (e.clientX / this.w) * 2 - 1
      const y = (-e.clientY / this.h) * 2 + 1
      this.mouse.lerp(new Vector2(x, y), 0.1)
    })
  }

  public animate(): void {
    this.controls.update()
    this.shaderMaterial.uniforms.uTime.value = window.performance.now() / 1000
    this.camera.position.x = this.mouse.x * 200
    this.camera.position.y = this.mouse.y * 200
    this.camera.lookAt(0, 0, 0)

    this.smallSphere.visible = false
    this.cubeCamera.position.copy(this.smallSphere.position)
    this.cubeCamera.update(this.renderer, this.scene)
    this.smallSphere.visible = true
    this.shaderMaterial2.uniforms.tCube.value = this.cubeRenderTarget.texture
    // this.renderer.render(this.scene, this.camera)
    this.noiseShaderPass.material.uniforms.uTime.value =
      window.performance.now() * 0.001
    this.composer.render()

    requestAnimationFrame(() => this.animate())
  }
}
