"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Line2, LineGeometry, LineMaterial } from "three-stdlib";

class InfinityCurve extends THREE.Curve<THREE.Vector3> {
  private size: number;

  constructor() {
    super();
    this.size = Math.min(window.innerWidth, window.innerHeight) / 50; // Dynamic size
  }

  getPoint(t: number): THREE.Vector3 {
    const x = this.size * Math.sin(2 * Math.PI * t);
    const y = (this.size * Math.sin(4 * Math.PI * t)) / 2;
    return new THREE.Vector3(x, y, 0);
  }
}

const Tracer = ({ curve }: { curve: InfinityCurve }) => {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const t = (elapsedTime % 5) / 5; // Tracer speed (0 to 1 over 5 seconds)
    const position = curve.getPoint(t);

    if (sphereRef.current) {
      sphereRef.current.position.set(position.x, position.y, position.z);
    }
  });

  // Dynamically scale the ball's size
  const size = Math.max(
    0.1,
    Math.min(0.3, Math.min(window.innerWidth, window.innerHeight) / 200)
  );

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

const InfinitySymbol = () => {
  const curveRef = useRef<Line2 | null>(null);
  const infinityCurve = new InfinityCurve();

  React.useEffect(() => {
    const points = infinityCurve.getPoints(100);
    const positions = points.flatMap((point) => [point.x, point.y, point.z]);

    const geometry = new LineGeometry();
    geometry.setPositions(positions);

    const material = new LineMaterial({
      color: 0x00ffcc,
      linewidth: 0.1,
    });
    material.resolution.set(window.innerWidth, window.innerHeight);

    const line = new Line2(geometry, material);
    curveRef.current = line;

    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [infinityCurve]);

  return (
    <>
      {curveRef.current && (
        <primitive object={curveRef.current as unknown as object} />
      )}
      <Tracer curve={infinityCurve} />
    </>
  );
};

const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
};

const Scene = () => {
  const { width, height } = useWindowSize();

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, Math.max(20, width / 50)], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <InfinitySymbol />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Scene;
