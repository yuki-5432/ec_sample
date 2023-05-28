import * as THREE from 'three'
import { RefObject } from 'react'
import BaseCanvas from './baseCanvas'
import vert from '../glsl/ripple.vert'
import frag from '../glsl/ripple.frag'
import img from '../img/marco-xu-cZAj2txBFO8-unsplash.jpg'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
// import img from '../img/150x150.png'
import {
  BufferAttribute,
  BufferGeometry,
  Float32BufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  RawShaderMaterial,
  TextureLoader,
  Vector2,
} from 'three'
import gsap from 'gsap'
import MotionPathPlugin from 'gsap/MotionPathPlugin'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

gsap.registerPlugin(MotionPathPlugin)

class Ripple extends BaseCanvas {
  private material!: RawShaderMaterial
  private mouse!: Vector2
  private mouseDiff!: Vector2

  constructor(ref: RefObject<Element>) {
    super(ref)
    console.log(ref.current)
    this.mouse = new THREE.Vector2(0, 0)
    this.mouseDiff = new THREE.Vector2(0, 0)

    this.setRenderer()
    this.setCamera()
    this.setScene()
    this.camera.position.z = 200
    this.setMesh()
    this.animate()
    // this.getGeometryPosition(new THREE.PlaneGeometry(10, 10, 10, 10))
  }

  private async setMesh(): Promise<void> {
    this.canvas.addEventListener('mousemove', (e) => {
      const x = (e.clientX / this.w) * 2.0 - 1.0
      const y = (-e.clientY / this.h) * 2.0 + 1.0
      this.mouse.set(x, y)
    })

    const loader = new THREE.TextureLoader()
    const texture = loader.load(img)

    const geometry = new THREE.PlaneGeometry(this.w, this.h, 1, 1)
    // const material = new THREE.MeshNormalMaterial()
    this.material = new THREE.RawShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture },
        uMouseDiff: { value: { x: 0, y: 0 } },
      },
    })
    const mesh = new THREE.Mesh(geometry, this.material)

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(200, 200, 200),
      new THREE.MeshNormalMaterial()
    )

    const light = new THREE.DirectionalLight(0xffffff, 1.0)
    light.position.set(100, 100, 0)
    this.scene.add(light)

    const textureLoader = new THREE.TextureLoader()
    const objLoader = new OBJLoader()
    const mtlLoader = new MTLLoader()
    const wrap = new THREE.Object3D()
    // this.scene.add(wrap)

    const wrapani = () => {
      wrap.rotation.y += 0.01

      requestAnimationFrame(wrapani)
    }

    wrapani()

    const group = new THREE.Object3D()
    this.scene.add(group)

    mtlLoader.load('/model/12140_Skull_v3_L2.mtl', (material) => {
      material.preload()

      objLoader.setMaterials(material)

      objLoader.load('/model/12140_Skull_v3_L2.obj', (object) => {
        // object.scale.set(100, 100, 100)

        wrap.add(object)
      })
    })

    const nomalMaterial = new THREE.MeshNormalMaterial()

    const cat = objLoader.load('/model/cat.obj', (obj) => {
      obj.scale.set(0.1, 0.1, 0.1)
      console.log(obj)
      // group.add(obj)
      const cat = obj.children[0] as Mesh

      cat.material = nomalMaterial

      console.log(cat)

      // this.scene.add(obj)
    })

    const catObj = await objLoader.loadAsync('/model/cat.obj')
    const catMesh = catObj.children[0] as Mesh

    const catPos = catMesh.geometry.getAttribute('position')
    console.log(catPos)
    const catP = this.getGeometryPosition(catMesh.geometry)
    console.log(catP)

    const bufferGeo = new THREE.BufferGeometry()
    const pointsMaterial = new THREE.PointsMaterial()
    bufferGeo.setAttribute('position', new THREE.BufferAttribute(catP, 3))

    const point = new THREE.Points(bufferGeo, pointsMaterial)
    point.scale.set(0.1, 0.1, 0.1)
    // const test = this.getGeometryPosition(
    //   new THREE.PlaneGeometry(34, 80, 100, 100)
    // )
    // console.log(test)
    point.position.y -= 100
    this.scene.add(point)

    // this.scene.add(sphere)
    // this.scene.add(mesh)
  }

  getGeometryPosition(geometry: BufferGeometry): Float32Array {
    const particleIntensity = 10000

    const material = new THREE.MeshBasicMaterial()
    const mesh = new THREE.Mesh(geometry, material)
    const sampler = new MeshSurfaceSampler(mesh).build()
    const particlesPosition = new Float32Array(particleIntensity * 3)
    for (let i = 0; i < particleIntensity; i++) {
      const newPosition = new THREE.Vector3()
      const normal = new THREE.Vector3()
      sampler.sample(newPosition, normal)
      particlesPosition.set(
        [newPosition.x, newPosition.y, newPosition.z],
        i * 3
      )
    }

    console.log(particlesPosition)
    return particlesPosition
  }

  animate(): void {
    this.renderer.render(this.scene, this.camera)

    this.material.uniforms.uTime.value = performance.now() / 1000
    this.mouseDiff.lerp(this.mouse, 0.02)
    this.material.uniforms.uMouseDiff.value = {
      x: this.mouse.x - this.mouseDiff.x,
      y: this.mouse.y - this.mouseDiff.y,
    }

    requestAnimationFrame(() => this.animate())
  }
}

export default Ripple
