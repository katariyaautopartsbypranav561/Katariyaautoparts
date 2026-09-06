async function testOrder() {
  const orderData = {
    visitorId: 'test-visitor',
    customerName: 'Pranav Gugale',
    customerEmail: 'pranavgugale561@gmail.com',
    customerPhone: '9876543210',
    customerAddress: '123 Test Street, Pune, Maharashtra',
    items: [
      { name: 'Amala Syrup', selectedWeight: '500ml', quantity: 2, price: 150 }
    ],
    total: 300,
    paymentMethod: 'COD',
    notes: 'Test order from script'
  };

  try {
    console.log("Sending test order to https://fortunefoodz.vercel.app/api/orders...");
    const response = await fetch('https://fortunefoodz.vercel.app/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
    }
    const data = await response.json();
    console.log("Order placed successfully!");
    console.log("Order ID:", data.id);
  } catch (error) {
    console.error("Failed to place order:", error);
  }
}

testOrder();
