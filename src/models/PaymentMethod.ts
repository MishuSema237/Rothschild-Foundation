import mongoose, { Schema, model, models } from 'mongoose';

const PaymentMethodSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    details: { type: String }, // e.g. Wallet address or Bank account
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

const PaymentMethod = models.PaymentMethod || model('PaymentMethod', PaymentMethodSchema);

export default PaymentMethod;
