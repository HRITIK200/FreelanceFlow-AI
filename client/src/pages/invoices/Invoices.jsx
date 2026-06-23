import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "../../api/invoiceApi";

import { 
    downloadInvoicePDF,
 } from "../../api/pdfApi";
import {
    sendInvoiceEmail,
} from "../../api/emailApi";

import { getProjects }
from "../../api/projectApi";

import { Search } from "lucide-react";

import { toast } from "react-hot-toast";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { exportToExcel } from "../../utils/exportToExcel";

import {
  CheckCircle2,
  Download,
  Mail,
  Trash2,
  FileText,
  Clock3,
  IndianRupee,
} from "lucide-react";

export default function Invoices() {

  const [invoices, setInvoices] =
    useState([]);

  const fetchInvoices =
    async () => {

      const data =
        await getInvoices();

      setInvoices(data);
    };
  
  const paidInvoices =
    invoices.filter(
      (i) => i.status === "PAID"
    ).length;

  const pendingInvoices =
    invoices.filter(
      (i) => i.status === "PENDING"
    ).length;


  const paidRevenue =
    invoices
      .filter((i) => i.status === "PAID")
      .reduce((sum, i) => sum + (i.amount || 0), 0);
  
  const pendingAmount =
    invoices
      .filter((i) => i.status === "PENDING")
      .reduce((sum, i) => sum + (i.amount || 0), 0);

  const averageInvoice =
    invoices.length > 0
      ? Math.round(
        invoices.reduce(
          (sum, i) => sum + (i.amount || 0),0
        ) / invoices.length
      ) : 0;

  const collectionRate =
    invoices.length > 0
      ? Math.round(
        (paidInvoices / invoices.length) * 100
      ) : 0;

  const overdueInvoices =
    invoices.filter(
      (invoice) =>
         invoice.status === "PENDING" &&
         new Date(invoice.dueDate) < new Date()
    ).length;
  
  const [showModal, setShowModal] =
     useState(false);

  const [projects, setProjects] =
     useState([]);

  const [formData, setFormData] =
     useState({
      amount: "",
      dueDate: "",
      notes: "",
      projectId: "",
    });
  
  const [search, setSearch] =
    useState("");
  
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [isDeleteOpen, setIsDeleteOpen] =
    useState(false);
  const [deleteInvoiceId, setDeleteInvoiceId] =
    useState(null);

  useEffect(() => {
    
    const fetchData = async () => {

      try{
        const invoiceData =
         await getInvoices();

        const projectData =
         await getProjects();

        setInvoices(invoiceData);
        setProjects(projectData);
      }catch(error){
        console.log(error);

        toast.error("Failed to load data");
      }
    };
    fetchData();
  }, []);

  const filteredInvoices =
    invoices.filter(
      (invoice) => {

       const matchesSearch =
        invoice.invoiceNumber
            .toLowerCase()
            .includes(search.toLowerCase()) ||

        (invoice.project?.title || "")
            .toLowerCase()
            .includes(search.toLowerCase());
       
      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : invoice.status === statusFilter;
    
    return(
      matchesSearch  &&
      matchesStatus
    );
});


return (
<DashboardLayout>
  
      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-900">
          Invoices
        </h1>

        <p className="text-gray-500 mt-2">
          Manage billing, payments and revenue
        </p>
      </div>

      <div className="flex gap-3 mb-6">
          
          <button onClick={() =>
              setShowModal(true)
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold">
              + Create Invoice
            </button>


          <button onClick={() =>
             exportToExcel(
              invoices.map(
                (invoice) => ({
                  InvoiceNo:invoice.invoiceNumber,
                  Project:invoice.project?.title,
                  Amount:invoice.amount,
                  Status:invoice.status,
                  DueDate:
                   new Date(
                    invoice.dueDate
                   ).toLocaleDateString(),
                })
              ),
              "Invoices"
             )}
             className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl flex items-center gap-2 shadow transition">
              <Download size={18} />
               Export
             </button>
        </div>

      {/*Statistics Cards*/}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all">

          <FileText className="text-blue-600 mb-3"/>
          <p className="text-gray-500 text-sm">
            Total Invoices
          </p>
          <h3 className="text-2xl font-bold">
             {invoices.length}
          </h3>
         </div>

         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all">

          <CheckCircle2 className="text-green-600 mb-3"/>
          <p className="text-gray-500 text-sm">
            Paid
          </p>

          <h3 className="text-2xl font-bold text-green-600">
            {paidInvoices}
          </h3>
         </div>

         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all">

          <Clock3 className="text-yellow-600 mb-3"/>
          <p className="text-gray-500 text-sm">
            Pending
          </p>
          <h3 className="text-2xl font-bold text-yellow-600">
            {pendingInvoices}
          </h3>
         </div>

         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all">

          <IndianRupee className="text-purple-600 mb-3"/>
          <p className="text-gray-500 text-sm">
            Revenue
          </p>
          <h3 className="text-3xl font-bold text-yellow-600">
            ₹{paidRevenue.toLocaleString()}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
             Total collected revenue
          </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
        
        {/* Average Invoice */}

        <div className="bg-blue-50 rounded-3xl p-6">

          <p className="text-gray-500">
            Average Invoice
          </p>

          <h3 className="text-3xl font-bold text-blue-600 mt-2">
            ₹{averageInvoice.toLocaleString()}
          </h3>

        </div>

        {/* Collection Rate */}

        <div className="bg-green-50 rounded-3xl p-6">

          <p className="text-gray-500">
            Collection Rate
          </p>

          <h3 className="text-3xl font-bold text-green-600 mt-2">
            {collectionRate}%
          </h3>

          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">

            <div className="bg-green-600 h-2 rounded-full"
               style={{
                width: `${collectionRate}%`,
               }} />
        </div>
        </div>
        
        {/* Pending Amount */}
        
        <div className="bg-yellow-50 rounded-3xl p-6">
          <p className="text-gray-500">
            Pending Amount
          </p>

          <h3 className="text-3xl font-bold text-purple-600 mt-2">
            ₹{pendingAmount.toLocaleString()}
          </h3>
        </div>

        {/* Overdue */}
        
       <div className="bg-indigo-50 rounded-3xl p-6">

        <p className="text-gray-500">
          Invoice Health
        </p>

        <h3 className="text-3xl font-bold text-indigo-600 mt-2">
          <span className={
            collectionRate >= 80
              ? "text-green-600"
              : collectionRate >= 50
              ? "text-yellow-600"
              : "text-red-600"
          }
          >
          {collectionRate >= 80
            ? "Excellent"
            : collectionRate >= 50
            ? "Good"
            : "Poor"}
          </span>
        </h3>
       </div>

        <div className="bg-red-50 rounded-3xl p-6">

          <p className="text-gray-500">
            Overdue Invoices
          </p>

          <h3 className="text-3xl font-bold text-red-600 mt-2">
            {overdueInvoices}
          </h3>
        </div>

      </div>

      <div className="bg-white rounded-2xl  shadow-md overflow-hidden">

      <div className="p-6 border-b border-gray-100">

        <div className="flex flex-col md:flex-row gap-4">

          {/* Search */}

          <div className="relative flex-1">

            <Search size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>

                <input type="text" placeholder="Search invoices..." 
                      value={search} onChange={(e) => 
                         setSearch(e.target.value)
                      }
                      className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>               
          </div>

          {/* Status Filter */}

          <select value={statusFilter}
                  onChange={(e) => 
                  setStatusFilter(e.target.value)
                  }
                className="border border-gray-200 rounded-2xl px-4 py-4 bg-white min-w-[180px]">

                 <option value="ALL">
                  All Invoices
                 </option> 
                 <option value="PAID">
                  Paid
                 </option>
                 <option value="PENDING">
                  Pending
                 </option>

                </select>
        </div>
      </div>
        
        <div className="hidden md:block overflow-x-auto">
           <table className="w-full min-w-[700px]">

          <thead>

            <tr className="bg-slate-50 border-b">

              <th className="p-3 text-left">
                Invoice No
              </th>

              <th className="p-3 text-left">
                Project
              </th>

              <th className="p-3 text-left">
                Amount
              </th>

              <th className="p-3 text-left">
                Status
              </th>

              <th className="p-3 text-left">
                Due Date
              </th>

              <th className="p-3 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>
            
            {filteredInvoices.length === 0 ? (

              <tr>
                <td colSpan="6"
                    className="text-center p-6 text-gray-500">
                  
                  <p className="text-gray-500">
                    <div className="py-16 text-center">
                      <FileText size={50}
                      className="mx-auto text-gray-300 mb-4"/>

                      <h3 className="text-xl font-bold">
                        No Invoices Yet
                      </h3>

                      <p className="text-gray-500 mt-2">
                        Generate invoices and manage payments here.
                      </p>
                    </div>
                  </p>
                </td>
              </tr>
            ) : (

            filteredInvoices.map(
              (invoice) => (

              <tr
                key={invoice.id}
                className="border-b hover:bg-slate-50 transition"
              >

                <td className="p-3">
                  {invoice.invoiceNumber}
                </td>

                <td className="p-3">
                  {invoice.project?.title || "No Project"}
                </td>

                <td className="p-3 font-medium">
                  ₹{(invoice.amount || 0).toLocaleString()}
                </td>

                <td className="p-3">

                  <span
                    className={`
                      px-4
                      py-2
                      rounded-full
                      text-xs
                      font-semibold
                      inline-flex
                      items-center
                      gap-1

                      ${
                      invoice.status === "PAID"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                    }
                    `}
                  >
                    {invoice.status === "PAID"
                      ? "✅ PAID"
                      : "⏳ PENDING"}

                  </span>

                </td>

                <td className="p-3">
                  {
                    new Date(
                      invoice.dueDate
                    ).toLocaleDateString()
                  }
                </td>

                <td className="p-3">

                  <div className="flex flex-wrap gap-2">

                    <button
                      onClick={async () => {

                        const newStatus =
                          invoice.status ===
                          "PAID"
                            ? "PENDING"
                            : "PAID";
     
                      try {
                        await updateInvoice(invoice.id,{
                          status: newStatus,
                        });
                        fetchInvoices();
                        toast.success("Status updated");
                      } catch(error){
                        toast.error("Failed to update status");
                      }  

                    

                      }}
                      title="Toggle Status"
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-xl hover:scale-110 transition"
                    >
                      <CheckCircle2 size={16} />
                    </button>
                    
                    <button
                      onClick={async () => {

                        try {
                          const pdfBlob =
                            await downloadInvoicePDF(
                              invoice.id
                            );

                        const url =
                          window.URL.createObjectURL(
                            pdfBlob
                          );

                        const link =
                          document.createElement("a");

                        link.href = url;

                        link.download = 
                          `Invoice-${invoice.invoiceNumber}.pdf`;

                        document.body.appendChild(link);

                        link.click();

                        link.remove();

                        window.URL.revokeObjectURL(url);

                        } catch (error) {

                          console.log(error);

                          toast.error(
                            "Failed to download PDF"
                          );

                        }
                        }}
                        title="Download PDF"
                        className="bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-xl hover:scale-110 transition"
                        >
                        <Download size={16} />
                    </button>

                    <button
                      onClick={async () => {

                        try {

                          await sendInvoiceEmail(
                            invoice.id
                            );

                            toast.success(
                                "Email sent successfully"
                            );

                        fetchInvoices();

                        } catch (error) {

                          console.log(error);

                            toast.error(
                                "Failed to send email"
                            );

                        }

                        }}
                        title="Send Email"
                        className="bg-purple-500 hover:bg-purple-600 text-white p-2.5 rounded-xl hover:scale-110 transition"
                        >
                        <Mail size={16} />
                    </button>

                    <button onClick={() => {
                      
                        setDeleteInvoiceId(invoice.id);
                        setIsDeleteOpen(true);
                    }}
                    title="Delete Invoice"
                    className="bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-xl hover:scale-110 transition"
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
      <div className="md:hidden space-y-4">

          {filteredInvoices.length === 0 ? (

            <div className="bg-white rounded-2xl shadow-md p-6 text-center text-gray-500">
              <div className="py-10 text-center">
                <FileText size={50} className="mx-auto text-gray-300 mb-4"/>
                <p className="text-gray-500">
                  No invoices match your search
                </p>
              </div>
            </div>

          ) : (

            filteredInvoices.map(
              (invoice) => (

                <div key={invoice.id}
                  className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition">

                {/* Invoice Number */}

                <div className="flex justify-between items-start">

                <div>
                  <h3 className="font-bold text-lg">
                     {invoice.invoiceNumber}
                  </h3>
                  <p className="text-gray-500 text-sm">
                     {invoice.project?.title || "No Project"}
                  </p>
                </div>

                <span className={`px-4 py-2 rounded-full text-xs font-semibold
                    ${
                      invoice.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                     }
                    `}
                    >
                      {
                       invoice.status === "PAID"
                         ? "✅ PAID"
                         : "⏳ PENDING"
                      }
                </span>
              </div>  

              {/* Amount */}

              <div className="mt-4">

                <p className="text-gray-500 text-sm">
                  Amount
                </p>
                <h4 className="text-2xl font-bold">
                   ₹{(invoice.amount || 0).toLocaleString()}
                </h4>
              </div>

              {/* Due Date */}

              <div className="mt-3">

               <p className="text-gray-500 text-sm">
                Due Date
               </p>
               <p className="font-medium">
                {
                  new Date(
                    invoice.dueDate
                  ).toLocaleDateString()
                }
               </p>
            </div>

              {/* Actions */}
               
               <div className="grid grid-cols-2 gap-2 mt-5">

                <button onClick={async () => {

                  const newStatus =
                    invoice.status === "PAID"
                     ? "PENDING"
                     : "PAID";
                  
                  try {
                        await updateInvoice(invoice.id,{
                          status: newStatus,
                        });
                        fetchInvoices();
                        toast.success("Status updated");
                      } catch(error){
                        toast.error("Failed to update status");
                      }  
                }}
              className="bg-blue-500 text-white p-2.5 rounded-lg transition">
                Status
              </button>
              <button onClick={async () => {

                try {
                  const pdfBlob =
                   await downloadInvoicePDF(
                    invoice.id
                   );
                  const url =
                   window.URL.createObjectURL(
                    pdfBlob
                   );
                  const link =
                    document.createElement("a");
                  
                  link.href = url;
                  link.download =
                   `Invoice-${invoice.invoiceNumber}.pdf`;

                  document.body.appendChild(
                    link
                  );

                  link.click();
                  link.remove();

                  window.URL.revokeObjectURL(
                    url
                  );
                } catch(error){
                  toast.error(
                    "Failed to download PDF"
                  );
                }
              }}
              className="bg-green-500 text-white py-2 rounded-lg">
                PDF
              </button>

              <button onClick={async () => {

                try{
                  await sendInvoiceEmail(
                    invoice.id
                  );
                  toast.success(
                    "Email sent Successfully"
                  );
                } catch(error){
                  toast.error(
                    "failed to send email"
                  );
                }
              }}
              className="bg-purple-500 text-white py-2 rounded-lg">
                Email
              </button>

              <button onClick={() =>{
                setDeleteInvoiceId(
                  invoice.id
                );
                setIsDeleteOpen(true);
          
              }}
              className="bg-red-500 text-white py-2 rounded-lg">
                Delete
              </button>
        </div>
        </div>
              ))
          )}
      </div>
      </div>
      
    <div className="mt-8 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

      <h2 className="text-xl font-bold mb-4">
        Invoice Summary
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        <div>
          <p className="text-gray-500">
            Paid Revenue
          </p>

          <h3 className="text-2xl font-bold text-green-600">
            ₹{paidRevenue.toLocaleString()}
          </h3>
        </div>

        <div>
          <p className="text-gray-500">
            Pending Amount
          </p>

          <h3 className="text-2xl font-bold text-yellow-600">
            ₹{pendingAmount.toLocaleString()}
          </h3>
        </div>

        <div>
          <p className="text-gray-500">
            Collection Rate
          </p>

          <h3 className="text-2xl font-bold text-blue-600">
            {collectionRate}%
          </h3>
        </div>
      </div>
    </div>
    
    {
      showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl">

            <h2 className="text-2xl font-bold mb-5">
              Create Invoice
            </h2>

            <input type="number" placeholder="Amount"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount:
                       e.target.value,
                    })
                  }
                  className="w-full border rounded-xl p-3 mb-4"/>

            <select value={formData.projectId}
                  onChange={(e) =>
                    setFormData({
                       ...formData,
                       projectId:
                         e.target.value,
                    })
                  }
                  className="w-full border rounded-xl p-3 mb-4">
                  
                  <option value="">
                    Select Project
                  </option>

                  {projects.map(
                    (project) => (
                      <option key={project.id}
                              value={project.id}
                      >
                        {project.title}
                      </option>
                    )
                  )}
             </select>

          <input type="date"
                 value={formData.dueDate}
                 onChange={(e) =>
                   setFormData({
                     ...formData,
                     dueDate: e.target.value,
                   })
                 }
                 className="w-full border rounded-xl p-3 mb-4"/>

          <textarea placeholder="Notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    notes: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3 mb-4"/>
          
          <div className="flex gap-3">

            <button onClick={async () => {

              try{
                await createInvoice({
                  ...formData,
                  amount: Number(formData.amount),
                });

                toast.success("Invoice created successfully");

                setShowModal(false);
                setFormData({
                  amount: "",
                  dueDate: "",
                  notes: "",
                  projectId: "",
                });

                fetchInvoices();
              }catch (error){

                console.log(error);

                toast.error("Failed to create invoice");
              }
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold">
              Create Invoice
            </button>

          <button onClick={() =>
             setShowModal(false)
            }
            className="flex-1 bg-gray-100 hover:bg-gray-200 py-3 rounded-xl font-semibold">
              Cancel
            </button>
          </div>
          </div>
        </div>
      )
    }

    <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice?"
        onConfirm={async () => {
            try {
                await deleteInvoice(deleteInvoiceId);
                toast.success(
                    "Invoice deleted successfully"
                );
                fetchInvoices();
                setIsDeleteOpen(false);
            } catch (error) {
                console.log(error);
                toast.error(
                    "Failed to delete invoice"
                );
            }
        }}
      />
    </DashboardLayout>
  );
}