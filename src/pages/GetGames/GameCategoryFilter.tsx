import React from "react";
import { Badge } from "@/components/ui/badge";

interface Props {
  categories: string[];
  selected: string[];
  onToggle: (category: string) => void;
}

export const GameCategoryFilter: React.FC<Props> = ({
  categories,
  selected,
  onToggle,
}) => {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {categories.map((category) => (
        <Badge
          key={category}
          onClick={() => onToggle(category)}
          className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium border ${
            selected.includes(category)
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
};
