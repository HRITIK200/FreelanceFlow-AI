import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export const sendInvoiceEmail =
  async ({
    to,
    subject,
    html,
  }) => {

    const response =
      await resend.emails.send({
        from:
          "onboarding@resend.dev",

        to,

        subject,

        html,
      });

    return response;
};