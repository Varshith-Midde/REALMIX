// Real-Life Quest: Interactive 3D Three.js Background & Spatial Scene
// Features floating RPG polyhedral crystals, particle starfields, and 3D shockwaves

class ThreeRpgScene {
  constructor() {
    this.canvas = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.crystals = [];
    this.stars = null;
    this.shockwaves = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetCameraX = 0;
    this.targetCameraY = 0;
    this.initialized = false;
  }

  init() {
    this.canvas = document.getElementById('threeDCanvas');
    if (!this.canvas || typeof THREE === 'undefined') {
      console.log('Three.js or canvas not present, continuing without 3D scene');
      return;
    }

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 30;

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x4a148c, 0.8);
    this.scene.add(ambientLight);

    const goldPoint = new THREE.PointLight(0xf59e0b, 2.5, 60);
    goldPoint.position.set(15, 10, 15);
    this.scene.add(goldPoint);

    const purplePoint = new THREE.PointLight(0xa855f7, 3, 60);
    purplePoint.position.set(-15, -10, 10);
    this.scene.add(purplePoint);

    const cyanPoint = new THREE.PointLight(0x06b6d4, 1.8, 50);
    cyanPoint.position.set(0, 15, -10);
    this.scene.add(cyanPoint);

    // 4. Floating 3D RPG Polyhedra & Crystals
    this.createFloatingPolyhedra();

    // 5. Starfield & Arcane Dust
    this.createStarfield();

    // 6. Event listeners
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    this.initialized = true;
    this.animate();
  }

  createFloatingPolyhedra() {
    // Geometries: D20 (Icosahedron), Octahedron, Dodecahedron
    const geometries = [
      new THREE.IcosahedronGeometry(2.2, 0),
      new THREE.OctahedronGeometry(2.0, 0),
      new THREE.DodecahedronGeometry(1.8, 0),
      new THREE.TetrahedronGeometry(2.0, 0)
    ];

    const materials = [
      new THREE.MeshPhysicalMaterial({
        color: 0x9333ea,
        emissive: 0x3b0764,
        roughness: 0.2,
        metalness: 0.8,
        wireframe: false,
        transparent: true,
        opacity: 0.75,
        clearcoat: 1.0
      }),
      new THREE.MeshPhysicalMaterial({
        color: 0xf59e0b,
        emissive: 0x78350f,
        roughness: 0.2,
        metalness: 0.9,
        wireframe: false,
        transparent: true,
        opacity: 0.8,
        clearcoat: 1.0
      }),
      new THREE.MeshPhysicalMaterial({
        color: 0x06b6d4,
        emissive: 0x083344,
        roughness: 0.3,
        metalness: 0.7,
        wireframe: false,
        transparent: true,
        opacity: 0.7,
        clearcoat: 0.8
      })
    ];

    // Wireframe overlay materials for technical RPG crystal look
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });

    const spawnPoints = [
      { x: -18, y: 8, z: -10, rotSpeed: 0.008 },
      { x: 19, y: 10, z: -8, rotSpeed: 0.007 },
      { x: -20, y: -10, z: -5, rotSpeed: 0.009 },
      { x: 20, y: -8, z: -12, rotSpeed: 0.006 },
      { x: 0, y: -16, z: -15, rotSpeed: 0.01 }
    ];

    spawnPoints.forEach((pt, i) => {
      const geo = geometries[i % geometries.length];
      const mat = materials[i % materials.length];

      const mesh = new THREE.Mesh(geo, mat);
      const wire = new THREE.Mesh(geo, wireframeMat);
      mesh.add(wire);

      mesh.position.set(pt.x, pt.y, pt.z);
      mesh.userData = {
        baseY: pt.y,
        rotSpeedX: pt.rotSpeed,
        rotSpeedY: pt.rotSpeed * 1.3,
        floatSpeed: 0.0015 + (i * 0.0005),
        floatOffset: i * 1.5
      };

      this.scene.add(mesh);
      this.crystals.push(mesh);
    });
  }

  createStarfield() {
    const starCount = 300;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const palette = [
      new THREE.Color(0xa855f7),
      new THREE.Color(0xf59e0b),
      new THREE.Color(0x38bdf8),
      new THREE.Color(0xffffff)
    ];

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 5;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    this.stars = new THREE.Points(starGeo, starMat);
    this.scene.add(this.stars);
  }

  triggerShockwave(color = 0xa855f7) {
    if (!this.initialized) return;

    const ringGeo = new THREE.RingGeometry(0.5, 1.2, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1
    });

    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(0, 0, 5);
    ring.userData = { scale: 1, maxScale: 35, opacity: 1 };

    this.scene.add(ring);
    this.shockwaves.push(ring);
  }

  onMouseMove(e) {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = -(e.clientY / window.innerHeight) * 2 + 1;

    this.targetCameraX = normX * 4;
    this.targetCameraY = normY * 3;
  }

  onResize() {
    if (!this.renderer || !this.camera) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = Date.now();

    // Smooth camera parallax
    this.camera.position.x += (this.targetCameraX - this.camera.position.x) * 0.05;
    this.camera.position.y += (this.targetCameraY - this.camera.position.y) * 0.05;
    this.camera.lookAt(0, 0, 0);

    // Rotate & float 3D crystals
    this.crystals.forEach(c => {
      c.rotation.x += c.userData.rotSpeedX;
      c.rotation.y += c.userData.rotSpeedY;
      c.position.y = c.userData.baseY + Math.sin((time * c.userData.floatSpeed) + c.userData.floatOffset) * 1.5;
    });

    // Slow ambient rotation of starfield
    if (this.stars) {
      this.stars.rotation.y += 0.0004;
      this.stars.rotation.x += 0.0002;
    }

    // Animate active shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.userData.scale += 0.8;
      sw.userData.opacity -= 0.025;
      sw.scale.set(sw.userData.scale, sw.userData.scale, 1);
      sw.material.opacity = Math.max(0, sw.userData.opacity);

      if (sw.userData.opacity <= 0 || sw.userData.scale >= sw.userData.maxScale) {
        this.scene.remove(sw);
        this.shockwaves.splice(i, 1);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.threeScene = new ThreeRpgScene();
document.addEventListener('DOMContentLoaded', () => {
  window.threeScene.init();
});

// Global RPG event helpers: trigger visual effects from anywhere
window.triggerQuestCompleteEffect = function() {
  if (window.threeScene && window.threeScene.initialized) {
    window.threeScene.triggerShockwave(0xa855f7);  // Purple: quest
    setTimeout(() => window.threeScene.triggerShockwave(0xf59e0b), 300);   // Gold follow-up
  }
};

window.triggerLevelUpEffect = function() {
  if (window.threeScene && window.threeScene.initialized) {
    window.threeScene.triggerShockwave(0xfbbf24);  // Gold: level up!
    setTimeout(() => window.threeScene.triggerShockwave(0xfbbf24), 250);
    setTimeout(() => window.threeScene.triggerShockwave(0xc084fc), 500);
  }
};

window.triggerBossHitEffect = function() {
  if (window.threeScene && window.threeScene.initialized) {
    window.threeScene.triggerShockwave(0xef4444);  // Red: boss hit
  }
};

