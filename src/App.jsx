import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserScreen from './screens/UserScreen';
import AllItems from './pages/AllItems';
import VendorList from './pages/VendorList';
import Signup from './screens/Signup';
import Login from './screens/Login';
import PrivateRoute from './components/PrivateRoute';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <PrivateRoute>
            <UserScreen />
          </PrivateRoute>
        }>
          <Route path="inventory/products" element={<AllItems />} />
          <Route path="vendor" element={<VendorList />} />
        </Route>

        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
