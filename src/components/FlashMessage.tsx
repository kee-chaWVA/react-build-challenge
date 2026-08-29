import { useEffect, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import type { AlertColor } from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import type { SxProps, Theme } from "@mui/material/styles";

type FlashMessageProps = {
  message: string;
  severity?: AlertColor;
  onClose?: () => void;
  autoHideDuration?: number;
  className?: string;
  sx?: SxProps<Theme>;
};

export default function FlashMessage({
  message,
  severity = "error",
  onClose,
  autoHideDuration,
  className,
  sx,
}: FlashMessageProps) {
  const [open, setOpen] = useState(true);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    setOpen(true);
  }, [message, autoHideDuration]);

  useEffect(() => {
    if (autoHideDuration == null) return;

    const timer = setTimeout(() => {
      setOpen(false);
      onCloseRef.current?.();
    }, autoHideDuration);

    return () => clearTimeout(timer);
  }, [autoHideDuration]);

  if (!message) return null;

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

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
              onClick={handleClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          ) : undefined
        }
        sx={sx}
      >
        {message}
      </Alert>
    </Collapse>
  );
}
