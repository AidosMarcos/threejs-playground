import './style.css';
import * as THREE from 'three';

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
const planeMesh = createPlane(20);
planeMesh.rotation.x = Math.PI/2;
planeMesh.name = "Plane1";
scene.add(planeMesh);

const boxMesh = createBox(1,1,1);
boxMesh.position.y = boxMesh.geometry.parameters.height / 2;
boxMesh.name = "Box1";
scene.add(boxMesh);

//LIGHT
const pointLight = createPointLight(1);
pointLight.position.y = 2;
scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper( pointLight, 0.05 );
scene.add(pointLightHelper);

//RENDER EVERYTHING
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setClearColor("rgb(120,120,120)"); //background scene
document.querySelector("#app").appendChild(renderer.domElement);
update(renderer, scene, camera);

function createBox(x,y,z) {
  //CREATE BOX
  const boxGeometry = new THREE.BoxGeometry(x,y,z); //x y z
  const boxMaterial = new THREE.MeshPhongMaterial({
    color: 0xFF0000
  })
  return new THREE.Mesh(boxGeometry, boxMaterial);
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

//RECURSIVE UPDATE RENDERER
function update(renderer, scene, camera) {
  renderer.render(scene, camera);
  // var plane = scene.getObjectByName("Plane1");
  // plane.rotation.y += 0.01;
  // plane.rotation.z += 0.01;

  requestAnimationFrame(() => {
    update(renderer, scene, camera);
  })
}