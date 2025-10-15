// create college route to add
import express from "express";
import {
  createCollege,
  getAllColleges,
} from "../controller/college.controller.js";

const collegeRouter = express.Router();
collegeRouter.post("/create", createCollege);
collegeRouter.get("/all", getAllColleges);

export default collegeRouter;
