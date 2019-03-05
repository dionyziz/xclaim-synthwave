const FOV = 75
const CLIP_NEAR = 0.1
const CLIP_FAR = 10000

const Camera = {
  init: function(renderer) {
    this.camera = new THREE.PerspectiveCamera(
      FOV, window.innerWidth / window.innerHeight, CLIP_NEAR, CLIP_FAR
    )

    this.camera.position.x = 0
    this.camera.position.y = 200
    this.camera.position.z = 300

    this.renderer = renderer

    this.adjustViewport()
  },
  adjustViewport: function() {
    Camera.camera.aspect = window.innerWidth / window.innerHeight
    Camera.camera.updateProjectionMatrix()
    Camera.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}
