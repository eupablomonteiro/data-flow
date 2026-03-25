"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useMemo } from "react";
import { Loader2, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { loginWithGithub, loginWithGoogle } from "@/app/actions/auth";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
    email: z.string().email({ message: "Insira um e-mail válido" }),
    password: z
      .string()
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z\d]/.test(password)) score++;
  return score;
}

const strengthLabels = ["", "Fraca", "Razoável", "Boa", "Forte"];
const strengthColors = [
  "bg-df-surface/30",
  "bg-df-error",
  "bg-df-warning",
  "bg-df-info",
  "bg-df-success",
];

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoadingGithub, setIsLoadingGithub] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(registerSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const strength = useMemo(() => getPasswordStrength(password || ""), [password]);

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    console.log(data);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  }

  const handleGithubLogin = async () => {
    setIsLoadingGithub(true);
    await loginWithGithub();
  };

  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true);
    await loginWithGoogle();
  };

  const isFormDisabled = isLoading || isLoadingGithub || isLoadingGoogle;

  return (
    <div className="space-y-4 pt-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-df-text text-sm">
            Nome completo
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-df-muted" />
            <Input
              id="name"
              placeholder="Seu nome"
              type="text"
              autoCapitalize="words"
              disabled={isFormDisabled}
              className="pl-10 bg-df-bg-secondary/80 border-df-surface/40 text-df-white placeholder:text-df-muted/50 focus:border-df-accent focus:ring-df-accent/20 h-11"
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-sm text-df-error">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-email" className="text-df-text text-sm">
            E-mail
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-df-muted" />
            <Input
              id="register-email"
              placeholder="exemplo@email.com"
              type="email"
              disabled={isFormDisabled}
              className="pl-10 bg-df-bg-secondary/80 border-df-surface/40 text-df-white placeholder:text-df-muted/50 focus:border-df-accent focus:ring-df-accent/20 h-11"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-df-error">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-password" className="text-df-text text-sm">
            Senha
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-df-muted" />
            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              disabled={isFormDisabled}
              className="pl-10 pr-10 bg-df-bg-secondary/80 border-df-surface/40 text-df-white placeholder:text-df-muted/50 focus:border-df-accent focus:ring-df-accent/20 h-11"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-df-muted hover:text-df-text transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Password strength meter */}
          {password && (
            <div className="space-y-1.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                      level <= strength
                        ? strengthColors[strength]
                        : "bg-df-surface/20"
                    }`}
                  />
                ))}
              </div>
              <p
                className={`text-xs ${
                  strength <= 1
                    ? "text-df-error"
                    : strength === 2
                    ? "text-df-warning"
                    : strength === 3
                    ? "text-df-info"
                    : "text-df-success"
                }`}
              >
                {strengthLabels[strength]}
              </p>
            </div>
          )}

          {errors.password && (
            <p className="text-sm text-df-error">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-df-text text-sm">
            Confirmar Senha
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-df-muted" />
            <Input
              id="confirm-password"
              type="password"
              disabled={isFormDisabled}
              className="pl-10 bg-df-bg-secondary/80 border-df-surface/40 text-df-white placeholder:text-df-muted/50 focus:border-df-accent focus:ring-df-accent/20 h-11"
              {...register("confirmPassword")}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-df-error">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          className="w-full bg-df-accent hover:bg-df-accent-hover text-white font-semibold h-11 rounded-lg transition-all hover:shadow-lg hover:shadow-df-accent/25 cursor-pointer"
          type="submit"
          disabled={isFormDisabled}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Criar conta
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-df-surface/40"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-df-bg-secondary px-2 text-df-muted">Ou</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 bg-df-bg-secondary border-df-surface/40 text-df-white hover:bg-df-surface/20 transition-all cursor-pointer"
          onClick={handleGithubLogin}
          disabled={isFormDisabled}
        >
          {isLoadingGithub ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <FaGithub className="mr-2 h-5 w-5" />
          )}
          Criar conta com GitHub
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full h-11 bg-df-bg-secondary border-df-surface/40 text-df-white hover:bg-df-surface/20 transition-all cursor-pointer"
          onClick={handleGoogleLogin}
          disabled={isFormDisabled}
        >
          {isLoadingGoogle ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <FaGoogle className="mr-2 h-5 w-5 text-red-500" />
          )}
          Criar conta com Google
        </Button>
      </div>
    </div>
  );
}
