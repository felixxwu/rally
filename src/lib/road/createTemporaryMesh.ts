import { roadColor, scene, temporaryMesh } from '../../refs';
import { createRoadShape, Vector } from './createRoadShape';
import { createRoadTriangles } from './createRoadTriangles';

export async function createTemporaryMesh(vecs: Vector[]) {
  if (temporaryMesh.current) {
    scene.current?.remove(temporaryMesh.current.road);
  }

  const { road } = await createRoadTriangles(vecs, true);

  const { mesh: roadMesh } = createRoadShape(road, roadColor, 0.7);
  temporaryMesh.current = { road: roadMesh };
  scene.current?.add(roadMesh);

  await new Promise(r => setTimeout(r));
}
