import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/pages/login';
import Notfound from './components/pages/notFound';
import Register from './components/pages/register';
import Home from './components/pages/home';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path="/login/:userId" element={<Home />} />
          <Route path='*' element={<Notfound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
