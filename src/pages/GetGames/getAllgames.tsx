import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../api/axios";
import { Card, CardFooter } from "@/components/ui/card";
import { Star, ArrowRight } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { Link } from "react-router";
import { toast } from "sonner";
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

const fetchGames = async (): Promise<Game[]> => {
  const response = await apiClient.get<{ success: boolean; data: Game[] }>(
    "/games"
  );
  return response.data.data;
};

const GameCard: React.FC<{ game: Game; onDelete: (id: number) => void }> = ({
  game,
  onDelete,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const handleDelete = (gameId: number) => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      onDelete(gameId);
    }
  };

  return (
    <Card className="group relative w-full overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
      <div className="relative h-60 overflow-hidden">
        <img
          src={game.imageUrl}
          alt={game.name}
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
        />

        <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {isAdmin && (
            <Link to={`/update-game/${game.id}`}>
              <div className="p-1 shadow cursor-pointer">
                <Pencil className="h-5 w-5 text-white" />
              </div>
            </Link>
          )}
          {isAdmin && (
            <div
              onClick={() => handleDelete(game.id)}
              className="p-1 shadow cursor-pointer"
              title="Delete Game"
            >
              <Trash2 className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-opacity-0 text-white opacity-0 transition-all duration-500 backdrop-blur-none group-hover:bg-opacity-60 group-hover:opacity-100 group-hover:backdrop-blur-md">
          <h3 className="mb-2 text-xl font-bold">{game.name}</h3>
          <div className="mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">
              {Number(game.rating).toFixed(1)}
            </span>
          </div>
          <ArrowRight className="h-8 w-8 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>

      <CardFooter className="flex flex-col items-start bg-gray-50 p-4">
        <h3 className="text-lg font-semibold text-gray-800">{game.name}</h3>
        <div className="flex items-center justify-between w-full mt-2">
          <p className="text-md font-bold text-gray-700">
            ${Number(game.price).toFixed(2)}
          </p>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">
              {Number(game.rating).toFixed(1)}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

const GameList: React.FC = () => {
  const {
    data: games = [],
    isLoading,
    isError,
    error,
  } = useQuery<Game[], Error>({
    queryKey: ["games"],
    queryFn: fetchGames,
  });

  const deleteGameMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/game/${id}`);
    },
    onSuccess: () => {
      toast.success("Game deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
    onError: () => {
      toast.error("Failed to delete game");
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-600">Loading games...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">Error fetching games: {error.message}</p>
      </div>
    );
  }

  const queryClient = useQueryClient();

  const handleDelete = (id: number) => {
    deleteGameMutation.mutate(id);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Games</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <GameCard key={game.id} game={game} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default GameList;
