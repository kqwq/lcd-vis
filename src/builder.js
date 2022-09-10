import * as THREE from "three";
import { easeQuadInOut } from "d3-ease";

let layers = [];
function buildLayer(scene, n, material, depthOverride) {
  let w = 20;
  let h = 14;
  let d = depthOverride === undefined ? 0.4 : depthOverride;
  let geometry = new THREE.BoxGeometry(w, h, d);

  let box = new THREE.Mesh(geometry, material);
  box.position.set(0, 0, -50 + n * 10);
  scene.add(box);
  layers.push(box);
}

function build(scene) {
  let m, t; // abbr. for material, texture
  let textureLoader = new THREE.TextureLoader();

  // backlight
  m = new THREE.MeshPhongMaterial({
    color: 0x2121de,
    emissive: 0xeeeeee,
  });
  buildLayer(scene, 0, m);

  // back polarizer
  m = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: textureLoader.load("asset/texture/b_p.png"),
    transparent: true,
  });
  buildLayer(scene, 1, m, 0);

  //tft
  m = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: textureLoader.load("asset/texture/tft.png"),
    transparent: true,
  });
  buildLayer(scene, 1, m, 0);

  //rgb
  m = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: textureLoader.load("asset/texture/rgb.png"),
    transparent: true,
  });
  buildLayer(scene, 1, m, 0.1);

  // front polarizer
  m = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: textureLoader.load("asset/texture/f_p.png"),
    transparent: true,
  });
  buildLayer(scene, 1, m, 0);
}

let separationStage = 1.0;
let isShowLayers = false;
let showLayersStart = new Date();
function smoothTrans(mid, numLayers, val, index, reach) {
  let linearVal =
    mid +
    (easeQuadInOut(val) * (index - (numLayers - 1) / 2) * reach) / numLayers;
  return linearVal;
}
function animateLayers() {
  // sep stage timer
  if (isShowLayers) {
    let now = new Date();
    separationStage = 1 + (now - showLayersStart) / 2000;
  }

  let dec = separationStage % 1;
  if (separationStage < 2) {
    // 1.0 to 1.999
    layers.forEach((layer, index) => {
      layer.position.z = smoothTrans(0, layers.length, dec, index, 20);
    });
  } else if (separationStage >= 2 && separationStage < 3) {
    layers.forEach((layer, index) => {
      layer.position.x = smoothTrans(0, layers.length, dec, index, 20);
      layer.position.y = smoothTrans(0, layers.length, dec, index, -4);
    });
  }
}
window.showLayers = () => {
  isShowLayers = true;
  showLayersStart = new Date();
};

export { build, animateLayers };
