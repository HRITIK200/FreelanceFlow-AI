import { useEffect, useState } from "react";

import DashboardLayout
from "../../components/layout/DashboardLayout";

import {
  getProjects,
  updateProject,
  deleteProject,
} from "../../api/projectApi";

import Modal from "../../components/ui/Modal";
import { toast } from "react-hot-toast";
import ConfirmModal from "../../components/ui/ConfirmModal";

import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Search,
  Pencil,
  Trash2,
  Building2,
} from "lucide-react";

export default function Projects() {

  const [projects, setProjects] =
    useState([]);

  const [isEditOpen, setIsEditOpen] =
    useState(false);
  const [selectedProject, setSelectedProject] =
    useState(null);
  
  const [isDeleteOpen, setIsDeleteOpen] 
    = useState(false);
  const [deleteProjectId, setDeleteProjectId] =
    useState(null);


  const [search, setSearch] =
    useState("");

  const fetchProjects = async () => {
     
      try{
        const data =
          await getProjects();

        setProjects(data);

      } catch(error){
        console.log(error);
      }
    };

    useEffect(() => {
    fetchProjects();
    }, []);



  const filteredProjects =
    projects.filter(
      (project) =>
        project.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        project.client?.name
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  
  const completedProjects =
  projects.filter(
    (p) => p.status === "COMPLETED"
  ).length;

  const progressProjects =
  projects.filter(
    (p) => p.status === "IN_PROGRESS"
  ).length;

  const totalRevenue =
  projects.reduce(
    (sum, p) => sum + (p.budget || 0),
    0
  );
  
  return(
    <DashboardLayout>

  {/* Header */}

  <div className="mb-8">

    <h1 className="text-4xl font-bold text-gray-900">
      Projects
    </h1>

    <p className="text-gray-500 mt-2">
      Manage and track all freelance projects
    </p>

  </div>

  {/* Stats */}

  <div className="
    grid
    grid-cols-2
    lg:grid-cols-4
    gap-4
    mb-8
  ">

    <div className="bg-white rounded-2xl shadow-md p-5">
      <FolderKanban
        className="text-blue-600 mb-3"
      />
      <p className="text-gray-500 text-sm">
        Total Projects
      </p>
      <h3 className="text-2xl font-bold">
        {projects.length}
      </h3>
    </div>

    <div className="bg-white rounded-2xl shadow-md p-5">
      <CheckCircle2
        className="text-green-600 mb-3"
      />
      <p className="text-gray-500 text-sm">
        Completed
      </p>
      <h3 className="text-2xl font-bold">
        {completedProjects}
      </h3>
    </div>

    <div className="bg-white rounded-2xl shadow-md p-5">
      <Clock3
        className="text-yellow-600 mb-3"
      />
      <p className="text-gray-500 text-sm">
        In Progress
      </p>
      <h3 className="text-2xl font-bold">
        {progressProjects}
      </h3>
    </div>

    <div className="bg-white rounded-2xl shadow-md p-5">
      <IndianRupee
        className="text-purple-600 mb-3"
      />
      <p className="text-gray-500 text-sm">
        Revenue
      </p>
      <h3 className="text-2xl font-bold">
        ₹{totalRevenue}
      </h3>
    </div>

  </div>

  {/* Search */}

  <div className="
    bg-white
    rounded-2xl
    shadow-md
    p-4
    mb-6
  ">

    <div className="relative">

      <Search
        size={18}
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-gray-400
        "
      />

      <input
        type="text"
        placeholder="Search projects..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="
          w-full
          border
          rounded-xl
          py-3
          pl-11
          pr-4
        "
      />

    </div>

  </div>

  {/* Desktop Table */}

  <div
    className="
      hidden
      md:block
      bg-white
      rounded-2xl
      shadow-md
      overflow-hidden
    "
  >

    <table className="w-full">

      <thead className="bg-slate-50">

        <tr>

          <th className="p-4 text-left">
            Project
          </th>

          <th className="p-4 text-left">
            Client
          </th>

          <th className="p-4 text-left">
            Budget
          </th>

          <th className="p-4 text-left">
            Status
          </th>

          <th className="p-4 text-center">
            Actions
          </th>

        </tr>

      </thead>

      <tbody>

        {filteredProjects.length === 0 ? (

          <tr>

            <td
              colSpan="5"
              className="
                text-center
                py-10
                text-gray-500
              "
            >
              No projects found
            </td>

          </tr>

        ) : (

          filteredProjects.map(
            (project) => (

            <tr
              key={project.id}
              className="
                border-t
                hover:bg-gray-50
              "
            >

              <td className="p-4 font-medium">
                {project.title}
              </td>

              <td className="p-4">
                {project.client?.name}
              </td>

              <td className="p-4 font-semibold">
                ₹{project.budget}
              </td>

              <td className="p-4">

                <span
                  className={`
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-semibold

                  ${
                    project.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"

                    : project.status === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-700"

                    : "bg-yellow-100 text-yellow-700"
                  }
                  `}
                >
                  {project.status.replace(
                    "_",
                    " "
                  )}
                </span>

              </td>

              <td className="p-4">

                <div className="
                  flex
                  justify-center
                  gap-2
                ">

                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      setIsEditOpen(true);
                    }}
                    className="
                      bg-yellow-500
                      text-white
                      p-2
                      rounded-lg
                    "
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => {
                      setDeleteProjectId(
                        project.id
                      );
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

          ))
        )}

      </tbody>

    </table>

  </div>

  {/* Mobile Cards */}

  <div className="
    md:hidden
    space-y-4
  ">

    {filteredProjects.map(
      (project) => (

      <div
        key={project.id}
        className="
          bg-white
          rounded-2xl
          shadow-md
          p-5
        "
      >

        <h3 className="
          font-bold
          text-lg
        ">
          {project.title}
        </h3>

        <div className="
          mt-3
          space-y-2
        ">

          <p className="
            flex
            items-center
            gap-2
            text-gray-600
          ">
            <Building2 size={16} />
            {project.client?.name}
          </p>

          <p className="
            font-semibold
            text-lg
          ">
            ₹{project.budget}
          </p>

        </div>

        <div className="mt-4">

          <span
            className={`
            px-3
            py-1
            rounded-full
            text-sm
            font-medium

            ${
              project.status === "COMPLETED"
                ? "bg-green-100 text-green-700"

              : project.status === "IN_PROGRESS"
                ? "bg-blue-100 text-blue-700"

              : "bg-yellow-100 text-yellow-700"
            }
            `}
          >
            {project.status.replace(
              "_",
              " "
            )}
          </span>

        </div>

        <div className="
          flex
          gap-2
          mt-4
        ">

          <button
            onClick={() => {
              setSelectedProject(project);
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
              setDeleteProjectId(
                project.id
              );
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
  </DashboardLayout>
  )
}
