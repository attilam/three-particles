/* global THREE */
THREE = require('three')
require('./js/controls/OrbitControls')
const Detector = require('./js/Detector')
const Stats = require('./js/libs/stats.min')

if (!Detector.webgl) Detector.addGetWebGLMessage()

let container, camera, renderer, scene, controls, stats

let particleSystem, particlesGeometry
let particleCount = 250000

init()
setupScene()
animate()

function init () {
  container = document.createElement('div')
  document.body.appendChild(container)

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight)
  camera.position.set(0, 0, -1000)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000, 0)

  container.appendChild(renderer.domElement)
  window.addEventListener('resize', onWindowResize, false)

  const gl = renderer.getContext()
  gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE)

  stats = new Stats()
  container.appendChild(stats.dom)
}

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

function setupScene () {
  scene = new THREE.Scene()

  particlesGeometry = new THREE.Geometry()
  let pMaterial = new THREE.PointsMaterial({
    color: 0x222222,
    size: 20,
    map: THREE.ImageUtils.loadTexture('assets/particle.png'),
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    transparent: true
  })

  for (let p = 0; p < particleCount; p++) {
    let pX = Math.random() * 800 - 400
    let pY = Math.random() * 500 - 200
    let pZ = Math.random() * 800 - 400

    let particle = new THREE.Vector3(pX, pY, pZ)
    particle.velocity = new THREE.Vector3(0, -Math.random(), 0)
    particlesGeometry.vertices.push(particle)
  }

  particleSystem = new THREE.Points(particlesGeometry, pMaterial)
  particleSystem.renderOrder = 999
  scene.add(particleSystem)

  controls = new THREE.OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.1
  controls.target.set(0, 0, 0)
  controls.update()
}

function animate () {
  requestAnimationFrame(animate)

  particleSystem.rotation.y += 0.001

  for (let count = 0; count < particleCount; count++) {
    let particle = particlesGeometry.vertices[count]

    if (particle.y < -250) {
      particle.y = -250
      particle.velocity.y = -particle.velocity.y
    }

    particle.velocity.y -= Math.random() * 0.1

    particle.add(particle.velocity)
  }

  particleSystem.geometry.verticesNeedUpdate = true

  stats.update()
  controls.update()
  renderer.render(scene, camera)
}
