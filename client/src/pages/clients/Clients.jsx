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
  deleteClient
} from "../../api/clientApi";

import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import {
  exportToExcel
} from "../../utils/exportToExcel";

import {
  Users,
  Search,
  Pencil,
  Trash2,
  Building2,
  Mail,
  Download,
} from "lucide-react";


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

  {/* Header */}

  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
    <div>
      <h1 className="text-4xl font-bold text-gray-900">
        Clients
      </h1>

      <p className="text-gray-500 mt-2">
        Manage all your clients and companies
      </p>
    </div>

    <div className="mt-4 md:mt-0 flex gap-3">

      {/* Total Clients Card */}

      <div className="bg-white rounded-xl px-4 py-3 shadow">
        <div className="flex items-center gap-3">
          <Users size={20} />
          <div>
            <p className="text-sm text-gray-500">
              Total Clients
            </p>

            <h3 className="font-bold text-xl">
              {clients.length}
            </h3>
          </div>

        </div>
      </div>

      {/* Export Button */}

      <button onClick={() =>
         exportToExcel(clients,"Clients")
      }
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl flex items-center gap-2 shadow transition">
        <Download size={18} />
        Export
      </button>
      
    </div>
  </div>

  {/* Add Client */}

  <div className="bg-white rounded-2xl shadow-md p-6 mb-8">

    <h2 className="text-xl font-bold mb-5">
      Add New Client
    </h2>

    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >

      <input
        type="text"
        placeholder="Client Name"
        value={form.name}
        onChange={(e) =>
          setForm({
            ...form,
            name: e.target.value,
            })
        }
        className="w-full border rounded-xl p-3 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <input
        type="email"
        placeholder="Email Address"
        value={form.email}
        onChange={(e) =>
          setForm({
           ...form,
           email: e.target.value,
           })
        }
        className="w-full border rounded-xl p-3 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <input
        type="text"
        placeholder="Company Name"
        value={form.company}
        onChange={(e) =>
          setForm({
            ...form,
            company: e.target.value,
           })
        }
        className="w-full border rounded-xl p-3 mb-5 focus:ring-2 focus:ring-blue-500 outline-none"
      />
  
    <button
       type="submit"
       className="
       bg-blue-600
       hover:bg-blue-700
       text-white
         rounded-xl
         px-6
         py-3
         font-medium
         "
        >
        Add Client
        </button>
        
    </form>
  </div>

  {/* Search */}

  <div className="bg-white rounded-2xl shadow-md p-4 mb-6">

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
        placeholder="Search clients..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="
          w-full
          border
          rounded-xl
          py-3
          pl-10
          pr-4
        "
      />

    </div>

  </div>

{/* Empty State */}

