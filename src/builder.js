import * as THREE from "three";

let layers = [];
function buildLayer(scene, n, material) {
  let w = 20;
  let h = 14;
  let d = 1;
  let geometry = new THREE.BoxGeometry(w, h, d);

  let box = new THREE.Mesh(geometry, material);
  box.position.set(0, 0, -50 + n * 10);
  scene.add(box);
  layers.push(box);
}

function build(scene) {
  let m; // abbr. for material

  // backlight
  m = new THREE.MeshPhongMaterial({
    color: 0x2121de,
    emissive: 0xeeeeee,
  });
  buildLayer(scene, 0, m);

  // back polarizer
  m = new THREE.MeshBasicMaterial({
    color: 0xffeeff,
  });
  buildLayer(scene, 1, m);
}

let separationStage = 1.0;
let isShowLayers = false;
let showLayersStart = new Date();
function smoothTrans(mid, numLayers, val, index, reach) {
  let linearVal = mid + (val / (index - (numLayers - 1) / 2)) * reach;
}
function animateLayers() {
  // sep stage timer
  if (isShowLayers) {
    let now = new Date();
    separationStage = 1 + (now - showLayersStart) / 5000;
  }

  let dec = separationStage % 1;
  if (separationStage < 2) {
    // 1.0 to 1.999
    layers.forEach((layer, index) => {
      layer.position.z = -25 + dec * 10;
    });
  } else if (separationStage >= 2 && separationStage < 3) {
    layers.forEach((layer, index) => {
      layer.position.x = 0 + index * 10;
    });
  }
}
window.showLayers = () => {
  isShowLayers = true;
  showLayersStart = new Date();
};

export { build, animateLayers };
