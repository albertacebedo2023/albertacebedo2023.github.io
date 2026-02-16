import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.161/examples/jsm/loaders/GLTFLoader.js";


// =======================
// 📷 VIDEO CÁMARA TRASERA
// =======================
const video = document.createElement("video");
video.setAttribute("autoplay", "");
video.setAttribute("playsinline", "");
video.style.zIndex = "0";
document.body.appendChild(video);

async function startCamera() {
  const constraints = {
    video: {
      facingMode: { ideal: "environment" }, // ideal funciona mejor que exact
      width: { ideal: 1280 },
      height: { ideal: 720 }
    },
    audio: false
  };

  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = stream;
}

startCamera();


// =======================
// 🌍 THREE.JS
// =======================
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.zIndex = "1";
document.body.appendChild(renderer.domElement);


// =======================
// 💡 LUCES
// =======================
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7);
scene.add(light);


// =======================
// 🧱 PLANO INVISIBLE (SUELO)
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshBasicMaterial({ visible:false })
);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);


// =======================
// 🐉 MODELO
let model = null;
const loader = new GLTFLoader();
loader.load("model.glb", (gltf) => {
  model = gltf.scene;
  model.scale.set(0.3, 0.3, 0.3);
  console.log("Modelo cargado");
});


// =======================
// 👉 TOQUE PANTALLA (MÓVIL + PC)
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onTouch(event) {
  if (!model) {
    console.log("Modelo no cargado aún");
    return;
  }

  const x = event.touches ? event.touches[0].clientX : event.clientX;
  const y = event.touches ? event.touches[0].clientY : event.clientY;

  pointer.x = (x / window.innerWidth) * 2 - 1;
  pointer.y = -(y / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObject(plane);

  if (hits.length > 0) {
    const clone = model.clone(true);
    clone.position.copy(hits[0].point);
    scene.add(clone);
    console.log("Objeto colocado:", hits[0].point);
  }
}

window.addEventListener("touchstart", onTouch);
window.addEventListener("click", onTouch);


// =======================
// 🎞️ LOOP
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();


// =======================
// 📱 RESIZE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
