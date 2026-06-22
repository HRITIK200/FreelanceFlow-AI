import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardLayout
from "../../components/layout/DashboardLayout";

import { getClientDetails }
from "../../api/clientApi";

export default function ClientDetails() {

  const { id } = useParams();

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchClient =
      async () => {

      try {

        const response =
          await getClientDetails(id);

        setData(response);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    fetchClient();

  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        Loading...
      </DashboardLayout>
    );
  }

 return (
  <DashboardLayout>

    {/* Header */}

    <div className="mb-8">

      <h1 className="text-4xl font-bold">
        {data.client.name}
      </h1>

      <p className="text-gray-500 mt-2">
        {data.client.company || "No Company"}
      </p>

      <p className="text-gray-500">
        {data.client.email}
      </p>

    </div>

    {/* Stats Cards */}

    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-4
        gap-4
        mb-8
      "
    >

      <div
        className="
          bg-white
          rounded-2xl
          shadow
          p-6
        "
      >
        <p className="text-gray-500">
          Total Projects
        </p>

        <h2 className="text-3xl font-bold">
          {data.totalProjects}
        </h2>
      </div>

      <div
        className="
          bg-white
          rounded-2xl
          shadow
          p-6
        "
      >
        <p className="text-gray-500">
          Completed
        </p>

        <h2 className="text-3xl font-bold">
          {data.completedProjects}
        </h2>
      </div>

      <div
        className="
          bg-white
          rounded-2xl
          shadow
          p-6
        "
      >
        <p className="text-gray-500">
          Revenue
        </p>

        <h2 className="text-3xl font-bold text-green-600">
          ₹{data.totalRevenue.toLocaleString()}
        </h2>
      </div>

      <div
        className="
          bg-white
          rounded-2xl
          shadow
          p-6
        "
      >
        <p className="text-gray-500">
          Pending Revenue
        </p>

        <h2 className="text-3xl font-bold text-orange-500">
          ₹{data.pendingRevenue.toLocaleString()}
        </h2>
      </div>

    </div>

    <div
      className="
        bg-white
        rounded-2xl
        shadow
        p-6
        mb-6
      "
    >

      <h2
        className="
          text-xl
          font-bold
          mb-4
        "
      >
        Client Projects
      </h2>

      {data.client.projects.length === 0 ? (

        <p className="text-gray-500">
          No projects found
        </p>

      ) : (

        data.client.projects.map(
          (project) => (

            <div
              key={project.id}
              className="
                border-b
                py-4
              "
            >

              <div className="flex justify-between">

                <div>

                  <h3 className="font-semibold">
                    {project.title}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {project.status}
                  </p>

                </div>

                <div className="font-semibold">

                  ₹{project.budget}

                </div>

              </div>

            </div>

          )
        )

      )}

    </div>
        <div
      className="
        bg-white
        rounded-2xl
        shadow
        p-6
      "
    >

      <h2
        className="
          text-xl
          font-bold
          mb-4
        "
      >
        Recent Invoices
      </h2>

      {data.recentInvoices.length === 0 ? (

        <p className="text-gray-500">
          No invoices found
        </p>

      ) : (

        data.recentInvoices.map(
          (invoice) => (

            <div
              key={invoice.id}
              className="
                border-b
                py-4
              "
            >

              <div className="flex justify-between">

                <div>

                  <h3 className="font-semibold">
                    {invoice.invoiceNumber}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {invoice.status}
                  </p>

                </div>

                <div className="font-semibold text-green-600">

                  ₹{invoice.amount}

                </div>

              </div>

            </div>

          )
        )

      )}

    </div>

  </DashboardLayout>
);
}