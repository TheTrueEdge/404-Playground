"use client";

import React, { useRef, useState } from "react";
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import {
  Vector2,
  Vector3,
  Mesh,
  Shape,
  Curve,
  Euler,
  Group,
  Quaternion
} from "three";
import { extend } from "@react-three/fiber";
import { ExtrudeGeometry } from "three";

extend({ ExtrudeGeometry });

type GlassRingProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  //pointer?: { x: number; y: number } | null; // raw pointer coords in pixels
  //domSize?: { width: number; height: number };
};

// Reusable drifting + physics push hook for meshes/groups
function useInteractiveDriftPhysics(
  ref: React.RefObject<Mesh | Group | null>,
  basePosition: Vector3,
  baseRotation: Euler,
) {
  const [, setHovered] = useState(false);
  const currentPos = useRef(new Vector3().copy(basePosition));
  const currentRotQuat = useRef(new Quaternion().setFromEuler(baseRotation));
  const velocityPos = useRef(new Vector3(0, 0, 0));
  const velocityRot = useRef(new Vector3(0, 0, 0));
  const damping = 0.85;
  const springFactor = 5.0;
  const pushForce = 1.5;
  function onPointerOver() {
    setHovered(true);
  }
  function onPointerOut() {
    setHovered(false);
  }
  function onPointerMove(e: ThreeEvent<PointerEvent>) {
    if (!ref.current) return;
    const localPoint = ref.current.worldToLocal(e.point.clone());
    const pushVec = localPoint.clone();
    if (pushVec.length() > 0.3) pushVec.setLength(0.3);
    velocityPos.current.add(pushVec.multiplyScalar(pushForce));
    const rotPush = new Vector3(
      -pushVec.y * pushForce * 3,
      pushVec.x * pushForce * 3,
      pushVec.z * pushForce * 1.5,
    );
    rotPush.z += (Math.random() - 0.5) * 0.1;
    velocityRot.current.add(rotPush);
  }

  useFrame((state, delta) => {
    if (!ref.current) return;
    // Position physics
    const posDiff = basePosition.clone().sub(currentPos.current).multiplyScalar(springFactor * delta);
    velocityPos.current.add(posDiff);
    velocityPos.current.multiplyScalar(damping);
    currentPos.current.add(velocityPos.current.clone().multiplyScalar(delta));
    // Rotation physics
    const baseQuat = new Quaternion().setFromEuler(baseRotation);
    const diffQuat = baseQuat.clone().multiply(currentRotQuat.current.clone().invert());
    let angle = 2 * Math.acos(diffQuat.w);
    if (angle > Math.PI) angle -= 2 * Math.PI;
    const sinHalfAngle = Math.sqrt(1 - diffQuat.w * diffQuat.w);
    let axis: Vector3;
    if (sinHalfAngle < 0.001) {
      axis = new Vector3(1, 0, 0);
    } else {
      axis = new Vector3(diffQuat.x, diffQuat.y, diffQuat.z).divideScalar(sinHalfAngle);
    }
    const rotDiffVec = axis.multiplyScalar(angle * springFactor * delta);
    velocityRot.current.add(rotDiffVec);
    velocityRot.current.multiplyScalar(damping);
    const axisVel = velocityRot.current.clone().normalize();
    const angleVel = velocityRot.current.length() * delta;
    if (angleVel !== 0) {
      const deltaQuat = new Quaternion();
      deltaQuat.setFromAxisAngle(axisVel, angleVel);
      currentRotQuat.current.multiply(deltaQuat);
      currentRotQuat.current.normalize();
    }
    ref.current.position.copy(currentPos.current);
    ref.current.quaternion.copy(currentRotQuat.current);
  });

  return { onPointerOver, onPointerOut, onPointerMove };
}

