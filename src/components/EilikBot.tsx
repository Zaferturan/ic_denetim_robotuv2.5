import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface EilikBotProps {
  message: string;
  messageId?: string;
  isSpeaking: boolean;
  emotion?: 'happy' | 'sad' | 'excited' | 'neutral';
  onSpeakEnd?: () => void;
}

interface EyeShape {
  ry: number;
  cy?: number;
}

const BotContainer = styled.div`
  width: 200px;
  height: 240px;
  position: relative;
  margin: 0 auto;
`;

const BotSVG = styled(motion.svg)`
  width: 100%;
  height: 100%;
`;

// Duygu durumlarına göre ağız şekilleri
const mouthShapes = {
  happy: "M85,80 Q100,95 115,80",
  sad: "M85,80 Q100,65 115,80",
  excited: "M85,80 Q100,100 115,80",
  neutral: "M85,80 Q100,85 115,80"
};

// Duygu durumlarına göre göz şekilleri
const eyeShapes: Record<string, EyeShape> = {
  happy: { ry: 4 },
  sad: { ry: 8, cy: 63 },
  excited: { ry: 12 },
  neutral: { ry: 8 }
};

const EilikBot: React.FC<EilikBotProps> = ({ message, messageId, isSpeaking, emotion = 'neutral', onSpeakEnd }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const prevMessageIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (message && isSpeaking && (prevMessageIdRef.current !== messageId)) {
      setIsAnimating(true);
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'tr-TR';
      utterance.onend = () => {
        setIsAnimating(false);
        if (onSpeakEnd) onSpeakEnd();
      };
      speechRef.current = utterance;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      prevMessageIdRef.current = messageId;
    }
    if (!isSpeaking) {
      setIsAnimating(false);
      window.speechSynthesis.cancel();
    }
  }, [message, isSpeaking, messageId, onSpeakEnd]);

  // Animation variants
  const eyeVariants: Variants = {
    speaking: {
      scaleY: [1, 1.2, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    },
    idle: {
      scaleY: 1
    }
  };

  const mouthVariants: Variants = {
    speaking: {
      d: [
        mouthShapes[emotion],
        mouthShapes.excited,
        mouthShapes[emotion]
      ],
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    },
    idle: {
      d: mouthShapes[emotion]
    }
  };

  const armVariants: Variants = {
    speaking: {
      rotate: [-5, 5, -5],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    },
    idle: {
      rotate: 0
    }
  };

  const headVariants: Variants = {
    speaking: {
      y: [0, -2, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    },
    idle: {
      y: 0
    }
  };

  return (
    <BotContainer>
      <BotSVG viewBox="0 0 200 240">
        {/* Gövde */}
        <motion.g id="body">
          <ellipse cx="100" cy="150" rx="60" ry="70" fill="#ffffff" stroke="#222" strokeWidth="4"/>
          <path d="M70,110 C80,90 120,90 130,110" fill="#f8aebc" />
        </motion.g>

        {/* Kafa */}
        <motion.g 
          id="head"
          variants={headVariants}
          animate={isAnimating ? "speaking" : "idle"}
        >
          <ellipse cx="100" cy="70" rx="50" ry="60" fill="#ffffff" stroke="#222" strokeWidth="4"/>
          <circle cx="100" cy="70" r="30" fill="#222222"/>
          
          {/* Gözler */}
          <motion.g id="eyes">
            <motion.ellipse
              cx="85"
              cy={eyeShapes[emotion].cy || 65}
              rx="5"
              ry={eyeShapes[emotion].ry}
              fill="#aef"
              variants={eyeVariants}
              animate={isAnimating ? "speaking" : "idle"}
            />
            <motion.ellipse
              cx="115"
              cy={eyeShapes[emotion].cy || 65}
              rx="5"
              ry={eyeShapes[emotion].ry}
              fill="#aef"
              variants={eyeVariants}
              animate={isAnimating ? "speaking" : "idle"}
            />
          </motion.g>
          
          {/* Ağız */}
          <motion.g id="mouth">
            <motion.path
              d={mouthShapes[emotion]}
              fill="#aef"
              variants={mouthVariants}
              animate={isAnimating ? "speaking" : "idle"}
            />
          </motion.g>
        </motion.g>

        {/* Kollar */}
        <motion.g id="arms">
          <motion.path
            d="M40,150 Q20,130 40,110"
            fill="#aef"
            stroke="#222"
            strokeWidth="4"
            variants={armVariants}
            animate={isAnimating ? "speaking" : "idle"}
          />
          <motion.path
            d="M160,150 Q180,130 160,110"
            fill="#f8aebc"
            stroke="#222"
            strokeWidth="4"
            variants={armVariants}
            animate={isAnimating ? "speaking" : "idle"}
          />
        </motion.g>

        {/* Zemin */}
        <ellipse cx="100" cy="220" rx="70" ry="10" fill="#eee" stroke="#222" strokeWidth="2"/>
      </BotSVG>
    </BotContainer>
  );
};

export default EilikBot; 