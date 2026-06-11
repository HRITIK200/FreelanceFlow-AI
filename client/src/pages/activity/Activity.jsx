import { useEffect, useState } from "react";

import DashboardLayout
from "../../components/layout/DashboardLayout";

import {
  getActivities,
} from "../../api/activityApi";

export default function Activity() {

  const [activities, setActivities] =
    useState([]);

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

  return (

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Activity Logs
      </h1>

      <div className="bg-white rounded-xl shadow">

        {activities.length === 0 ? (

          <div className="p-6 text-gray-500">

            No activity found

          </div>

        ) : (

          activities.map(
            (activity) => (

              <div
                key={activity.id}
                className="
                  border-b
                  p-4
                  hover:bg-gray-50
                "
              >

                <div className="font-medium">

                  {activity.details}

                </div>

                <div className="text-sm text-gray-500 mt-1">

                  {new Date(
                    activity.createdAt
                  ).toLocaleString()}

                </div>

              </div>

            )
          )

        )}

      </div>

    </DashboardLayout>

  );

}