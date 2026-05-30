'use client';

import { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useBrainStore, type NodeType } from '@/store/useBrainStore';
import { useThemeStore } from '@/store/useThemeStore';

// Dynamically import the ForceGraph2D component with SSR disabled
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-white/50">
      Initializing Neural Engine...
    </div>
  )
});

interface KnowledgeGraphProps {
  onNodeClick?: (nodeId: string) => void;
}

const TYPE_COLORS: Record<NodeType, string> = {
  note: '#3b82f6', // blue-500
  idea: '#10b981', // emerald-500
  resource: '#f59e0b', // amber-500
  bookmark: '#8b5cf6', // violet-500
};

export function KnowledgeGraph({ onNodeClick }: KnowledgeGraphProps) {
  const { nodes, addNode } = useBrainStore();
  const { theme } = useThemeStore();
  const graphRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Resize handler
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const graphData = useMemo(() => {
    const gNodes = nodes.map(n => ({
      id: n.id,
      name: n.title,
      type: n.type,
      val: 20 // size
    }));

    const gLinks: { source: string, target: string }[] = [];
    
    // Add explicitly defined connections
    nodes.forEach(n => {
      n.connections.forEach(targetId => {
        // Ensure bidirectional links aren't duplicated, but force-graph handles it mostly fine.
        // Also ensure target exists.
        if (nodes.find(tn => tn.id === targetId)) {
          gLinks.push({ source: n.id, target: targetId });
        }
      });
    });
    
    // Auto-connect nodes based on shared tags
    const tagMap: Record<string, string[]> = {};
    nodes.forEach(n => {
      n.tags.forEach(tag => {
        if (!tagMap[tag]) tagMap[tag] = [];
        tagMap[tag].push(n.id);
      });
    });
    
    Object.values(tagMap).forEach(ids => {
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          // Check if link already exists
          const exists = gLinks.some(
            l => (l.source === ids[i] && l.target === ids[j]) || 
                 (l.source === ids[j] && l.target === ids[i])
          );
          if (!exists) {
            gLinks.push({ source: ids[i], target: ids[j] });
          }
        }
      }
    });

    return { nodes: gNodes, links: gLinks };
  }, [nodes]);

  const handleNodeClick = useCallback((node: any) => {
    // Aim at node from outside it
    const distance = 40;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(8, 2000);
    }
    
    if (onNodeClick) {
      onNodeClick(node.id);
    }
  }, [onNodeClick]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <ForceGraph2D
        ref={graphRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeColor={(node: any) => TYPE_COLORS[node.type as NodeType] || '#ffffff'}
        nodeRelSize={6}
        linkColor={() => 'rgba(255, 255, 255, 0.2)'}
        linkWidth={1}
        nodeLabel="name"
        onNodeClick={handleNodeClick}
        backgroundColor="transparent"
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 12/globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.beginPath();
          // @ts-ignore
          ctx.roundRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1], 4);
          ctx.fill();

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = TYPE_COLORS[node.type as NodeType] || '#ffffff';
          ctx.fillText(label, node.x, node.y);

          node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
        }}
        nodePointerAreaPaint={(node: any, color, ctx) => {
          ctx.fillStyle = color;
          const bckgDimensions = node.__bckgDimensions;
          bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);
        }}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />
    </div>
  );
}
