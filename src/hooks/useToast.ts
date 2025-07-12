import { toast } from 'sonner';

export const useToast = () => {
  return {
    message: (message: string) => toast.message(message),
    error: (message: string) => toast.error(message),
  };
};
