import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./redux/auth/index"; 
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/signUp";
import Note from "./pages/note/Note";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  console.log("authenticated",isAuthenticated);
   console.log("user",user);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div>
      <Routes>
        <Route path='/' element={!isAuthenticated ? <Navigate to='/login' /> : <Navigate to='/note' />} />
        <Route path='/login' element={!isAuthenticated ? <Login /> : <Navigate to='/note' />} />
        <Route path='/signup' element={!isAuthenticated ? <SignUp /> : <Navigate to='/note' />} />
        <Route path='/note' element={isAuthenticated ? <Note /> : <Navigate to='/login' />} />
        <Route path='*' element={<Navigate to={isAuthenticated ? '/note' : '/login'} />} />
      </Routes>
    </div>
  );
}

export default App