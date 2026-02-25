import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import List from './pages/List';
import Details from './pages/Details';
import PhotoResult from './pages/PhotoResult';
import Charts from './pages/Charts';
import MapView from './pages/MapView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/list" element={<List />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/photo-result" element={<PhotoResult />} />
        <Route path="/charts" element={<Charts />} />
        <Route path="/map" element={<MapView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;