import { THREE } from '../utils/THREE';
import { createRoadShape, Triangle } from './createRoadShape';
import { roadVecs, roadColor, grassColor } from '../../refs';
import { Mesh } from '../../types';

export type RoadChunk = {
  road: Mesh;
  grassLeft: Mesh;
  grassRight: Mesh;
  centerX: number;
  centerZ: number;
};

// Number of triangle progress steps per chunk; adjust for balance between draw calls and culling granularity
const CHUNK_PROGRESS_LENGTH = 100;

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

    // Compute chunk center from roadVecs using progress range spanned by this chunk
    const firstProgress = key * CHUNK_PROGRESS_LENGTH;
    const lastProgress = firstProgress + CHUNK_PROGRESS_LENGTH;
    const start = roadVecs.current[Math.max(0, firstProgress)] ?? roadVecs.current[0];
    const end = roadVecs.current[Math.min(roadVecs.current.length - 1, lastProgress)] ?? start;
    const centerX = ((start?.[0] ?? 0) + (end?.[0] ?? 0)) / 2;
    const centerZ = ((start?.[2] ?? 0) + (end?.[2] ?? 0)) / 2;

    // Initially invisible; visibility controlled elsewhere
    roadMesh.visible = false;
    grassLeftMesh.visible = false;
    grassRightMesh.visible = false;

    chunks.push({
      road: roadMesh,
      grassLeft: grassLeftMesh,
      grassRight: grassRightMesh,
      centerX,
      centerZ,
    });
  }

  return chunks;
}
