import { RefObject } from 'react'
import * as THREE from 'three'
import {
  AmbientLight,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three'

class BaseCanvas {
  private ref: RefObject<Element>
  public rect!: DOMRect | undefined
  public w!: number
  public h!: number
  protected canvas!: HTMLCanvasElement
  public renderer!: WebGLRenderer
  public scene!: Scene
  public fov: number | undefined
  public cameraZ!: number | undefined
  public camera!: PerspectiveCamera | OrthographicCamera
  public light: AmbientLight | undefined

  constructor(ref: RefObject<Element>) {
    this.ref = ref
    this.rect = ref.current?.getBoundingClientRect()
    this.w = this.rect?.width!
    this.h = this.rect?.height!
  }

  public setRenderer(): void {
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setClearColor(0x000000)
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
    this.renderer.setSize(this.w, this.h)
    this.canvas = this.ref.current?.appendChild(this.renderer.domElement)!
  }

  public setScene(): void {
    this.scene = new THREE.Scene()
  }

  public setCamera(): void {
    this.fov = 60
    const rad = ((this.fov / 2) * Math.PI) / 180
    this.cameraZ = this.h! / 2 / Math.tan(rad)
    console.log(this.cameraZ + 10)
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      this.w / this.h,
      0.1,
      2000
    )
    this.camera.position.z = this.cameraZ + 20
  }

  public animate(): void {
    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(this.animate.bind(this))
  }
}

export default BaseCanvas
