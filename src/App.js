import { Route, Routes } from "react-router-dom";

import LoginPage from './pages/LoginPage/index.js'

import NavigationFrame from './pages/NavigationFrame/index.js'

import HomePage from "./pages/HomePage/index.js";
import IvtListPage from "./pages/IvtListPage/index.js";
import RecordPage from "./pages/RecordPage/index.js";
//test
import Test01 from "./testClass/test01.js";
//components
import { AuthComponent } from "./components/AuthComponent.js";
//import { LoginJumpComp } from "./components/LoginJumpComp.js";

import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'
import { history } from "./utils/historyPlugin.js";
import './App.css';

function App() {
  return (
    <HistoryRouter history={history}>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <AuthComponent><NavigationFrame /></AuthComponent>
          }>
            <Route index element={<HomePage />}></Route>
            <Route path="/ivtlist" element={<IvtListPage />}></Route>
            <Route path="/record" element={<RecordPage />}></Route>
          </Route>
          <Route path="/test01" element={<Test01 />}></Route>
          {/* login Page */}
          <Route path="/login" element={<LoginPage />}></Route>
        </Routes>
      </div>
    </HistoryRouter>
  );
}

export default App;
