import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * HalftoneBackdrop — deck-referenced texture as a minor 3JS motion background.
 * The brand deck leans on halftone dot collage; this renders the same dot
 * language as a fixed, near-invisible field behind the page. Dots "breathe"
 * on a slow travelling wave and crawl a few pixels per second. Ink #232A2A
 * at 2–5% effective alpha — texture, never noise.
 */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;
  void main() {
    vec2 px = vUv * uRes;
    // extremely slow drift — a few px per second, diagonal like the deck scans
    px += vec2(uTime * 5.0, -uTime * 3.5);
    float cell = 26.0;
    vec2 g = mod(px, cell) - cell * 0.5;
    vec2 id = floor(px / cell);
    // slow travelling wave modulates dot radius (halftone "breathing")
    float wave = sin(id.x * 0.32 + uTime * 0.35) * cos(id.y * 0.27 - uTime * 0.28);
    float r = 1.3 + 1.25 * (0.5 + 0.5 * wave);
    float d = length(g);
    float dotMask = 1.0 - smoothstep(r - 0.8, r + 0.8, d);
    // keep the reading column clean: texture strengthens toward the edges
    float vign = smoothstep(0.22, 0.95, distance(vUv, vec2(0.5)));
    float alpha = dotMask * (0.035 + 0.075 * vign);
    gl_FragColor = vec4(vec3(0.137, 0.165, 0.165), alpha);
  }
`;

const HalftoneField = () => {
  const mat = useRef();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1920, 800) },
    }),
    []
  );
  useFrame((state) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    mat.current.uniforms.uRes.value.set(state.size.width, state.size.height);
  });
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
};

export const HalftoneBackdrop = () => (
  <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true" data-testid="home-texture-backdrop">
    <Canvas dpr={1} gl={{ alpha: true, antialias: false, powerPreference: "low-power" }} frameloop="always">
      <HalftoneField />
    </Canvas>
  </div>
);