function GlassRing({ position = [0, 0, 0], rotation = [0, 0, Math.PI / 4], scale = [1, 1, 1] }: GlassRingProps) {
  const meshRef = useRef<Mesh>(null);
  const basePosition = new Vector3(...position);
  const baseRotation = new Euler(...rotation);
  const { onPointerOver, onPointerOut, onPointerMove } = useInteractiveDriftPhysics(meshRef, basePosition, baseRotation);

  return (
    <mesh
      ref={meshRef}
      position={basePosition}
      rotation={baseRotation}
      scale={scale}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onPointerMove={onPointerMove}
      castShadow
      receiveShadow
    >
      <torusGeometry args={[1.3, 0.2, 64, 256]} />
      <MeshTransmissionMaterial
        backside
        samples={8}
        resolution={1024}
        transmission={1}
        thickness={1.2}
        roughness={0}
        anisotropy={1}
        chromaticAberration={1}
        distortion={0.15}
        distortionScale={0.8}
        temporalDistortion={0.25}
        ior={1.7}
        color="#ffffff"
        attenuationDistance={0.5}
        attenuationColor="#e0f7ff"
      />
    </mesh>
  );
}

class SpiralCurve extends Curve<Vector3> {
  constructor() {
    super();
  }
  getPoint(t: number) {
    const angle = 2 * Math.PI * 2.5 * t;
    const radius = 0.6;
    const x = Math.cos(angle) * radius;
    const y = t * 2.8 - 1.4;
    const z = Math.sin(angle) * radius;
    return new Vector3(x, y, z);
  }
}

function createRoundedTriangle(sideLength: number, radius: number): Shape {
  const height = (Math.sqrt(3) / 2) * sideLength;
  const shape = new Shape();

  // Equilateral triangle points (centered)
  const p1 = new Vector2(-sideLength / 2, -height / 3);
  const p2 = new Vector2(0, (2 * height) / 3);
  const p3 = new Vector2(sideLength / 2, -height / 3);

  function addRoundedCorner(ctx: Shape, from: Vector2, corner: Vector2, to: Vector2, radius: number, isFirst = false) {
    const v1 = from.clone().sub(corner).normalize();
    const v2 = to.clone().sub(corner).normalize();
    const start = corner.clone().add(v1.multiplyScalar(radius));
    const end = corner.clone().add(v2.multiplyScalar(radius));

    if (isFirst) {
      ctx.moveTo(start.x, start.y);
    } else {
      ctx.lineTo(start.x, start.y);
    }
    ctx.quadraticCurveTo(corner.x, corner.y, end.x, end.y);
  }
  addRoundedCorner(shape, p3, p1, p2, radius, true);
  addRoundedCorner(shape, p1, p2, p3, radius);
  addRoundedCorner(shape, p2, p3, p1, radius);
  shape.closePath();
  return shape;
}


function TriangleRing({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]}: GlassRingProps) {
  const meshRef = useRef<Mesh>(null);
  const basePosition = new Vector3(...position);
  const baseRotation = new Euler(...rotation);
  const outerSide = 3;
  const innerSide = 2.6;
  const cornerRadius = 0.2;
  const outerShape = createRoundedTriangle(outerSide, cornerRadius);
  const innerShape = createRoundedTriangle(innerSide, 0);
  innerShape.curves.reverse(); // reverse curve winding
  outerShape.holes.push(innerShape);
  const extrudeSettings = {
    depth: 0.15,
    bevelEnabled: true,
    bevelThickness: 0.09,
    bevelSize: 0.09,
    bevelSegments: 8,
    steps: 1,
  };
  const { onPointerOver, onPointerOut, onPointerMove } = useInteractiveDriftPhysics(meshRef, basePosition, baseRotation);

  return (
    <mesh
      ref={meshRef}
      position={basePosition}
      rotation={baseRotation}
      scale={scale}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onPointerMove={onPointerMove}
      castShadow
      receiveShadow
    >
      <extrudeGeometry args={[outerShape, extrudeSettings]} />
      <MeshTransmissionMaterial
        backside
        samples={8}
        resolution={1024}
        transmission={1}
        thickness={1.2}
        roughness={0}
        anisotropy={1}
        chromaticAberration={1}
        distortion={0.15}
        distortionScale={0.8}
        temporalDistortion={0.25}
        ior={1.7}
        color="#ffffff"
        attenuationDistance={0.5}
        attenuationColor="#e0f7ff"
      />
    </mesh>
  );
}

