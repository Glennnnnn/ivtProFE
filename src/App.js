import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from './pages/Login/index.js'
import Layout from './pages/Layout/index.js'

import { Button } from 'antd'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <button type="primary">Primary Button</button>
        <Routes>
          <Route path="/" element={<Layout />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
