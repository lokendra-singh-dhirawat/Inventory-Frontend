import React from "react";
import { Input } from "@/components/ui/input";

interface GameSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const GameSearchBar: React.FC<GameSearchBarProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <Input
        type="text"
        placeholder="Search games by name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
};