// Cube Frame component
function HollowCubeFrame({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }: GlassRingProps) {
  const groupRef = useRef<Group>(null);
  const basePosition = new Vector3(...position);
  const baseRotation = new Euler(...rotation);
  const { onPointerOver, onPointerOut, onPointerMove } = useInteractiveDriftPhysics(groupRef, basePosition, baseRotation);
  const edgeLength = 2;
  const edgeThickness = 0.3;
  const edges: { pos: [number, number, number]; rot: [number, number, number] }[] = [
    { pos: [1, 0, 1], rot: [0, 0, 0] },
    { pos: [-1, 0, 1], rot: [0, 0, 0] },
    { pos: [1, 0, -1], rot: [0, 0, 0] },
    { pos: [-1, 0, -1], rot: [0, 0, 0] },
    { pos: [0, 1, 1], rot: [0, 0, Math.PI / 2] },
    { pos: [0, -1, 1], rot: [0, 0, Math.PI / 2] },
    { pos: [0, 1, -1], rot: [0, 0, Math.PI / 2] },
    { pos: [0, -1, -1], rot: [0, 0, Math.PI / 2] },
    { pos: [1, 1, 0], rot: [Math.PI / 2, 0, 0] },
    { pos: [-1, 1, 0], rot: [Math.PI / 2, 0, 0] },
    { pos: [1, -1, 0], rot: [Math.PI / 2, 0, 0] },
    { pos: [-1, -1, 0], rot: [Math.PI / 2, 0, 0] },
  ];

  return (
    <group
      ref={groupRef}
      position={basePosition}
      rotation={baseRotation}
      scale={scale}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onPointerMove={onPointerMove}
      castShadow
      receiveShadow
    >
      {edges.map(({ pos, rot }, i) => (
        <mesh key={i} position={pos} rotation={rot}>
          <cylinderGeometry args={[edgeThickness / 2, edgeThickness / 2, edgeLength, 16]} />
          <MeshTransmissionMaterial
            backside
            samples={8}
            resolution={1024}
            transmission={1}
            thickness={1.2}
            roughness={0}
            anisotropy={1}
            chromaticAberration={1}
            distortion={0.15}
            distortionScale={0.8}
            temporalDistortion={0.25}
            ior={1.7}
            color="#ffffff"
            attenuationDistance={0.5}
            attenuationColor="#e0f7ff"
          />
        </mesh>
      ))}
    </group>
  );
}

function SpiralHelix({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }: GlassRingProps) {
  const meshRef = useRef<Mesh>(null);
  const basePosition = new Vector3(...position);
  const baseRotation = new Euler(...rotation);
  const { onPointerOver, onPointerOut, onPointerMove } = useInteractiveDriftPhysics(meshRef, basePosition, baseRotation);

  return (
    <mesh
      ref={meshRef}
      position={basePosition}
      rotation={baseRotation}
      scale={scale}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onPointerMove={onPointerMove}
      castShadow
      receiveShadow
    >
      <tubeGeometry args={[new SpiralCurve(), 200, 0.18, 8, false]} />
      <MeshTransmissionMaterial
        backside
        samples={8}
        resolution={1024}
        transmission={1}
        thickness={1.2}
        roughness={0}
        anisotropy={1}
        chromaticAberration={1}
        distortion={0.15}
        distortionScale={0.8}
        temporalDistortion={0.25}
        ior={1.7}
        color="#ffffff"
        attenuationDistance={0.5}
        attenuationColor="#e0f7ff"
      />
    </mesh>
  );
}

export default function GlassRingScene() {

  return (
    <div className="w-full h-[500px] bg-black rounded-xl shadow-xl">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} linear>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={2.5} />
        <pointLight position={[-5, -5, -5]} intensity={0.75} />

        <OrbitControls enableZoom={false} enableRotate={false} />

        <HollowCubeFrame 
          position={[-7.25, 0, 0]} 
          rotation={[Math.PI / 5, Math.PI / 4, 0]}
          scale={[1.4, 1.4, 1.4]}
        />
        <GlassRing 
          position={[-2.25, 0, 0]} 
          rotation={[0, 0, Math.PI / 4]} 
          scale={[1.5, 1.5, 1.5]}
        />
        <SpiralHelix 
          position={[2.75, 0, 0]} 
          rotation={[0, 0, -Math.PI / 6]} 
          scale={[1.5, 1.5, 1.5]}
        />
        <TriangleRing 
          position={[7.75, 0, 0]} 
          rotation={[0, 0, -Math.PI / 12]} 
          scale={[1.5, 1.5, 1.5]}
        />

        <Environment preset="studio" />
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} intensity={1.5} />
          <ChromaticAberration offset={new Vector2(0.0025, 0.0025)} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
