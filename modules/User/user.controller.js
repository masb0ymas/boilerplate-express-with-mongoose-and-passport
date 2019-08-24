const Joi = require('@hapi/joi');
var jwt = require('jsonwebtoken');
const User = require('./user.model.js');
var Helper = require('../../helper/Common');

var getToken = Helper.getToken;
const isValidationReplace = Helper.isValidationReplace;
const jwtPass = 'SQiDap1djWTyIFoc4ffsXeHvgMq2';

signUp = async (req, res) => {
	let { fullName, email, password } = req.body

	try {

		const schema = Joi.object().keys({
			fullName: Joi.string().required(),
			email: Joi.string().email({ minDomainSegments: 2 }),
			password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
		})

		await schema.validate(req.body)

		let insertData = await User.create({
			fullName: fullName,
			email: email,
			password: password,
		})
		return res.status(201).json({
			success: true,
			message: 'Kamu sudah terdaftar sekarang',
			insertData
		})

	} catch (err) {
		console.log(err)
		return res.status(400).json({ 
			success: false, 
			message: isValidationReplace(err)
		})
	}
}

signIn = async (req, res) => {
	let { email, password } = req.body

	try {
		let store = await User.findOne({
			email: email
		})
		if (!store) {
			return res.status(404).json({ 
				success: false, 
				message: 'Akun tidak ditemukan!'
			});
		}

		store.comparePassword(password, (err, isMatch) => {
			if (isMatch && !err) {
				let token = jwt.sign(JSON.parse(JSON.stringify(store)), jwtPass, {expiresIn: 86400 * 30}); // 30 Days
				jwt.verify(token, jwtPass, function(err, data){
          // console.log(err, data);
        })
        return res.status(200).json({
        	success: true,
        	token: 'JWT ' + token,
        	uid: store.id,
        });
			} else {
				// console.log(res)
				res.status(401).json({
					success: false, 
					message: 'Email atau Password salah!'
				});
			}
		})
	} catch (err) {
		return res.status(400).json(err.errors)
	}
}

getProfile = async (req, res) => {
	const token = getToken(req.headers);
	if (token) {
		res.status(200).json(jwt.decode(token))
	} else {
		return res.status(403).json({
			success: false, 
			message: 'Unauthorized. Please Re-login...'
		});
	}
}

getAll = async (req, res) => {
	try {

		let getData = await User.find()
		return res.status(200).json({
			success: true,
			getData
		})

	} catch (err) {
		return res.status(400).json({
			success: false,
			message: err
		})
	}
}

getOne = async (req, res) => {
	let id = req.params.id;
	try {

		let getData = await User.findById(id)
		return res.status(200).json({
			success: true,
			getData
		})

	} catch (err) {
		return res.status(400).json({
			success: false,
			message: err
		})
	}
}

storeData = async (req, res) => {
	let { fullName, email, password } = req.body

	try {

		const schema = Joi.object().keys({
			fullName: Joi.string().required(),
			email: Joi.string().email({ minDomainSegments: 2 }),
			password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
		})

		await schema.validate(req.body)

		let insertData = await User.create({
			fullName: fullName,
			email: email,
			password: password,
		})
		return res.status(201).json({
			success: true,
			message: 'Data sudah ditambahkan',
			insertData
		})

	} catch (err) {
		return res.status(400).json({ 
			success: false, 
			message: err
		})
	}
}

updateData = async (req, res) => {
	let { roleName } = req.body;
	let id = req.params.id;

	try {

		let editData = await User.findByIdAndUpdate(id, {
			roleName: roleName,
		}, {new: true})
		if (!editData) {
			return res.status(404).json({
				message: 'Data tidak ditemukan!'
			});
		}
		res.status(200).json({
			success: true,
			message: 'Data berhasil diperbarui!',
			editData
		})

	} catch (err) {
		// console.log(err)
		if (err.kind === 'ObjectId') {
			return res.status(404).json({
				message: 'Data tidak ditemukan!'
			});                
		}
		return res.status(400).json({
			success: false,
			message: err
		})
	}
}

destroyData = async (req, res) => {
	let { roleName } = req.body;
	let id = req.params.id;

	try {

		let deleteData = await User.findByIdAndRemove(id)
		if (!deleteData) {
			return res.status(404).json({
				message: 'Data tidak ditemukan!'
			});
		}
		res.status(200).json({
			success: true,
			message: 'Data berhasil dihapus!',
		})

	} catch (err) {
		// console.log(err)
		if (err.kind === 'ObjectId') {
			return res.status(404).json({
				message: 'Data tidak ditemukan!'
			});                
		}
		return res.status(400).json({
			success: false,
			message: err
		})
	}
}

module.exports = {
	signUp,
	signIn,
	getProfile,
	getAll,
	getOne,
	storeData,
	updateData,
	destroyData,
}
