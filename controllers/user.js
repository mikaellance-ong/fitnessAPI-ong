const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require("../auth");

const { errorHandler } = auth;

module.exports.register = (req, res) => {
	const { firstName, lastName, email, mobileNo, password } = req.body;

	if(!email || !email.includes('@')) return res.status(400).json({message: 'Email is invalid'});

	if (!mobileNo || typeof mobileNo !== 'string' || mobileNo.length !== 11) return res.status(400).json({ message: 'Mobile number invalid' });
  
	if (!password || password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
  
	if (!firstName || typeof firstName !== 'string' || !lastName || typeof lastName !== 'string') 
		return res.status(400).json({ message: 'Check name details and try again' });

	const newUser = new User({
		firstName,
		lastName,
		email,
		mobileNo,
		password: bcrypt.hashSync(password, 10)
	})

	newUser.save()
	.then(savedUser => {
		const userObject = savedUser.toObject();

		return res.status(201).json({
			message: 'Registered Successfully'
		});
	})
	.catch(err => errorHandler(err, req, res));
}

module.exports.login = (req, res) => {
	const { email, password } = req.body;

	if(!email || !email.includes("@")) return res.status(400).json({message: 'Invalid email'});

	User.findOne({ email })
	.then(user => {
		if(!user)
		{
			return res.status(404).json({message: "No email found"})
		}

		const isPasswordCorrect = bcrypt.compareSync(password, user.password)
		if (!isPasswordCorrect)
		{
			return res.status(401).json({message: "Email and possword do not match"})
		}

		const accessToken = auth.createAccessToken(user);
        return res.status(200).send({
            access: accessToken
		});
	})
	.catch(err => errorHandler(err, req, res));
}

module.exports.getUserDetails = (req, res) => {

	return User.findById(req.user.id)
	.then(user => {

		if(!user) return res.status(404).json({ error: "User not found"});

		user.password = "";
		return res.status(200).json({ user });
	})
	.catch(err => errorHandler(err, req, res));
}