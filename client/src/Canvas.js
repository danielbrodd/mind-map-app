import React, { useState, useEffect, useCallback } from 'react';
import './Canvas.css';

const Canvas = () => {
  const [nodes, setNodes] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState(null);
  const [offset, setOffset] = useState({x: 0, y: 0});

  const createNode = (e) => {
    if (isDragging || e.button !== 0) {
      return;
    }
  

    const newNode = {
      id: Date.now(),
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
      text: 'New Node',
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
  }
  const handleDragStart = (e, node) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDraggedNode(node);
    setOffset({ x: e.clientX - node.x, y: e.clientY - node.y });
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrag = useCallback((e) => {
    if (isDragging && draggedNode) {
      const newNodes = nodes.map((node) => {
        if (node.id === draggedNode.id) {
          return {
            ...node,
            x: e.clientX - offset.x,
            y: e.clientY - offset.y,
          };
        }
        return node;
      });
      setNodes(newNodes);
    }
  }, [isDragging, draggedNode, offset, nodes]);

    const handleDragEnd = (e) =>{
      setIsDragging(false);
      setDraggedNode(null);
      e.preventDefault();
      e.stopPropagation();
    };
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    useEffect(() => {
      if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
      } else {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
      }

      return () => {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }, [isDragging, handleDrag]);

    return (
      <div
        className="canvas"
        onMouseDown={createNode}
        onContextMenu={handleContextMenu}
      >
        {nodes.map((node) => (
          <div
            key={node.id}
            className="node"
            style={{top: node.y, left: node.x}}
            onMouseDown={(e) => handleDragStart(e, node)}
          >
            {node.text}
          </div>
        ))}
        </div>
    );
};

export default Canvas
