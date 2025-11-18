const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const port = 4000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors());

mongoose.connect("mongodb+srv://admin:admin1234@ongdb.dsvafql.mongodb.net/fitness-tracker-api?retryWrites=true&w=majority&appName=OngDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));

const userRoutes = require("./routes/user");
const workoutRoutes = require("./routes/workout");

app.use("/users", userRoutes);
app.use("/workouts", workoutRoutes);

if(require.main === module){
	app.listen(process.env.PORT || port, () => {
	    console.log(`API is now online on port ${ process.env.PORT || port }`)
	});
}

module.exports = {app,mongoose};