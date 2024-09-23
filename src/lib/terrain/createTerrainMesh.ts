import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { terrainDepth, terrainDepthExtents, terrainWidth, terrainWidthExtents } from '../../refs';
import { THREE } from '../utils/THREE';

export function createTerrainMesh(heightData: Float32Array) {
  const geometry = new THREE.PlaneGeometry(
    terrainWidthExtents,
    terrainDepthExtents,
    terrainWidth - 1,
    terrainDepth - 1
  );
  geometry.rotateX(-Math.PI / 2);

  const vertices = geometry.attributes.position.array;

  for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
    // j + 1 because it is the y component that we modify
    vertices[j + 1] = heightData[i] ?? 0;
  }

  geometry.computeVertexNormals();

  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0xc7c7c7,
    roughness: 1,
    metalness: 0,
  });
  const terrainMesh = new THREE.Mesh(geometry, groundMaterial);
  terrainMesh.receiveShadow = true;
  terrainMesh.castShadow = true;

  new THREE.TextureLoader().load('./grass-small.png', function (texture) {
    texture.anisotropy = 0;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(terrainWidth - 1, terrainDepth - 1);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    groundMaterial.map = texture;
    groundMaterial.needsUpdate = true;
  });

  return terrainMesh;
}
