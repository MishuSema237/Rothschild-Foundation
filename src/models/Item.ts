import { Schema, model, models } from 'mongoose';

const ItemSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    mysticalProperties: { type: String },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const Item = models.Item || model('Item', ItemSchema);

export default Item;
