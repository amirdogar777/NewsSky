import { Routes, Route, Navigate, Link } from 'react-router';
import { ArrowUpRight, Heart } from 'lucide-react';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import News from './components/News.jsx';
import Weather from './components/Weather.jsx';

export default function App() {
  return <div className="app">
    <Header />
    <main id="main-content"><Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/news" element={<News/>}/>
      <Route path="/weather" element={<Weather/>}/>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes></main>
    <footer className="footer"><div className="shell footer-inner">
      <div><Link to="/" className="footer-brand">news<span>sky.</span></Link><p>A little more informed, every day.</p></div>
      <div className="footer-links"><Link to="/">Home</Link><Link to="/news">News</Link><Link to="/weather">Weather</Link></div>
      <span className="footer-note">Made with <Heart size={12} fill="currentColor"/> & React <ArrowUpRight size={13}/></span>
    </div></footer>
  </div>;
}
