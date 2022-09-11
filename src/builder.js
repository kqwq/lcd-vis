import * as THREE from "three";
import { easeQuadInOut } from "d3-ease";

let hoverer;
let layers = [];
let siding = [];
let w = 20;
let h = 14;
function buildLayer(scene, n, material, depthOverride) {
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
  buildLayer(scene, 0, m, 0.7);

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

  //lcd
  m = new THREE.MeshBasicMaterial({
    color: 0xddffff,
    map: textureLoader.load("asset/texture/lcd.jpeg"),
    transparent: false,
  });
  buildLayer(scene, 1, m, 0.3);

  //rgb
  m = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: textureLoader.load("asset/texture/rgb.png"),
    transparent: true,
  });
  buildLayer(scene, 1, m, 0.1);

  // glass
  m = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: textureLoader.load("asset/texture/glass.jpg"),
    transparent: true,
    opacity: 0.9,
  });
  buildLayer(scene, 1, m, 0.4);

  // front polarizer
  m = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: textureLoader.load("asset/texture/f_p.png"),
    transparent: true,
  });
  buildLayer(scene, 1, m, 0);

  // siding
  m = new THREE.MeshLambertMaterial({
    color: 0x222222,
    emissive: 0x001011,
    transparent: true,
    opacity: 1,
  });
  let sidingD = 0.8;
  let geos = [
    // [x, y, z, w, h, d]
    [0, -(h + 1) / 2, 0, w + 2, 1, sidingD * 2],
    [0, +(h + 1) / 2, 0, w + 2, 1, sidingD * 2],
    [-(w + 1) / 2, 0, 0, 1, h + 2, sidingD * 2],
    [+(w + 1) / 2, 0, 0, 1, h + 2, sidingD * 2],
  ];
  for (let [x, y, z, w, h, d] of geos) {
    let geometry = new THREE.BoxGeometry(w, h, d);
    let box = new THREE.Mesh(geometry, m);
    box.position.set(x, y, z);
    scene.add(box);
    siding.push(box);
  }

  // keyboard
  m = new THREE.MeshLambertMaterial({
    color: 0x222222,
    map: textureLoader.load("asset/texture/keyboard.jpg"),
    emissive: 0x001011,
    transparent: true,
    opacity: 1,
  });
  let geometry = new THREE.BoxGeometry(w + 2, 0.6, h * 1.2);
  let keyboard = new THREE.Mesh(geometry, m);
  keyboard.position.set(0, -h / 2 - 1, h / 2 + 1);
  scene.add(keyboard);
  siding.push(keyboard);

  // hoverer
  hoverer = new Hoverer(scene);
}

let separationStage = 1.0;
let gotoSeparationStage = 1.0;
let showLayersStart = new Date();
function smoothTrans(mid, numLayers, val, index, reach) {
  let linearVal =
    mid +
    (easeQuadInOut(val) * (index - (numLayers - 1) / 2) * reach) / numLayers;
  return linearVal;
}
function animateLayers(delta) {
  // sep stage logic
  if (separationStage < gotoSeparationStage) {
    separationStage += delta;
    if (separationStage > gotoSeparationStage) {
      separationStage = gotoSeparationStage;
    }
  } else if (separationStage > gotoSeparationStage) {
    separationStage -= delta;
    if (separationStage < gotoSeparationStage) {
      separationStage = gotoSeparationStage;
    }
  }

  let dec = separationStage % 1;
  if (separationStage < 2) {
    // 1.0 to 1.999
    layers.forEach((layer, index) => {
      layer.position.z = smoothTrans(0, layers.length, dec, index, 20);
    });
    // fade out siding
    siding.forEach((side) => {
      side.material.opacity = 1 - dec;
    });
  } else if (separationStage >= 2 && separationStage < 3) {
    // 2.0 to 2.999
    layers.forEach((layer, index) => {
      layer.position.x = smoothTrans(0, layers.length, dec, index, 20);
      layer.position.y = smoothTrans(0, layers.length, dec, index, -4);
    });
  }

  // Hoverer logic
  hoverer.update();
}

class Hoverer {
  constructor(scene) {}

  update() {}
}

window.showLayers = () => {
  gotoSeparationStage = 3;
  showLayersStart = new Date();
};
window.collapseLayers = () => {
  gotoSeparationStage = 1;
  showLayersStart = new Date();
};

export { build, animateLayers };
