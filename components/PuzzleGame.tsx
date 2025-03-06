'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Placeholder image - replace with your own
const PUZZLE_IMAGE = 'rick.jpg';

interface PuzzlePieceProps {
  id: number;
  image: string;
  position: number;
  onDrop: (fromPos: number, toPos: number) => void;
}

function PuzzlePiece({ id, image, position, onDrop }: PuzzlePieceProps) {
  const ref = useRef(null);

  // Set up the drag behavior
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'piece',
    item: { fromPosition: position },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Set up the drop behavior
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'piece',
    drop: (item: { fromPosition: number }) => {
      onDrop(item.fromPosition, position);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // Combine the drag and drop refs so they both use the same element.
  drag(drop(ref));

  // Assuming the full image is 300x300 and you have 3 columns,
  // each piece is 100x100. Use negative offsets to show the right part.
  const pieceStyle = {
    backgroundImage: `url(${image})`,
    backgroundSize: '300px 300px',
    backgroundPosition: `-${(id % 3) * 100}px -${Math.floor(id / 3) * 100}px`,
  };

  return (
    <div ref={ref} className={`puzzle-slot ${isOver ? 'can-drop' : ''}`}>
      <motion.div
        className={`puzzle-piece w-full h-full rounded ${isDragging ? 'dragging' : ''}`}
        style={pieceStyle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      />
    </div>
  );
}

interface PuzzleGameProps {
  onSuccess: () => void;
}

export default function PuzzleGame({ onSuccess }: PuzzleGameProps) {
  const [pieces, setPieces] = useState<number[]>([]);

  useEffect(() => {
    // Initialize puzzle in solved state
    const initialPieces = Array.from({ length: 9 }, (_, i) => i);
    // Shuffle pieces
    const shuffledPieces = [...initialPieces].sort(() => Math.random() - 0.5);
    setPieces(shuffledPieces);
  }, []);

  const handleDrop = (fromPos: number, toPos: number) => {
    const newPieces = [...pieces];
    // Swap the two pieces
    const temp = newPieces[fromPos];
    newPieces[fromPos] = newPieces[toPos];
    newPieces[toPos] = temp;
    setPieces(newPieces);

    // Check if puzzle is solved
    const isSolved = newPieces.every((piece, index) => piece === index);
    if (isSolved) {
      setTimeout(onSuccess, 500);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md p-8 rounded-lg bg-card/80 backdrop-blur shadow-xl border border-primary/20"
      >
        <h2 className="text-2xl font-bold text-primary text-center mb-6">
          Arrange the Map Pieces
        </h2>

        <div
          className="puzzle-grid"
          style={{
            width: '300px',
            height: '300px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
          }}
        >
          {pieces.map((piece, index) => (
            <PuzzlePiece
              key={index}
              id={piece}
              image={PUZZLE_IMAGE}
              position={index}
              onDrop={handleDrop}
            />
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Drag and drop the pieces to complete the map
        </p>
      </motion.div>
    </DndProvider>
  );
}
