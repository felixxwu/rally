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
  resolutionScale,
} from '../../refs';
import { THREE } from '../utils/THREE';

export function initRenderer() {
  renderer.current = new THREE.WebGLRenderer({ antialias: false });
  renderer.current.setPixelRatio(window.devicePixelRatio);
  renderer.current.setSize(
    window.innerWidth * resolutionScale,
    window.innerHeight * resolutionScale
  );
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
  const frameStart = window.performance.now();
  now = frameStart;

  const delta = clock.getDelta();

  if (i % f === 0 && devMode) {
    Object.keys(renderTimes).forEach(key => {
      renderTimes[key] = Math.round((renderTimes[key] / f) * 1000);
    });
    console.table(renderTimes);
    renderTimes = {};
  }

  if (delta !== 0) {
    onRender.current.forEach(callback => {
      if (stopOnRender.current) return;
      const callbackStart = window.performance.now();
      callback[1](delta);
      logRenderTime('onRender: ' + callback[0], callbackStart);
    });
    onRenderNoPausing.current.forEach(callback => callback(delta));
    logRenderTime('All onRender', frameStart);
  }

  if (camera.current && scene.current) {
    const renderStart = window.performance.now();
    renderer.current?.render(scene.current, camera.current);
    logRenderTime('render', renderStart);
  }

  stats.current?.update();

  i++;
}
