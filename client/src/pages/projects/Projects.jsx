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
import { exportToExcel } from "../../utils/exportToExcel";

import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Search,
  Pencil,
  Trash2,
  Building2,
  Download,
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

  

  const averageProgress =
   projects.length > 0
    ? Math.round(
      projects.reduce(
        (sum, p) => sum + (p.progress || 0), 0
      ) / projects.length
    ) : 0;
  
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
  <div className="flex gap-3 mb-6">

    <button onClick={() =>
       exportToExcel(
        projects.map(
          (project) => ({
            Title:project.title,
            Status:project.status,
            Budget:project.budget,
            Client:project.client?.name,
          })
        ),
        "Projects"
       )}
       className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl flex items-center gap-2 shadow transition">
        <Download size={18} />
         Export
       </button>
  </div>

  {/* Stats */}

  <div className="
    grid
    grid-cols-2
    lg:grid-cols-5
    gap-4
    mb-8
  ">

    <div className="bg-white rounded-3xl shadow-sm border border-gray-100  p-6 hover:shadow-lg transition">
      <div  className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
        <FolderKanban className="text-blue-600 mb-3" />
      </div>
      <p className="text-gray-500 text-sm">
        Total Projects
      </p>
      <h3 className="text-2xl font-bold">
        {projects.length}
      </h3>
    </div>

    <div className="bg-white rounded-3xl shadow-sm border border-gray-100  p-6 hover:shadow-lg transition">
      <div className="h-12 w-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-4">
        <CheckCircle2 size={22} />
      </div>
      <p className="text-gray-500 text-sm">
        Completed
      </p>
      <h3 className="text-2xl font-bold">
        {completedProjects}
      </h3>
    </div>

    <div className="bg-white rounded-3xl shadow-sm border border-gray-100  p-6 hover:shadow-lg transition">
      <div className="h-12 w-12 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center mb-4">
        <Clock3 size={22} />
      </div>
      <p className="text-gray-500 text-sm">
        In Progress
      </p>
      <h3 className="text-2xl font-bold">
        {progressProjects}
      </h3>
    </div>

    <div className="bg-white rounded-3xl shadow-sm border border-gray-100  p-6 hover:shadow-lg transition">
      <div className="h-12 w-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-4">
        <IndianRupee size={22} />
      </div>
      
      <p className="text-gray-500 text-sm">
        Revenue
      </p>
      <h3 className="text-2xl font-bold">
        ₹{totalRevenue.toLocaleString()}
      </h3>
    </div>
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
       <div className="h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
        🚀
       </div>
       <p className="text-gray-500 text-sm">
        Avg Progress
       </p>
       <h3 className="text-2xl font-bold">
        {averageProgress}%
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
        size={20}
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
        placeholder="Search projects by title or client..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"/>
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

      <thead className="bg-gradient-to-r from-slate-50 to-blue-50">

        <tr>

          <th className="p-5 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold">
            Project
          </th>

          <th className="p-5 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold">
            Client
          </th>

          <th className="p-5 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold">
            Budget
          </th>

          <th className="p-5 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold">
            Status
          </th>

          <th className="p-5 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold">
            Progress
          </th>

          <th className="p-4 text-center text-xs uppercase tracking-wider text-gray-500 font-semibold">
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
              <div className="py-12 text-center">
                
                <p className="text-gray-500">
                  <div className="py-16 text-center">
                    <FolderKanban size={50} className="mx-auto text-gray-300 mb-4"/>

                    <h3 className="text-xl font-bold">
                      No Projects Yet
                    </h3>
                    <p className="text-gray-500 mt-2">
                      Create your first project and start Tracking progress.
                    </p>
                  </div>
                </p>
              </div>
            </td>

          </tr>

        ) : (

          filteredProjects.map(
            (project) => (

            <tr
              key={project.id}
              className="
                border-t
                border-gray-100
                hover:bg-blue-50
                transition
                duration-200
              "
            >

              <td className="p-5 font-semibold text-gray-800">
                {project.title}
              </td>

              <td className="p-4">
                {project.client?.name}
              </td>

              <td className="p-5 font-bold text-green-600">
                ₹{project.budget}
              </td>

              <td className="p-4">

                <span
                  className={`
                    inline-flex
                    items-center
                    px-4
                    py-2
                    rounded-full
                    text-xs
                    font-semibold
                    tracking-wide

                  ${
                    project.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"

                    : project.status === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-700"

                    : "bg-yellow-100 text-yellow-700"
                  }
                  `}
                >
                  {project.status === "COMPLETED" && "✅ "}
                  {project.status === "IN_PROGRESS" && "🚀 "}
                  {project.status === "PENDING" && "⏳ "}
                  
                  {project.status.replace(
                    "_",
                    " "
                  )}
                </span>

              </td>

              <td className="p-4 min-w-[180px]">
                 <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                       style={{width: `${project.progress || 0}%`,}}/>
                 </div>
                 <p className="text-xs mt-2 font-medium text-gray-600">
                  {project.progress || 0}%
                 </p>
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
                      bg-yellow-100
                      text-yellow-600
                      p-2.5
                      rounded-xl
                      hover:bg-yellow-200
                      hover:scale-110
                      transition
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
                      bg-red-100
                      text-red-600
                      p-2.5
                      rounded-xl
                      hover:bg-red-200
                      hover:scale-110
                      transition
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

          <div className="mt-3">
            <div className="flex justify-between mb-1">
             <span className="text-sm text-gray-500">
              Progress
             </span>

             <span className="text-sm font-medium">
              {project.progress || 0}%
             </span>
            </div>

             <div className="w-full bg-gray-200 rounded-full h-2">

               <div className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{width: `${project.progress || 0}%`,}}/>
             </div>
            </div>

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
  <Modal
  isOpen={isEditOpen}
  onClose={() => setIsEditOpen(false)}
  title="Edit Project"
>
  {selectedProject && (

    <form
      onSubmit={async (e) => {

        e.preventDefault();

        try {
          
          const updatedStatus =
           (selectedProject?.progress || 0) >= 100
             ? "COMPLETED"
             : selectedProject.status;


          await updateProject(
            selectedProject.id,
            {
              title:
                selectedProject.title,

              description:
                selectedProject.description,

              budget:
                Number(
                  selectedProject.budget
                ),
              progress:
                Number(selectedProject.progress) || 0,

              status:
                updatedStatus,

              deadline:
                selectedProject.deadline,

              clientId:
                selectedProject.clientId ||
                selectedProject.client?.id,
            }
          );

          toast.success(
            "Project updated successfully"
          );

          fetchProjects();

          setIsEditOpen(false);

        } catch (error) {

          console.log(error);

          toast.error(
            "Failed to update project"
          );

        }

      }}
    >

      <input
        type="text"
        value={selectedProject.title}
        onChange={(e) =>
          setSelectedProject({
            ...selectedProject,
            title: e.target.value,
          })
        }
        className="
          w-full
          border
          rounded-xl
          p-3
          mb-4
        "
      />

      <textarea
        value={
          selectedProject.description || ""
        }
        onChange={(e) =>
          setSelectedProject({
            ...selectedProject,
            description:
              e.target.value,
          })
        }
        className="
          w-full
          border
          rounded-xl
          p-3
          mb-4
        "
      />

      <input
        type="number"
        value={selectedProject.budget}
        onChange={(e) =>
          setSelectedProject({
            ...selectedProject,
            budget: e.target.value,
          })
        }
        className="
          w-full
          border
          rounded-xl
          p-3
          mb-4
        "
      />

      <input
        type="range"
        min="0"
        max="100"
        value={selectedProject.progress || 0}
        onChange={(e) => 
          setSelectedProject({
            ...selectedProject,
            progress: Number(e.target.value),
          })
        }
        className="w-full"/>

      <p className="text-center mt-2 font-semibold">
        {selectedProject.progress || 0}%
      </p>

      <select
        value={selectedProject.status}
        onChange={(e) =>
          setSelectedProject({
            ...selectedProject,
            status: e.target.value,
          })
        }
        className="
          w-full
          border
          rounded-xl
          p-3
          mb-5
        "
      >
        <option value="PENDING">
          Pending
        </option>

        <option value="IN_PROGRESS">
          In Progress
        </option>

        <option value="COMPLETED">
          Completed
        </option>

      </select>

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
  title="Delete Project"
  message="Are you sure you want to delete this project?"
  onConfirm={async () => {

    try {

      await deleteProject(
        deleteProjectId
      );

      toast.success(
        "Project deleted successfully"
      );

      fetchProjects();

      setIsDeleteOpen(false);

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to delete project"
      );

    }

  }}
/>
  </DashboardLayout>
  );
}
