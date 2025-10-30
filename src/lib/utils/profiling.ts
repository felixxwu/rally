/**
 * Profiling utilities for performance analysis
 *
 * Available profiling methods:
 *
 * 1. Browser DevTools Performance Profiler
 *    - Open Chrome DevTools (F12)
 *    - Go to "Performance" tab
 *    - Click record, play your game, stop recording
 *    - Analyze flame chart to see what's taking time
 *
 * 2. Chrome DevTools Performance Monitor
 *    - Open DevTools (F12)
 *    - Open More Tools > Performance Monitor
 *    - Real-time FPS, CPU, JS heap, DOM nodes
 *
 * 3. React DevTools Profiler
 *    - Install React DevTools browser extension
 *    - Open "Profiler" tab
 *    - Record interactions to see React render performance
 *
 * 4. Three.js Renderer Info
 *    - Use renderer.info for detailed WebGL statistics
 *    - Shows geometries, textures, programs, calls, etc.
 *
 * 5. WebGL Debugging Extensions
 *    - Chrome: WebGL Insight, Spector.js
 *    - Firefox: WebGL Shader Editor
 *
 * 6. Memory Profiling
 *    - Chrome DevTools > Memory tab
 *    - Take heap snapshots before/rant after operations
 *    - Compare to find memory leaks
 */

import { renderer } from '../../refs';
import { THREE } from './THREE';

export interface RendererStats {
  geometries: number;
  textures: number;
  programs: number;
  frame: number;
  calls: number;
  triangles: number;
  points: number;
  lines: number;
  memory: {
    geometries: number;
    textures: number;
  };
}

/**
 * Get detailed Three.js renderer statistics
 */
export function getRendererStats(): RendererStats | null {
  if (!renderer.current) return null;

  const info = renderer.current.info;
  return {
    geometries: info.memory.geometries,
    textures: info.memory.textures,
    programs: info.programs?.length || 0,
    frame: info.render.frame,
    calls: info.render.calls,
    triangles: info.render.triangles,
    points: info.render.points,
    lines: info.render.lines,
    memory: {
      geometries: info.memory.geometries,
      textures: info.memory.textures,
    },
  };
}

/**
 * Log renderer stats to console
 */
export function logRendererStats(): void {
  const stats = getRendererStats();
  if (stats) {
    console.log('Three.js Renderer Stats:', stats);
    console.log('Draw Calls:', stats.calls);
    console.log('Triangles:', stats.triangles);
    console.log('Geometries in Memory:', stats.memory.geometries);
    console.log('Textures in Memory:', stats.memory.textures);
  }
}

/**
 * Performance mark/measure helpers for using with Chrome DevTools Performance tab
 */
export function mark(label: string): void {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(label);
  }
}

export function measure(name: string, startMark: string, endMark?: string): void {
  if (typeof performance !== 'undefined' && performance.measure) {
    try {
      performance.measure(name, startMark, endMark);
    } catch (e) {
      // Marks might not exist, ignore
    }
  }
}

/**
 * Get performance timing information
 */
export function getPerformanceTiming(): PerformanceTiming | null {
  if (typeof performance !== 'undefined' && performance.timing) {
    return performance.timing;
  }
  return null;
}

/**
 * Get memory information (Chrome only)
 */
export function getMemoryInfo(): { used: number; total: number } | null {
  if (typeof performance !== 'undefined' && (performance as any).memory) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize / 1048576, // MB
      total: memory.jsHeapSizeLimit / 1048576, // MB
    };
  }
  return null;
}

/**
 * Count objects in scene for debugging
 */
export function countSceneObjects(scene: THREE.Scene): {
  meshes: number;
  lights: number;
  cameras: number;
  total: number;
  children: number;
} {
  let meshes = 0;
  let lights = 0;
  let cameras = 0;

  scene.traverse(object => {
    if (object instanceof THREE.Mesh) meshes++;
    if (object instanceof THREE.Light) lights++;
    if (object instanceof THREE.Camera) cameras++;
  });

  return {
    meshes,
    lights,
    cameras,
    total: scene.children.length,
    children: scene.children.length,
  };
}
