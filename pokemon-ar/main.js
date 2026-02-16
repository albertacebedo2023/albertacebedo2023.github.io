import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.161/examples/jsm/loaders/GLTFLoader.js";
import { ARButton } from "https://cdn.jsdelivr.net/npm/three@0.161/examples/jsm/webxr/ARButton.js";

let camera, scene, renderer;
let controller;
let reticle;
let model;

init();
animate();

function init() {

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.01, 20);

  renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);

  document.body.appendChild(ARButton.createButton(renderer, {
    requiredFeatures: ['hit-test']
  }));

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  // Reticle para ver superficie detectada
  const geometry = new THREE.RingGeometry(0.05, 0.06, 32).rotateX(-Math.PI/2);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  reticle = new THREE.Mesh(geometry, material);
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  scene.add(reticle);

  // Controlador táctil
  controller = renderer.xr.getController(0);
  controller.addEventListener("select", placeObject);
  scene.add(controller);

  // Cargar modelo 3D
  const loader = new GLTFLoader();
  loader.load("hornet.glb", (gltf)=>{
    model = gltf.scene;
    model.scale.set(0.2,0.2,0.2);
  });

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Colocar objeto al tocar pantalla
function placeObject() {
  if (!model || !reticle.visible) return;

  const clone = model.clone();
  clone.position.setFromMatrixPosition(reticle.matrix);
  scene.add(clone);
}

// Hit test para detectar superficies reales
let hitTestSource = null;
let hitTestSourceRequested = false;

function animate() {
  renderer.setAnimationLoop(render);
}

function render(timestamp, frame) {

  if (frame) {
    const referenceSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();

    if (!hitTestSourceRequested) {
      session.requestReferenceSpace("viewer").then((space) => {
        session.requestHitTestSource({ space }).then((source) => {
          hitTestSource = source;
        });
      });

      session.addEventListener("end", () => {
        hitTestSourceRequested = false;
        hitTestSource = null;
      });

      hitTestSourceRequested = true;
    }

    if (hitTestSource) {
      const hitTestResults = frame.getHitTestResults(hitTestSource);

      if (hitTestResults.length) {
        const hit = hitTestResults[0];
        const pose = hit.getPose(referenceSpace);

        reticle.visible = true;
        reticle.matrix.fromArray(pose.transform.matrix);
      } else {
        reticle.visible = false;
      }
    }
  }

  renderer.render(scene, camera);
}

