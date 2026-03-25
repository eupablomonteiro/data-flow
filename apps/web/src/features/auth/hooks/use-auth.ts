import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMe } from "@/services/auth/get-me";
import { logout } from "@/services/auth/logout";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const userQuery = useQuery({
    queryKey: ["auth-me"],
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
      toast.success("Sessão encerrada com sucesso");
    },
    onError: () => {
      toast.error("Erro ao encerrar a sessão");
      queryClient.clear();
      router.push("/login");
    },
  });

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
    logout: () => logoutMutation.mutate(),
    isLoggingOut: logoutMutation.isPending,
  };
}
