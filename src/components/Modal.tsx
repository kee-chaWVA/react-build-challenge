import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import type { ReactNode } from "react"
import "../styles/Modal.css"

type ModalProps = {
  open: boolean
  title?: string
  onClose: () => void
  children: ReactNode
}

export default function Modal({open, title, onClose, children}: ModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      >
        {title && (
          <DialogTitle className="modal-title">
            {title}
          </DialogTitle>
        )}

        <DialogContent>
          {children}
        </DialogContent>
      </Dialog>
  )
}