import { useState } from "react";
import { motion } from "framer-motion";

export const Dice = ({ onRoll, randomGenerator, isDisabled }) => {
  const [rolling, setRolling] = useState(false);
  const [dice, setDice] = useState(1);
  const getDiceValue = () => Math.floor(randomGenerator() * 6) + 1;

  const handleRoll = () => {
    if (isDisabled || rolling) return;

    setRolling(true);
    setTimeout(() => {
      const value = getDiceValue();
      setDice(value);
      onRoll(value);
      setRolling(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-around">
      <h2>Click to Roll Dice</h2>
      <div className="flex justify-center items-center p-8">
        <motion.div
          className="relative"
          style={{
            width: "100px",
            height: "100px",
            perspective: "600px",
            cursor: isDisabled ? "not-allowed" : "pointer",
          }}
          onClick={handleRoll}
        >
          <motion.div
            className="absolute w-full h-full"
            animate={
              rolling
                ? {
                    rotateX: [0, 360],
                    rotateY: [0, 360],
                    rotateZ: [0, 360],
                  }
                : {}
            }
            transition={
              rolling
                ? {
                    duration: 1.5,
                    repeat: 1,
                    ease: "easeInOut",
                  }
                : {}
            }
            style={{
              position: "relative",
              width: "100px",
              height: "100px",
              transformStyle: "preserve-3d",
            }}
          >
            {[
              { transform: "translateZ(50px)", text: 1 },
              { transform: "rotateY(180deg) translateZ(50px)", text: 6 },
              { transform: "rotateY(-90deg) translateZ(50px)", text: 4 },
              { transform: "rotateY(90deg) translateZ(50px)", text: dice },
              { transform: "rotateX(90deg) translateZ(50px)", text: 5 },
              { transform: "rotateX(-90deg) translateZ(50px)", text: 2 },
            ].map(({ transform, text }, index) => (
              <div
                key={index}
                className="absolute w-full h-full flex items-center justify-center text-2xl font-bold border"
                style={{
                  backgroundColor: isDisabled ? "gray" : "antiquewhite",
                  transform,
                  position: "absolute",
                  width: "100px",
                  height: "100px",
                  border: "2px solid black",
                }}
              >
                {text}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
