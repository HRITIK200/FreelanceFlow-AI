export default function StatCard({
  title,
  value,
  icon,
}) {

return (
  <div
    className="
      bg-white
      dark:bg-slate-800

      rounded-2xl
      p-5
      shadow-sm

      border
      border-gray-100
      dark:border-slate-700

      hover:shadow-xl
      hover:-translate-y-1

      transition-all
      duration-300
    "
  >
    <div className="flex items-center justify-between">

      <div>

        <p
          className="
            text-sm
            text-gray-500
            dark:text-gray-400
            font-medium
          "
        >
          {title}
        </p>

        <h2
          className="
            text-3xl
            font-bold
            text-gray-900
            dark:text-white
            mt-2
          "
        >
          {value}
        </h2>

      </div>

      <div
        className="
          w-14
          h-14
          rounded-2xl

          bg-gradient-to-br
          from-blue-50
          to-indigo-100

          dark:from-slate-700
          dark:to-slate-600

          flex
          items-center
          justify-center
          text-3xl
        "
      >
        {icon}
      </div>

    </div>
  </div>
);
}