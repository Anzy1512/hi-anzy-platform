import React, { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { subscribeScroll } from "@/lib/motion";

/**
 * THE ANZY SYSTEM CORE
 * Disconnected editorial nodes (paper cards) that a single orange route
 * connects as the user scrolls — AUDIT → ARCHITECT → BUILD → CONNECT → SCALE → ROI.
 * Authored camera, pointer parallax only. No orbit controls.
 */

const NODE_DEFS = [
  { label: "BRAND", scatter: [-2.1, 2.0, -1.6], resolved: [-1.7, 1.35, 0] },
  { label: "CUSTOMER", scatter: [1.75, 2.6, -2.4], resolved: [0.05, 1.9, -0.2] },
  { label: "SALES", scatter: [2.3, 0.35, -1.0], resolved: [1.7, 1.1, 0.1] },
  { label: "TECH", scatter: [-2.5, -0.55, -2.2], resolved: [-1.8, -0.2, 0.15] },
  { label: "CONTENT", scatter: [0.8, -0.35, -3.0], resolved: [0.0, 0.4, 0.25] },
  { label: "DATA", scatter: [-1.4, -2.5, -1.2], resolved: [-1.05, -1.45, 0] },
  { label: "OPERATIONS", scatter: [0.5, -2.9, -2.0], resolved: [0.55, -1.0, -0.1] },
  { label: "GROWTH", scatter: [2.1, -2.0, -1.4], resolved: [1.75, -1.7, 0.1] },
];

const ROUTE_ORDER = [0, 1, 2, 4, 3, 5, 6, 7];
const ROI_POS = [2.25, -2.45, 0.3];
const STAGE_LABELS = [
  { label: "AUDIT", at: 0.06 },
  { label: "ARCHITECT", at: 0.28 },
  { label: "BUILD", at: 0.5 },
  { label: "CONNECT", at: 0.7 },
  { label: "SCALE", at: 0.88 },
];

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const clamp01 = (v) => Math.max(0, Math.min(1, v));

const NodeCard = ({ def, progressRef, index }) => {
  const group = useRef(null);
  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const p = easeInOut(clamp01(progressRef.current));
    const t = clock.getElapsedTime();
    const floatAmp = 0.09 * (1 - p * 0.75);
    g.position.set(
      THREE.MathUtils.lerp(def.scatter[0], def.resolved[0], p),
      THREE.MathUtils.lerp(def.scatter[1], def.resolved[1], p) + Math.sin(t * 0.7 + index * 1.7) * floatAmp,
      THREE.MathUtils.lerp(def.scatter[2], def.resolved[2], p)
    );
    const wob = (1 - p) * 0.35;
    g.rotation.set(Math.sin(t * 0.5 + index) * 0.12 * wob + index * 0.02 * wob, Math.cos(t * 0.4 + index * 2) * 0.3 * wob, Math.sin(t * 0.3 + index * 3) * 0.14 * wob);
    g.scale.setScalar(1 + Math.sin(t * 0.9 + index * 2.1) * 0.02);
  });
  return (
    <group ref={group}>
      <mesh>
        <boxGeometry args={[1.12, 0.44, 0.06]} />
        <meshStandardMaterial color="#F7F5EE" roughness={0.85} metalness={0} />
      </mesh>
      <mesh position={[-0.44, 0, 0.04]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshStandardMaterial color="#F19020" roughness={0.6} />
      </mesh>
      <Html center transform position={[0.05, 0, 0.05]} scale={0.27} pointerEvents="none" zIndexRange={[2, 0]}>
        <div data-scene-label style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: "0.12em", color: "#232A2A", whiteSpace: "nowrap", pointerEvents: "none" }}>{def.label}</div>
      </Html>
    </group>
  );
};

const Route = ({ progressRef }) => {
  const meshRef = useRef(null);
  const { geometry, indexCount } = useMemo(() => {
    const pts = ROUTE_ORDER.map((i) => new THREE.Vector3(...NODE_DEFS[i].resolved));
    pts.unshift(new THREE.Vector3(-2.9, 2.6, -0.4));
    pts.push(new THREE.Vector3(...ROI_POS));
    const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.35);
    const geo = new THREE.TubeGeometry(curve, 220, 0.045, 8, false);
    return { geometry: geo, indexCount: geo.index.count };
  }, []);
  useFrame(() => {
    const p = clamp01(progressRef.current * 1.05);
    geometry.setDrawRange(0, Math.floor(indexCount * p));
  });
  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial color="#F19020" />
    </mesh>
  );
};

