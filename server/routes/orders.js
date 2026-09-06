const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { sendEmail } = require('../utils/email');

// GET all orders (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// POST create new order (storefront checkout)
router.post('/', async (req, res) => {
  try {
    const {
      visitorId, customerName, customerPhone, customerAddress, customerEmail, userEmail,
      items, total, paymentMethod, razorpayOrderId,
      razorpayPaymentId, notes
    } = req.body;

    if (!customerName || !customerPhone || !customerAddress || !items || !total || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const emailToUse = customerEmail || userEmail || null;

    const order = await prisma.order.create({
      data: {
        visitorId: visitorId && visitorId !== 'anonymous' ? visitorId : null,
        customerName,
        customerEmail: emailToUse,
        customerPhone,
        customerAddress,
        items: typeof items === 'string' ? items : JSON.stringify(items),
        total: parseFloat(total),
        paymentMethod,
        paymentStatus: paymentMethod === 'ONLINE' && razorpayPaymentId ? 'PAID' : 'PENDING',
        status: 'PENDING',
        razorpayOrderId: razorpayOrderId || null,
        razorpayPaymentId: razorpayPaymentId || null,
        notes: notes || null
      }
    });

    // If visitorId is provided, update the visitor profile with their actual name & phone
    if (visitorId && visitorId !== 'anonymous') {
      await prisma.visitor.updateMany({
        where: { visitorId },
        data: {
          name: customerName,
          phone: customerPhone
        }
      }).catch(e => console.error("Error linking visitor to order:", e.message));
    }

    // Send Order Alert Email to Admin
    try {
      const adminEmail = process.env.EMAIL_USER || 'pranavgugale561@gmail.com';
      const itemsList = typeof items === 'string' ? JSON.parse(items) : items;

      const itemsHtml = itemsList.map(function(item) {
        const subtotal = item.quantity * item.price;
        return '<li>' + item.name + ' (' + (item.selectedWeight || 'Standard') + ') - ' + item.quantity + ' x Rs.' + item.price + ' = Rs.' + subtotal + '</li>';
      }).join('');

      const adminHtml = '<h2>New Order Received!</h2>'
        + '<p><strong>Order ID:</strong> #' + order.id + '</p>'
        + '<p><strong>Customer Name:</strong> ' + customerName + '</p>'
        + '<p><strong>Phone:</strong> ' + customerPhone + '</p>'
        + (customerEmail ? '<p><strong>Email:</strong> ' + customerEmail + '</p>' : '')
        + '<p><strong>Address:</strong> ' + customerAddress + '</p>'
        + '<p><strong>Payment Method:</strong> ' + paymentMethod + ' (' + order.paymentStatus + ')</p>'
        + '<p><strong>Total Amount:</strong> Rs.' + total + '</p>'
        + '<h3>Order Items:</h3>'
        + '<ul>' + itemsHtml + '</ul>'
        + '<br/>'
        + '<p><a href="https://fortunefoodz.vercel.app/admin" style="padding:10px 15px;background:#d97706;color:#fff;text-decoration:none;border-radius:5px;">View in Admin Panel</a></p>';

      await sendEmail({
        to: adminEmail,
        subject: 'New Order #' + order.id + ' from ' + customerName + ' - Rs.' + total,
        text: 'New Order #' + order.id + ' from ' + customerName + '. Total: Rs.' + total,
        html: adminHtml
      });
      console.log('Order alert email sent to admin.');

      // Send Order Confirmation to Customer
      if (customerEmail) {
        const invoiceDate = new Date().toLocaleDateString('en-IN');
        
        const tableItemsHtml = itemsList.map(function(item) {
          const subtotal = item.quantity * item.price;
          return '<tr style="border-bottom: 1px solid #eee;">' +
                 '<td style="padding: 10px; color: #555;">' + item.name + '<br/><small style="color: #888;">Variant: ' + (item.selectedWeight || 'Standard') + '</small></td>' +
                 '<td style="padding: 10px; text-align: center; color: #555;">' + item.quantity + '</td>' +
                 '<td style="padding: 10px; text-align: right; color: #555;">Rs. ' + subtotal + '</td>' +
                 '</tr>';
        }).join('');

        const customerHtml = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">'
          + '<div style="background-color: #d97706; padding: 20px; text-align: center; color: white;">'
          + '<h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">katariya auto parts</h1>'
          + '<p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Taste of Goodness</p>'
          + '</div>'
          + '<div style="padding: 30px 20px;">'
          + '<h2 style="color: #333; margin-top: 0; font-size: 20px; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">Order Confirmation</h2>'
          + '<p style="color: #555; font-size: 15px; line-height: 1.5;">Hi <strong>' + customerName + '</strong>,</p>'
          + '<p style="color: #555; font-size: 15px; line-height: 1.5;">Thank you for your order! We are currently processing it. Below is your official invoice.</p>'
          + '<table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 25px; margin-bottom: 25px; font-size: 14px;">'
          + '<tr>'
          + '<td width="50%" valign="top" style="color: #555; line-height: 1.6;">'
          + '<h4 style="margin: 0 0 5px 0; color: #333;">Order Details:</h4>'
          + '<strong>Order ID:</strong> #' + order.id + '<br/>'
          + '<strong>Date:</strong> ' + invoiceDate + '<br/>'
          + '<strong>Payment:</strong> ' + paymentMethod + ' (' + order.paymentStatus + ')'
          + '</td>'
          + '<td width="50%" valign="top" style="color: #555; line-height: 1.6;">'
          + '<h4 style="margin: 0 0 5px 0; color: #333;">Billed To:</h4>'
          + customerName + '<br/>'
          + customerAddress + '<br/>'
          + customerPhone
          + '</td>'
          + '</tr>'
          + '</table>'
          + '<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-size: 14px; margin-bottom: 25px;">'
          + '<thead>'
          + '<tr style="background-color: #f8f9fa; border-bottom: 2px solid #ddd; text-align: left;">'
          + '<th style="padding: 10px; color: #333;">Item</th>'
          + '<th style="padding: 10px; color: #333; text-align: center;">Qty</th>'
          + '<th style="padding: 10px; color: #333; text-align: right;">Price</th>'
          + '</tr>'
          + '</thead>'
          + '<tbody>'
          + tableItemsHtml
          + '</tbody>'
          + '<tfoot>'
          + '<tr>'
          + '<td colspan="2" style="text-align: right; font-weight: bold; padding: 15px 10px 0 0; border-top: 1px solid #ddd; color: #333;">Total Amount:</td>'
          + '<td style="text-align: right; font-weight: bold; padding: 15px 10px 0 10px; border-top: 1px solid #ddd; font-size: 16px; color: #d97706;">Rs. ' + total + '</td>'
          + '</tr>'
          + '</tfoot>'
          + '</table>'
          + '<p style="text-align: center; color: #777; font-size: 14px; margin-top: 30px;">We will notify you as soon as your order ships.</p>'
          + '</div>'
          + '<div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e0e0e0;">'
          + '<p style="margin: 0 0 5px 0;"><strong>Katariya Auto Parts</strong></p>'
          + '<p style="margin: 0 0 5px 0;">Email: fortunefood273@gmail.com</p>'
          + '<p style="margin: 0;"><a href="https://fortunefoodz.vercel.app" style="color: #d97706; text-decoration: none;">www.fortunefoodz.vercel.app</a></p>'
          + '</div>'
          + '</div>';

        await sendEmail({
          to: customerEmail,
          subject: 'Order Confirmation #' + order.id + ' - Katariya Auto Parts',
          text: 'Thank you for your order #' + order.id + '. Total: Rs.' + total,
          html: customerHtml
        });
        console.log('Order confirmation email sent to customer.');
      }
    } catch (emailErr) {
      console.error('Failed to send order emails:', emailErr);
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// PUT update order status (admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, notes } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (notes !== undefined) updateData.notes = notes;

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: updateData
    });
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// DELETE order (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.order.delete({ where: { id: parseInt(id) } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

module.exports = router;
