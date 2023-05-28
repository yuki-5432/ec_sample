import * as THREE from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { RefObject } from 'react'
import BaseCanvas from './baseCanvas'
import { DoubleSide, Points, RawShaderMaterial, Vector2 } from 'three'
import vert from '../glsl/particle.vert'
import frag from '../glsl/particle.frag'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader'
import chromaticAberrationShader from './chromatic-aberration'

class Particle extends BaseCanvas {
  public controls!: TrackballControls
  private shaderMaterial!: RawShaderMaterial
  private mesh!: Points
  private stats!: Stats
  private gui!: GUI
  private composer!: EffectComposer
  private bloomPass!: UnrealBloomPass
  private client!: Vector2
  private param: {
    exposure: number
    bloomStrength: number
    bloomThreshold: number
    bloomRadius: number
  }
  // private rotate!: number

  constructor(ref: RefObject<Element>) {
    super(ref)

    this.client = new THREE.Vector2(0, 0)
    this.param = {
      exposure: 1,
      bloomStrength: 12.66,
      bloomThreshold: 0.594,
      bloomRadius: 0.9,
    }

    this.setRenderer()
    this.setCamera()
    this.camera.position.z = 500
    this.camera.lookAt(0, 0, 0)
    this.setScene()
    this.setShader()
    // this.setLight()
    this.setMesh()
    // this.setControls()
    this.setClient()
    this.setStats()
    this.setComposer()
    this.setGUI()
    this.animate()
  }

  private setClient(): void {
    this.canvas.addEventListener('mousemove', (e: MouseEvent) => {
      const x = (e.clientX / this.w) * 2 - 1
      const y = (-e.clientY / this.h) * 2 + 1

      // this.client.set(x, y)
      this.client.set(x, y)
      console.log(this.client.x)
    })
  }

  private setShader(): void {}

  private setGUI(): void {
    this.gui = new GUI()

    this.gui.add(this.param, 'exposure', 0.1, 2).onChange((value: number) => {
      this.renderer.toneMappingExposure = Math.pow(value, 4.0)
    })
    this.gui
      .add(this.param, 'bloomThreshold', 0.0, 1.0)
      .onChange((event: any) => {
        this.param.bloomThreshold = Number(event)
      })
    this.gui
      .add(this.param, 'bloomStrength', 0.0, 30.0)
      .onChange((value: string) => {
        console.log(this)
        this.param.bloomStrength = Number(value)
        console.log(this.param.bloomStrength)
        this.bloomPass.strength = Number(value)
      })
    this.gui
      .add(this.param, 'bloomRadius', 0.0, 10.0)
      .onChange((value: string) => {
        this.bloomPass.radius = Number(value)
      })
  }

  private setStats(): void {
    this.stats = new Stats()
    this.stats.dom.style.top = '120px'

    this.ref.current?.appendChild(this.stats.dom)
  }

  public setLight(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
    const pointLight = new THREE.PointLight(0xffffff, 1)
    this.scene.add(ambientLight)
    this.scene.add(pointLight)
  }

  public setMesh(): void {
    const geometry = new THREE.PlaneGeometry(300, 1000, 30, 100)
    const material = new THREE.MeshNormalMaterial({
      side: DoubleSide,
    })
    this.shaderMaterial = new THREE.RawShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        uTime: {
          value: 0,
        },
        uColor1: {
          value: new THREE.Color(0xfa8072),
        },
        uColor2: {
          value: new THREE.Color(0x87cefa),
        },
        uColor3: {
          value: new THREE.Color(0x66cdaa),
        },
      },
      side: DoubleSide,
      transparent: true,

      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    console.log(geometry)

    const vertIntensity = geometry.getAttribute('position').count

    const randomSize = new Float32Array(vertIntensity)

    for (let i = 0; i < vertIntensity; i++) {
      const size = Math.random() * 10

      randomSize.set([size], i)
    }

    geometry.setAttribute(
      'randomSize',
      new THREE.BufferAttribute(randomSize, 1)
    )

    this.mesh = new THREE.Points(geometry, this.shaderMaterial)
    this.mesh.position.x = 200
    this.scene.add(this.mesh)
  }

  public setControls(): void {
    this.controls = new TrackballControls(this.camera, this.canvas)
  }

  private setComposer(): void {
    this.renderer.toneMapping = THREE.ReinhardToneMapping
    const renderScene = new RenderPass(this.scene, this.camera)
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.w, this.h),
      this.param.bloomStrength,
      this.param.bloomRadius,
      this.param.bloomThreshold
    )
    this.renderer.toneMappingExposure = Math.pow(this.param.exposure, 4.0)
    const shader = chromaticAberrationShader
    shader.uniforms.resolution.value = new THREE.Vector2(this.w, this.h)
    const effect = new ShaderPass(shader)

    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(renderScene)
    this.composer.addPass(this.bloomPass)
    this.composer.addPass(effect)
  }

  public animate(): void {
    // this.renderer.render(this.scene, this.camera)
    // this.controls.update()
    this.stats.update()

    this.renderer.toneMappingExposure = Math.pow(this.param.exposure, 4.0)
    this.bloomPass.threshold = this.param.bloomThreshold
    this.bloomPass.strength = this.param.bloomStrength
    this.bloomPass.radius = this.param.bloomRadius

    this.shaderMaterial.uniforms.uTime.value = window.performance.now()
    this.mesh.rotation.y =
      window.scrollY * 0.003 + window.performance.now() * 0.0005

    this.camera.position.x = this.client.x * 100
    this.camera.position.y = this.client.y * 100
    this.camera.lookAt(0, 0, 0)

    this.composer.render()

    requestAnimationFrame(this.animate.bind(this))
  }
}

export default Particle
