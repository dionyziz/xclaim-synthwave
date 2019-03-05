const FOG_INTENSITY = 0.0004
const FOG_COLOR = 0x000000
const SIMULATION_SPEED = 2
let scene, textScene, renderer, camera

function initScene() {
  let fogColor = new THREE.Color(FOG_COLOR)
  let fog = new THREE.FogExp2(fogColor, FOG_INTENSITY)
  scene = new THREE.Scene(fog)
  scene.background = fogColor
  scene.fog = fog
  textScene = new THREE.Scene()

  Camera.init(renderer)
}

function init() {
  renderer = new THREE.WebGLRenderer({antialias: true})
  renderer.autoClear = false
  document.body.appendChild(renderer.domElement)

  initScene()
  Billboard.init(textScene)
  City.init(scene)
}

let t = (new Date()) | 0
let timeSinceStart = 0

function integrate(dt) {
  Billboard.integrate(dt)
  City.integrate(dt)
}

function render() {
  requestAnimationFrame(render)

  let dt = ((new Date()) | 0) - t
  dt *= SIMULATION_SPEED
  t = (new Date()) | 0

  timeSinceStart += dt

  integrate(dt)

  renderer.clear()
  renderer.render(scene, Camera.camera)
  renderer.render(textScene, Camera.camera)
}

let initialized = false

video.load()
video.addEventListener('canplaythrough', () => {
  if (initialized) {
    return
  }
  if (video.paused) {
    video.play()
  }
  init()
  render()
  window.addEventListener('resize', Camera.adjustViewport, false)
  initialized = true
}, false)
