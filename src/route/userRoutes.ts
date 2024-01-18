import express from "express";
import userController from "../controller/userController";
import jobController from "../controller/jobController";


const router=express.Router();

router.post('/register',userController.register);
router.post('/login',userController.login);
router.post('/createJobCategory',jobController.categories);
router.post('/createJob',jobController.jobs);
router.post('/createJobInterest',jobController.jobInterest);
router.post('/jobInterest/:jobInterestId/interestedUser',jobController.jobInterestedUser)
router.post('/jobs/:jobId/apply',jobController.jobApply);
router.get('/jobs/:jobId/applicants',jobController.allApplicants)


export default router;