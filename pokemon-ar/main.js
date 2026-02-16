import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.161/examples/jsm/loaders/GLTFLoader.js";

// 1. Video de cámara
const video = document.createElement("video");
video.autoplay = true;
video.playsInline = true;
document.body.appendChild(video);

navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
.then(stream => video.srcObject = stream);

// 2. Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ alpha:true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 3. Iluminación
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));

// 4. Plano invisible donde colocar objetos
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshBasicMaterial({ visible:false });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// 5. Cargar modelo
let model;
const loader = new GLTFLoader();
loader.load("hornet.glb", gltf => {
  model = gltf.scene;
  model.scale.set(0.5,0.5,0.5);
});

// 6. Raycaster para tocar pantalla
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
  if (!model) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(plane);

  if (intersects.length > 0) {
    const clone = model.clone();
    clone.position.copy(intersects[0].point);
    scene.add(clone);
  }
});

// 7. Animación
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
