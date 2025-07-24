import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/authContext";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { useNavigate } from "react-router";
import type { AxiosError } from "axios";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      login(credentials.email, credentials.password),
    onSuccess: (data) => {
      console.log("Login successful!", data);
      navigate("/");
    },
    onError: (error: AxiosError<{ message?: string; errors?: any[] }>) => {
      console.error(
        "Login failed:",
        error.response?.data?.message || "An error occurred."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 max-w-md mx-auto border rounded-lg shadow-md"
    >
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
        disabled={loginMutation.isPending}
        className="w-full"
      >
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </Button>
      {loginMutation.isError && (
        <p className="text-red-500 text-sm mt-2">
          {loginMutation.error.response?.data?.message ||
            "Login failed. Please try again."}
        </p>
      )}
    </form>
  );
};

export default LoginForm;
