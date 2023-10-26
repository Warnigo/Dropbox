import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './components/pages/login';
import Notfound from './components/pages/notFound';
import Register from './components/pages/register';
import Home from './components/pages/home';
import FrontLayout from './components/layout/frontLayot';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />

          <Route path='/login/:userId' element={<FrontLayout />}>
            <Route index element={<Home />} />
          </Route>

          <Route path='*' element={<Notfound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
