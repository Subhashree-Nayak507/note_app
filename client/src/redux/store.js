import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth/index';
import noteReducer from './note/index';

const store=configureStore({
    reducer:{
        auth:authReducer,
        notes:noteReducer
    }
})

export default store
