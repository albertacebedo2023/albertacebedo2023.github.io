import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.161/examples/jsm/loaders/GLTFLoader.js";


// =======================
// 🎥 CÁMARA TRASERA FORZADA
// =======================
const video = document.createElement("video");
video.setAttribute("autoplay", "");
video.setAttribute("playsinline", "");
document.body.appendChild(video);

async function startCamera() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const cams = devices.filter(d => d.kind === "videoinput");

  let backCam = cams.find(cam =>
    cam.label.toLowerCase().includes("back") ||
    cam.label.toLowerCase().includes("rear") ||
    cam.label.toLowerCase().includes("environment")
  );

  const constraints = {
    video: backCam 
      ? { deviceId: { exact: backCam.deviceId } }
      : { facingMode: "environment" }
  };

  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = stream;
}

startCamera();


// =======================
// 🌍 THREE.JS ESCENA
// =======================
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 3, 5);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// =======================
// 💡 LUCES
// =======================
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);


// =======================
// 🧱 PLANO INVISIBLE (SUELO VIRTUAL)
// =======================
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const planeMaterial = new THREE.MeshBasicMaterial({ visible: false });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);


// =======================
// 🐉 CARGAR MODELO
// =======================
let model;
const loader = new GLTFLoader();
loader.load("model.glb", (gltf) => {
  model = gltf.scene;
  model.scale.set(0.5, 0.5, 0.5);
});


// =======================
// 👉 RAYCAST PARA TOCAR PANTALLA
// =======================
const raycaster = new THREE.Raycaster();
const touch = new THREE.Vector2();

function placeObject(event) {
  if (!model) return;

  const x = event.touches ? event.touches[0].clientX : event.clientX;
  const y = event.touches ? event.touches[0].clientY : event.clientY;

  touch.x = (x / window.innerWidth) * 2 - 1;
  touch.y = -(y / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(touch, camera);
  const intersects = raycaster.intersectObject(plane);

  if (intersects.length > 0) {
    const clone = model.clone();
    clone.position.copy(intersects[0].point);
    scene.add(clone);
  }
}

window.addEventListener("click", placeObject);
window.addEventListener("touchstart", placeObject);


// =======================
// 🎞️ ANIMACIÓN
// =======================
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();


// =======================
// 📱 RESPONSIVE
// =======================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


