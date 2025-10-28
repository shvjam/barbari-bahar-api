import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Auth from "./Auth";

export default function AuthDialog({
  trigger,
  onAuthSuccess,
}: {
  trigger: React.ReactNode;
  onAuthSuccess: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onAuthSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>احراز هویت</DialogTitle>
        </DialogHeader>
        <Auth onAuthSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
