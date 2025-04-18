import styled from 'styled-components';
import { useCustomRef } from '../../utils/useCustomRef';
import { countDownStarted, roadVecs, stageTimeStarted, mapHeight, mapWidth } from '../../../refs';
import { useEffect, useState } from 'react';
import { getCarMeshDirection } from '../../car/getCarDirection';
import { getCarMeshPos } from '../../car/getCarTransform';
import { THREE } from '../../utils/THREE';
import { addOnRenderListener } from '../../render/addOnRenderListener';

const mapSize = 150;

export function MiniMap() {
  const road = useCustomRef(roadVecs);
  const [carTransform, setCarTransform] = useState<{
    carX: number;
    carZ: number;
    carRot: number;
  } | null>(null);
  const { carX, carZ, carRot } = carTransform ?? { carX: 0, carZ: 0, carRot: 0 };

  useEffect(() => {
    addOnRenderListener('minimap', () => {
      if (!stageTimeStarted.current && !countDownStarted.current) {
        setCarTransform(null);
        return;
      }
      const dir = getCarMeshDirection();
      const carPos = getCarMeshPos();
      const projected = dir.clone().projectOnPlane(new THREE.Vector3(0, 1, 0));
      setCarTransform({
        carX: carPos.x,
        carZ: carPos.z,
        carRot: Math.atan2(projected.x, projected.z),
      });
    });
  }, []);

  const tx = mapWidth / 2 - carX;
  const ty = mapHeight / 2 - carZ;
  const rot = carRot + Math.PI;
  const scale = carTransform ? 6 : 1;

  return (
    <Container>
      <SVG viewBox={`0 0 ${mapWidth} ${mapHeight}`}>
        <Path
          d={road.map(([x, _, z], i) => `${i === 0 ? 'M' : 'L'} ${x} ${z}`).join(' ')}
          style={{
            transform: `translate(${tx}px, ${ty}px) rotate(${rot}rad) scale(${scale})`,
            transformOrigin: `${carX}px ${carZ}px`,
          }}
        />
        {carTransform && (
          <CarTriangle
            points='0,-200 -200,200 200,200'
            transform={`translate(${mapWidth / 2}, ${mapHeight / 2})`}
          />
        )}
      </SVG>
    </Container>
  );
}

const Container = styled('div')`
  position: absolute;
  top: 10px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const SVG = styled('svg')`
  width: ${mapSize}px;
  height: ${mapSize}px;
  outline: 2px solid white;
  background-color: #0001;
`;

const Path = styled('path')`
  fill: none;
  stroke: white;
  stroke-width: 30;
`;

const CarTriangle = styled('polygon')`
  fill: white;
  stroke: #aaa;
  stroke-width: 40;
`;
