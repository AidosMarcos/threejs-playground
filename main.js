import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const gui = new dat.GUI();
const clock = new THREE.Clock();

const sizes = {
  width: innerWidth,
  height: innerHeight
}
const enableFog = false;

//CREATE A SCENE
const scene = new THREE.Scene();

if (enableFog)
  scene.fog = new THREE.FogExp2(0xffffff, 0.2);

//CREATE A CAMERA
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 200);
camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 4;
camera.lookAt(new THREE.Vector3(0,0,0)); //MAKES CAMERA LOOK AT ORIGIN POINT

//CREATE AN OBJECTS
const planeMesh = createPlane(40);
planeMesh.receiveShadow = true;
planeMesh.rotation.x = Math.PI/2;
planeMesh.name = "Plane1";
scene.add(planeMesh);

//const boxMesh = createBox(1,1,1);
//boxMesh.castShadow = true;
//boxMesh.position.y = boxMesh.geometry.parameters.height / 2;
//boxMesh.name = "Box1";
//scene.add(boxMesh);
var boxGroup = createBoxGrid(10, 1.5);
boxGroup.name = "BoxGroup";
scene.add(boxGroup);

//LIGHT
const directionalLight = createDirectionalLight(1);
directionalLight.castShadow = true;
directionalLight.position.y = 2;
scene.add(directionalLight);
//add light to gui
gui.add(directionalLight, 'intensity', 0, 10);
gui.add(directionalLight.position, 'y', 0, 100);
gui.add(directionalLight.position, 'x', -10, 10);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.05);
scene.add(directionalLightHelper);


const ambientLight = createAmbientLight(0.2);
scene.add(ambientLight);

//RENDER EVERYTHING
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(devicePixelRatio);
renderer.setClearColor("rgb(120,120,120)"); //background scene
document.querySelector("#app").appendChild(renderer.domElement);

//ORBIT CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
//controls.enableZoom = false;
controls.enablePan = false;

update(renderer, scene, camera);

function createBox(x,y,z) {
  //CREATE BOX
  const boxGeometry = new THREE.BoxGeometry(x,y,z); //x y z
  const boxMaterial = new THREE.MeshPhongMaterial({
    color: 0xFF0000
  })
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.castShadow = true;
  return mesh;
}

function createBoxGrid(amount, separationMultiplier) { 
  const group = new THREE.Group();

  for (let i = 0; i < amount; i++) {
    const box = createBox(1,1,1);
    box.position.x = i * separationMultiplier;
    box.position.y = box.geometry.parameters.height / 2;
    group.add(box);

    for (let j = 1; j < amount; j++) {
      const box1 = createBox(1,1,1);
      box1.position.x = i * separationMultiplier;
      box1.position.y = box1.geometry.parameters.height / 2;
      box1.position.z = j * separationMultiplier;
      group.add(box1);
    }
  }

  group.position.x = -(separationMultiplier * (amount-1)) / 2;
  group.position.z = -(separationMultiplier * (amount-1)) / 2;

  return group;
}

function createPlane(size) {
  const planeGeometry = new THREE.PlaneGeometry(size, size);
  const planeMaterial = new THREE.MeshPhongMaterial({
    color: "rgb(120,120,120)",
    side: THREE.DoubleSide
  });

  return new THREE.Mesh(planeGeometry, planeMaterial);
}

function createPointLight(intensity) {
  return new THREE.PointLight(0xffffff, intensity);
}

function createSpotLight(intensity) {
  const light = new THREE.SpotLight(0xffffff, intensity);
  light.castShadow = true;
  return light;
}

function createDirectionalLight(intensity) {
  const light = new THREE.DirectionalLight(0xffffff, intensity);
  light.castShadow = true;
  light.shadow.camera.left = -10;
  light.shadow.camera.bottom = -10;
  light.shadow.camera.right = 10;
  light.shadow.camera.top = 10;
  light.position.x = 13;
  light.position.y = 4;
  light.position.z = 10;
  return light;
}

function createAmbientLight(intensity) {
  const light = new THREE.AmbientLight(0x0000ff, intensity);
  return light;
}

//RECURSIVE UPDATE RENDERER
function update(renderer, scene, camera) {
  renderer.render(scene, camera);
  let timeElapsed = clock.getElapsedTime();
  // var plane = scene.getObjectByName("Plane1");
  // plane.rotation.y += 0.01;
  // plane.rotation.z += 0.01;
  let boxGrid = scene.getObjectByName("BoxGroup");
  boxGrid.children.forEach(function (child) {
    child.scale.y = Math.sin(timeElapsed);
    child.position.y = child.scale.y / 2;
  })

  controls.update();
  requestAnimationFrame(() => {
    update(renderer, scene, camera);
  })
}