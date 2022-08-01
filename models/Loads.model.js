const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const loadsSchema = new Schema(
  {
    routes: {
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
    status: [
        "AVAILABLE", "IN_TRANSIT", "DELIVERED"
    ]
    
  }, { timestamps: true }
);

const Loads = model("Loads", loadsSchema);

module.exports = Loads;
