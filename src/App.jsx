import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UserScreen from './screens/UserScreen';
import AllItems from './pages/AllItems';
import VendorList from './pages/VendorList';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserScreen />}>
          <Route path="inventory">
            <Route path="products" element={<AllItems />} />
            {/* You can add more inventory subroutes here */}
          </Route>
          <Route path="vendor" element={<VendorList />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
