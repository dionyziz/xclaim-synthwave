const W = 5200
const H = 10000
const N = 60
const STEP = H / N

const City = {
  init: function (scene) {
    this.lines = null
    this.plane = null
    this.geometry = null
    this.scene = scene
    this.wireframe = null
    this.uz = 0.3 // speed at which city is moving
    this.dz = 0 // how deep the city has already moved (modulo STEP)
    this.offset = 0 // how deep the city has already moved
    this.lightIntensity = 20
    this.light = null
    this.cityMaterial = null
    this.lineMaterial = null
    this.initLights()
    this.initMaterials()
    this.initGeometry()
  },
  initMaterials: function () {
    this.cityMaterial = new THREE.MeshPhongMaterial({color: 0x3D596F})
    this.lineMaterial = new THREE.LineBasicMaterial({
      color: 0xFAECD2,
      linewidth: 1,
      linecap: 'round',
      linejoin: 'round'
    })
  },
  initLights: function () {
    this.light = new THREE.DirectionalLight(0xffffff, City.lightIntensity)
    this.light.position.set(0, 100, 300)
    this.scene.add(this.light)
  },
  reapPlaneGeometry: function() {
    this.scene.remove(this.plane)
    this.scene.remove(this.lines)
  },
  initGeometry: function () {
    this.geometry = new THREE.PlaneGeometry(W, H, N, N)
    this.updateGeometry()
  },
  updateGeometry: function () {
    const matrix = new THREE.Matrix4().makeRotationX(-Math.PI / 2)
    this.geometry.applyMatrix(matrix)
    this.protrudeGeometry()
    this.wireframe = new THREE.WireframeGeometry(this.geometry)
    this.lines = new THREE.LineSegments(this.wireframe, this.lineMaterial)
    this.plane = new THREE.Mesh(this.geometry, this.cityMaterial)

    this.lines.material.depthTest = false
    this.lines.material.opacity = 0.25
    this.lines.material.transparent = true
    this.scene.add(this.plane)
    this.scene.add(this.lines)
  },
  integrate: function (dt) {
    let real_uz = dt / 10 * this.uz
    this.dz += real_uz
    this.lines.translateZ(real_uz)
    this.plane.translateZ(real_uz)
    this.lightIntensity = 2 * (Math.sin(timeSinceStart / 2000) + 1)
    this.light.intensity = this.lightIntensity
    if (this.dz > STEP) {
      this.dz -= STEP
      this.offset -= STEP
      this.reapPlaneGeometry()
      this.initGeometry()
      this.lines.translateZ(this.dz)
      this.plane.translateZ(this.dz)
    }
  },
  cityFunc: function(x, z) {
    const realZ = z + this.offset
    const scaling = 3 * (1 - sinc(6 / W * x)**2)
    const city = Math.sin(0.001 * (x + realZ))**2
               + Math.cos(0.0015 * (2 * x + 3 * realZ))**2
               + 0.5 * Math.sin(0.03 * (7 * x - 5 * realZ))**2
    return scaling * city
  },
  protrudeGeometry: function () {
    for (let vertex of this.geometry.vertices) {
      vertex.y = 100 * this.cityFunc(vertex.x, vertex.z)
    }
  }
}
