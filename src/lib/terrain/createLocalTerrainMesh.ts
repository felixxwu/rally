import { terrainDepth, terrainDepthExtents, terrainWidth, terrainWidthExtents } from '../../refs';
import { THREE } from '../utils/THREE';
import { getLocalSquares } from './getLocalSquares';

export function createLocalTerrainMesh(pos: THREE.Vector3) {
  const localSquares = getLocalSquares(pos);

  const geometry = new THREE.PlaneGeometry(
    (terrainWidthExtents / (terrainWidth - 1)) * 3,
    (terrainDepthExtents / (terrainDepth - 1)) * 3,
    3,
    3
  );
  geometry.rotateX(-Math.PI / 2);

  const vertices = geometry.attributes.position.array;

  for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
    vertices[j + 1] = localSquares[i]?.y ?? 0;
  }

  geometry.computeVertexNormals();

  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0xc7c7c7,
    roughness: 1,
    metalness: 0,
  });

  const terrainMesh = new THREE.Mesh(geometry, groundMaterial);

  terrainMesh.position.set(
    localSquares[0].x + (terrainWidthExtents / (terrainWidth - 1)) * 1.5,
    0,
    localSquares[0].z + (terrainDepthExtents / (terrainDepth - 1)) * 1.5
  );

  terrainMesh.visible = false;

  return terrainMesh;
}
