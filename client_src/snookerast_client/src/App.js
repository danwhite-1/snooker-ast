import { Routes, Route } from 'react-router-dom';
import './App.css';
import SnookerAST from './components/SnookerAST';
import PlayerCompare from './components/PlayerCompare';
import TournamentCompare from './components/TournamentCompare';

function App() {
  return (
    <div className='AppDiv'>
      <SnookerAST />
      <Routes>
        <Route path="/" element={<TournamentCompare />} />
        <Route path="/compare-players" element={<PlayerCompare />} />
        <Route path="/compare-tournaments" element={<TournamentCompare />} />
      </Routes>
    </div>
  );
}

export default App;
