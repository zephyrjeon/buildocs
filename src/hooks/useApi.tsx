import { RootStore } from '@/stores/RootStore';
import { useSignin } from './apis/useSignin';

export const useApi = (store: RootStore) => {
  const signin = useSignin(store);

  return {
    signin,
  };
};
