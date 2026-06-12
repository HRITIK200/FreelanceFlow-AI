import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0
        bg-black/50
        backdrop-blur-sm
        flex items-center justify-center
        p-4
        z-50
      "
    >
      <div
        className="
          bg-white
          rounded-3xl
          shadow-2xl
          w-full
          max-w-lg
          overflow-hidden
          animate-in
          fade-in
          zoom-in-95
        "
      >
        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            px-6
            py-5
            border-b
          "
        >
          <h2 className="text-2xl font-bold text-gray-900">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="
              h-10
              w-10
              rounded-xl
              hover:bg-gray-100
              flex
              items-center
              justify-center
              transition
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}