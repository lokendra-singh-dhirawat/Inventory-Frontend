import React, { useRef } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../api/axios";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: number;
  name: string;
}

interface Game {
  id: number;
  name: string;
  description: string;
  price: number;
  releaseDate: string;
  rating: number;
  imageUrl: string;
  categories: Category[];
}

const fetchGame = async (id: string): Promise<Game> => {
  const res = await apiClient.get(`/game/${id}`);
  return res.data.data || res.data;
};

const SingleGamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const imageRef = useRef<HTMLDivElement>(null);

  const {
    data: game,
    isLoading,
    isError,
    error,
  } = useQuery<Game, Error>({
    queryKey: ["game", id],
    queryFn: () => fetchGame(id!),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const el = imageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / 20).toFixed(2);
    const rotateY = (x / 20).toFixed(2);
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  };

  const handleMouseLeave = () => {
    const el = imageRef.current;
    if (el) {
      el.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-800 text-lg">Loading game...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg">Error: {error.message}</p>
      </div>
    );
  }

  if (!game) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-black py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div
            ref={imageRef}
            className="rounded-xl shadow-2xl w-full h-[500px] transition-transform duration-200 ease-out"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={game.imageUrl}
              alt={game.name}
              className="rounded-xl w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h1
              className="text-5xl font-extrabold mb-4 tracking-tight text-black"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {game.name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <span className="text-xl font-semibold">
                {Number(game.rating).toFixed(1)} / 5
              </span>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {game.categories.map((cat) => (
                <Badge
                  key={cat.id}
                  className="bg-black text-white font-medium px-3 py-1 text-sm rounded-full"
                >
                  {cat.name}
                </Badge>
              ))}
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Released on{" "}
              <span className="font-semibold">
                {new Date(game.releaseDate).toLocaleDateString()}
              </span>
            </p>

            <div className="relative mb-8">
              <p className="text-sm text-black mb-1">Price</p>
              <div className="text-4xl md:text-5xl font-extrabold text-black">
                ${Number(game.price).toFixed(2)}
              </div>
              <div className="absolute -bottom-2 left-0 w-20 h-1 bg-black rounded-full opacity-90 blur-sm"></div>
            </div>

            <div className="bg-gray-100 p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-gray-800 leading-relaxed text-md whitespace-pre-line">
                {game.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleGamePage;
