import mongoose from 'mongoose'
import { Practice } from '../interfaces'

const practiceSchema: mongoose.Schema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
  },
  progress: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true
  }
})

export default mongoose.model<Practice>("Practice", practiceSchema)
