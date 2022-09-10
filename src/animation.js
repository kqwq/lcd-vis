import * as THREE from "three";
import { animateLayers, build } from "./builder";

let scene, light, raycaster, camera, renderer;
let skyboxGeo, materialCorona;

function createPathStrings(filename) {
  const basePath = "./asset/skybox/";
  const baseFilename = basePath + filename;
  const fileType = ".png";
  const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
  const pathStings = sides.map((side) => {
    return baseFilename + "_" + side + fileType;
  });
  return pathStings;
}
function createMaterialArray(filename) {
  const skyboxImagepaths = createPathStrings(filename);
  const materialArray = skyboxImagepaths.map((image) => {
    let texture = new THREE.TextureLoader().load(image);
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide }); // <---
  });
  return materialArray;
}
const onKeyDown = function (event) {
  switch (event.code) {
    case "ArrowUp":
    case "KeyW":
      break;

    case "ArrowDown":
    case "KeyS":
      break;
  }
};

const onKeyUp = function (event) {
  switch (event.code) {
    case "ArrowUp":
    case "KeyW":
      break;

    case "ArrowDown":
    case "KeyS":
      break;
  }
};
function init() {
  // Camera/rendering
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    30000
  );
  camera.setRotationFromEuler(new THREE.Euler(-0.1, -0.5, 0, "YXZ"));
  camera.position.set(-30, 5, 20);

  //scene.fog = new THREE.Fog(0x222, 0, 70);

  // Lights
  light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
  light.position.set(0.5, 1, 0.75);

  // skybox init (rest is set up in game.loadStage())
  materialCorona = createMaterialArray("corona");
  skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
  const skybox = new THREE.Mesh(skyboxGeo, materialCorona);
  scene.add(skybox);

  // build rest
  build(scene);

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    10
  );

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  //renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  // resize
  window.addEventListener("resize", onWindowResize);

  // animate
  animate();
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  minimap.onResize();
}
function animate() {
  requestAnimationFrame(animate);

  animateLayers();
  renderer.render(scene, camera);
}

export { init };
