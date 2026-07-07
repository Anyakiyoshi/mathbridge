import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { ReactNode } from 'react';

interface MathSceneProps {
  children?: ReactNode;
  cameraPosition?: [number, number, number];
  showGrid?: boolean;
  className?: string;
}

export default function MathScene({
  children,
  cameraPosition = [4, 4, 6],
  showGrid = true,
  className = 'math-scene',
}: MathSceneProps) {
  return (
    <Canvas className={className} camera={{ position: cameraPosition, fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      <directionalLight position={[-3, 3, -3]} intensity={0.3} />
      {showGrid && <GridPlane />}
      <Axes3D />
      <OrbitControls enableDamping dampingFactor={0.1} />
      {children}
    </Canvas>
  );
}

// XY grid plane at z=0
function GridPlane() {
  return (
    <group>
      <gridHelper args={[8, 16, '#444', '#333']} rotation={[0, 0, 0]} />
    </group>
  );
}

function Axes3D() {
  const axisLen = 4;
  return (
    <group>
      {/* X axis - red */}
      <Line points={[[0, 0, 0], [axisLen, 0, 0]]} color="red" lineWidth={1} />
      {/* Y axis - green */}
      <Line points={[[0, 0, 0], [0, axisLen, 0]]} color="green" lineWidth={1} />
      {/* Z axis - blue */}
      <Line points={[[0, 0, 0], [0, 0, axisLen]]} color="blue" lineWidth={1} />
      {/* Labels */}
      <Text position={[axisLen + 0.3, 0, 0]} fontSize={0.3} color="red">x</Text>
      <Text position={[0, axisLen + 0.3, 0]} fontSize={0.3} color="green">y</Text>
      <Text position={[0, 0, axisLen + 0.3]} fontSize={0.3} color="blue">z</Text>
    </group>
  );
}

// --- Surface mesh for z = f(x, y) ---
interface SurfaceMeshProps {
  f: (x: number, y: number) => number;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  resolution?: number;
  color?: string;
  wireframe?: boolean;
  opacity?: number;
}

export function SurfaceMesh({
  f,
  xMin = -2,
  xMax = 2,
  yMin = -2,
  yMax = 2,
  resolution = 80,
  color = '#4da6ff',
  wireframe = false,
  opacity = 0.85,
}: SurfaceMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(xMax - xMin, yMax - yMin, resolution, resolution);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getZ(i); // because we rotated
      pos.setZ(i, f(x, y));
    }
    geo.computeVertexNormals();
    return geo;
  }, [f, xMin, xMax, yMin, yMax, resolution]);

  useFrame(() => {
    // Recompute if needed
  });

  const midX = (xMin + xMax) / 2;
  const midY = (yMin + yMax) / 2;

  return (
    <mesh ref={meshRef} geometry={geometry} position={[midX, 0, midY]}>
      <meshPhongMaterial
        color={color}
        wireframe={wireframe}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        shininess={30}
      />
    </mesh>
  );
}

// --- Gradient vector field arrows on the base plane ---
interface GradientFieldProps {
  f: (x: number, y: number) => number;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  step?: number;
  scale?: number;
  color?: string;
}

export function GradientField({
  f,
  xMin = -2,
  xMax = 2,
  yMin = -2,
  yMax = 2,
  step = 0.5,
  scale = 0.15,
  color = '#ff6600',
}: GradientFieldProps) {
  const arrows = useMemo(() => {
    const result: { pos: [number, number, number]; dir: [number, number, number] }[] = [];
    const h = 1e-5;
    for (let x = xMin; x <= xMax; x += step) {
      for (let y = yMin; y <= yMax; y += step) {
        const dfx = (f(x + h, y) - f(x - h, y)) / (2 * h);
        const dfy = (f(x, y + h) - f(x, y - h)) / (2 * h);
        const mag = Math.hypot(dfx, dfy);
        if (mag < 1e-6) continue;
        const nx = -dfx / mag * scale;
        const ny = -dfy / mag * scale;
        result.push({
          pos: [x, 0.05, y],
          dir: [nx, 0, ny],
        });
      }
    }
    return result;
  }, [f, xMin, xMax, yMin, yMax, step, scale]);

  return (
    <group>
      {arrows.map((a, i) => (
        <arrowHelper
          key={i}
          args={[new THREE.Vector3(...a.dir), new THREE.Vector3(...a.pos), Math.hypot(a.dir[0], a.dir[2]), color, 0.08, 0.04]}
        />
      ))}
    </group>
  );
}

// Gradient field rendering uses surface + trajectory overlays in individual modules
