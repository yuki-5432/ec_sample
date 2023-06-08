import { RefObject } from 'react'
import BaseCanvas from './baseCanvas'
import {
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  RawShaderMaterial,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { gsap } from 'gsap'
import vert from '../glsl/distortion.vert'
import frag from '../glsl/distortion.frag'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import disp from '../img/distortion/test-a301d29511.png'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'
import lensFrag from '../glsl/lens.frag'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { DigitalGlitch } from 'three/examples/jsm/shaders/DigitalGlitch'
import noiseFrag from '../glsl/white-noise.frag'
import noiseFrag2 from '../glsl/noise.frag'
import noiseImage from '../img/distortion/Wrapped-full-displacement-map-of-the-populated-board-fixed-in-the-4-corners-seen-from.png'

export default class DistortionCanvas extends BaseCanvas {
  imgList: RefObject<Element>
  shaderMaterials!: RawShaderMaterial[]
  meshs!: Mesh[]
  scrollY: number
  to: number
  imgs: Element[]
  camera!: PerspectiveCamera
  composer!: EffectComposer
  lensPass!: ShaderPass
  noisePass!: ShaderPass
  mouse!: Vector2
  // noisePass2!: ShaderPass

  constructor(
    ref: RefObject<Element>,
    imgList: RefObject<Element>,
    to: number
  ) {
    super(ref)
    this.imgList = imgList
    this.imgs = gsap.utils.selector(imgList.current)(
      'div[data-src]'
    ) as unknown as Element[]
    this.scrollY = window.scrollY
    this.to = window.scrollY
    this.mouse = new Vector2(0, 0)

    this.setRenderer()
    this.setScene()
    this.setCamera()
    this.setMesh()
    this.setGUI()
    this.setComposer()
    this.animate()

    window.addEventListener('mousemove', (e) => {
      this.onMouseMove(e)
    })

    window.addEventListener('resize', () => this.onResize())
  }

  public onMouseMove(e: MouseEvent): void {
    const { clientX, clientY } = e
    this.mouse.set(clientX / this.w, 1 - clientY / this.h)
    console.log(this.mouse)
  }

  public setRenderer(): void {
    this.renderer = new WebGLRenderer({ alpha: true })
    this.renderer.setSize(this.w, this.h)
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
    this.canvas = this.ref.current!.appendChild(this.renderer.domElement)
  }

  public setGUI(): void {
    const gui = new GUI()
    const param = {
      progress: 0,
    }

    gui.add(param, 'progress', 0, 1).onChange((value: string) => {
      this.shaderMaterials[0].uniforms.uProgress.value = Number(value)
    })
  }

  public setComposer(): void {
    this.composer = new EffectComposer(this.renderer)
    const renderPass = new RenderPass(this.scene, this.camera)

    const lensShader: any = CopyShader
    // lensShader.uniforms.uResolution.value = new Vector2(this.w, this.h)
    lensShader.fragmentShader = lensFrag
    lensShader.uniforms = {
      tDiffuse: { value: null },
      opacity: { value: 1.0 },
      uResolution: { value: new Vector2(this.w, this.h) },
      uMouse: { value: new Vector2(0, 0) },
      uTime: { value: 0 },
    }
    this.lensPass = new ShaderPass(lensShader)

    const noiseShader: any = CopyShader
    noiseShader.fragmentShader = noiseFrag
    noiseShader.uniforms = {
      tDiffuse: { value: null },
      opacity: { value: 1.0 },
      uTime: { value: 0 },
    }

    this.noisePass = new ShaderPass(noiseShader)

    // const textureLoader = new TextureLoader()
    // const noiseTexture = textureLoader.load(noiseImage)

    // const noiseShader2: any = CopyShader
    // noiseShader2.fragmentShader = noiseFrag2
    // noiseShader2.uniforms = {
    //   tDiffuse: { value: null },
    //   opacity: { value: 1.0 },
    //   uTime: { value: 0 },
    //   uNoiseTexture: { value: noiseTexture },
    // }

    // this.noisePass2 = new ShaderPass(noiseShader2)

    this.composer.addPass(renderPass)
    this.composer.addPass(this.lensPass)
    this.composer.addPass(this.noisePass)
    // this.composer.addPass(this.noisePass2)
  }

  public setMesh(): void {
    const imgs = gsap.utils.selector(this.imgList.current)('div[data-src]')
    console.log(imgs)

    this.meshs = []
    this.shaderMaterials = []
    const textureLoader = new TextureLoader()
    const displacement = textureLoader.load(disp)

    this.imgs.forEach((el, i) => {
      const rect = el.getBoundingClientRect()
      const offset = {
        x: window.scrollX + rect.left,
        y: window.scrollY + rect.top,
      }
      const size = { w: rect.width, h: rect.height }

      const geometry = new PlaneGeometry(1, 1, 1, 1)

      const src = el.getAttribute('data-src')
      const texture = textureLoader.load(src!)

      const shaderMaterial = new RawShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms: {
          uTexture: {
            value: texture,
          },
          uProgress: {
            value: 0,
          },
          uDisp: {
            value: displacement,
          },
          uTime: {
            value: 0,
          },
        },
      })

      const mesh = new Mesh(geometry, shaderMaterial)
      mesh.position.set(
        offset.x - window.innerWidth / 2 + size.w / 2,
        -offset.y + window.innerHeight / 2 - size.h / 2,
        0
      )
      mesh.scale.set(size.w, size.h, 1)
      this.meshs.push(mesh)
      this.shaderMaterials.push(shaderMaterial)

      const progress = shaderMaterial.uniforms.uProgress

      el.addEventListener('mouseenter', () => {
        gsap.to(progress, {
          value: 1,
          duration: 0.6,
          ease: 'expo.out',
        })
      })

      el.addEventListener('mouseleave', () => {
        gsap.to(progress, {
          value: 0,
          duration: 0.6,
          ease: 'expo.out',
        })
      })
    })
    console.log(this.meshs)

    this.scene.add(...this.meshs)
  }

  public onResize(): void {
    this.rect = this.ref.current!.getBoundingClientRect()
    this.w = this.rect.width
    this.h = this.rect.height
    this.renderer.setSize(this.w, this.h)
    const rad = ((this.fov! / 2) * Math.PI) / 180
    this.cameraZ = this.h / 2 / Math.tan(rad)
    this.camera.aspect = this.w / this.h
    this.camera.position.z = this.cameraZ
    this.camera.updateProjectionMatrix()

    this.lensPass.material.uniforms.uResolution.value.set(this.w, this.h)

    this.imgs.forEach((el, i) => {
      const rect = el.getBoundingClientRect()
      const { scrollY, scrollX } = window
      const { width: w, height: h, top: offsetY, left: offsetX } = rect
      this.meshs[i].scale.set(w, h, 1)
      this.meshs[i].position.set(
        scrollX + offsetX - window.innerWidth / 2 + w / 2,
        -(scrollY + offsetY) + window.innerHeight / 2 - h / 2,
        0
      )
    })
  }

  public animate(): void {
    // this.renderer.render(this.scene, this.camera)
    this.composer.render()

    this.shaderMaterials.forEach((shader) => {
      shader.uniforms.uTime.value = performance.now() / 1000
    })
    this.lensPass.uniforms.uTime.value = performance.now() / 1000
    this.lensPass.uniforms.uMouse.value.lerp(this.mouse, 0.2)
    console.log(this.lensPass.uniforms.uMouse.value)
    // this.camera.position.lerp(
    //   new Vector3(0, -window.scrollY, this.cameraZ),
    //   0.2
    // )
    this.noisePass.uniforms.uTime.value = performance.now() / 1000
    // this.noisePass2.uniforms.uTime.value = performance.now() / 1000
    this.camera.position.lerp(
      new Vector3(0, -this.to ? -this.to : -window.scrollY, this.cameraZ),
      0.15
    )

    requestAnimationFrame(() => this.animate())
  }
}
