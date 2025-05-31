import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls, mixer;
init();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.5, 3);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 20, 0);
  scene.add(light);

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(0.016);
  renderer.render(scene, camera);
}

document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  console.log(file);
  if (file) {
    const filePath = 'models/' + file.name;
    loadGLB(filePath, file.name);
  }
});

function loadGLB(url, filename) {
  const loader = new GLTFLoader();
  loader.load(url, function(gltf) {
    const model = gltf.scene;
    scene.add(model);

    // Hiển thị khung xương nếu có
    model.traverse((object) => {
      if (object.isSkinnedMesh) {
        const skeletonHelper = new THREE.SkeletonHelper(object);
        skeletonHelper.visible = true;
        scene.add(skeletonHelper);
      }
    });

    // Tạo mã nguồn Three.js tương ứng
    const code = generateThreeJSCode(filename);
    document.getElementById('codeOutput').textContent = code;
  }, undefined, function(error) {
    console.error(error);
  });
}

function generateThreeJSCode(filename) {
  return `import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.HemisphereLight(0xffffff, 0x444444);
light.position.set(0, 20, 0);
scene.add(light);

const loader = new GLTFLoader();
loader.load('models/${filename}', function(gltf) {
  const model = gltf.scene;
  scene.add(model);

  model.traverse((object) => {
    if (object.isSkinnedMesh) {
      const skeletonHelper = new THREE.SkeletonHelper(object);
      skeletonHelper.visible = true;
      scene.add(skeletonHelper);
    }
  });
}, undefined, function(error) {
  console.error(error);
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();`;
}
