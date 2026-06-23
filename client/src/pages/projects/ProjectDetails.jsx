import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardLayout
from "../../components/layout/DashboardLayout";

import {
  getProjectDetails,
} from "../../api/projectApi";

import { 
  createInvoice,
  updateInvoice,
  deleteInvoice,
 } from "../../api/invoiceApi";

 import { toast } from "react-hot-toast";

import Modal
from "../../components/ui/Modal";

export default function ProjectDetails() {

  const { id } = useParams();

  const [project, setProject] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [showInvoiceModal, setShowInvoiceModal] =
    useState(false);
  
  const [invoiceData, setInvoiceData] =
    useState({amount: "",dueDate: "",});

  const fetchProject =
      async () => {

        try {

          const data =
            await getProjectDetails(id);

          setProject(data);

        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);

        }

      };


  useEffect(() => {
    fetchProject();

  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl font-semibold">
              Loading Project...
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="p-8">
          Project not found
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      {/* Header */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          {project.title}
        </h1>

        <p className="text-gray-500 mt-2">
          {project.description}
        </p>
        <div className="mt-5">

          <button onClick={() =>
             setShowInvoiceModal(true)
          }
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition">
            + Create Invoice
          </button>
        </div>
      </div>

      {/* Stats */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4
          mb-8
        "
      >

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">
            Budget
          </p>

          <h2 className="text-3xl font-bold text-green-600">
            ₹{project.budget}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">
            Status
          </p>

          <h2 className="text-2xl font-bold">
            {project.status}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">
            Progress
          </p>

          <h2 className="text-3xl font-bold">
            {project.progress || 0}%
          </h2>
        </div>

      </div>

      {/* Progress Bar */}

      <div
        className="
          bg-white
          rounded-2xl
          shadow
          p-6
          mb-8
        "
      >

        <h2 className="text-xl font-bold mb-4">
          Project Progress
        </h2>

        <div className="w-full bg-gray-200 rounded-full h-5">

          <div
            className="
              bg-blue-600
              h-5
              rounded-full
              transition-all
            "
            style={{
              width:
                `${project.progress || 0}%`,
            }}
          />

        </div>

        <p className="mt-3 font-semibold">
          {project.progress || 0}% Complete
        </p>

      </div>

      {/* Client */}

      <div
        className="
          bg-white
          rounded-2xl
          shadow
          p-6
          mb-8
        "
      >

        <h2 className="text-xl font-bold mb-4">
          Client Information
        </h2>

        <p>
          <strong>Name:</strong>{" "}
          {project.client?.name}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {project.client?.email}
        </p>

        <p>
          <strong>Company:</strong>{" "}
          {project.client?.company}
        </p>

      </div>

      {/* Invoices */}

      <div
        className="
          bg-white
          rounded-2xl
          shadow
          p-6
        "
      >

        <h2 className="text-xl font-bold mb-4">
          Related Invoices
          ({project.invoices.length})
        </h2>

        {project.invoices.length === 0 ? (

          <p className="text-gray-500">
            No invoices found
          </p>

        ) : (

          project.invoices.map(
            (invoice) => (

              <div
                key={invoice.id}
                className="
                  flex
                  justify-between
                  items-center
                  border-b
                  py-4
                "
              >

                <div>

                    <h3 className="font-semibold">
                      {invoice.invoiceNumber}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      Due: {" "}
                           {new Date(
                            invoice.dueDate
                           ).toLocaleDateString()}
                    </p>

                  </div>

                  <div className="text-right">

                  <p className="font-bold text-green-600">
                    ₹{invoice.amount}
                  </p>

                  <span className={`px-3 py-1 rounded-full text-xs font-medium"
                      ${
                         invoice.status === "PAID"
                           ? "bg-green-100 text-green-700"
                           : "bg-yellow-100 text-yellow-700"
                      }
                      `}
                  >
                    {invoice.status}
                  </span>

                {
                  invoice.status !== "PAID" && (

                    <button onClick={async () => {

                      try{

                        const confirmPaid =
                          window.confirm(
                            "Mark this invoice as paid?"
                          );

                        if(!confirmPaid) return;

                        await updateInvoice(
                          invoice.id,
                          {
                            status: "PAID",
                          }
                        );
                        toast.success("Invoice marked as paid");

                        fetchProject();

                      } catch (error){
                        console.log(error);

                        toast.error("Failed to update invoice");
                      }
                    }}
                    className="block mt-2 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded-lg ">
                      Mark Paid
                    </button>
                  )
                }
              <button onClick={async () =>{

                const confirmDelete =
                  window.confirm(
                    "Delete this invoice?"
                  );
                
                if(!confirmDelete)
                  return;

                try{
                  await deleteInvoice(invoice.id);

                  toast.success("Invoice deleted");

                  fetchProject();

                } catch(error){

                  console.log(error);

                  toast.error("Failed to delete invoice");
                }
              }}
              className="block mt-2 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-lg">
                Delete
              </button>

                </div>

              </div>

            )
          )

        )}

      </div>
    
    <Modal 
       isOpen={showInvoiceModal}
       onClose={() =>
         setShowInvoiceModal(false)
       }
       title="Create Invoice"
    >
      <div className="space-y-4">

        <input
           type="number"
           placeholder="Amount"
           value={invoiceData.amount}
           onChange={(e) =>
             setInvoiceData({
              ...invoiceData,
              amount: e.target.value,
             })
           }
           className="w-full border rounded-xl p-3"/>
        
        <input
          type="date"
          value={invoiceData.dueDate}
          onChange={(e) =>
            setInvoiceData({
              ...invoiceData,
              dueDate: e.target.value,
            })
          }
          className="w-full border rounded-xl p-3"/>

        <button onClick={async () => {

          try{
            
            if(
              !invoiceData.amount ||
              !invoiceData.dueDate
            ){
              toast.error("Please fill all fields");
              return;
            }

            await createInvoice({
              invoiceNumber:`INV-${Date.now()}`,

              amount:
                 Number(
                  invoiceData.amount
                 ),
              dueDate:
                 invoiceData.dueDate,
              projectId:
                 project.id,
            });

            toast.success("Invoice Created");

            setShowInvoiceModal(false);

            setInvoiceData({
              amount: "",
              dueDate: "",
            });
            fetchProject();
          }catch(error){

            console.log(error);

            toast.error("Failed to create invoice");
          }
        }}
        className="w-full bg-blue-600 text-white py-3 rounded-xl">
          Create Invoice
        </button>
       </div>
      </Modal> 

    </DashboardLayout>
  );
}