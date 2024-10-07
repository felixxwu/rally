import { Mesh } from '../../types';
import { GLTFLoader } from '../jsm/GLTFLoader';

export function asyncGLTFLoader(url: string) {
  return new Promise<Mesh>((res, rej) => {
    const loader = new GLTFLoader();
    loader.load(
      url,
      function (gltf) {
        res(gltf.scene.children[0]);
      },
      undefined,
      function (error) {
        console.error(error);
        rej(error);
      }
    );
  });
}
