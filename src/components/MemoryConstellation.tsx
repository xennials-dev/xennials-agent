import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Brain, Pin, Trash2 } from "lucide-react";
import { Button } from "@nous-research/ui/ui/components/button";
import { Badge } from "@nous-research/ui/ui/components/badge";
import { useToast } from "@nous-research/ui/hooks/use-toast";
import { cn } from "@/lib/utils";

export interface MemoryNode {
  id: string;
  topic: string;
  excerpt: string;
  category: "preference" | "skill" | "entity" | "decision";
  confidence: number;
  pinned?: boolean;
  position: [number, number, number];
}

const INITIAL_MEMORIES: MemoryNode[] = [
  {
    id: "mem-1",
    topic: "Deployment Strategy",
    excerpt: "Prefers zero-downtime rolling deploys with automated rollback on health check failure.",
    category: "preference",
    confidence: 0.94,
    pinned: true,
    position: [-2.2, 1.4, 0],
  },
  {
    id: "mem-2",
    topic: "Kubernetes Cluster",
    excerpt: "Maintains 2-node k8s cluster on v1.30 with cert-manager and ingress-nginx.",
    category: "entity",
    confidence: 0.98,
    pinned: true,
    position: [1.8, 1.2, -0.5],
  },
  {
    id: "mem-3",
    topic: "Vite + Tailwind Stack",
    excerpt: "Default web dashboard stack using Vanilla CSS / Tailwind 4 with strict typing.",
    category: "skill",
    confidence: 0.88,
    position: [0.2, -1.6, 1.0],
  },
  {
    id: "mem-4",
    topic: "Prompt Caching Protocol",
    excerpt: "Invariant rule: NEVER mutate past message context mid-turn to preserve cached prefixes.",
    category: "decision",
    confidence: 0.99,
    pinned: true,
    position: [-1.2, -0.8, -1.2],
  },
  {
    id: "mem-5",
    topic: "Netlify Edge Relay",
    excerpt: "Edge ingress function handles HMAC validation and retry deduplication.",
    category: "entity",
    confidence: 0.91,
    position: [2.0, -1.0, -0.8],
  },
];

function ConstellationSpheres({
  memories,
  selectedId,
  onSelect,
}: {
  memories: MemoryNode[];
  selectedId: string | null;
  onSelect(id: string): void;
}) {
  const groupRef = useRef<{ rotation: { y: number } } | null>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef as never}>
      {memories.map((mem) => {
        const isSelected = mem.id === selectedId;
        const color =
          mem.category === "preference"
            ? "#C8A24B"
            : mem.category === "decision"
              ? "#B23A48"
              : mem.category === "skill"
                ? "#27C93F"
                : "#60A5FA";

        return (
          <mesh
            key={mem.id}
            position={mem.position}
            onClick={(e: { stopPropagation(): void }) => {
              e.stopPropagation();
              onSelect(mem.id);
            }}
          >
            <sphereGeometry args={[isSelected ? 0.32 : 0.22, 24, 24]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isSelected ? 0.8 : 0.3}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export function MemoryConstellation() {
  const [memories, setMemories] = useState<MemoryNode[]>(INITIAL_MEMORIES);
  const [selectedId, setSelectedId] = useState<string | null>("mem-1");
  const { showToast } = useToast();

  const selectedMem = memories.find((m) => m.id === selectedId) || null;

  const handleTogglePin = (id: string) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, pinned: !m.pinned } : m)),
    );
    showToast("Memory pin state updated", "success");
  };

  const handlePrune = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    if (selectedId === id) setSelectedId(null);
    showToast("Stale memory pruned from cross-session graph", "success");
  };

  return (
    <div className="relative h-[480px] w-full rounded-xl border border-border/80 bg-black/90 overflow-hidden shadow-inner flex flex-col">
      {/* Overlay Canvas Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 border border-border/60 text-xs font-mono text-foreground backdrop-blur-sm">
          <Brain className="h-3.5 w-3.5 text-primary" />
          <span>3D Semantic Memory Constellation</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 text-[10px] font-mono text-muted-foreground bg-black/70 px-2.5 py-1 rounded-md border border-border/60 backdrop-blur-sm">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#C8A24B]" /> Preference
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#B23A48]" /> Decision
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#27C93F]" /> Skill
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#60A5FA]" /> Entity
        </span>
      </div>

      {/* 3D WebGL Canvas */}
      <div className="flex-1 w-full h-full">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={1.2} />
          <ConstellationSpheres
            memories={memories}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId(id)}
          />
        </Canvas>
      </div>

      {/* Interactive Memory Inspector Card */}
      {selectedMem && (
        <div className="absolute bottom-4 left-4 right-4 z-10 p-3.5 rounded-lg border border-border/80 bg-black/85 backdrop-blur-md flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-foreground font-mono truncate">
                {selectedMem.topic}
              </span>
              <Badge tone="default" className="text-[9px] uppercase font-mono">
                {selectedMem.category}
              </Badge>
              {selectedMem.pinned && (
                <span className="text-[10px] text-primary flex items-center gap-0.5">
                  <Pin className="h-2.5 w-2.5 fill-current" /> Pinned
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{selectedMem.excerpt}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              outlined
              size="icon"
              className={cn("h-7 w-7", selectedMem.pinned ? "text-primary border-primary/40" : "text-muted-foreground")}
              title={selectedMem.pinned ? "Unpin Memory" : "Pin Memory"}
              onClick={() => handleTogglePin(selectedMem.id)}
            >
              <Pin className="h-3 w-3" />
            </Button>
            <Button
              outlined
              destructive
              size="icon"
              className="h-7 w-7"
              title="Prune Stale Memory"
              onClick={() => handlePrune(selectedMem.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
