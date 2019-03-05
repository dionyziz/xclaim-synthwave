const Billboard = {
  init: function (scene) {
    this.scene = scene
    this.textMesh = null
    this.billboardRotation = 0
    this.rotating = true
    this.rotationTheta = 0
    this.ROTATION_SPEED = 0.0003
    this.initGeometry()
    this.initLights()
  },
  initGeometry: function () {
    const video = document.getElementsByTagName('video')[0]
    const billboardTexture = new THREE.VideoTexture(video)
    billboardTexture.minFilter = THREE.LinearFilter
    billboardTexture.magFilter = THREE.LinearFilter
    billboardTexture.format = THREE.RGBFormat
    const textBillboardGeometry = new THREE.PlaneGeometry(480, 287, 1, 1)
    const textMaterial = new THREE.MeshBasicMaterial({
      map: billboardTexture, side: THREE.DoubleSide
    })
    this.textMesh = new THREE.Mesh(textBillboardGeometry, textMaterial)
    this.textMesh.position.set(0, 400, -300)

    Billboard.scene.add(this.textMesh)
  },
  initLights: function () {
    const textLight = new THREE.SpotLight(0xffffff)
    textLight.position.set(50, 500, 400)
    textLight.intensity = 0.5
    textLight.decay = 0.1
    textLight.penumbra = 0.8
    Billboard.scene.add(textLight)
  },
  integrate: function (dt) {
    if (this.rotating) {
      this.textMesh.rotateY(-this.billboardRotation)
      this.rotationTheta += this.ROTATION_SPEED * dt
      this.billboardRotation = 2 * Math.PI * Math.sin(this.rotationTheta)**2
      this.textMesh.rotateY(+this.billboardRotation)
      if (this.rotationTheta >= Math.PI / 2) {
        this.textMesh.rotateY(-this.billboardRotation)
        this.rotating = false
      }
    }
  }
}
