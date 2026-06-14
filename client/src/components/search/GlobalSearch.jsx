import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getClients } from "../../api/clientApi";
import { getProjects } from "../../api/projectApi";
import { getInvoices } from "../../api/invoiceApi";

export default function GlobalSearch() {

  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const [clients, setClients] =
    useState([]);

  const [projects, setProjects] =
    useState([]);

  const [invoices, setInvoices] =
    useState([]);

  useEffect(() => {

    const loadData =
      async () => {

        try {

          const [
            clientsData,
            projectsData,
            invoicesData,
          ] = await Promise.all([
            getClients(),
            getProjects(),
            getInvoices(),
          ]);

          setClients(clientsData);
          setProjects(projectsData);
          setInvoices(invoicesData);

        } catch (error) {

          console.log(error);

        }
      };

    loadData();

  }, []);

  const searchText =
    query.toLowerCase();

  const filteredClients =
    clients.filter(
      (client) =>
        client.name
          ?.toLowerCase()
          .includes(searchText)
    );

  const filteredProjects =
    projects.filter(
      (project) =>
        project.title
          ?.toLowerCase()
          .includes(searchText)
    );

  const filteredInvoices =
    invoices.filter(
      (invoice) =>
        invoice.invoiceNumber
          ?.toLowerCase()
          .includes(searchText)
    );

  return (
    <div className="relative w-72">

      <div
        className="
          flex
          items-center
          gap-3
          bg-gray-100
          rounded-xl
          px-4
          py-2
        "
      >
        <Search
          size={18}
          className="text-gray-500"
        />

        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          className="
            bg-transparent
            outline-none
            w-full
          "
        />
      </div>

      {query && (

        <div
          className="
            absolute
            top-14
            left-0
            right-0
            bg-white
            rounded-xl
            shadow-xl
            border
            max-h-96
            overflow-y-auto
            z-50
          "
        >

          {/* Clients */}

          {filteredClients.length > 0 && (

            <div className="p-3">

              <p
                className="
                  text-xs
                  font-bold
                  text-gray-400
                  uppercase
                  mb-2
                "
              >
                Clients
              </p>

              {filteredClients.map(
                (client) => (

                <button
                  key={client.id}
                  onClick={() => {
                    navigate("/clients");
                    setQuery("");
                  }}
                  className="
                    block
                    w-full
                    text-left
                    p-2
                    rounded-lg
                    hover:bg-gray-100
                  "
                >
                  {client.name}
                </button>

              ))}
            </div>
          )}

          {/* Projects */}

          {filteredProjects.length > 0 && (

            <div className="p-3 border-t">

              <p
                className="
                  text-xs
                  font-bold
                  text-gray-400
                  uppercase
                  mb-2
                "
              >
                Projects
              </p>

              {filteredProjects.map(
                (project) => (

                <button
                  key={project.id}
                  onClick={() => {
                    navigate("/projects");
                    setQuery("");
                  }}
                  className="
                    block
                    w-full
                    text-left
                    p-2
                    rounded-lg
                    hover:bg-gray-100
                  "
                >
                  {project.title}
                </button>

              ))}
            </div>
          )}

          {/* Invoices */}

          {filteredInvoices.length > 0 && (

            <div className="p-3 border-t">

              <p
                className="
                  text-xs
                  font-bold
                  text-gray-400
                  uppercase
                  mb-2
                "
              >
                Invoices
              </p>

              {filteredInvoices.map(
                (invoice) => (

                <button
                  key={invoice.id}
                  onClick={() => {
                    navigate("/invoices");
                    setQuery("");
                  }}
                  className="
                    block
                    w-full
                    text-left
                    p-2
                    rounded-lg
                    hover:bg-gray-100
                  "
                >
                  {invoice.invoiceNumber}
                </button>

              ))}
            </div>
          )}

        </div>

      )}

    </div>
  );
}