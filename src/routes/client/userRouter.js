const express = require('express');
const router = express.Router();

const controller = require('../../controller/UserController');
const fileUpload = require('../../middleware/FileUpload');

router.post('/login', controller.login);
router.post('/register', controller.register);
router.post('/update-profile', fileUpload.uploadProfilePic(), controller.updateProfile);


// router.post('/create-resume', controller.createResume);
// router.get('/employee-personal-info', controller.empPersonalInfo);
// router.post('/update-resume', controller.updateCareer);
// router.post('/add-vote', controller.addVote);
// router.get('/get-votes', controller.selectVotes);
// router.get('/get-professions', controller.getProfessions);
// router.get('/employees', controller.getEmployees);
// router.post('/forgot-password', controller.forgotPassEmp);
// router.put('/change-password', controller.changeCurrentPassword);

module.exports = router;