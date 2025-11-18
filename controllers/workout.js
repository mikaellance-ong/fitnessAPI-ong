const Workout = require('../models/Workout');
const auth = require("../auth");

const { errorHandler } = auth;

module.exports.addWorkout = (req, res) => {
    const userId = req.user.id;

    Workout.findOne({ userId, name: req.body.name })
    .then(existingWorkout => {
        if (existingWorkout) return res.status(409).json({ message: "Workout already exists" });

        const newWorkout = new Workout({
            userId: userId,
            name: req.body.name,
            duration: req.body.duration
        });

        return newWorkout.save()
        .then(workout => res.status(201).json(workout))
    })
    .catch(err => errorHandler(err, req, res));
};

module.exports.getMyWorkouts = (req, res) => {
    const userId = req.user.id;

    return Workout.find({ userId })
    .then(workouts => {
        if (workouts.length > 0) {
            return res.status(200).json({ workouts: workouts });
        } else {
            return res.status(404).json({ message: "No workouts found" });
        }
    })
    .catch(err => errorHandler(err, req, res));
};

module.exports.updateWorkout = (req, res) => {
    const userId = req.user.id;

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body cannot be empty" });
    }

    const updatedWorkout = {};
    if (req.body.name) updatedWorkout.name = req.body.name;
    if (req.body.duration) updatedWorkout.duration = req.body.duration;

    return Workout.findOneAndUpdate({ _id: req.params.workoutId, userId: userId }, updatedWorkout, { new: true })
    .then(workout => {
        if (!workout) return res.status(404).json({ error: "Workout not found" });

        return res.status(200).json({
            message: "Workout updated successfully",
            updatedWorkout: workout
        });
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.deleteWorkout = (req, res) => {
    const userId = req.user.id;

    return Workout.findOneAndDelete({ _id: req.params.workoutId, userId: userId })
    .then(deletedWorkout => {
        if (!deletedWorkout) {
            return res.status(404).json({ error: "Workout not found" });
        }
        return res.status(200).json({ message: "Workout deleted successfully" });
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.completeWorkoutStatus = (req, res) => {
    const userId = req.user.id;
    const workoutId = req.params.workoutId;

    Workout.findOneAndUpdate({ _id: workoutId, userId: userId }, { status: 'completed' }, { new: true })
    .then(updatedWorkout => {
        if (!updatedWorkout) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.status(200).json({
            message: 'Workout marked as completed',
            updatedWorkout: updatedWorkout
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    });
};