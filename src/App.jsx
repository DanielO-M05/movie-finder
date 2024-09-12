
import { HashRouter as Router, Routes, Route } from 'react-router-dom' 
import './App.css';
import MovieSearch from './MovieSearch';
import ShowMore from './ShowMore';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/:q?/:y?/:p?" element={<MovieSearch />} /> */}
        <Route path="/" element={<MovieSearch />} />
        <Route path="/search" element={<MovieSearch />} />
        <Route path="/more/:id" element={<ShowMore />} />
      </Routes>
    </Router>
  );
};

export default App;