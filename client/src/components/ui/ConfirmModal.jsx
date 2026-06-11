import Modal from "./Modal";

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

      <p className="mb-4">
        {message}
      </p>

      <div className="flex gap-2">

        <button
          onClick={onConfirm}
          className="
            bg-red-600
            text-white
            px-4 py-2
            rounded
          "
        >
          Delete
        </button>

        <button
          onClick={onClose}
          className="
            bg-gray-500
            text-white
            px-4 py-2
            rounded
          "
        >
          Cancel
        </button>

      </div>

    </Modal>
  );
}