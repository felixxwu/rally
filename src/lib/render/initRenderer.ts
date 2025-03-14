import {
  container,
  renderer,
  stats,
  clock,
  scene,
  camera,
  onRender,
  stopOnRender,
  onRenderNoPausing,
  devMode,
} from '../../refs';
import { THREE } from '../utils/THREE';

export function initRenderer() {
  renderer.current = new THREE.WebGLRenderer({ antialias: true });
  renderer.current.setPixelRatio(window.devicePixelRatio);
  renderer.current.setSize(window.innerWidth, window.innerHeight);
  renderer.current.shadowMap.enabled = true;
  renderer.current.toneMapping = THREE.AgXToneMapping;
  container.current?.appendChild(renderer.current.domElement);
  animate();
}

function animate() {
  render();
  requestAnimationFrame(animate);
}

let renderTimes = {} as Record<string, number>;
let i = 0;
const f = 100;
export function logRenderTime(id: string, oldNow: number) {
  if (!devMode) return;
  const time = window.performance.now() - oldNow;
  renderTimes[id] = renderTimes[id] ? renderTimes[id] + time : time;
}

let now = window.performance.now();

function render() {
  logRenderTime('time since last render', now);
  now = window.performance.now();

  const delta = clock.getDelta();

  if (i % f === 0 && devMode) {
    Object.keys(renderTimes).forEach(key => {
      renderTimes[key] = Math.round((renderTimes[key] / f) * 1000);
    });
    console.table(renderTimes);
    renderTimes = {};
  }

  if (delta !== 0) {
    const now = window.performance.now();
    onRender.current.forEach(callback => {
      if (stopOnRender.current) return;
      const now = window.performance.now();
      callback[1](delta);
      logRenderTime('onRender: ' + callback[0], now);
    });
    onRenderNoPausing.current.forEach(callback => callback(delta));
    logRenderTime('All onRender', now);
  }

  if (camera.current && scene.current) {
    const now = window.performance.now();
    renderer.current?.render(scene.current, camera.current);
    logRenderTime('render', now);
  }

  stats.current?.update();

  i++;
}
