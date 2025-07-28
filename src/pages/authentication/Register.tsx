import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import apiClient from "../../api/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { AxiosError } from "axios";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: (credentials: {
      email: string;
      password: string;
      name?: string;
    }) => apiClient.post("/auth/register", credentials),
    onSuccess: (data) => {
      console.log("Registration successful!", data);

      navigate("/login", { state: { registered: true, email: email } });
    },
    onError: (error: AxiosError<{ message?: string; errors?: any[] }>) => {
      console.error(
        "Registration failed:",
        error.response?.data?.message || "An error occurred."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ email, password, name: name || undefined }); // Pass name as undefined if empty
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 max-w-md mx-auto border rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold text-center mb-4">
        Register Account
      </h2>
      <div>
        <Label htmlFor="name">Name (Optional)</Label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full"
        />
      </div>
      <Button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full"
      >
        {registerMutation.isPending ? "Registering..." : "Register"}
      </Button>
      {registerMutation.isError && (
        <p className="text-red-500 text-sm mt-2">
          {registerMutation.error.response?.data?.message ||
            "Registration failed. Please try again."}
        </p>
      )}
      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login here
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
