const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const loadsSchema = new Schema(
  {
    senderInfo: {
        type: String,
        required: true
    },
    receiverInfo: {
        type: String,
        required: true
    },
    startAirport: {
      type: String,
      required: true
    },
    endAirport: {
        type: String,
        required: true
      },
    contents: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true,
      unique: true
    },
    handler: {
      type: Schema.Types.ObjectId, 
      ref: "Handler"
    },
    status: {
      type: String,
      enum : ['AVAILABLE','IN_TRANSIT','DELIVERED'],
      default: 'AVAILABLE'
  },
    
  }, { timestamps: true }
);

const Loads = model("Loads", loadsSchema);

module.exports = Loads;
