import { RefObject } from 'react'
import BaseCanvas from './baseCanvas'
import {
  AmbientLight,
  BufferGeometry,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Points,
  RawShaderMaterial,
  ReinhardToneMapping,
  Texture,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import frag from '../glsl/exploding.frag'
import vert from '../glsl/exploding.vert'
import video01f from '../img/video-01-first.jpg'
import video01e from '../img/video-01-end.jpg'
import video02f from '../img/video-02-first.jpg'
import video02e from '../img/video-02-end.jpg'
import video03f from '../img/video-03-first.jpg'
import video03e from '../img/video-03-end.jpg'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
// import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { SlowMo } from 'gsap/EasePack'

gsap.registerPlugin(CustomEase, SlowMo)

export default class ExplodingParticle extends BaseCanvas {
  shaderMaterial?: RawShaderMaterial
  controls?: OrbitControls
  composer?: EffectComposer
  unrealBloomPass!: UnrealBloomPass
  imageAspect: number
  videoRef: RefObject<Element>
  textRef: RefObject<Element>
  camera!: PerspectiveCamera
  points!: Points
  images!: {
    start: Texture
    end: Texture
  }[]
  prev: number
  next: number

  constructor(
    ref: RefObject<Element>,
    videoRef: RefObject<Element>,
    textRef: RefObject<Element>
  ) {
    super(ref)
    this.videoRef = videoRef
    this.textRef = textRef
    this.imageAspect = 480 / 820
    this.prev = 0
    this.next = this.prev + 1

    this.setRenderer()
    this.renderer.setPixelRatio(1)
    this.setScene()
    this.setCamera()
    this.setMesh()
    this.setComposer()
    this.setGUI()
    this.setControls()
    this.animate()

    this.slideShow()
    window.addEventListener('resize', () => {
      this.onResize()
    })
  }

  public setRenderer(): void {
    this.renderer = new WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: false,
      stencil: false,
      depth: false,
    })
    this.renderer.setClearColor(0x000000)
    this.renderer.setPixelRatio(Math.min(1, window.devicePixelRatio))
    this.renderer.setSize(this.w, this.h)
    this.renderer.shadowMap.enabled = true
    this.renderer.toneMapping = ReinhardToneMapping
    // this.renderer.toneMappingExposure = 1.0
    this.canvas = this.ref.current?.appendChild(this.renderer.domElement)!
  }

  public setGUI(): void {
    const gui = new GUI()
    const param = {
      dist: 0,
      distX: 0,
      distY: 0,
      distZ: 0,
      exposure: 1.0,
      threshold: 0,
      strength: 0,
      radius: 0,
      progress: 0,
    }

    gui.add(param, 'dist', 0, 5).onChange((value: number) => {
      this.shaderMaterial!.uniforms.uDistortion.value = value
    })
    gui.add(param, 'distX', 0, 10).onChange((value: number) => {
      this.shaderMaterial!.uniforms.uDistX.value = value
    })
    gui.add(param, 'distY', 0, 10).onChange((value: number) => {
      this.shaderMaterial!.uniforms.uDistY.value = value
    })
    gui.add(param, 'distZ', 0, 10).onChange((value: number) => {
      this.shaderMaterial!.uniforms.uDistZ.value = value
    })
    gui.add(param, 'threshold', 0, 1.0).onChange((value: string) => {
      this.unrealBloomPass!.threshold = Number(value)
    })
    gui.add(param, 'strength', 0, 10).onChange((value: string) => {
      this.unrealBloomPass!.strength = Number(value)
    })
    gui.add(param, 'radius', 0, 1.0).onChange((value: string) => {
      this.unrealBloomPass!.radius = Number(value)
    })
    gui.add(param, 'progress', 0, 1.0).onChange((value: string) => {
      this.shaderMaterial!.uniforms.uProgress.value = Number(value)
    })
    gui.add(param, 'exposure', 0, 2.0).onChange((value: string) => {
      this.renderer.toneMappingExposure = Math.pow(Number(value), 4.0)
    })
  }

  public setMesh(): void {
    const geometry = new PlaneGeometry(1, 1, 480, 820)
    const textureLoader = new TextureLoader()
    const texture01f = textureLoader.load(video01f),
      texture01e = textureLoader.load(video01e),
      texture02f = textureLoader.load(video02f),
      texture02e = textureLoader.load(video02e),
      texture03f = textureLoader.load(video03f),
      texture03e = textureLoader.load(video03e)

    this.images = [
      {
        start: texture01f,
        end: texture01e,
      },
      {
        start: texture02f,
        end: texture02e,
      },
      {
        start: texture03f,
        end: texture03e,
      },
    ]

    // const material = new MeshNormalMaterial({
    //   side: DoubleSide,
    // })
    this.shaderMaterial = new RawShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        uDistortion: {
          value: 0,
        },
        uDistY: {
          value: 0,
        },
        uDistX: { value: 0 },
        uDistZ: { value: 0 },
        uTexture01: {
          value: texture01f,
        },
        uTexture02: {
          value: texture01e,
        },
        uTexture03: {
          value: texture02f,
        },
        uTexture04: {
          value: texture02e,
        },
        uCurrentTexture: {
          value: texture01e,
        },
        uNextTexture: {
          value: texture02f,
        },
        uTime: {
          value: 0,
        },
        uProgress: {
          value: 0,
        },
      },
      side: DoubleSide,
    })
    // const mesh = new Mesh(geometry, this.shaderMaterial)
    this.points = new Points(geometry, this.shaderMaterial)
    this.points.scale.x = this.h * 0.6 * this.imageAspect
    this.points.scale.y = this.h * 0.6
    this.scene.add(this.points)
  }

  public slideShow(): void {
    const shader = this.shaderMaterial!.uniforms

    const videos = gsap.utils.selector(this.videoRef.current)(
      'video'
    ) as unknown as HTMLVideoElement[]
    console.log(videos)

    const texts = gsap.utils.selector(this.textRef.current)(
      'div'
    ) as unknown as HTMLDivElement[]
    console.log(texts)

    const textSplit = (el: Element) => {
      let letter = el.textContent?.split('')
      console.log(letter)
      const t = letter!.reduce(
        (c, n) => (n === ' ' ? c + n : c + `<span class="char">${n}</span>`),
        ''
      )
      console.log(t)
      el.innerHTML = t
    }

    texts.forEach((text, i) => {
      textSplit(text)

      if (i > 0) {
        gsap.set(text.children, {
          yPercent: 100,
        })
      }

      // gsap
      //   .timeline({ repeat: -1 })
      //   .fromTo(
      //     texts[0].children,
      //     {
      //       yPercent: 100,
      //     },
      //     {
      //       yPercent: 0,
      //       delay: 1,
      //       stagger: {
      //         each: 0.06,
      //         ease: 'sine.in',
      //       },
      //       duration: 0.8,
      //       ease: 'quint.out',
      //       // ease: 'slow(0.7, 0.7, false)',
      //     }
      //   )
      //   .to(texts[0].children, {
      //     yPercent: -100,
      //     duration: 0.8,
      //     ease: 'quint.in',
      //     // ease: 'slow(0.7, 0.7, false)',
      //     delay: 1,
      //     stagger: {
      //       each: 0.06,
      //       ease: 'sine.out',
      //     },
      //   })
    })

    const textAnimationIn = (el: Element) => {
      gsap.fromTo(
        el.children,
        {
          yPercent: 100,
        },
        {
          yPercent: 0,
          delay: 1,
          stagger: {
            each: 0.06,
            ease: 'sine.in',
          },
          duration: 0.8,
          ease: 'quint.out',
        }
      )
    }

    const textAnimationOut = (el: Element) => {
      gsap.to(el.children, {
        yPercent: -100,
        duration: 0.8,
        ease: 'quint.in',
        delay: 1,
        stagger: {
          each: 0.06,
          ease: 'sine.out',
        },
      })
    }

    CustomEase.create('custom1', 'M0,0 C0.234,0 0.08,1 1,1 ')
    CustomEase.create('custom2', 'M0,0,C0.466,0,-0.062,1,1,1')
    CustomEase.create('custom3', 'M0,0,C0.466,0,0.246,1,1,1')

    for (const video of videos) {
      gsap.set(video, { autoAlpha: 0 })

      video.addEventListener('play', () => {
        gsap.to(video, {
          autoAlpha: 1,
          duration: 0.1,
        })
      })

      video.addEventListener('ended', () => {
        gsap
          .timeline()
          .to(video, {
            autoAlpha: 0,
            duration: 0.2,
            ease: 'linear',
            onComplete: () => {
              video.currentTime = 0
            },
          })
          .to(
            this.unrealBloomPass,
            {
              strength: 0.2,
              duration: 0.2,
              ease: 'linear',
            },
            '<'
          )
          .to(shader.uDistortion, {
            value: 3.5,
            duration: 1.5,
            ease: 'cubic.inOut',
          })
          .to(
            this.unrealBloomPass,
            {
              strength: 5,
              duration: 1.5,
              ease: 'cubic.inOut',
            },
            '<'
          )
          .to(
            shader.uProgress,
            {
              value: 1,
              duration: 3,
              ease: 'quad.inOut',
              onStart: () => {
                textAnimationOut(texts[this.prev])
              },
              onComplete: () => {
                textAnimationIn(texts[this.next])
              },
            },
            '-=1.5'
          )
          .to(
            shader.uDistortion,
            {
              value: 0,
              duration: 2.0,
              ease: 'custom3',
              onComplete: () => {
                this.prev = this.next

                if (this.next < videos.length - 1) {
                  this.next += 1
                } else {
                  this.next = 0
                }

                console.log(`${this.prev}, ${this.next}`)

                gsap.to(videos[this.prev], {
                  autoAlpha: 1,
                  duration: 0.2,
                  ease: 'cubic.in',
                  onComplete: () => {
                    console.log(videos[this.prev])
                    setTimeout(() => {
                      slide()
                    })
                  },
                })

                gsap.to(this.unrealBloomPass, {
                  strength: 0,
                  duration: 0.2,
                  ease: 'cubic.in',
                })
              },
            },
            '-=0.5'
          )
          .to(
            this.unrealBloomPass,
            {
              strength: 0.2,
              duration: 2,
              ease: 'custom3',
            },
            '<'
          )
      })
    }

    const slide = async () => {
      await videos[this.prev].play()
      shader.uCurrentTexture.value = this.images[this.prev].end
      shader.uNextTexture.value = this.images[this.next].start
      shader.uProgress.value = 0
    }

    slide()
  }

  public setControls(): void {
    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true
    this.controls.enableZoom = false
  }

  public setComposer(): void {
    // const ambientLight = new AmbientLight(0xffffff, 1.0)
    // this.scene.add(ambientLight)
    // const pointLight = new PointLight(0xffffff, 1.0)
    // this.camera.add(pointLight)

    this.composer = new EffectComposer(this.renderer)
    const renderPass = new RenderPass(this.scene, this.camera)
    this.unrealBloomPass = new UnrealBloomPass(
      new Vector2(this.w, this.h),
      0,
      0.5,
      0.01
    )
    // this.unrealBloomPass.enabled = false

    this.composer.addPass(renderPass)
    this.composer.addPass(this.unrealBloomPass)
  }

  public onResize(): void {
    this.rect = this.ref.current!.getBoundingClientRect()
    this.w = this.rect.width
    this.h = this.rect.height
    this.renderer.setSize(this.w, this.h)
    this.camera.aspect = this.w / this.h
    const rad = ((this.fov! / 2) * Math.PI) / 180
    this.cameraZ = this.h / 2 / Math.tan(rad)
    this.camera.position.z = this.cameraZ
    this.camera.updateProjectionMatrix()
    this.points.scale.x = this.h * 0.6 * this.imageAspect
    this.points.scale.y = this.h * 0.6
  }

  public animate(): void {
    // this.renderer.render(this.scene, this.camera)
    this.composer!.render()
    this.controls?.update()

    this.shaderMaterial!.uniforms.uTime.value = performance.now() / 1000

    requestAnimationFrame(() => this.animate())
  }
}
