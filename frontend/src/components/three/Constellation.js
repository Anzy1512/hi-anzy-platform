import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, QuadraticBezierLine } from "@react-three/drei";
import * as THREE from "three";

/**
 * THE NETWORK CONSTELLATION
 * Hi Anzy central; discipline clusters orbit. Selecting a category expands
 * its cluster and routes it to the centre. Controlled entirely from the
 * accessible DOM category list — the scene is never the only source of info.
 */

const mulberry = (seed) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const Cluster = ({ name, index, total, active, anyActive, subs = [], onSelect }) => {
  const group = useRef(null);
  const labelRef = useRef(null);
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const base = useMemo(() => new THREE.Vector3(Math.cos(angle) * 3.4, Math.sin(angle) * 2.1, 0), [angle]);
  const dots = useMemo(() => {
    const rnd = mulberry(index * 97 + 13);
    return Array.from({ length: 5 }, () => [ (rnd() - 0.5) * 1.15, (rnd() - 0.5) * 0.85, (rnd() - 0.5) * 0.6 ]);
  }, [index]);

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.getElapsedTime();
    const targetScale = active ? 1.45 : anyActive ? 0.72 : 1;
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, targetScale, 0.08));
    const tz = active ? 1.1 : 0;
    g.position.set(base.x, base.y + Math.sin(t * 0.5 + index) * 0.07, THREE.MathUtils.lerp(g.position.z, tz, 0.08));
    if (labelRef.current) labelRef.current.style.opacity = active ? "1" : anyActive ? "0.3" : "0.85";
    g.children.forEach((c) => {
      if (c.material) c.material.opacity = THREE.MathUtils.lerp(c.material.opacity, active ? 1 : anyActive ? 0.22 : 0.8, 0.08);
    });
  });

  return (
    <group ref={group} position={base.toArray()}>
      {/* Invisible hit target — lets visitors click a cluster to deep-dive its specialists */}
      {onSelect && (
        <mesh
          onClick={(e) => { e.stopPropagation(); onSelect(name); }}
          onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { document.body.style.cursor = ""; }}
        >
          <sphereGeometry args={[0.75, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
      {dots.map((d, i) => (
        <mesh key={i} position={d}>
          <sphereGeometry args={[i === 0 ? 0.11 : 0.065, 12, 12]} />
          <meshBasicMaterial color={i === 0 ? "#F19020" : "#F7F5EE"} transparent opacity={0.8} />
        </mesh>
      ))}
      <Html center transform position={[0, 0.62, 0]} scale={0.3} pointerEvents="none" zIndexRange={[2, 0]}>
        <div ref={labelRef} style={{ transition: "opacity 0.4s ease", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: 16, letterSpacing: "0.16em", color: "#F7F5EE", whiteSpace: "nowrap", pointerEvents: "none" }}>{name.toUpperCase()}</div>
      </Html>
      {/* Subcategory fan — visible when this cluster is focused */}
      {active && subs.slice(0, 6).map((s, j) => {
        const n = Math.min(subs.length, 6);
        const a = ((j / Math.max(n - 1, 1)) - 0.5) * Math.PI * 0.85 + Math.PI / 2;
        const sx = Math.cos(a) * 1.35;
        const sy = -Math.sin(a) * 0.95 - 0.35;
        return (
          <group key={s}>
            <QuadraticBezierLine start={[0, 0, 0]} end={[sx, sy, 0.15]} mid={[sx * 0.5, sy * 0.5 - 0.1, 0.1]} color="#F19020" lineWidth={1} transparent opacity={0.55} />
            <mesh position={[sx, sy, 0.15]}>
              <sphereGeometry args={[0.045, 10, 10]} />
              <meshBasicMaterial color="#F19020" />
            </mesh>
            <Html center transform position={[sx, sy - 0.22, 0.15]} scale={0.24} pointerEvents="none" zIndexRange={[3, 0]}>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: 15, letterSpacing: "0.08em", color: "#F7F5EE", background: "rgba(29,36,36,0.88)", border: "1px solid rgba(241,144,32,0.45)", borderRadius: 999, padding: "2px 10px", whiteSpace: "nowrap", pointerEvents: "none", animation: "subFadeIn 0.5s ease both", animationDelay: `${j * 70}ms` }}>
                {s}
              </div>
              <style>{`@keyframes subFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

const CenterNode = () => {
  const ring = useRef(null);
  const ring2 = useRef(null);
  const core = useRef(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ring.current) ring.current.rotation.z = t * 0.3;
    if (ring2.current) {
      ring2.current.rotation.z = -t * 0.18;
      ring2.current.rotation.x = 0.9 + Math.sin(t * 0.4) * 0.15;
    }
    if (core.current) core.current.scale.setScalar(1 + Math.sin(t * 1.6) * 0.06);
  });
  return (
    <group>
      <mesh ref={core}>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshBasicMaterial color="#F19020" />
      </mesh>
      <mesh ref={ring} rotation={[0.4, 0, 0]}>
        <torusGeometry args={[0.62, 0.015, 8, 48]} />
        <meshBasicMaterial color="#F19020" transparent opacity={0.55} />
      </mesh>
      <mesh ref={ring2} rotation={[0.9, 0, 0]}>
        <torusGeometry args={[0.86, 0.01, 8, 48]} />
        <meshBasicMaterial color="#F7F5EE" transparent opacity={0.28} />
      </mesh>
      <Html center transform position={[0, -0.85, 0]} scale={0.34} pointerEvents="none" zIndexRange={[2, 0]}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 17, fontWeight: 700, letterSpacing: "0.2em", color: "#F19020", whiteSpace: "nowrap", pointerEvents: "none" }}>HI ANZY</div>
      </Html>
    </group>
  );
};

/* Ambient dust for the dark constellation chamber */
const Dust = () => {
  const ref = useRef(null);
  const { positions, count } = useMemo(() => {
    const n = 70;
    const arr = new Float32Array(n * 3);
    let s = 21;
    const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    for (let i = 0; i < n; i += 1) {
      arr[i * 3] = (rnd() - 0.5) * 11;
      arr[i * 3 + 1] = (rnd() - 0.5) * 6.5;
      arr[i * 3 + 2] = -2 - rnd() * 4;
    }
    return { positions: arr, count: n };
  }, []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.012;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#F7F5EE" size={0.04} sizeAttenuation transparent opacity={0.35} depthWrite={false} />
    </points>
  );
};

const SceneInner = ({ categories, active, subs, onSelect }) => {
  const world = useRef(null);
  const activeIndex = categories.indexOf(active);
  useFrame(({ clock }) => {
    if (!world.current) return;
    const target = active ? 0 : Math.sin(clock.getElapsedTime() * 0.1) * 0.12;
    world.current.rotation.y = THREE.MathUtils.lerp(world.current.rotation.y, target, 0.04);
  });
  const activePos = useMemo(() => {
    if (activeIndex < 0) return null;
    const angle = (activeIndex / categories.length) * Math.PI * 2 - Math.PI / 2;
    return [Math.cos(angle) * 3.4, Math.sin(angle) * 2.1, 1.1];
  }, [activeIndex, categories.length]);
  return (
    <group ref={world}>
      <Dust />
      <CenterNode />
      {categories.map((c, i) => (
        <Cluster key={c} name={c} index={i} total={categories.length} active={active === c} anyActive={!!active} subs={(subs && subs[c]) || []} onSelect={onSelect} />
      ))}
      {activePos && (
        <QuadraticBezierLine key={active} start={[0, 0, 0]} end={activePos} mid={[activePos[0] * 0.4, activePos[1] * 0.4 + 0.7, 0.6]} color="#F19020" lineWidth={2.4} dashed={false} />
      )}
    </group>
  );
};

const Constellation = ({ categories = [], active = null, subs = null, onSelect = null }) => (
  <div className="h-full w-full" data-testid="network-constellation-canvas">
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 7.6], fov: 46 }} gl={{ antialias: true, alpha: true }} style={{ background: "transparent" }}>
      <SceneInner categories={categories} active={active} subs={subs} onSelect={onSelect} />
    </Canvas>
  </div>
);

export default Constellation;
