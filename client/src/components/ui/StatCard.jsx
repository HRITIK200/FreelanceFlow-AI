export default function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div
      className="
        bg-white
        rounded-3xl
        p-6
        shadow-sm
        border
        border-gray-100
        hover:shadow-lg
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >
      <div className="flex items-center justify-between gap-3">

        <div className="flex-1">

          <p
            className="
              text-sm
              text-gray-500
              font-medium
            "
          >
            {title}
          </p>

          <h2
            className="
              text-xl
              font-bold
              text-gray-900
              mt-2
              whitespace-nowrap
            "
          >
            {value}
          </h2>

        </div>

        <div
          className="
            h-12
            w-12
            rounded-2xl
            bg-gradient-to-br
            from-blue-500
            to-indigo-600
            text-white
            flex
            items-center
            justify-center
            shrink-0
            ml-2
          "
        >
          {icon}
        </div>

      </div>
    </div>
  );
}