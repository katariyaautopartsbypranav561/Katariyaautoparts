// Mock for Razorpay SDK used in payment route tests
const Razorpay = jest.fn().mockImplementation(() => ({
  orders: {
    create: jest.fn().mockResolvedValue({
      id: 'order_mock_123abc',
      amount: 50000,
      currency: 'INR',
      status: 'created',
      receipt: 'receipt_test'
    })
  }
}));

module.exports = Razorpay;
