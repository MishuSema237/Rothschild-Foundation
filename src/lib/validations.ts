import { z } from 'zod';

export const registrationSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    dateOfBirth: z.string().min(1, "Date of Birth is required"),
    maritalStatus: z.string().min(1, "Marital Status is required"),
    occupation: z.string().min(1, "Occupation is required"),
    salary: z.string().min(1, "Salary/Income is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(5, "Valid phone number is required"),
    paymentMethod: z.string().min(1, "Payment method selection is required"),
    personalPhoto: z.string().min(1, "Personal photo is required"),
    idCardPhoto: z.string().min(1, "ID card photo is required"),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
