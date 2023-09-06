import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from './pages/Login/index.js'
import Layout from './pages/Layout/index.js'

import { Button } from 'antd'
import Test01 from "./testClass/test01.js";
import { AuthComponent } from "./components/AuthComponent.js";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Button type="primary">Primary Button</Button>
        <Routes>
          <Route path="/" element={
            <AuthComponent><Layout /></AuthComponent>
          }></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/test01" element={<Test01 />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
