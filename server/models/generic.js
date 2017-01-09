import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const genericSchema = new Schema({
  cuid: { 
    type: 'String',
    required: true 
  },
  createdAt: {
    type: 'Date',
    required: true,
    default: Date.now 
  },
  name: {
    type: 'String',
    required: true 
  },
});

export default mongoose.model('Generic', genericSchema);

