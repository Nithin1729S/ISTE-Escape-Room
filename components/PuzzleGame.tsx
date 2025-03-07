import React from 'react';
import { motion } from 'framer-motion';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const PUZZLE_IMAGE = '/puzzle.jpg';

interface PuzzlePieceProps {
  piece: number;
  position: number;
  onDrop: (fromPos: number, toPos: number) => void;
  size: number;
  boardSize: number;
}

function PuzzlePiece({ piece, position, onDrop, size, boardSize }: PuzzlePieceProps) {
  const ref = React.useRef(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'piece',
    item: { fromPosition: position },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [position]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'piece',
    drop: (item: { fromPosition: number }) => {
      if (item.fromPosition !== position) {
        onDrop(item.fromPosition, position);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [position, onDrop]);

  drag(drop(ref));

  // Calculate each piece's size based on boardSize instead of a fixed 600px
  const pieceSize = boardSize / size;
  const pieceStyle = {
    backgroundImage: `url(${PUZZLE_IMAGE})`,
    backgroundSize: `${boardSize}px ${boardSize}px`,
    backgroundPosition: `-${(piece % size) * pieceSize}px -${Math.floor(piece / size) * pieceSize}px`,
    width: '100%',
    height: '100%',
  };

  return (
    <div
      ref={ref}
      className="relative"
      style={{
        width: `${pieceSize}px`,
        height: `${pieceSize}px`,
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <motion.div
        style={{
          ...pieceStyle,
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: isDragging ? 0.5 : 1,
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`${isOver ? 'brightness-110' : ''}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Optional piece label */}
        </div>
      </motion.div>
    </div>
  );
}

function shuffleArray(array: number[]) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function isSolvable(puzzle: number[], size: number): boolean {
  let inversions = 0;
  for (let i = 0; i < puzzle.length - 1; i++) {
    for (let j = i + 1; j < puzzle.length; j++) {
      if (puzzle[i] > puzzle[j]) {
        inversions++;
      }
    }
  }
  return inversions % 2 === 0;
}

interface PuzzleGameProps {
  onSuccess?: () => void;
}

export default function PuzzleGame({ onSuccess }: PuzzleGameProps) {
  const [pieces, setPieces] = React.useState<number[]>([]);
  const [isComplete, setIsComplete] = React.useState(false);
  const [boardSize, setBoardSize] = React.useState(600);
  const size = 5;
  const boardRef = React.useRef<HTMLDivElement>(null);

  // Measure the board container width and update boardSize accordingly
  React.useEffect(() => {
    const updateBoardSize = () => {
      if (boardRef.current) {
        setBoardSize(boardRef.current.clientWidth);
      }
    };
    updateBoardSize();
    window.addEventListener('resize', updateBoardSize);
    return () => window.removeEventListener('resize', updateBoardSize);
  }, []);

  React.useEffect(() => {
    let shuffledPieces;
    do {
      shuffledPieces = shuffleArray(Array.from({ length: size * size }, (_, i) => i));
    } while (!isSolvable(shuffledPieces, size));
    setPieces(shuffledPieces);
  }, []);

  const handleDrop = (fromPos: number, toPos: number) => {
    setPieces((prev) => {
      const newPieces = [...prev];
      [newPieces[fromPos], newPieces[toPos]] = [newPieces[toPos], newPieces[fromPos]];
      
      const isSolved = newPieces.every((p, i) => p === i);
      if (isSolved) {
        setTimeout(() => {
          setIsComplete(true);
          onSuccess?.();
        }, 500);
      }
      
      return newPieces;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <a 
        href="https://github.com/Nithin1729S" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed top-4 right-4"
      >
        <svg 
          height="32" 
          viewBox="0 0 16 16" 
          width="32" 
          aria-hidden="true"
          className="fill-current text-white"
        >
          <path 
            fillRule="evenodd" 
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 
               0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 
               1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 
               0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.63 7.63 0 012-.27c.68 
               0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 
               2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 
               2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          />
        </svg>
      </a>
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-8"
        >
          {!isComplete ? (
            <>
              {/* Responsive container with a max width */}
              <div
                ref={boardRef}
                style={{
                  width: '90vw',
                  maxWidth: '600px',
                  aspectRatio: '1 / 1', // ensures the board stays square
                  display: 'grid',
                  gridTemplateColumns: `repeat(${size}, 1fr)`,
                  padding: '1px',
                  borderRadius: '4px',
                }}
              >
                {pieces.map((piece, index) => (
                  <PuzzlePiece
                    key={index}
                    piece={piece}
                    position={index}
                    onDrop={handleDrop}
                    size={size}
                    boardSize={boardSize}
                  />
                ))}
              </div>
              <p className="text-white/60 text-sm">
                Drag and drop pieces to solve the puzzle
              </p>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <h2 className="text-3xl font-medium text-white/90 mb-4">Puzzle Solved!</h2>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-white/10 text-white/90 rounded-lg hover:bg-white/20 transition-colors"
              >
                Play Again
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </DndProvider>
  );
}
