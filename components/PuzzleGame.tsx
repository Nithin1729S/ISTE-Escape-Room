'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const PUZZLE_IMAGE = 'rick.jpg';

interface PuzzlePieceProps {
  piece: number;      // The unique number of the piece
  position: number;   // The grid cell index (its position)
  onDrop: (fromPos: number, toPos: number) => void;
}

function PuzzlePiece({ piece, position, onDrop }: PuzzlePieceProps) {
  const ref = useRef(null);

  // Setup dragging. The dragged item carries its grid cell position.
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'piece',
      item: { fromPosition: position },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [position]
  );

  // Setup dropping. When dropped, call onDrop with the positions.
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'piece',
      drop: (item: { fromPosition: number }) => {
        if (item.fromPosition !== position) {
          onDrop(item.fromPosition, position);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [position, onDrop]
  );

  // Combine drag and drop refs.
  drag(drop(ref));

  // Calculate which part of the 300×300 image to show.
  const pieceStyle = {
    backgroundImage: `url(${PUZZLE_IMAGE})`,
    backgroundSize: '300px 300px',
    backgroundPosition: `-${(piece % 3) * 100}px -${Math.floor(piece / 3) * 100}px`,
    width: '100%',
    height: '100%',
  };

  return (
    <div
      ref={ref}
      style={{
        width: '100px',
        height: '100px',
        border: '1px solid #ccc',
        position: 'relative',
      }}
    >
      <motion.div
        style={{
          ...pieceStyle,
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: isDragging ? 0.5 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '20px',
          textShadow: '0 0 3px black',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {piece + 1}
      </motion.div>
    </div>
  );
}

interface PuzzleGameProps {
  onSuccess: () => void;
}

export default function PuzzleGame({ onSuccess }: PuzzleGameProps) {
  // The array holds the unique piece numbers. Its order defines the grid.
  const [pieces, setPieces] = useState<number[]>([]);

  useEffect(() => {
    // Start with a solved puzzle: [0, 1, 2, …, 8]
    const initialPieces = Array.from({ length: 9 }, (_, i) => i);
    setPieces(initialPieces);
  }, []);

  const handleDrop = (fromPos: number, toPos: number) => {
    setPieces((prev) => {
      const newPieces = [...prev];
      // Swap the pieces in the two fixed grid cells.
      [newPieces[fromPos], newPieces[toPos]] = [newPieces[toPos], newPieces[fromPos]];
      // Check if the puzzle is solved (pieces in order).
      const isSolved = newPieces.every((p, i) => p === i);
      if (isSolved) {
        setTimeout(onSuccess, 500);
      }
      return newPieces;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          width: '320px',
          padding: '10px',
          background: '#f9f9f9',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center' }}>Drag & Drop Puzzle</h2>
        <div
          style={{
            width: '300px',
            height: '300px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2px',
          }}
        >
          {pieces.map((piece, index) => (
            // Use the grid cell index as key so the cell position is fixed.
            <PuzzlePiece key={index} piece={piece} position={index} onDrop={handleDrop} />
          ))}
        </div>
        <p style={{ textAlign: 'center' }}>
          Drag and drop the numbered pieces to swap them.
        </p>
      </motion.div>
    </DndProvider>
  );
}
