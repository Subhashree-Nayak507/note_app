import express from 'express';
import { createNoteController, deleteNoteController, getNotes, updateNoteController } from '../controllers/note.controller.js';
import { protectRoute} from "../utils/middleware/check.auth.js";

const  noteRouter= express.Router();

noteRouter.post('/create',protectRoute,createNoteController);
noteRouter.get('/get',protectRoute,getNotes);
noteRouter.post('/update/:id',protectRoute,updateNoteController);
noteRouter.delete('/delete/:id',protectRoute,deleteNoteController);

export default noteRouter;