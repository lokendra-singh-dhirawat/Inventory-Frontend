import React, { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
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
import type { AxiosError } from "axios";

interface Category {
  id: number;
  name: string;
}

const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<{ success: boolean; data: Category[] }>(
    "/categories"
  );
  return response.data.data;
};

const CreateGameForm: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [releaseDate, setReleaseDate] = useState<string>("");
  const [rating, setRating] = useState<string>("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: categoriesError,
  } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 15,
  });

  const createGameMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await apiClient.post("/game", formData);
    },
    onSuccess: () => {
      setSuccessMessage("Game created successfully! Redirecting to home...");
      setErrorMessage(null);
      queryClient.invalidateQueries({ queryKey: ["games"] });
      setName("");
      setDescription("");
      setPrice("");
      setReleaseDate("");
      setRating("");
      setSelectedCategoryIds([]);
      setImageFile(null);
      const fileInput = document.getElementById("image") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      setTimeout(() => navigate("/"), 1500);
    },
    onError: (error: AxiosError<{ message?: string; errors?: any[] }>) => {
      const backendMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      const backendErrors = error.response?.data?.errors;

      let displayMessage = backendMessage;
      if (backendErrors && backendErrors.length > 0) {
        displayMessage = backendErrors.map((err) => err.message).join(" | ");
      }
      setErrorMessage(displayMessage);
      setSuccessMessage(null);
    },
  });

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImageFile(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("releaseDate", releaseDate);
    formData.append("rating", rating);

    if (selectedCategoryIds.length === 0) {
      setErrorMessage("At least one category is required.");
      return;
    }
    selectedCategoryIds.forEach((id) => {
      formData.append("categoryIds", id.toString());
    });

    if (!imageFile || !(imageFile instanceof File)) {
      setErrorMessage("Game cover image is required.");
      return;
    }

    formData.append("image", imageFile);

    createGameMutation.mutate(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 bg-white rounded-lg shadow-xl w-full max-w-lg border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create New Game
        </h2>

        {successMessage && (
          <p className="text-green-600 text-sm text-center border p-2 rounded bg-green-50">
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <p className="text-red-500 text-sm text-center border p-2 rounded bg-red-50">
            {errorMessage}
          </p>
        )}

        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Game Name
          </Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <Label
            htmlFor="description"
            className="text-sm font-medium text-gray-700"
          >
            Description
          </Label>
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
          <Label htmlFor="price" className="text-sm font-medium text-gray-700">
            Price
          </Label>
          <Input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
            required
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <Label
            htmlFor="releaseDate"
            className="text-sm font-medium text-gray-700"
          >
            Release Date
          </Label>
          <Input
            type="date"
            id="releaseDate"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            required
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <Label htmlFor="rating" className="text-sm font-medium text-gray-700">
            Rating (0-5)
          </Label>
          <Input
            type="number"
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            step="0.1"
            min="0"
            max="5"
            required
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <Label
            htmlFor="categories"
            className="text-sm font-medium text-gray-700"
          >
            Categories
          </Label>
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
          <Label htmlFor="image">Game Cover Image</Label>
          <Input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={createGameMutation.isPending || isLoadingCategories}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          {createGameMutation.isPending ? "Creating..." : "Create Game"}
        </Button>
      </form>
    </div>
  );
};

export default CreateGameForm;
