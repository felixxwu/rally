import {
  mapHeightSegments,
  mapHeight,
  mapWidthSegments,
  mapWidth,
  terrainChunksX,
  terrainChunksZ,
} from '../../refs';
import { THREE } from '../utils/THREE';
import { Mesh } from '../../types';

// Note: use current values from refs to allow configurable chunk counts

export interface TerrainChunk {
  mesh: Mesh;
  centerX: number;
  centerZ: number;
}

/**
 * Creates visual terrain chunks from height data
 * Each chunk covers a portion of the terrain and can be individually shown/hidden
 */
export function createTerrainChunks(heightData: Float32Array): TerrainChunk[] {
  const chunks: TerrainChunk[] = [];

  const CHUNKS_X = Math.max(1, Math.floor(terrainChunksX.current));
  const CHUNKS_Z = Math.max(1, Math.floor(terrainChunksZ.current));

  // Calculate chunk dimensions
  const CHUNK_SEGMENTS_X = mapWidthSegments / CHUNKS_X;
  const CHUNK_SEGMENTS_Z = mapHeightSegments / CHUNKS_Z;

  // Shared material/texture for all terrain chunks (reduces draw state changes)
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0xc7c7c7,
    roughness: 1,
    metalness: 0,
  });
  const textureLoader = new THREE.TextureLoader();
  const sharedTexture = textureLoader.load('./grass-small.png');
  sharedTexture.anisotropy = 0;
  sharedTexture.wrapS = THREE.RepeatWrapping;
  sharedTexture.wrapT = THREE.RepeatWrapping;
  sharedTexture.magFilter = THREE.NearestFilter;
  sharedTexture.minFilter = THREE.NearestFilter;
  groundMaterial.map = sharedTexture;
  groundMaterial.needsUpdate = true;

  // Create chunks
  // Important: PlaneGeometry with (widthSegments, heightSegments) creates (widthSegments+1) x (heightSegments+1) vertices
  // The original terrain uses (mapWidthSegments-1) segments, giving mapWidthSegments x mapHeightSegments vertices
  // Each chunk must share edges with neighbors, so we include overlapping vertices

  // Calculate vertex spacing in world coordinates
  const vertexSpacingX = mapWidth / (mapWidthSegments - 1);
  const vertexSpacingZ = mapHeight / (mapHeightSegments - 1);

  for (let chunkZ = 0; chunkZ < CHUNKS_Z; chunkZ++) {
    for (let chunkX = 0; chunkX < CHUNKS_X; chunkX++) {
      // Calculate vertex indices (not segment indices) in the height data array
      const startVertexX = Math.floor(chunkX * CHUNK_SEGMENTS_X);
      const startVertexZ = Math.floor(chunkZ * CHUNK_SEGMENTS_Z);

      // End vertices: include one extra vertex for edge sharing (except for the last chunk)
      // This ensures chunks share edges seamlessly
      const endVertexX =
        chunkX === CHUNKS_X - 1
          ? mapWidthSegments
          : Math.floor((chunkX + 1) * CHUNK_SEGMENTS_X) + 1;
      const endVertexZ =
        chunkZ === CHUNKS_Z - 1
          ? mapHeightSegments
          : Math.floor((chunkZ + 1) * CHUNK_SEGMENTS_Z) + 1;

      // Number of vertices in each direction
      const verticesX = endVertexX - startVertexX;
      const verticesZ = endVertexZ - startVertexZ;

      // Number of segments = vertices - 1
      const segmentsX = verticesX - 1;
      const segmentsZ = verticesZ - 1;

      // Calculate actual chunk dimensions in world space based on vertex spacing
      const chunkWorldWidth = segmentsX * vertexSpacingX;
      const chunkWorldHeight = segmentsZ * vertexSpacingZ;

      // Create geometry for this chunk
      const geometry = new THREE.PlaneGeometry(
        chunkWorldWidth,
        chunkWorldHeight,
        segmentsX,
        segmentsZ
      );
      geometry.rotateX(-Math.PI / 2);

      // Fill in vertex heights from height data
      // PlaneGeometry creates vertices row by row (Z first), then column by column (X)
      // This matches the heightData order: data[z * mapWidthSegments + x]
      const vertices = geometry.attributes.position.array;
      let vertexIndex = 0;

      for (let z = startVertexZ; z < endVertexZ; z++) {
        for (let x = startVertexX; x < endVertexX; x++) {
          const dataIndex = z * mapWidthSegments + x;
          if (dataIndex < heightData.length && vertexIndex * 3 + 1 < vertices.length) {
            vertices[vertexIndex * 3 + 1] = heightData[dataIndex] ?? 0;
          }
          vertexIndex++;
        }
      }

      geometry.computeVertexNormals();

      // Create mesh with shared material
      const mesh = new THREE.Mesh(geometry, groundMaterial);
      mesh.receiveShadow = true;
      mesh.castShadow = true;

      // Position the chunk correctly
      // The original terrain PlaneGeometry is centered at origin by default
      // After rotation, the first vertex is at (-mapWidth/2, 0, -mapHeight/2)
      // We need to position each chunk so its first vertex aligns with the full terrain
      const firstVertexWorldX = -mapWidth / 2 + startVertexX * vertexSpacingX;
      const firstVertexWorldZ = -mapHeight / 2 + startVertexZ * vertexSpacingZ;

      // PlaneGeometry centers itself, so we offset to align first vertex
      const offsetX = firstVertexWorldX + chunkWorldWidth / 2;
      const offsetZ = firstVertexWorldZ + chunkWorldHeight / 2;

      mesh.position.set(offsetX, 0, offsetZ);

      chunks.push({
        mesh,
        centerX: offsetX,
        centerZ: offsetZ,
      });
    }
  }

  return chunks;
}
