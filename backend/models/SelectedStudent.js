const mongoose = require("mongoose");

const SelectedStudentSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    roundsData: [
        {
            round: { type: Number, required: true },
            selectedStudents: [{ type: String }],
        }
    ],
    finalSelectedStudents: [{ type: String }],
}, { timestamps: true });

const SelectedStudent = mongoose.model("SelectedStudent", SelectedStudentSchema);
module.exports = SelectedStudent;
