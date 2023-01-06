import { useMutation } from "@tanstack/react-query";
import { authService } from "./auth.service";

export function useAuthService() {
  const signInMutation = useMutation({
    mutationFn: authService.signIn,
  });

  return {
    signIn: {
      run: signInMutation.mutate,
      isLoading: signInMutation.isLoading,
      isError: signInMutation.isError,
      isSuccess: signInMutation.isSuccess,
      response: signInMutation.data,
    },
  };
}
