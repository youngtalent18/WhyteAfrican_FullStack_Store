import { sendEmail } from "../utils/sendMail.js";

export const sendOrderEmailToAdmin = async (order, user) => {
  if (!process.env.EMAIL_USER) {
    throw new Error("EMAIL_USER is not configured");
  }

  return sendEmail({
    to: process.env.EMAIL_USER,
    subject: `🔥 New Order - ${order.paymentReference}`,
    html: `
    <div style="font-family:Arial;padding:20px;">
      <h2>New Order Received</h2>

      <p><strong>Customer:</strong> ${user.name} (${user.email})</p>
      <p><strong>Total:</strong> GHC ${order.total}</p>
      <p><strong>Reference:</strong> ${order.paymentReference}</p>
      <p><strong>Phone:</strong> ${order.phone}</p>
      <p><strong>Address:</strong> ${order.address}</p>

      <h3>Items</h3>
      <ul>
        ${
          order.items
            .map((i) => {
              const image = i.image || "https://via.placeholder.com/50";
              const name = i.name || "Product";

              return `
                <li style="list-style:none; display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                  <img 
                    src="${image}" 
                    alt="${name}" 
                    style="width:50px;height:50px;border-radius:6px;object-fit:cover;margin-right:5px"
                  />
                  <span>${name} x ${i.quantity}</span>
                </li>
              `;
            })
            .join("")
        }
      </ul>
    </div>`,
  });
};

export const sendOrderEmailToUser = async (order, user) => {
  return sendEmail({
    to: user.email,
    subject: `🧾 Order Confirmation - ${order.paymentReference}`,
    html: `
    <div style="background:#f6f6f6;padding:20px;font-family:Arial,sans-serif;">

      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;">

        <!-- HEADER -->
        <div style="background:#111827;color:#ffffff;padding:20px;text-align:center;">
          <h1 style="margin:0;font-size:20px;">WhyteAfrican Shop</h1>
          <p style="margin:5px 0 0;font-size:13px;color:#cbd5e1;">
            Order Confirmation
          </p>
        </div>

        <!-- BODY -->
        <div style="padding:20px;color:#111827;">

          <p style="font-size:14px;">Hi <strong>${user.name}</strong>,</p>

          <p style="font-size:14px;color:#374151;">
            Thank you for your order. We’ve received your payment successfully.
          </p>

          <!-- ORDER INFO -->
          <div style="margin:15px 0;padding:10px;background:#f3f4f6;border-radius:8px;font-size:13px;">
            <p><strong>Order Reference:</strong> ${order.paymentReference}</p>
            <p><strong>Status:</strong> Paid</p>
            <p><strong>Total:</strong> GHC ${order.total}</p>
            <p><strong>Phone:</strong> ${order.phone}</p>
            <p><strong>Address:</strong> ${order.address}</p>
          </div>

          <!-- ITEMS -->
          <h3 style="font-size:15px;margin-top:20px;">Order Items</h3>

          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;border-collapse:collapse;">
            <thead>
              <tr style="text-align:left;border-bottom:1px solid #e5e7eb;">
                <th style="padding:8px 0;">Product</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              ${order.items
                .map((i) => {
                  const image = i.image || "https://via.placeholder.com/50";
                  const name = i.name || "Product";

                  return `
                    <tr style="border-bottom:1px solid #f1f1f1;">
                      <td style="padding:10px 0; display:flex; align-items:center; gap:10px;">
                        
                        <img 
                          src="${image}" 
                          alt="${name}" 
                          style="width:50px;height:50px;border-radius:8px;object-fit:cover;"
                        />

                        <div>
                          <div style="font-weight:600;">${name}</div>
                          ${i.size ? `<div style="font-size:12px;color:#777;">Size: ${i.size}</div>` : ""}
                        </div>

                      </td>

                      <td style="text-align:center;">
                        ${i.quantity}
                      </td>

                      <td style="text-align:right;font-weight:600;">
                        GHC ${(i.price * i.quantity).toFixed(2)}
                      </td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>

          <!-- TOTAL -->
          <div style="margin-top:20px;text-align:right;font-size:14px;">
            <p><strong>Total:</strong> GHC ${order.total}</p>
          </div>

        </div>

        <!-- FOOTER -->
        <div style="background:#f9fafb;padding:15px;text-align:center;font-size:12px;color:#6b7280;">
          © ${new Date().getFullYear()} WhyteAfrican Shop
        </div>

      </div>
    </div>
    `,
  });
};
