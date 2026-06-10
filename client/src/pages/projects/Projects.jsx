import { useEffect, useState } from "react";

import DashboardLayout
from "../../components/layout/DashboardLayout";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../api/projectApi";

export default function Projects() {

  const [projects, setProjects] =
    useState([]);

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      budget: "",
    });

  const fetchProjects =
    async () => {

      const data =
        await getProjects();

      setProjects(data);
    };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      alert(
        "Need clientId before creating project. We'll improve this next."
      );
    };

  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Projects
      </h1>

      <div className="bg-white rounded shadow">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="p-3">
                Title
              </th>

              <th className="p-3">
                Client
              </th>

              <th className="p-3">
                Budget
              </th>

              <th className="p-3">
                Status
              </th>

              <th className="p-3">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {projects.map(
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
                  {project.status}
                </td>

                <td className="p-3">

                  <div className="flex gap-2">

                    <button
                      onClick={async () => {

                        const newTitle =
                          prompt(
                            "New Project Title",
                            project.title
                          );

                        if (!newTitle)
                          return;

                        await updateProject(
                          project.id,
                          {
                            title: newTitle,
                            description: project.description,
                            budget: project.budget,
                            status: project.status,
                            deadline: project.deadline,
                            clientId: project.clientId,
                          }
                        );

                        fetchProjects();

                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={async () => {

                        const confirmDelete =
                          window.confirm(
                            "Delete Project?"
                          );

                        if (!confirmDelete)
                          return;

                        await deleteProject(
                          project.id
                        );

                        fetchProjects();

                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded"
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