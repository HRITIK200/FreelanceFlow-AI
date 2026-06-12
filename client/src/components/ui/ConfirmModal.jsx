import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <div className="text-center">

        {/* Warning Icon */}

        <div
          className="
            h-16
            w-16
            mx-auto
            rounded-full
            bg-red-100
            flex
            items-center
            justify-center
            mb-5
          "
        >
          <AlertTriangle
            size={32}
            className="text-red-600"
          />
        </div>

        {/* Message */}

        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>

        {/* Actions */}

        <div className="flex gap-3">

          <button
            onClick={onClose}
            className="
              flex-1
              py-3
              rounded-xl
              bg-gray-100
              hover:bg-gray-200
              text-gray-700
              font-medium
              transition
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="
              flex-1
              py-3
              rounded-xl
              bg-red-600
              hover:bg-red-700
              text-white
              font-medium
              transition
            "
          >
            Delete
          </button>

        </div>

      </div>
    </Modal>
  );
}