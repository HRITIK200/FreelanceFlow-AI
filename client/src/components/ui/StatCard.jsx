export default function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div
      className="
        bg-white/80
        dark:bg-[#161b28]
        backdrop-blur-md
        rounded-3xl
        p-6
        border
        border-gray-100
        dark:border-white/[0.06]
        shadow-sm
        hover:shadow-md
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p
            className="
              text-xs
              text-gray-500
              dark:text-gray-400
              font-bold
              uppercase
              tracking-wider
            "
          >
            {title}
          </p>

          <h2
            className="
              text-3xl
              font-extrabold
              text-gray-900
              dark:text-white
              mt-2
              whitespace-nowrap
              tracking-tight
            "
          >
            {value !== undefined && value !== null ? value : 0}
          </h2>
        </div>

        <div
          className="
            h-12
            w-12
            rounded-2xl
            bg-gradient-to-br
            from-blue-600
            to-indigo-600
            text-white
            flex
            items-center
            justify-center
            shrink-0
            ml-2
            shadow-md
            shadow-blue-500/20
          "
        >
          {icon}
        </div>
      </div>
    </div>
  );
}