// hooks/use-toast.ts
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

export const useToast = () => {
  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    if (variant === "destructive") {
      sonnerToast.error(title, {
        description,
        duration: 4000,
      });
    } else {
      sonnerToast.success(title, {
        description,
        duration: 4000,
      });
    }
  };

  return { toast };
};

export const toast = {
  success: (title: string, description?: string) => {
    sonnerToast.success(title, { description });
  },
  error: (title: string, description?: string) => {
    sonnerToast.error(title, { description });
  },
  info: (title: string, description?: string) => {
    sonnerToast.info(title, { description });
  },
  warning: (title: string, description?: string) => {
    sonnerToast.warning(title, { description });
  },
};