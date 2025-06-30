import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture, useProgress, Html } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

// 3D model yükleyici bileşen
function BrightBotModel() {
  const objPath = process.env.PUBLIC_URL + '/robot_obj/robot.obj';
  const mtlPath = process.env.PUBLIC_URL + '/robot_obj/robot.mtl';

  const [object, setObject] = React.useState<THREE.Group | null>(null);

  React.useEffect(() => {
    const mtlLoader = new MTLLoader();
    mtlLoader.load(mtlPath, (materials) => {
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(objPath, (obj) => {
        setObject(obj);
      });
    });
  }, [objPath, mtlPath]);

  return object ? <primitive object={object} scale={2.5} position={[0, -1, 0]} /> : null;
}

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(0)} %</Html>;
}

const BrightBot3D: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '400px', background: '#222', borderRadius: 12 }}>
      <Canvas camera={{ position: [0, 1, 5], fov: 50 }} shadows>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 7]} intensity={1} />
        <Suspense fallback={<Loader />}>
          <BrightBotModel />
        </Suspense>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};

export default BrightBot3D; 