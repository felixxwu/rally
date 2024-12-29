import * as THREE from 'three';
import { carVisible, scene, weather } from '../../refs';
import { addOnRenderListener } from '../render/addOnRenderListener';
import { getCarPos } from '../car/getCarTransform';
import { getSpeedVec } from '../car/getSpeedVec';

const rainReach = 150;
const rainHeight = 35;

export function initRain() {
  const geom = new THREE.BufferGeometry();

  const points: THREE.Vector3[] = [];
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * rainReach - rainReach / 2;
    const y = Math.random() * rainHeight - rainHeight / 2;
    const z = Math.random() * rainReach - rainReach / 2;

    points.push(new THREE.Vector3(x, y, z));
  }
  geom.setFromPoints(points);
  geom.computeVertexNormals();

  const rainMaterial = new THREE.PointsMaterial({
    color: 0x9999ff,
    size: 0.3,
    transparent: true,
  });
  const rain = new THREE.Points(geom, rainMaterial);

  scene.current?.add(rain);

  addOnRenderListener('rain', deltaTime => {
    if (weather.current !== 'rain' || !carVisible.current) {
      rain.visible = false;
      return;
    }

    rain.visible = true;

    const carPos = getCarPos();
    const speed = getSpeedVec();
    rain.position.copy(carPos);

    const positionAttribute = geom.getAttribute('position');
    const vertex = new THREE.Vector3();
    for (let i = 0; i < positionAttribute.count; i++) {
      vertex.fromBufferAttribute(positionAttribute, i);
      vertex.y -= deltaTime * 35;
      vertex.x -= speed.x * deltaTime;
      vertex.y -= speed.y * deltaTime;
      vertex.z -= speed.z * deltaTime;
      if (vertex.y < -10) {
        vertex.y += rainHeight;
        vertex.x = Math.random() * rainReach - rainReach / 2;
        vertex.z = Math.random() * rainReach - rainReach / 2;
      }
      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    positionAttribute.needsUpdate = true;
  });
}
