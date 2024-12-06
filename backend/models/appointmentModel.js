import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({

    userId: {type: String, default:' '},
    slotTime: { type: String, required: true },
    docId: {type: String, required: true},
    slotDate: {type: String, required: true},
    userData: {type: Object, default: {}},
    docData: {type: Object, required: true},
    amount: {type: Number, default: 0},
    date: {type: Number, required:true},
    cancelled: {type:Boolean, default:false},
    paymnet: {type: Number, default:0},
    isCompleted: {type: Boolean, default:false}

})

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema)
export default appointmentModel