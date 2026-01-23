import mongoose, { Schema, model, models } from 'mongoose';

const RegistrationSchema = new Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    maritalStatus: { type: String, required: true },
    occupation: { type: String, required: true },
    salary: { type: String, required: true },
    personalPhoto: { type: String, required: true },
    idCardFront: { type: String, required: true },
    idCardBack: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
    createdAt: { type: Date, default: Date.now },
});

const Registration = models.Registration || model('Registration', RegistrationSchema);

export default Registration;
