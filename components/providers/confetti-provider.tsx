"use client";
import { useConffetiStore } from "@/hooks/use-confetti-store";
import ReactConffeti from "react-confetti";

export const ConfettiProvider = () => {
  const { isOpen, onClose, onOpen } = useConffetiStore();

  if (!isOpen) return null;

  return (
    <ReactConffeti
      className="pointer-events-none z-[100]"
      numberOfPieces={500}
      recycle={false}
      onConfettiComplete={() => {
        onClose();
      }}
    />
  );
};
