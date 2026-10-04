import nodemailer from "nodemailer";

export interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  shippingAddress?: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
}

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

export async function sendOrderConfirmationToAdmin(data: OrderEmailData) {
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim()).filter(Boolean);
  if (!adminEmails.length || !process.env.GMAIL_USER) return;

  const transporter = createTransporter();

  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #f0ebe7;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #f0ebe7; text-align:center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #f0ebe7; text-align:right;">₹${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #f0ebe7; text-align:right;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join("");

  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1c1917; background: #fff;">
      <div style="background: #3d2b1f; padding: 32px; text-align: center;">
        <h1 style="color: #fdf8f6; font-size: 24px; margin: 0; letter-spacing: 2px;">LEZARI JEWELS</h1>
        <p style="color: #d2bab0; font-size: 12px; letter-spacing: 4px; margin: 8px 0 0; text-transform: uppercase;">New Order Received</p>
      </div>
      
      <div style="padding: 32px; background: #fdf8f6; border-bottom: 3px solid #a37c6b;">
        <h2 style="margin: 0; font-size: 20px; color: #3d2b1f;">Order #${data.orderId.slice(-8).toUpperCase()}</h2>
        <p style="color: #78716c; margin: 8px 0 0; font-family: sans-serif; font-size: 14px;">
          Placed on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div style="padding: 32px;">
        <h3 style="font-size: 14px; letter-spacing: 2px; text-transform: uppercase; color: #78716c; margin: 0 0 16px; font-family: sans-serif;">Customer Details</h3>
        <table style="width: 100%; font-family: sans-serif; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #78716c; width: 120px;">Name:</td>
            <td style="padding: 6px 0; color: #1c1917; font-weight: 600;">${data.customerName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #78716c;">Email:</td>
            <td style="padding: 6px 0; color: #1c1917;">${data.customerEmail}</td>
          </tr>
          ${data.shippingAddress ? `
          <tr>
            <td style="padding: 6px 0; color: #78716c;">Address:</td>
            <td style="padding: 6px 0; color: #1c1917;">${data.shippingAddress.line1}, ${data.shippingAddress.city}, ${data.shippingAddress.state} – ${data.shippingAddress.pincode}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #78716c;">Phone:</td>
            <td style="padding: 6px 0; color: #1c1917;">${data.shippingAddress.phone}</td>
          </tr>
          ` : ''}
        </table>

        <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 24px 0;" />

        <h3 style="font-size: 14px; letter-spacing: 2px; text-transform: uppercase; color: #78716c; margin: 0 0 16px; font-family: sans-serif;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 14px;">
          <thead>
            <tr style="background: #f5f5f4;">
              <th style="padding: 10px; text-align: left; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #78716c;">Product</th>
              <th style="padding: 10px; text-align: center; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #78716c;">Qty</th>
              <th style="padding: 10px; text-align: right; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #78716c;">Price</th>
              <th style="padding: 10px; text-align: right; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #78716c;">Subtotal</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <div style="margin-top: 24px; background: #3d2b1f; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #d2bab0; font-family: sans-serif; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">Total Amount</span>
          <span style="color: #fff; font-size: 22px; font-family: Georgia, serif;">₹${data.total.toFixed(2)}</span>
        </div>
      </div>

      <div style="padding: 24px; text-align: center; background: #fdf8f6; border-top: 1px solid #e7e5e4;">
        <p style="color: #78716c; font-family: sans-serif; font-size: 12px; margin: 0;">
          This is an automated notification from Lezari Jewels Admin System.
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Lezari Jewels" <${process.env.GMAIL_USER}>`,
    to: adminEmails.join(", "),
    subject: `🛍 New Order #${data.orderId.slice(-8).toUpperCase()} from ${data.customerName}`,
    html,
  });
}

export async function sendOrderConfirmationToCustomer(data: OrderEmailData) {
  if (!process.env.GMAIL_USER) return;
  const transporter = createTransporter();

  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #f0ebe7;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #f0ebe7; text-align:center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #f0ebe7; text-align:right;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join("");

  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1c1917; background: #fff;">
      <div style="background: #3d2b1f; padding: 32px; text-align: center;">
        <h1 style="color: #fdf8f6; font-size: 24px; margin: 0; letter-spacing: 2px;">LEZARI JEWELS</h1>
        <p style="color: #d2bab0; font-size: 12px; letter-spacing: 4px; margin: 8px 0 0; text-transform: uppercase;">Order Confirmed</p>
      </div>

      <div style="padding: 32px;">
        <p style="font-family: sans-serif; color: #1c1917; font-size: 15px;">Dear ${data.customerName},</p>
        <p style="font-family: sans-serif; color: #78716c; font-size: 14px; line-height: 1.6;">
          Thank you for your order! We've received it and will process it shortly. 
          Your jewellery is on its way to making you shine ✨
        </p>

        <div style="background: #fdf8f6; border: 1px solid #eaddd7; padding: 20px; margin: 24px 0;">
          <p style="margin: 0; font-family: sans-serif; font-size: 13px; color: #78716c;">Order Reference</p>
          <p style="margin: 8px 0 0; font-family: sans-serif; font-size: 20px; font-weight: 700; color: #3d2b1f; letter-spacing: 2px;">
            #${data.orderId.slice(-8).toUpperCase()}
          </p>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 14px;">
          <thead>
            <tr style="background: #f5f5f4;">
              <th style="padding: 10px; text-align: left; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #78716c;">Item</th>
              <th style="padding: 10px; text-align: center; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #78716c;">Qty</th>
              <th style="padding: 10px; text-align: right; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #78716c;">Total</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <div style="margin-top: 16px; text-align: right; border-top: 2px solid #3d2b1f; padding-top: 16px;">
          <span style="font-family: sans-serif; font-size: 13px; color: #78716c; margin-right: 16px;">Order Total</span>
          <span style="font-size: 22px; color: #3d2b1f;">₹${data.total.toFixed(2)}</span>
        </div>
      </div>

      <div style="padding: 24px 32px; background: #3d2b1f; text-align: center;">
        <p style="color: #d2bab0; font-family: sans-serif; font-size: 12px; margin: 0 0 8px;">
          Questions? We're here to help.
        </p>
        <a href="mailto:hello@lezarijewels.com" style="color: #fdf8f6; font-family: sans-serif; font-size: 12px;">hello@lezarijewels.com</a>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Lezari Jewels" <${process.env.GMAIL_USER}>`,
    to: data.customerEmail,
    subject: `Your Lezari Jewels order #${data.orderId.slice(-8).toUpperCase()} is confirmed! ✨`,
    html,
  });
}
