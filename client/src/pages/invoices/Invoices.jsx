import { useEffect, useState } from "react";

import DashboardLayout
from "../../components/layout/DashboardLayout";

import {
  getInvoices,
  updateInvoice,
  deleteInvoice,
} from "../../api/invoiceApi";

export default function Invoices() {

  const [invoices, setInvoices] =
    useState([]);

  const fetchInvoices =
    async () => {

      const data =
        await getInvoices();

      setInvoices(data);
    };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Invoices
      </h1>

      <div className="bg-white rounded shadow">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="p-3">
                Invoice No
              </th>

              <th className="p-3">
                Project
              </th>

              <th className="p-3">
                Amount
              </th>

              <th className="p-3">
                Status
              </th>

              <th className="p-3">
                Due Date
              </th>

              <th className="p-3">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {invoices.map(
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
                      ? "text-green-600 font-bold"
                      : "text-orange-500 font-bold"
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

                  <div className="flex gap-2">

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

                        const confirmDelete =
                          window.confirm(
                            "Delete Invoice?"
                          );

                        if (!confirmDelete)
                          return;

                        await deleteInvoice(
                          invoice.id
                        );

                        fetchInvoices();

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