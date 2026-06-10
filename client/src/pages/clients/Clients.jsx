import {
  useEffect,
  useState,
} from "react";

import DashboardLayout
from "../../components/layout/DashboardLayout";

import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "../../api/clientApi";

export default function Clients() {

  const [clients,
    setClients] =
    useState([]);

  const [form,
    setForm] =
    useState({
      name: "",
      email: "",
      company: "",
    });

  const fetchClients =
    async () => {

      const data =
        await getClients();

      setClients(data);
    };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      await createClient(form);

      setForm({
        name: "",
        email: "",
        company: "",
      });

      fetchClients();
    };

  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Clients
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6"
      >

        <div className="grid grid-cols-3 gap-4">

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="Company"
            value={form.company}
            onChange={(e) =>
              setForm({
                ...form,
                company:
                  e.target.value,
              })
            }
            className="border p-2 rounded"
          />

        </div>

        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Client
        </button>

      </form>

      <div className="bg-white rounded shadow">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="p-3">
                Name
              </th>

              <th className="p-3">
                Email
              </th>

              <th className="p-3">
                Company
              </th>

              <th className="p-3">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {clients.map(
              (client) => (

              <tr
                key={client.id}
                className="border-b"
              >

                <td className="p-3">
                  {client.name}
                </td>

                <td className="p-3">
                  {client.email}
                </td>

                <td className="p-3">
                  {client.company}
                </td>

                <td className="p-3">
                    <div className="flex gap-2">

                      <button
                        onClick={async () => {

                          const newName =
                            prompt(
                              "Enter new name",
                              client.name
                            );
                          if (!newName) return;

                          await updateClient(
                            client.id,
                            {
                                name: newName,
                                email: client.email,
                                company: client.company,
                            }
                          );
                            fetchClients();
                        }}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>

                    <button
                        onClick={async () => {

                         const confirmDelete =
                            window.confirm(
                              "Delete this client?"
                            );
                          if (!confirmDelete) return;
                            await deleteClient(
                                client.id
                            );
                            fetchClients();
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                    </td>  

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </DashboardLayout>
  );
}

