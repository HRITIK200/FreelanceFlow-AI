import { useEffect, useState } from "react";

import DashboardLayout
from "../../components/layout/DashboardLayout";

import {
  getActivities,
} from "../../api/activityApi";

import {
  Search,
  Activity as ActivityIcon,
  PlusCircle,
  Pencil,
  Trash2,
  Mail,
  CheckCircle2,
} from "lucide-react";

export default function Activity() {

  const [activities, setActivities] =
    useState([]);

  const [search, setSearch] = useState("");

  const fetchActivities =
    async () => {

      try {

        const data =
          await getActivities();

        setActivities(data);

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    fetchActivities();

  }, []);

 const filteredActivities = activities.filter((activity) =>
  activity.details
    .toLowerCase()
    .includes(search.toLowerCase())
);

const getActivityIcon = (text) => {
  const value = text.toLowerCase();

  if (value.includes("created"))
    return <PlusCircle size={18} className="text-green-600" />;

  if (value.includes("updated"))
    return <Pencil size={18} className="text-blue-600" />;

  if (value.includes("deleted"))
    return <Trash2 size={18} className="text-red-600" />;

  if (value.includes("email"))
    return <Mail size={18} className="text-purple-600" />;

  if (value.includes("paid"))
    return <CheckCircle2 size={18} className="text-green-600" />;

  return <ActivityIcon size={18} className="text-indigo-600" />;
};

  return (
  <DashboardLayout>

    {/* Header */}

    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Activity Logs
        </h1>

        <p className="text-gray-500 mt-2">
          Track everything happening in your business.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4">

        <div className="flex items-center gap-3">
          <ActivityIcon size={22} />

          <div>
            <p className="text-sm text-gray-500">
              Total Activities
            </p>

            <h3 className="font-bold text-xl">
              {activities.length}
            </h3>
          </div>
        </div>

      </div>

    </div>

    {/* Search */}

    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-6">

      <div className="relative">

        <Search
          size={18}
          className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-gray-400
          "
        />

        <input
          type="text"
          placeholder="Search activities..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            w-full
            bg-slate-50
            border
            border-gray-200
            rounded-2xl
            py-4
            pl-12
            pr-4
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />

      </div>

    </div>

    {/* Activities */}

    <div className="bg-white rounded-2xl shadow-md overflow-hidden">

      {filteredActivities.length === 0 ? (

        <div className="py-16 text-center">


          <h3 className="text-xl font-bold">
            <div className="py-16 text-center">
              <ActivityIcon size={60}
               className="mx-auto text-gray-300 mb-4"/>
              
              <h3 className="text-xl font-bold">
                No Activity Yet
              </h3>

              <p className="text-gray-500 mt-2">
                Your recent actions will appear here.
              </p>
            </div>
          </h3>

          <p className="text-gray-500 mt-2">
            Activity logs will appear here.
          </p>  
        </div>

      ) : (

        filteredActivities.map((activity) => (

          <div
            key={activity.id}
            className="
              flex
              items-start
              gap-4
              p-5
              border-b
              border-gray-100
              hover:bg-blue-50
              transition-all
              duration-300
            "
          >

            <div
              className="
                h-12
                w-12
                rounded-2xl
                bg-gradient-to-r
                from-blue-50
                to-indigo-50
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              {getActivityIcon(
                activity.details
              )}
            </div>

            <div className="flex-1">

              <h3 className="font-medium text-gray-800">
                {activity.details}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {new Date(
                  activity.createdAt
                ).toLocaleDateString()}.
                {" "}
                {new Date(
                  activity.createdAt
                ).toLocaleDateString()}
              </p>

            </div>

          </div>

        ))

      )}

    </div>

  </DashboardLayout>
);

}