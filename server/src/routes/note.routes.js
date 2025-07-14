import express from 'express';
import { createNoteController, getNotes } from '../controllers/note.controller.js';
import { protectRoute} from "../utils/middleware/check.auth.js";
import { deleteNoteManager, updateNoteManager } from '../managers/note.manager.js';

const  noteRouter= express.Router();

noteRouter.post('/create',protectRoute,createNoteController);
noteRouter.get('/get',protectRoute,getNotes);
noteRouter.patch('/update/:id',protectRoute,updateNoteManager);
noteRouter.delete('/delete/:id',protectRoute,deleteNoteManager);

export default noteRouter;