{filteredClients.length === 0 ? (

  <div
    className="
      bg-white
      rounded-2xl
      shadow-md
      p-12
      text-center
    "
  >
    

    <h3 className="text-xl font-bold mt-4">
      <div className="py-16 text-center">
        <Users
          size={48}
          className="mx-auto text-gray-300"
        />
        <h3 className="text-xl font-bold">
          No Clients Yet
        </h3>
        <p className="text-gray-500 mt-2">
          Add your first client to start managaing projects.
        </p>
      </div>
    </h3>

    <p className="text-gray-500 mt-2">
      Add your first client to get started.
    </p>
  </div>

) : (

<>
  {/* Desktop Table */}

  <div className="hidden md:block bg-white rounded-2xl shadow-md overflow-hidden">

    <table className="w-full">

      <thead className="bg-slate-50">

        <tr>

          <th className="p-4 text-left">
            Client
          </th>

          <th className="p-4 text-left">
            Email
          </th>

          <th className="p-4 text-left">
            Company
          </th>

          <th className="p-4 text-center">
            Actions
          </th>

        </tr>

      </thead>

      <tbody>

        {filteredClients.map((client) => (

          <tr
            key={client.id}
            className="border-t hover:bg-gray-50"
          >

            <td className="p-4">
              <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold">
                {client.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">
                  <Link to={`/clients/${client.id}`}
                      className="text-blue-600 font-semibold hover:underline">
                        {client.name}
                      </Link>
                </p>
                <p className="text-xs text-gray-500">
                  Client
                </p>
              </div>
              </div>
            </td>

            <td className="p-4">
              {client.email}
            </td>

            <td className="p-4">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
                {client.company || "N/A"}
              </span>
              
            </td>

            <td className="p-4">

              <div className="flex justify-center gap-2">

                <button
                  onClick={() => {
                    setSelectedClient(client);
                    setIsEditOpen(true);
                  }}
                  className="
                    bg-yellow-100
                    text-yellow-600
                    p-2
                    rounded-xl
                    hover:bg-yellow-200
                    transition
                  "
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => {
                    setDeleteClientId(client.id);
                    setIsDeleteOpen(true);
                  }}
                  className="
                    bg-red-500
                    text-white
                    p-2
                    rounded-lg
                  "
                >
                  <Trash2 size={16} />
                </button>

              </div>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>
  </>
)}

  {/* Mobile Cards */}

  <div className="md:hidden space-y-4">

    {filteredClients.map((client) => (

      <div
        key={client.id}
        className="
          bg-white
          rounded-2xl
          shadow-md
          p-4
        "
      >

        <div className="flex items-center gap-3">

          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold">
             {client.name?.charAt(0)?.toUpperCase()}
          </div>

          <div>
            <h3 className="font-bold text-lg">
              {client.name}
            </h3>

            <p className="text-sm text-gray-500">
              Client
            </p>
          </div>
        </div>

        <div className="mt-3 space-y-2 text-gray-600">

          <div className="flex items-center gap-2">
            <Mail size={16} />
            {client.email}
          </div>

          <div className="flex items-center gap-2">
            <Building2 size={16} />
            {client.company}
          </div>

        </div>

        <div className="flex gap-2 mt-4">

          <button
            onClick={() => {
              setSelectedClient(client);
              setIsEditOpen(true);
            }}
            className="
              flex-1
              bg-yellow-500
              text-white
              py-2
              rounded-lg
            "
          >
            Edit
          </button>

          <button
            onClick={() => {
              setDeleteClientId(client.id);
              setIsDeleteOpen(true);
            }}
            className="
              flex-1
              bg-red-500
              text-white
              py-2
              rounded-lg
            "
          >
            Delete
          </button>

        </div>

      </div>

    ))}

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

          toast.success(
            "Client updated successfully"
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

      <input
        type="text"
        value={selectedClient.name}
        onChange={(e) =>
          setSelectedClient({
            ...selectedClient,
            name: e.target.value,
          })
        }
        className="w-full border rounded-xl p-3 mb-4"
      />

      <input
        type="email"
        value={selectedClient.email}
        onChange={(e) =>
          setSelectedClient({
            ...selectedClient,
            email: e.target.value,
          })
        }
        className="w-full border rounded-xl p-3 mb-4"
      />

      <input
        type="text"
        value={selectedClient.company}
        onChange={(e) =>
          setSelectedClient({
            ...selectedClient,
            company: e.target.value,
          })
        }
        className="w-full border rounded-xl p-3 mb-5"
      />

      <div className="flex gap-3">

        <button
          type="submit"
          className="
            flex-1
            bg-blue-600
            text-white
            py-3
            rounded-xl
          "
        >
          Save Changes
        </button>

        <button
          type="button"
          onClick={() =>
            setIsEditOpen(false)
          }
          className="
            flex-1
            bg-gray-100
            py-3
            rounded-xl
          "
        >
          Cancel
        </button>

      </div>

    </form>
  )}
</Modal>
<ConfirmModal
  isOpen={isDeleteOpen}
  onClose={() =>
    setIsDeleteOpen(false)
  }
  title="Delete Client"
  message="Are you sure you want to delete this client?"
  onConfirm={async () => {
    try {

      await deleteClient(
        deleteClientId
      );

      toast.success(
        "Client deleted successfully"
      );

      fetchClients();

      setIsDeleteOpen(false);

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to delete client"
      );
    }
  }}
/>
</DashboardLayout>
  );
}

