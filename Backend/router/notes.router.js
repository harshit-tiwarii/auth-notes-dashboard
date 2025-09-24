import express from "express";
import auth from "../middleware/auth.middleware.js";
import { createNote, getNotes, getNote, updateNote, deleteNote } from "../controllers/Notes.controller.js";
const router = express.Router();

router.use(auth);

router.get("/", getNotes);
router.post("/", createNote);
router.get("/:id", getNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);


export { router as notesRoute } ;
