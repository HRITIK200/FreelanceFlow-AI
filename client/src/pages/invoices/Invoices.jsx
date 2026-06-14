import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  getInvoices,
  updateInvoice,
  deleteInvoice,
} from "../../api/invoiceApi";

import { 
    downloadInvoicePDF,
 } from "../../api/pdfApi";
import {
    sendInvoiceEmail,
} from "../../api/emailApi";

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
    
  const [search, setSearch] =
    useState("");

  const [isDeleteOpen, setIsDeleteOpen] =
    useState(false);
  const [deleteInvoiceId, setDeleteInvoiceId] =
    useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filteredInvoices =
    invoices.filter(
      (invoice) =>
        invoice.invoiceNumber
            .toLowerCase()
            .includes(search.toLowerCase()) ||
        (invoice.project?.title || "")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

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
         <div className="bg-white rounded-2xl shadow-md p-5">

          <FileText className="text-blue-600 mb-3"/>
          <p className="text-gray-500 text-sm">
            Total Invoices
          </p>
          <h3 className="text-2xl font-bold">
             {invoices.length}
          </h3>
         </div>

         <div className="bg-white rounded-2xl shadow-md p-5">

          <CheckCircle2 className="text-green-600 mb-3"/>
          <p className="text-gray-500 text-sm">
            Paid
          </p>

          <h3 className="text-2xl font-bold text-green-600">
            {paidInvoices}
          </h3>
         </div>

         <div className="bg-white rounded-2xl shadow-md p-5">

          <Clock3 className="text-yellow-600 mb-3"/>
          <p className="text-gray-500 text-sm">
            Pending
          </p>
          <h3 className="text-2xl font-bold text-yellow-600">
            {pendingInvoices}
          </h3>
         </div>

         <div className="bg-white rounded-2xl shadow-md p-5">

          <IndianRupee className="text-purple-600 mb-3"/>
          <p className="text-gray-500 text-sm">
            Revenue
          </p>
          <h3 className="text-2xl font-bold text-purple-600">
            ₹{paidRevenue.toLocaleString()}
          </h3>
         </div>
      </div>

      <div className="bg-white rounded-2xl  shadow-md overflow-hidden">

        <div className="p-4 border-b">
            <div className="relative">

              <Search size={18}
                 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                   <input type="text"
                      placeholder="Search invoices..."
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      className="w-full border rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            
            </div>
        </div>
        
        <div className="hidden md:block overflow-x-auto">
           <table className="w-full min-w-[900px]">

          <thead>

            <tr className="border-b">

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
                  No invoices found
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
                      px-3
                      py-1
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
                      ? "🟢 PAID"
                      : "🟡 PENDING"}

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
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-lg transition"
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
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition"
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
                        className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg transition"
                        >
                        <Mail size={16} />
                    </button>

                    <button onClick={() => {
                      
                        setDeleteInvoiceId(invoice.id);
                        setIsDeleteOpen(true);
                    }}
                    title="Delete Invoice"
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
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
              No invoices found
            </div>

          ) : (

            filteredInvoices.map(
              (invoice) => (

                <div key={invoice.id}
                  className="bg-white rounded-2xl shadow-md p-5">

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

                <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      invoice.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                     }
                    `}
                    >
                      {
                       invoice.status === "PAID"
                         ? "🟢 PAID"
                         : "🟡 PENDING"
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
                    "Failed to downlaod pdf"
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