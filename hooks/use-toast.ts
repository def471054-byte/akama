import { toast as sonnerToast } from "sonner";
export const toast = ({ title, description, variant }: { title: string; description?: string; variant?: string }) => { 
  if (variant === "destructive") {
    sonnerToast.error(title, { description });
  } else {
    sonnerToast.success(title, { description });
  }
}
export const useToast = () => { return { toast, toasts: [] as any[] }; }
