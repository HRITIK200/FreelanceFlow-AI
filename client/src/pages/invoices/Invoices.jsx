import { useEffect, useState } from "react";

import DashboardLayout
from "../../components/layout/DashboardLayout";

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

import { toast } from "react-hot-toast";
import ConfirmModal from "../../components/ui/ConfirmModal";

export default function Invoices() {

  const [invoices, setInvoices] =
    useState([]);

  const fetchInvoices =
    async () => {

      const data =
        await getInvoices();

      setInvoices(data);
    };

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
        invoice.project?.title
            .toLowerCase()
            .includes(search.toLowerCase())
    );

  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Invoices
      </h1>

      <div className="bg-white rounded shadow">

        <div className="mb-4">
          <input 
            type="text"
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>
        
        <div className="overflow-x-auto">
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
                className="border-b"
              >

                <td className="p-3">
                  {invoice.invoiceNumber}
                </td>

                <td className="p-3">
                  {invoice.project?.title}
                </td>

                <td className="p-3">
                  ₹{invoice.amount}
                </td>

                <td className="p-3">

                  <span
                    className={
                      invoice.status === "PAID"
                      ? "bg-green-100 text-green-700 px-3 py-1 rounded-full"
                      : "bg-orange-100 text-orange-700 px-3 py-1 rounded-full"
                    }
                  >
                    {invoice.status}
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

                        await updateInvoice(
                          invoice.id,
                          {
                            status:
                              newStatus,
                          }
                        );

                        fetchInvoices();

                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Toggle Status
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
                        className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                        Download PDF
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
                        className="bg-purple-500 text-white px-3 py-1 rounded"
                        >
                        Email
                    </button>

                    <button onClick={() => {
                        setDeleteInvoiceId(invoice.id);
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