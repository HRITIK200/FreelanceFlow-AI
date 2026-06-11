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
  

     return (
       <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Projects
      </h1>

      <div className="bg-white rounded shadow">

        <div className="mb-4">
            <input 
               type="text"
               placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-lg p-3"
            />
        </div>
        
        <div className="overflow-x-auto">
           <table className="w-full min-w-[700px]">

          <thead>

            <tr className="border-b">

              <th className="p-3 text-left">
                Title
              </th>

              <th className="p-3 text-left">
                Client
              </th>

              <th className="p-3 text-left">
                Budget
              </th>

              <th className="p-3 text-left">
                Status
              </th>

              <th className="p-3 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>
            
            {filteredProjects.length === 0 ? (

              <tr>
                <td
                  colSpan="5" className="text-center p-6 text-gray-500">
                  No projects found
                </td>
              </tr>
            ) : (

            filteredProjects.map(
              (project) => (

              <tr
                key={project.id}
                className="border-b"
              >

                <td className="p-3">
                  {project.title}
                </td>

                <td className="p-3">
                  {project.client?.name}
                </td>

                <td className="p-3">
                  ₹{project.budget}
                </td>

                <td className="p-3">
                  <span className={
                    project.status === "COMPLETED"
                        ? "bg-green-100 text-green-700 px-3 py-1 rounded-full"
                        : "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full"
                    }>
                  {project.status}
                    </span>
                </td>

                <td className="p-3">

                  <div className="flex flex-wrap gap-2">

                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setIsEditOpen(true);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                        onClick={() => {

                        setDeleteProjectId(project.id);
                        setIsDeleteOpen(true);
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))
            )}

          </tbody>

           </table>
        </div>

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
                await updateProject(
                  selectedProject.id,
                  {
                    title: selectedProject.title,
                    description: selectedProject.description,
                    budget: Number(selectedProject.budget),
                    status: selectedProject.status,
                    deadline: selectedProject.deadline,
                    clientId: selectedProject.clientId,
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
          <label className="block mb-1">
            Title
          </label>
            <input
                type="text"
                value={selectedProject.title}
                onChange={(e) =>
                  setSelectedProject({
                    ...selectedProject,
                    title: e.target.value,
                  })
                }
                className="w-full border p-2 mb-3 rounded"
            />
            <label className="block mb-1">
                Description
            </label>
            <textarea
                value={selectedProject.description || ""}
                onChange={(e) =>
                  setSelectedProject({
                    ...selectedProject,
                    description: e.target.value,
                  })
                }
                className="w-full border p-2 mb-3 rounded"
            />
            <label className="block mb-1">
                Budget
            </label>
            <input
                type="number"
                value={selectedProject.budget}
                onChange={(e) =>
                  setSelectedProject({                                                                                                   
                    ...selectedProject,
                    budget: e.target.value,
                  })
                }
                className="w-full border p-2 mb-3 rounded"
            />
            <label className="block mb-1">
                Status
            </label>
            <select  
                value={selectedProject.status}
                onChange={(e) =>
                  setSelectedProject({
                    ...selectedProject,
                    status: e.target.value,
                  })
                }
                className="w-full border p-2 mb-3 rounded"
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

            <div className="flex flex-wrap gap-2">
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
           title="Delete Project"
           message="Are you sure you want to delete this project? This action cannot be undone."
          onConfirm={async () => {
            try {
                await deleteProject(deleteProjectId);
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
