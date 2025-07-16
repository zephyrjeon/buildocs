import { RootStore } from '@/stores/RootStore';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

type SigninInput = {
  email: string;
  password: string;
};

export const useSignin = (store: RootStore) => {
  const router = useRouter();
  const signinModal = store.modalStore.useSignin();

  const signinMutation = useMutation({
    mutationFn: async ({ email, password }: SigninInput) => {
      const res = await fetch(store.urls.api.signin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const resolved = await res.json();

      if (!res.ok) {
        throw new Error(resolved);
      }

      return resolved;
    },
    onSuccess: async () => {
      signinModal.onClose();
      router.push(store.urls.documents);
    },
    onError: async (error, variables, context) => {
      store.toast.error(`Signin error: ${error}`);
    },
  });

  const callable = (input: SigninInput) => signinMutation.mutateAsync(input);
  callable.isLoading = signinMutation.isPending;

  return callable;
};
