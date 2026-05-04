import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close"


type FlashMessageProps = {
  message: string;
  severity?: "error" | "success" | "info" | "warning";
  onClose?: () => void;
  autoHideDuration?: number;
  className?: string
}

export default function FlashMessage({
  message,
  severity='error',
  onClose,
  autoHideDuration,
  className
}: FlashMessageProps) {
  const [open, setOpen] = useState(true)
  
  
  useEffect(() => {
    if (!autoHideDuration) return;

    const timer = setTimeout(() => {
      setOpen(false);
      onClose?.();
    }, autoHideDuration);

    return () => clearTimeout(timer);
  }, [autoHideDuration, onClose]);

  if (!message) return null;
  
  return (
    <Collapse in={open} className={className}>
      <Alert
        severity={severity}
        role="alert"
        variant="filled"
        action={
          onClose ? (
            <IconButton
              aria-label="Close message"
              size="small"
              onClick={() => {
                setOpen(false);
                onClose();
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          ) : undefined
        }
        sx={{ mb: 2 }}
      >
        {message}
      </Alert>
    </Collapse>
  );
}