const StageLabels = ({ progressRef }) => {
  const refs = useRef([]);
  const roiRef = useRef(null);
  const positions = useMemo(() => {
    const pts = ROUTE_ORDER.map((i) => new THREE.Vector3(...NODE_DEFS[i].resolved));
    pts.unshift(new THREE.Vector3(-2.9, 2.6, -0.4));
    pts.push(new THREE.Vector3(...ROI_POS));
    const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.35);
    return STAGE_LABELS.map((s) => {
      const v = curve.getPointAt(s.at);
      return [v.x, v.y + 0.42, v.z + 0.1];
    });
  }, []);
  useFrame(() => {
    const p = clamp01(progressRef.current);
    STAGE_LABELS.forEach((s, i) => {
      const el = refs.current[i];
      if (el) el.style.opacity = p > s.at + 0.02 ? "1" : "0";
    });
    if (roiRef.current) roiRef.current.style.opacity = p > 0.96 ? "1" : "0";
  });
  return (
    <>
      {STAGE_LABELS.map((s, i) => (
        <group key={s.label} position={positions[i]}>
          <Html center transform scale={0.3} pointerEvents="none" zIndexRange={[3, 0]}>
            <div data-scene-label ref={(el) => { refs.current[i] = el; }} style={{ opacity: 0, transition: "opacity 0.6s ease", fontFamily: "'Rajdhani', sans-serif", fontSize: 17, letterSpacing: "0.18em", color: "#F19020", background: "rgba(29,36,36,0.85)", padding: "3px 10px", borderRadius: 999, border: "1px solid rgba(241,144,32,0.5)", whiteSpace: "nowrap", pointerEvents: "none" }}>
              {`0${i + 1} ${s.label}`}
            </div>
          </Html>
        </group>
      ))}
      <group position={[ROI_POS[0], ROI_POS[1] - 0.05, ROI_POS[2] + 0.15]}>
        <Html center transform scale={0.42} pointerEvents="none" zIndexRange={[3, 0]}>
          <div data-scene-label ref={roiRef} style={{ opacity: 0, transition: "opacity 0.7s ease", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 30, letterSpacing: "0.06em", color: "#F7F5EE", background: "#E54A25", padding: "3px 14px", borderRadius: 10, whiteSpace: "nowrap", pointerEvents: "none" }}>
            ROI
          </div>
        </Html>
      </group>
    </>
  );
};

const Deco = () => {
  const pts = useMemo(() => [[-0.9, 2.4, -2.5], [2.2, -0.5, -2.8], [-2.3, -1.8, -3.0], [1.3, 2.2, -1.8], [-0.4, -2.4, -2.2]], []);
  return (
    <>
      {pts.map((p, i) => (
        <mesh key={i} position={p}>
          {i % 2 === 0 ? <boxGeometry args={[0.22, 0.22, 0.22]} /> : <sphereGeometry args={[0.07, 12, 12]} />}
          <meshStandardMaterial color={i % 2 === 0 ? "#2E3636" : "#F19020"} roughness={0.8} />
        </mesh>
      ))}
    </>
  );
};

/* Ambient drifting particles — analog dust in the system chamber */
const Particles = () => {
  const ref = useRef(null);
  const positions = useMemo(() => {
    const n = 46;
    const arr = new Float32Array(n * 3);
    let s = 7;
    const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    for (let i = 0; i < n; i += 1) {
      arr[i * 3] = (rnd() - 0.5) * 7;
      arr[i * 3 + 1] = (rnd() - 0.5) * 6.4;
      arr[i * 3 + 2] = -1.2 - rnd() * 3.2;
    }
    return arr;
  }, []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.z = t * 0.016;
    ref.current.rotation.y = Math.sin(t * 0.05) * 0.08;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#F19020" size={0.045} sizeAttenuation transparent opacity={0.45} depthWrite={false} />
    </points>
  );
};

