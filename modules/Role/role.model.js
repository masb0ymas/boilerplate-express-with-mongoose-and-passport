var mongoose = require('mongoose');

const RoleSchema = mongoose.Schema({
	roleName: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Role', RoleSchema);
