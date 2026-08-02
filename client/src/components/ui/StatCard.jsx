export default function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div
      className="
        bg-white/75
        backdrop-blur-md
        rounded-3xl
        p-6
        border
        border-white/40
        shadow-[0_8px_30px_rgb(0,0,0,0.02)]
        hover:shadow-[0_20px_40px_rgba(59,130,246,0.08)]
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >
      <div className="flex items-center justify-between gap-3">

        <div className="flex-1">

          <p
            className="
              text-xs
              text-gray-400
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
              text-gray-800
              mt-2
              whitespace-nowrap
              tracking-tight
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