/* A signal pulse travelling the connected route — the system, running */
const PulseDot = ({ progressRef }) => {
  const ref = useRef(null);
  const curve = useMemo(() => {
    const pts = ROUTE_ORDER.map((i) => new THREE.Vector3(...NODE_DEFS[i].resolved));
    pts.unshift(new THREE.Vector3(-2.9, 2.6, -0.4));
    pts.push(new THREE.Vector3(...ROI_POS));
    return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.35);
  }, []);
  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const p = clamp01(progressRef.current);
    if (p < 0.22) {
      m.visible = false;
      return;
    }
    m.visible = true;
    const t = (clock.getElapsedTime() * 0.09) % 1;
    const pos = curve.getPointAt(Math.min(t, Math.max(p - 0.02, 0.01)));
    m.position.set(pos.x, pos.y, pos.z + 0.06);
    const pulse = 1 + Math.sin(clock.getElapsedTime() * 6) * 0.25;
    m.scale.setScalar(pulse);
  });
  return (
    <mesh ref={ref} visible={false}>
      <sphereGeometry args={[0.075, 14, 14]} />
      <meshBasicMaterial color="#E54A25" />
    </mesh>
  );
};

/* World-space bounds of the resolved system, including the widest node label
   ("OPERATIONS"), the route's lead-in point and the ROI chip. Keeping this as
   data means the auto-fit below never has to guess. */
const CONTENT = (() => {
  let minX = -2.9;
  let maxX = 2.3;
  let minY = -2.9;
  let maxY = 2.6;
  const consider = (x, y, halfW, halfH) => {
    minX = Math.min(minX, x - halfW);
    maxX = Math.max(maxX, x + halfW);
    minY = Math.min(minY, y - halfH);
    maxY = Math.max(maxY, y + halfH);
  };
  NODE_DEFS.forEach((d) => {
    // card is 1.12 wide; a long label can overhang it
    const halfW = Math.max(0.56, (d.label.length * 0.155 + 0.2) / 2);
    consider(d.scatter[0], d.scatter[1], halfW, 0.3);
    consider(d.resolved[0], d.resolved[1], halfW, 0.3);
  });
  consider(ROI_POS[0], ROI_POS[1], 0.62, 0.42);
  return { cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, w: maxX - minX, h: maxY - minY };
})();

const SceneInner = ({ progressRef, pointerRef }) => {
  const world = useRef(null);
  const { viewport } = useThree();
  useFrame(() => {
    const w = world.current;
    if (!w) return;

    // Auto-fit so no node card or label is ever clipped by the frame,
    // whatever the panel's aspect ratio is (desktop, tablet, mobile).
    const margin = 0.92;
    const fit = Math.min(
      (viewport.width * margin) / CONTENT.w,
      (viewport.height * margin) / CONTENT.h,
      1
    );
    const s = THREE.MathUtils.lerp(w.scale.x, fit, 0.1);
    w.scale.setScalar(s);
    w.position.x = THREE.MathUtils.lerp(w.position.x, -CONTENT.cx * fit, 0.1);
    w.position.y = THREE.MathUtils.lerp(w.position.y, -CONTENT.cy * fit, 0.1);

    w.rotation.y = THREE.MathUtils.lerp(w.rotation.y, pointerRef.current.x * 0.09, 0.06);
    w.rotation.x = THREE.MathUtils.lerp(w.rotation.x, -pointerRef.current.y * 0.05, 0.06);
  });
  return (
    <group ref={world}>
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 6, 6]} intensity={0.7} />
      <Route progressRef={progressRef} />
      <PulseDot progressRef={progressRef} />
      {NODE_DEFS.map((d, i) => (
        <NodeCard key={d.label} def={d} progressRef={progressRef} index={i} />
      ))}
      <StageLabels progressRef={progressRef} />
      <Particles />
      <Deco />
    </group>
  );
};

const SystemCore = () => {
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const introRef = useRef(0);

  React.useEffect(() => {
    let raf;
    const startTime = performance.now();
    // Scroll position comes from the shared, Lenis-synced source so the route
    // animation advances on the same value as the top progress bar.
    const scrollRef = { current: window.scrollY };
    const unsubscribe = subscribeScroll((scroll) => {
      scrollRef.current = scroll;
    });
    const update = () => {
      const scrollP = clamp01(scrollRef.current / (window.innerHeight * 1.15));
      const intro = clamp01((performance.now() - startTime) / 3000) * 0.16;
      introRef.current = intro;
      progressRef.current = Math.max(intro, scrollP);
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    const onPointer = (e) => {
      pointerRef.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      unsubscribe();
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <div className="h-full w-full" data-testid="hero-system-core-canvas">
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 10.2], fov: 38 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} style={{ background: "transparent" }}>
        <SceneInner progressRef={progressRef} pointerRef={pointerRef} />
      </Canvas>
    </div>
  );
};

export default SystemCore;
