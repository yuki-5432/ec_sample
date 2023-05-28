import { saveProduct } from './../features/product/productSlice'
import * as THREE from 'three'
import { RefObject } from 'react'
import BaseCanvas from './baseCanvas'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import {
  BufferGeometry,
  DoubleSide,
  Mesh,
  Points,
  RawShaderMaterial,
} from 'three'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import vert from './../glsl/morphing.vert'
import frag from '../glsl/morphing.frag'
import gsap from 'gsap'

export default class Morphing extends BaseCanvas {
  public controls?: OrbitControls
  private shaderMaterial!: RawShaderMaterial
  private point!: Points
  public gui?: GUI
  public param!: {
    rotationX: number
    rotationY: number
    rotationZ: number
  }
  constructor(ref: RefObject<Element>) {
    super(ref)
    this.param = {
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
    }

    console.log(this.ref)

    this.setRenderer()
    this.setGUI()
    this.setScene()
    this.setCamera()
    this.camera.position.z = 150
    this.setControl()
    this.setMesh()
    this.animate()
  }

  public setGUI(): void {
    this.gui = new GUI()

    this.gui
      .add(this.param, 'rotationX', 0, Math.PI * 2)
      .onChange((value: string) => {
        this.point.rotation.x = Number(value)
      })
  }

  public setControl(): void {
    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
  }

  public async setMesh(): Promise<void> {
    const objLoader = new OBJLoader()
    const modelSrc = [
      '/model/16267_American_Paint_Horse_Nuetral_new.obj',
      '/model/12221_Cat_v1_l3.obj',
    ]

    const objs = await Promise.all(
      modelSrc.map((src) => {
        return objLoader.loadAsync(src)
      })
    )
    const [horse, cat] = objs
    const horseMesh = horse.children[0] as Mesh
    const catMesh = cat.children[0] as Mesh

    const [horsePosition, catPosition] = objs.map((obj) => {
      const mesh = obj.children[0] as Mesh
      return this.getGeometryPosition(mesh.geometry)
    })

    const randomPosition = new Float32Array(30000)
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 300
      const y = (Math.random() - 0.5) * 300
      const z = (Math.random() - 0.5) * 300

      randomPosition.set([x, y, z], i * 3)
    }

    const randomValue = new Float32Array(10000)
    for (let i = 0; i < 10000; i++) {
      const value = Math.random()

      randomValue.set([value], i)
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(horsePosition, 3))
    geo.setAttribute('catPosition', new THREE.BufferAttribute(catPosition, 3))
    geo.setAttribute(
      'randomPosition',
      new THREE.BufferAttribute(randomPosition, 3)
    )
    geo.setAttribute('randomValue', new THREE.BufferAttribute(randomValue, 1))

    console.log(geo)
    const geo2 = new THREE.BufferGeometry()
    geo2.setAttribute('position', new THREE.BufferAttribute(horsePosition, 3))
    const mat = new THREE.PointsMaterial()
    const shaderMaterial = new THREE.RawShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      side: DoubleSide,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      fog: true,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uMorphing: {
          value: 0.0,
        },
        uRandomValue: {
          value: 0.0,
        },
      },
    })

    gsap
      .timeline({ repeat: -1, yoyo: true, repeatDelay: 3.0 })
      .to(shaderMaterial.uniforms.uRandomValue, {
        value: 1.0,
        duration: 2.0,
        ease: 'cubic.inOut',
      })
      .to(shaderMaterial.uniforms.uMorphing, {
        value: 1.0,
        duration: 2.5,
        ease: 'cubic.inOut',
      })
      .to(
        shaderMaterial.uniforms.uRandomValue,
        {
          value: 0.0,
          duration: 2.5,
          ease: 'cubic.inOut',
        },
        '<'
      )
    this.point = new THREE.Points(geo, shaderMaterial)
    this.scene.add(this.point)
  }

  private getGeometryPosition(geometry: BufferGeometry): Float32Array {
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

    return particlesPosition
  }

  public animate(): void {
    this.renderer.render(this.scene, this.camera)
    this.controls!.update()

    if (this.point) {
      this.point.rotation.y += 0.01
      this.point.rotation.z += 0.02
    }
    requestAnimationFrame(() => this.animate())
  }
}

// export default Morphing
