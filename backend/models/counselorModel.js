import mongoose from "mongoose";

const counselorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, default: 'N/A' },
    experience: { type: String, default: 'N/A' },
    about: { type: String, required: true },
    available: { type: Boolean, default:true},
    fees: { type: Number, default: 0 },
    address: { type: Object, required: true },
    date: { type: Number, default: Date.now },
    slots_booked: { type: Object, default: {} },
    daysWorking: { type: Object, default: {} }
    
}, { minimize: false })

const counselorModel = mongoose.models.Counselor || mongoose.model('Counselor', counselorSchema, 'counselors');




export default counselorModel