import { THREE } from '../utils/THREE';
import { createRoadShape, Triangle } from './createRoadShape';
import { roadVecs, roadColor, grassColor } from '../../refs';
import { Mesh } from '../../types';
import { mergeGeometries } from '../jsm/BufferGeometryUtils';

export type RoadChunk = {
  mesh: Mesh;
  centerX: number;
  centerZ: number;
};

// Number of triangle progress steps per chunk; adjust for balance between draw calls and culling granularity
const CHUNK_PROGRESS_LENGTH = 50;

/**
 * Split road triangle arrays into chunks along progress and create THREE meshes for each chunk
 */
export function createRoadChunks(
  road: Triangle[],
  grassLeft: Triangle[],
  grassRight: Triangle[]
): RoadChunk[] {
  // Group triangles by floor(progress / CHUNK_PROGRESS_LENGTH)
  const groupByChunk = (triangles: Triangle[]) => {
    const groups: Record<number, Triangle[]> = {};
    for (const t of triangles) {
      const key = Math.floor(t.progress / CHUNK_PROGRESS_LENGTH);
      (groups[key] ||= []).push(t);
    }
    return groups;
  };

  const roadGroups = groupByChunk(road);
  const grassLeftGroups = groupByChunk(grassLeft);
  const grassRightGroups = groupByChunk(grassRight);

  const chunkKeys = Array.from(
    new Set(
      [
        ...Object.keys(roadGroups),
        ...Object.keys(grassLeftGroups),
        ...Object.keys(grassRightGroups),
      ].map(Number)
    )
  ).sort((a, b) => a - b);

  const chunks: RoadChunk[] = [];

  for (const key of chunkKeys) {
    const roadTriangles = roadGroups[key] ?? [];
    const grassLeftTriangles = grassLeftGroups[key] ?? [];
    const grassRightTriangles = grassRightGroups[key] ?? [];

    if (
      roadTriangles.length === 0 &&
      grassLeftTriangles.length === 0 &&
      grassRightTriangles.length === 0
    ) {
      continue;
    }

    const { mesh: roadMesh } = createRoadShape(roadTriangles, roadColor, 0.7);
    const { mesh: grassLeftMesh } = createRoadShape(grassLeftTriangles, grassColor, 1);
    const { mesh: grassRightMesh } = createRoadShape(grassRightTriangles, grassColor, 1);

    // Add vertex colors and merge into a single mesh to reduce draw calls
    const applyColor = (geom: THREE.BufferGeometry, color: THREE.Color) => {
      const count = geom.getAttribute('position').count;
      const colors = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        colors[i * 3 + 0] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }
      geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    };

    applyColor(roadMesh.geometry as THREE.BufferGeometry, new THREE.Color(roadColor));
    applyColor(grassLeftMesh.geometry as THREE.BufferGeometry, new THREE.Color(grassColor));
    applyColor(grassRightMesh.geometry as THREE.BufferGeometry, new THREE.Color(grassColor));

    const merged = mergeGeometries(
      [
        roadMesh.geometry as THREE.BufferGeometry,
        grassLeftMesh.geometry as THREE.BufferGeometry,
        grassRightMesh.geometry as THREE.BufferGeometry,
      ],
      true
    );

    const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 });
    const combinedMesh = new THREE.Mesh(merged, material);

    // Compute chunk center from roadVecs using progress range spanned by this chunk
    const firstProgress = key * CHUNK_PROGRESS_LENGTH;
    const lastProgress = firstProgress + CHUNK_PROGRESS_LENGTH;
    const start = roadVecs.current[Math.max(0, firstProgress)] ?? roadVecs.current[0];
    const end = roadVecs.current[Math.min(roadVecs.current.length - 1, lastProgress)] ?? start;
    const centerX = ((start?.[0] ?? 0) + (end?.[0] ?? 0)) / 2;
    const centerZ = ((start?.[2] ?? 0) + (end?.[2] ?? 0)) / 2;

    // Initially invisible; visibility controlled elsewhere
    combinedMesh.visible = false;

    chunks.push({
      mesh: combinedMesh as unknown as Mesh,
      centerX,
      centerZ,
    });
  }

  return chunks;
}
