"use client";

import { Canvas } from "@react-three/fiber";
import { Float, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

const MODEL_URL = "/models/centurion_card.glb";

function CardModel() {
  const { scene } = useGLTF(MODEL_URL);
  return <primitive object={scene} scale={3.2} position={[0, 0, 0]} />;
}

export function CenturionCardBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 3.4], fov: 38 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 2, 4]} intensity={1.8} color="#fff8e0" />
          <directionalLight position={[-3, -1, 2]} intensity={0.7} color="#a48dd7" />
          <Float
            speed={1.1}
            rotationIntensity={0.55}
            floatIntensity={0.4}
            floatingRange={[-0.08, 0.08]}
          >
            <CardModel />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
