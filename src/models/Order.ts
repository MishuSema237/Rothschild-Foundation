import { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
    registrationId: { type: Schema.Types.ObjectId, ref: 'Registration', required: true },
    itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    orderNumber: { type: String, required: true, unique: true },
    paymentMethod: { type: String, required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Order = models.Order || model('Order', OrderSchema);

export default Order;
