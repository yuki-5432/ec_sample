import { RefObject } from 'react'
import {
  AmbientLight,
  BackSide,
  Color,
  DirectionalLight,
  DoubleSide,
  Euler,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Quaternion,
  RawShaderMaterial,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  TextureLoader,
  Vector3,
  WebGLRenderTarget,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import BaseCanvas from './baseCanvas'
import vert from '../glsl/teleportation.vert'
import frag from '../glsl/teleportation.frag'
import img from '../img/AdobeStock_361416223 (1).jpeg'
import earth from '../img/earthmap1k.jpg'
import { gsap } from 'gsap'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
// import { Text } from 'troika-three-text'
import textVert from '../glsl/text.vert'
import textFrag from '../glsl/text.frag'

export default class Teleportation extends BaseCanvas {
  controls?: OrbitControls
  shaderMaterial?: RawShaderMaterial
  point?: {
    title: string
    coords: {
      lat: number
      lng: number
    }
  }[]
  prevRenderTarget?: WebGLRenderTarget
  nextRenderTarget?: WebGLRenderTarget
  prevScene?: Scene
  nextScene?: Scene
  prevCamera?: PerspectiveCamera
  nextCamera?: PerspectiveCamera
  gui?: GUI

  constructor(ref: RefObject<Element>) {
    super(ref)

    this.point = [
      {
        title: 'Kyiv',
        coords: {
          lat: 50.4501,
          lng: 30.5234,
        },
      },
      {
        title: 'Cancun',
        coords: {
          lat: 21.1619,
          lng: -87.8515,
        },
      },
      {
        title: 'Paris',
        coords: {
          lat: 43.29,
          lng: 2.3522,
        },
      },
      {
        title: 'Tokyo',
        coords: {
          lat: 35.689,
          lng: 139.691,
        },
      },
    ]

    this.setRenderer()
    this.setScene()
    this.scene.background = new Color(0xffffff)
    this.setCamera()
    this.setOffscreen()
    this.setMesh()
    this.setPlane()
    this.setScreen()
    this.setGUI()
    this.setLight()
    this.setControls()
    this.animate()

    console.log(Math.pow(0.5, 10))
  }

  private setOffscreen(): void {
    this.prevRenderTarget = new WebGLRenderTarget(this.w, this.h)
    this.nextRenderTarget = new WebGLRenderTarget(this.w, this.h)

    this.prevScene = new Scene()
    this.prevScene!.background = new Color(0xffffff)
    this.nextScene = new Scene()

    this.prevCamera = new PerspectiveCamera(60, this.w / this.h, 0.1, 10000)
    this.prevCamera.position.z = this.cameraZ!
    this.nextCamera = new PerspectiveCamera(60, this.w / this.h, 0.1, 10000)
    this.nextCamera.position.z = this.cameraZ!
  }

  public setLight(): void {
    const ambientLight = new AmbientLight(0xffffff, 0.5)
    const directionalLight = new DirectionalLight(0xffffff, 1.0)
    directionalLight.position.set(this.w / 2, this.h, 200)
    this.scene.add(ambientLight)
    this.scene.add(directionalLight)
    this.prevScene!.add(ambientLight)
    this.prevScene!.add(directionalLight)
    this.nextScene!.add(ambientLight)
    this.nextScene!.add(directionalLight)
  }

  public async setMesh(): Promise<void> {
    const textureLoader = new TextureLoader()
    const texture = textureLoader.load(img)
    const sphere = new SphereGeometry(1000, 100, 100)
    const material = new MeshLambertMaterial({
      map: texture,
      side: BackSide,
    })
    const mesh = new Mesh(sphere, material)
    // this.scene.add(mesh)
    this.nextScene?.add(mesh)

    const fontLoader = new FontLoader()
    const font = await fontLoader.loadAsync(
      '/font/Cormorant-Garamond_Bold.json'
    )
    console.log(font)
    console.log(performance.now() / 1000)
    const textGeometry = new TextGeometry('TOKYO', {
      font: font,
      size: 160,
      height: 2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 8,
      bevelOffset: 0,
      bevelSegments: 5,
    })
    textGeometry.center()

    const textMaterial = new ShaderMaterial({
      vertexShader: textVert,
      fragmentShader: textFrag,
    })
    // const textMaterial = new MeshPhongMaterial({ color: 0xffffff })
    const text = new Mesh(textGeometry, textMaterial)
    text.position.z = -200
    this.nextScene?.add(text)
  }

  public setPlane(): void {
    const geometry = new SphereGeometry(200, 30, 30)

    const material = new MeshBasicMaterial({
      map: new TextureLoader().load(earth),
    })

    const group = new Group()

    const list = document.getElementById('list')

    this.point?.forEach((point) => {
      const obj = this.calcPosFromLatLonRad(point.coords.lat, point.coords.lng)

      const { vector, quaternion } = obj

      const mesh = new Mesh(
        new SphereGeometry(10, 30, 30),
        new MeshBasicMaterial({ color: 0xff0000 })
      )

      group.add(mesh)
      mesh.position.set(vector.x * 200, vector.y * 200, vector.z * 200)

      const el = document.createElement('div')
      el.innerText = point.title
      list?.appendChild(el)

      let animateQuaternion = new Quaternion(),
        currentQuaternion = new Quaternion()

      el.addEventListener('click', () => {
        let o = { p: 0 }

        currentQuaternion.copy(group.quaternion)
        gsap
          .timeline()
          .to(o, {
            p: 1,
            duration: 1,
            ease: 'quint.inOut',
            onUpdate: () => {
              animateQuaternion.slerpQuaternions(
                currentQuaternion,
                quaternion,
                o.p
              )
              group.quaternion.copy(animateQuaternion)
            },
          })
          .to(
            this.shaderMaterial!.uniforms.uValue,
            {
              value: 1.0,
              duration: 1.0,
              // ease: 'quint.out',
            },
            '-=0.4'
          )
      })
    })

    const mesh = new Mesh(geometry, material!)
    // mesh.rotation.y += 0.25
    group.add(mesh)

    // this.scene.add(group)
    this.prevScene!.add(group)
  }

  private setScreen(): void {
    const plane = new PlaneGeometry(this.w, this.h, 1, 1)
    this.shaderMaterial = new RawShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      side: DoubleSide,
      uniforms: {
        uPrevScene: {
          value: null,
        },
        uNextScene: {
          value: null,
        },
        uValue: {
          value: 0.0,
        },
      },
    })
    const mesh = new Mesh(plane, this.shaderMaterial)
    this.scene.add(mesh)

    // gsap.to(this.shaderMaterial.uniforms.uValue, {
    //   value: 1,
    //   duration: 2.0,
    // })
  }

  private setGUI(): void {
    this.gui = new GUI()

    const param = {
      value1: 0,
    }

    this.gui.add(param, 'value1', 0, 1).onChange((v: number) => {
      this.shaderMaterial!.uniforms.uValue.value = Number(v)
    })
  }

  public setControls(): void {
    this.controls = new OrbitControls(this.nextCamera!, this.canvas)
    this.controls.enableDamping = true
    this.controls.enableZoom = false
  }

  public animate(): void {
    this.renderer.setRenderTarget(this.prevRenderTarget!)
    this.renderer.render(this.prevScene!, this.prevCamera!)
    this.shaderMaterial!.uniforms.uPrevScene.value =
      this.prevRenderTarget?.texture

    this.renderer.setRenderTarget(this.nextRenderTarget!)
    this.renderer.render(this.nextScene!, this.nextCamera!)
    this.shaderMaterial!.uniforms.uNextScene.value =
      this.nextRenderTarget?.texture

    this.renderer.setRenderTarget(null)
    this.renderer.render(this.scene, this.camera)

    this.controls!.update()

    requestAnimationFrame(() => this.animate())
  }

  public calcPosFromLatLonRad(
    lat: number,
    lon: number
  ): { vector: Vector3; quaternion: Quaternion } {
    const phi = lat * (Math.PI / 180)
    const theta = (lon + 180) * (Math.PI / 180)
    const theta1 = (270 - lon) * (Math.PI / 180)
    let x = -(Math.cos(phi) * Math.cos(theta))
    let z = Math.cos(phi) * Math.sin(theta)
    let y = Math.sin(phi)
    const vector = new Vector3(x, y, z)
    const euler = new Euler(phi, theta1, 0, 'XYZ')
    const quaternion = new Quaternion().setFromEuler(euler)
    return { vector, quaternion }
  }
}
