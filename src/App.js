import logo from './logo.svg';
import './App.css';
import ScholarSearch from './deneme';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ExtractedTextPage from './articlepage';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<ScholarSearch />} />
        <Route path="/extracted-text" element={<ExtractedTextPage />} />
      </Routes>
    </Router>
  );
}

export default App;