const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow guest checkout
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    title: String,
    price: Number,
    quantity: Number,
    selectedSize: String,
    selectedLength: String,
    selectedColor: String,
    image: String
  }],
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    apartment: String,
    city: { type: String, required: true },
    postcode: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, default: 'United Kingdom' }
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'credit-card', 'paypal', 'clearpay', 'klarna'],
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  dispatchInfo: {
    partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPartner', default: null },
    partnerName: { type: String, default: '' },
    partnerCode: { type: String, default: '' },
    trackingNumber: { type: String, default: '' },
    trackingUrl: { type: String, default: '' },
    dispatchedAt: { type: Date, default: null },
    notes: { type: String, default: '' }
  }
}, { timestamps: true });

// Pre-save hook to generate order number
orderSchema.pre('save', async function() {
  if (!this.orderNumber) {
    const date = new Date();
    const prefix = 'AAB' + date.getFullYear().toString().slice(-2) + (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await this.constructor.countDocuments();
    this.orderNumber = `${prefix}-${(count + 1001).toString()}`;
  }
});

module.exports = mongoose.model('Order', orderSchema);
