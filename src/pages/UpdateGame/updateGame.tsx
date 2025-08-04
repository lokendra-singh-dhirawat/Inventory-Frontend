import React, { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../api/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
}

const UpdateGameForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [releaseDate, setReleaseDate] = useState<string>("");
  const [rating, setRating] = useState<string>("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: categoriesError,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await apiClient.get("/categories");
      return res.data.data;
    },
  });

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await apiClient.get(`/game/${id}`);
        const gameData = res.data.data || res.data;
        setName(gameData.name || "");
        setDescription(gameData.description || "");
        setPrice(gameData.price ? String(gameData.price) : "");
        setReleaseDate(
          gameData.releaseDate ? gameData.releaseDate.substring(0, 10) : ""
        );
        setRating(gameData.rating ? String(gameData.rating) : "");
        setSelectedCategoryIds(
          gameData.categories?.map((cat: Category) => cat.id) || []
        );
      } catch (err) {
        toast.error("Failed to load game details");
      }
    };
    fetchGame();
  }, [id]);

  const updateGameMutation = useMutation({
    mutationFn: async () => {
      await apiClient.put(`/game/${id}`, {
        name,
        description,
        price: parseFloat(price),
        releaseDate,
        rating: parseFloat(rating),
        categoryIds: selectedCategoryIds,
      });

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        await apiClient.put(`/game/image/${id}`, formData);
      }
    },
    onSuccess: () => {
      toast.success("Game updated successfully!", {
        description: "Redirecting to home in 1.5s...",
      });
      queryClient.invalidateQueries({ queryKey: ["games"] });
      setTimeout(() => navigate("/"), 1500);
    },
    onError: () => {
      toast.error("Failed to update game");
    },
  });

  const handleCategoryToggle = (id: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (selectedCategoryIds.length === 0) {
      setErrorMessage("At least one category is required.");
      return;
    }

    updateGameMutation.mutate();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 bg-white rounded-lg shadow-xl w-full max-w-lg border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Update Game
        </h2>

        {errorMessage && (
          <p className="text-red-500 text-sm text-center border p-2 rounded bg-red-50">
            {errorMessage}
          </p>
        )}

        <div>
          <Label htmlFor="name">Game Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full"
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
            required
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <Label htmlFor="releaseDate">Release Date</Label>
          <Input
            id="releaseDate"
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            required
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <Label htmlFor="rating">Rating (0-5)</Label>
          <Input
            id="rating"
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            step="0.1"
            min="0"
            max="5"
            required
            className="mt-1 block w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categories">Categories</Label>
          {isLoadingCategories ? (
            <p className="text-gray-600">Loading categories...</p>
          ) : isErrorCategories ? (
            <p className="text-red-500">
              Error loading categories: {categoriesError?.message}
            </p>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !selectedCategoryIds.length && "text-muted-foreground"
                  )}
                >
                  {selectedCategoryIds.length > 0
                    ? categories
                        .filter((c) => selectedCategoryIds.includes(c.id))
                        .map((c) => c.name)
                        .join(", ")
                    : "Select categories..."}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                <Command>
                  <CommandInput
                    placeholder="Search categories..."
                    className="h-9"
                  />
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    {categories.map((category) => (
                      <CommandItem
                        key={category.id}
                        onSelect={() => handleCategoryToggle(category.id)}
                        className="cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedCategoryIds.includes(category.id)}
                          onCheckedChange={() =>
                            handleCategoryToggle(category.id)
                          }
                          className="mr-2"
                        />
                        {category.name}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedCategoryIds.includes(category.id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div>
          <Label htmlFor="image">Update Game Cover Image</Label>
          <Input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </div>

        <Button
          type="submit"
          disabled={updateGameMutation.isPending || isLoadingCategories}
          className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-md"
        >
          {updateGameMutation.isPending ? "Updating..." : "Update Game"}
        </Button>
      </form>
    </div>
  );
};

export default UpdateGameForm;
