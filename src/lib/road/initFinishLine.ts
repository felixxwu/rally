import {
  grassWidth,
  halfRoadWidth,
  resetDistance,
  roadVecs,
  scene,
  startRoadLength,
  startRoadWidth,
} from '../../refs';
import { THREE } from '../utils/THREE';
import { vec3 } from '../utils/createVec';

// State
let finishLineGroup: THREE.Group | null = null;
let bannerMesh: THREE.Mesh | null = null;

// Helper: Create checkerboard pattern texture
function createCheckerboardTexture(size: number = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const squareSize = size / 8; // 8x8 checkerboard
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? '#ffffff' : '#000000';
      ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  return texture;
}

export function initFinishLine(): void {
  cleanupFinishLine();

  const vecs = roadVecs.current;
  if (vecs.length < startRoadLength * 2) return;

  // Position finish line at the exact point where progress reaches 100%
  // Progress = 100% when: progress.current = vecs.length - startRoadLength
  // But we need to account for when it actually triggers (slightly earlier)
  // Calculate the exact finish index based on the progress formula
  const finishProgressIndex = vecs.length - resetDistance;

  // Move finish line earlier to match when the game actually registers the finish
  // The finish triggers when progress.current reaches finishProgressIndex,
  // but progress updates when car is within resetDistance of a road point
  // So we position the finish line resetDistance before the actual finish point
  const finishIndex = Math.max(startRoadLength, finishProgressIndex);
  const finishVec = vec3(vecs[finishIndex]);
  const prevVec = vec3(vecs[finishIndex - 1] || vecs[finishIndex]);
  const nextVec = vec3(vecs[Math.min(finishIndex + 1, vecs.length - 1)] || vecs[finishIndex]);

  // Calculate road direction at finish line
  const roadDirection = nextVec.clone().sub(prevVec).normalize();
  const perpendicular = new THREE.Vector3(-roadDirection.z, 0, roadDirection.x).normalize();

  // Get road width at finish point
  const roadWidth =
    finishIndex < startRoadLength || finishIndex >= vecs.length - startRoadLength
      ? startRoadWidth
      : halfRoadWidth;

  // Pole dimensions
  const poleRadius = 0.2;
  const poleHeight = 8;
  const poleTopHeight = finishVec.y + poleHeight;
  const poleOffset = roadWidth / 2 + grassWidth + 1; // Position poles just off the grass edge

  // Create group to hold all finish line elements
  finishLineGroup = new THREE.Group();
  finishLineGroup.position.copy(finishVec);

  // Create poles on either side of the road
  const poleGeometry = new THREE.CylinderGeometry(poleRadius, poleRadius, poleHeight, 8);
  const poleMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 0.7,
    metalness: 0.3,
  });

  const leftPole = new THREE.Mesh(poleGeometry, poleMaterial);
  const rightPole = new THREE.Mesh(poleGeometry, poleMaterial);

  // Position poles at road edges
  leftPole.position.copy(
    perpendicular
      .clone()
      .multiplyScalar(-poleOffset)
      .add(new THREE.Vector3(0, poleHeight / 2, 0))
  );
  rightPole.position.copy(
    perpendicular
      .clone()
      .multiplyScalar(poleOffset)
      .add(new THREE.Vector3(0, poleHeight / 2, 0))
  );

  leftPole.castShadow = true;
  leftPole.receiveShadow = true;
  rightPole.castShadow = true;
  rightPole.receiveShadow = true;

  finishLineGroup.add(leftPole);
  finishLineGroup.add(rightPole);

  // Create banner between pole tops (vertical plane perpendicular to road)
  const bannerWidth = poleOffset * 2; // Distance between poles (span between poles)
  const bannerHeight = 3; // Height of the banner
  const bannerGeometry = new THREE.PlaneGeometry(bannerWidth, bannerHeight);
  const texture = createCheckerboardTexture(512);
  const bannerMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.4,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });

  bannerMesh = new THREE.Mesh(bannerGeometry, bannerMaterial);

  // Position banner at pole tops, centered between poles
  bannerMesh.position.set(0, poleTopHeight - finishVec.y - bannerHeight / 2, 0);

  // Rotate banner so width spans between poles (perpendicular direction) and faces road
  // PlaneGeometry defaults to width along X, height along Y, normal along +Z
  // We want width (X) along perpendicular, and normal facing road direction
  const perpendicularAngle = Math.atan2(perpendicular.x, perpendicular.z);
  bannerMesh.rotation.y = perpendicularAngle + Math.PI / 2; // +90° to face road direction

  bannerMesh.castShadow = true;
  bannerMesh.receiveShadow = true;

  finishLineGroup.add(bannerMesh);
  scene.current?.add(finishLineGroup);
}

export function cleanupFinishLine(): void {
  if (bannerMesh) {
    if (Array.isArray(bannerMesh.material)) {
      bannerMesh.material.forEach(m => {
        if ('map' in m && m.map instanceof THREE.Texture) {
          m.map.dispose();
        }
        m.dispose();
      });
    } else {
      const material = bannerMesh.material;
      if ('map' in material && material.map instanceof THREE.Texture) {
        material.map.dispose();
      }
      material.dispose();
    }
    bannerMesh.geometry.dispose();
    bannerMesh = null;
  }

  if (finishLineGroup) {
    scene.current?.remove(finishLineGroup);
    finishLineGroup = null;
  }
}
