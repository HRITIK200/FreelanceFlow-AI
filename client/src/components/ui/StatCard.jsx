export default function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="
      bg-white
      rounded-2xl
      shadow-md
      p-5
      hover:shadow-xl
      hover:-translate-y-1
      transition-all
      duration-300
      flex
      justify-between
      items-center
    ">
      <div className="flex justify-between items-center">
      

        <div>
          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div className="text-3xl">
          {icon}
        </div>

      </div>
    </div>
  );
}