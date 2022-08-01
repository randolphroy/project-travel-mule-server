const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const handlerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
    currentLoads: {
      type: Schema.Types.ObjectId, 
      ref: "Loads"
    },
    previousLoads: [{
      type: Schema.Types.ObjectId, 
      ref: "Loads"
    }
    ]
  }
);

const Handler = model("Handler", handlerSchema);

module.exports = Handler;
