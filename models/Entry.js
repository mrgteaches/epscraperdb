var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var EntrySchema = new Schema({

  courseTitle: {
    type: String
  },
  dayTitle: {
    type: String
  },
  content: {
    type: String
  },
  courseTitle2: {
    type: String
  },
  dayTitle2: {
    type: String
  },
  content2: {
    type: String
  },
  courseTitle3: {
    type: String
  },
  dayTitle3: {
    type: String
  },
  content3: {
    type: String
  },

});

// This creates our model from the above schema, using mongoose's model method
var Entry = mongoose.model("Entry", EntrySchema);

module.exports = Entry;