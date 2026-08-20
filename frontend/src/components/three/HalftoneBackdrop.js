import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/motion";

/** Animated halftone dot grid driven by a sine wave. */
const HalftoneGrid = () => {
  const meshRef = useRef(null);
  const count = 32;

  const { positions, scales } = useMemo(() => {
    const pos = [];
    const scl = [];
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        pos.push(
          (x / (count - 1) - 0.5) * 14,
          (y / (count - 1) - 0.5) * 14,
          0
        );
        scl.push(0.12);
      }
    }
    return { positions: new Float32Array(pos), scales: new Float32Array(scl) };
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const arr = meshRef.current.geometry.attributes.position.array;
    const scArr = meshRef.current.geometry.attributes.aScale
      ? meshRef.current.geometry.attributes.aScale.array
      : null;

    for (let i = 0; i < count * count; i++) {
      const xi = arr[i * 3] / 14;
      const yi = arr[i * 3 + 1] / 14;
      const wave = Math.sin((xi + yi) * 5 + t * 0.4) * 0.5 + 0.5;
      if (scArr) scArr[i] = 0.06 + wave * 0.12;
    }
    if (scArr) meshRef.current.geometry.attributes.aScale.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#232A2A"
        size={0.18}
        transparent
        opacity={0.18}
        sizeAttenuation
      />
    </points>
  );
};

/** WebGL halftone backdrop: subtle animated dot grid behind the hero. */
export const HalftoneBackdrop = () => {
  if (prefersReducedMotion()) return <HalftoneStatic />;
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
        gl={{ alpha: true, antialias: false }}
        style={{ width: "100%", height: "100%" }}
      >
        <HalftoneGrid />
      </Canvas>
    </div>
  );
};

/** Static CSS fallback: a radial dot pattern using CSS background. */
export const HalftoneStatic = () => (
  <div
    className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.07]"
    aria-hidden="true"
    style={{
      backgroundImage: "radial-gradient(circle, #232A2A 1px, transparent 1px)",
      backgroundSize: "28px 28px",
    }}
  />
);
