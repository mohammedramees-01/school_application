import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: String,
  class: String,
  progress: {
    marks: Number,
    grade: String,
    remarks: String
  }
});

const Student = mongoose.model("Student", StudentSchema);

export default Student;
