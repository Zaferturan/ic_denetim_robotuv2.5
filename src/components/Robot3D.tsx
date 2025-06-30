<<<<<<< HEAD
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

interface Robot3DProps {
  isSpeaking: boolean;
  message: string;
  messageId?: string;
  onSpeakEnd?: () => void;
}

const RobotModel: React.FC<Robot3DProps> = ({ isSpeaking, message, messageId, onSpeakEnd }) => {
  const gltf = useLoader(GLTFLoader, '/robotblender/robot.gltf');
  const robotRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Object3D | null>(null);
  const mouthRef = useRef<THREE.Object3D | null>(null);
  const leftArmRef = useRef<THREE.Object3D | null>(null);
  const rightArmRef = useRef<THREE.Object3D | null>(null);
  const leftEyeRef = useRef<THREE.Object3D | null>(null);
  const rightEyeRef = useRef<THREE.Object3D | null>(null);
  const chestRef = useRef<THREE.Object3D | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const prevMessageIdRef = useRef<string | undefined>(undefined);
  const [isBlinking, setIsBlinking] = useState(false);
  const initialYPositionRef = useRef<number | null>(null);

  useEffect(() => {
    // Logo için canvas oluştur
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Arka planı robotun gövde rengine yakın yap
      ctx.fillStyle = '#4a4a4a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Logoyu yükle ve çiz
      const logo = new Image();
      logo.src = '/nilufer-logo.png';
      logo.onload = () => {
        // Logo boyutlarını ayarla (canvas'ın %80'i)
        const logoSize = canvas.width * 0.8;
        const x = (canvas.width - logoSize) / 2;
        const y = (canvas.height - logoSize) / 2;
        ctx.drawImage(logo, x, y, logoSize, logoSize);
        
        // Texture'ı güncelle
        if (chestRef.current && chestRef.current instanceof THREE.Mesh) {
          const texture = new THREE.CanvasTexture(canvas);
          texture.needsUpdate = true;
          if (chestRef.current.material) {
            (chestRef.current.material as THREE.MeshStandardMaterial).map = texture;
          }
        }
      };
    }

    if (gltf.scene) {
      console.log("Model loaded:", gltf.scene);
      gltf.scene.traverse((child) => {
        // console.log("Child name:", child.name);
        if (child.name.toLowerCase().includes('head')) headRef.current = child;
        if (child.name.toLowerCase().includes('mouth')) {
          mouthRef.current = child;
          if (child instanceof THREE.Mesh && child.material) {
            child.material = new THREE.MeshStandardMaterial({
              color: '#1a1a1a',
              emissive: '#333333',
              roughness: 0.5,
              metalness: 0.5
            });
          }
          mouthRef.current.rotation.x = 0.3;
        }
        if (child.name.toLowerCase().includes('body')) {
          chestRef.current = child;
          if (child instanceof THREE.Mesh && child.material) {
            child.material = new THREE.MeshStandardMaterial({
              color: '#4a4a4a', // Robotun gövde rengine yakın
              roughness: 0.7,
              metalness: 0.3
            });
          }
        }
        if (child.name.toLowerCase().includes('leftarm')) leftArmRef.current = child;
        if (child.name.toLowerCase().includes('rightarm')) {
          rightArmRef.current = child;
          rightArmRef.current.rotation.x = Math.PI / 2;
        }
        if (child.name.toLowerCase().includes('lefteye')) {
          leftEyeRef.current = child;
          if (child instanceof THREE.Mesh && child.material) {
            child.material = new THREE.MeshStandardMaterial({ 
              color: '#000000',  // Siyah
              emissive: '#1a1a1a', // Hafif parlaklık
              roughness: 0.3,
              metalness: 0.7
            });
          }
        }
        if (child.name.toLowerCase().includes('righteye')) {
          rightEyeRef.current = child;
          if (child instanceof THREE.Mesh && child.material) {
            child.material = new THREE.MeshStandardMaterial({ 
              color: '#000000',  // Siyah
              emissive: '#1a1a1a', // Hafif parlaklık
              roughness: 0.3,
              metalness: 0.7
            });
          }
        }
      });

      // Robotun başlangıç Y pozisyonunu kaydet
      if (robotRef.current) {
        initialYPositionRef.current = robotRef.current.position.y;
      }
    }
  }, [gltf]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 100);
    }, Math.random() * 3000 + 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    if (message && isSpeaking && (prevMessageIdRef.current !== messageId)) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'tr-TR';
      utterance.onend = () => {
        if (onSpeakEnd) onSpeakEnd();
      };
      speechRef.current = utterance;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      prevMessageIdRef.current = messageId;
    }
    if (!isSpeaking) {
      window.speechSynthesis.cancel();
    }
  }, [message, isSpeaking, messageId, onSpeakEnd]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Robotun anlık Y pozisyonunu konsola yazdırma (hata ayıklama için)
    if (robotRef.current) {
      // console.log("Robot Y Position:", robotRef.current.position.y);
    }

    // Konuşma animasyonu
    if (isSpeaking) {
      if (mouthRef.current) {
        mouthRef.current.rotation.x = Math.sin(time * 15) * 0.3;
      }
      
      // Kolların sıralı ve bazen birlikte hareket etmesi
      const cycle = Math.floor(time * 0.5) % 3; // Döngü süresini artırdım (0.5 ile)
      
      if (cycle === 0) {
        // Sağ kol hareketi
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = Math.PI / 2 - Math.abs(Math.sin(time * 2)) * (Math.PI / 2);
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = Math.PI / 2; // Sol kol sabit
        }
      } else if (cycle === 1) {
        // Sol kol hareketi
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = Math.PI / 2 - Math.abs(Math.sin(time * 2)) * (Math.PI / 2);
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = Math.PI / 2; // Sağ kol sabit
        }
      } else {
        // Her iki kol birlikte hareket eder
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = Math.PI / 2 - Math.abs(Math.sin(time * 2)) * (Math.PI / 2);
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = Math.PI / 2 - Math.abs(Math.sin(time * 2)) * (Math.PI / 2);
        }
      }

      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(time * 2) * 0.1;
      }
    } else {
      // Normal durum animasyonu (sallanma dahil)
      if (mouthRef.current) mouthRef.current.rotation.x = 0.3; // Konuşma bitince de en büyük haliyle kalsın
      if (leftArmRef.current) leftArmRef.current.rotation.x = Math.PI / 2;
      if (rightArmRef.current) rightArmRef.current.rotation.x = Math.PI / 2;
      if (headRef.current) headRef.current.rotation.y = 0;

      // Hafif sallanma animasyonu (sabit pozisyonu etkilemeden)
      if (robotRef.current && initialYPositionRef.current !== null) {
        robotRef.current.position.y = initialYPositionRef.current + Math.sin(time * 1.5) * 0.05;
      }
    }

    // Göz kırpma animasyonu
    if (isBlinking) {
      if (leftEyeRef.current) leftEyeRef.current.scale.y = 0.1;
      if (rightEyeRef.current) rightEyeRef.current.scale.y = 0.1;
    } else {
      if (leftEyeRef.current) leftEyeRef.current.scale.y = 1;
      if (rightEyeRef.current) rightEyeRef.current.scale.y = 1;
    }
  });

  return (
    <primitive 
      object={gltf.scene} 
      scale={[1, 1, 1]} 
      ref={robotRef} 
      rotation={[0, Math.PI, 0]} 
      position={[0, -1, 0]}
    />
  );
};

const Robot3D: React.FC<Robot3DProps> = (props) => {
  return (
    <Canvas 
      camera={{ position: [0, 0, -2], fov: 75 }} 
      style={{
        position: 'absolute',
        top: 'calc(200px + 20px)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(800px, 100%)',
        height: '400px',
        zIndex: 0,
      }}
    >
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <pointLight position={[0, 10, -10]} intensity={0.7} />
      <RobotModel {...props} />
      <OrbitControls />
    </Canvas>
  );
};

export default Robot3D; 
=======
// ... dosya içeriği buraya gelecek ...
>>>>>>> b3885ef91d42ca4cc13fa279a320378fd0d1470a
