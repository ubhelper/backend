const express = require('express');
const router = express.Router();
const fileUpload = require('../../middleware/FileUpload');
const controller = require('../../controller/UserController');

router.post('/login', controller.login);
router.post('/update-status-resume', controller.changeStatusResume);
router.post('/update-profession', controller.updateProfession);
router.post('/add-profession', controller.addProfession);
router.delete('/delete-profession', controller.deleteProfession);
router.put('/delete-employee',  controller.deleteEmployee);
router.put('/update-employee', controller.updateEmployee);
router.post('/update-photo', fileUpload.uploadProfilePic(), controller.updatePhoto);
router.get('/get-votes', controller.selectVotes);
router.put('/update-feedback', controller.updateFeedback);
router.get('/employees', controller.getAllEmployee);
router.put('/recover-employee',  controller.recoverEmployee);

module.exports = router;