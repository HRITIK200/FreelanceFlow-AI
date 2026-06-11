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

import { toast } from "react-hot-toast";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";


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

  const [isEditOpen, setIsEditOpen] =
    useState(false);

  const [selectedClient, setSelectedClient] =
    useState(null);

  const [search, setSearch] =
    useState("");
  
  const [deleteClientId, setDeleteClientId] =
    useState(null); 
  const [isDeleteOpen, setIsDeleteOpen] =
    useState(false);
  

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

      toast.success(
        "Client created successfully"
      );

      setForm({
        name: "",
        email: "",
        company: "",
      });

      fetchClients();
    };

  const filteredClients = clients.filter(
    (client) =>
      client.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      client.email
        .toLowerCase()
        .includes(search.toLowerCase()) ||
        client.company
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Clients
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6"
      >

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

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

        <div className="mb-4">
            <input 
               type="text"
               placeholder="Search clients..."
               value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-lg p-2"
            />
        </div>

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

            {filteredClients.map(
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
                        onClick={() => {
                            setSelectedClient(client);
                            setIsEditOpen(true);
                        }}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => {
                            
                         setDeleteClientId(client.id);
                         setIsDeleteOpen(true);
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
     
        <Modal
           isOpen={isEditOpen}
           onClose={() => setIsEditOpen(false)}
           title="Edit Client"
        >

        {selectedClient && (

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              
              try {
                await updateClient(
                  selectedClient.id,
                  {
                    name: selectedClient.name,
                    email: selectedClient.email,
                    company: selectedClient.company,
                  }
                );
                fetchClients();

                setIsEditOpen(false);

              } catch (error) {
                console.log(error);
                toast.error(
                  "Failed to update client"
                );
              }
            }}
            >
            <input type="text"
              value={selectedClient.name}
              onChange={(e) =>
                setSelectedClient({
                  ...selectedClient,
                  name: e.target.value,
                })
              }
              className="w-full border p-2 rounded mb-4"
            />
            <input type="email"
                value={selectedClient.email}
                onChange={(e) =>
                  setSelectedClient({
                    ...selectedClient,
                    email: e.target.value,
                  })
                }
                className="w-full border p-2 rounded mb-4"
            />
            <input type="text"
                value={selectedClient.company}
                onChange={(e) =>
                  setSelectedClient({
                    ...selectedClient,
                    company: e.target.value,
                  })
                }
                className="w-full border p-2 rounded mb-4"
            />
            <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Cancel
                </button>
            </div>
            </form>
        )}

        </Modal>
        <ConfirmModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          title="Delete Client"
          message="Are you sure you want to delete this client?"
          onConfirm={async () => {
            try {
              await deleteClient(deleteClientId);
              toast.success("Client deleted successfully");
              fetchClients();
              setIsDeleteOpen(false);
            } catch (error) {
              console.log(error);
              toast.error("Failed to delete client");
            }
          }}
        />
    </DashboardLayout>
  );
}

