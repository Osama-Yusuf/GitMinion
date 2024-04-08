import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import SettingsPage from './SettingsPage';
import RunPage from './RunPage';
import LinkPage from './LinkPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faGear, faLink, faPersonRunning } from '@fortawesome/free-solid-svg-icons';

function App() {
  return (
    <Router>
      <div>
        <nav className="absolute top-0 left-0 p-4">
          <Link className="mr-4 text-xl" to="/"><FontAwesomeIcon icon={faHouse} /></Link>
          <Link className="mr-4 text-xl" to="/settings"><FontAwesomeIcon icon={faGear} /></Link>
          <Link className="mr-4 text-xl" to="/run"><FontAwesomeIcon icon={faPersonRunning} /></Link>
          <Link className="mr-4 text-xl" to="/link"><FontAwesomeIcon icon={faLink} /></Link>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/run" element={<RunPage />} />
          <Route path="/link" element={<LinkPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
