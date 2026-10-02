import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { ArrowUpRight, CloudSun, House, Menu, Moon, Newspaper, Sun, X } from 'lucide-react';

const links = [
  { to: '/', label: 'Home', icon: House, end: true },
  { to: '/news', label: 'Discover news', icon: Newspaper },
  { to: '/weather', label: 'Weather', icon: CloudSun },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('newssky-theme') === 'dark');
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('newssky-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <>
      <div className="topline"><div className="shell top-inner"><span className="top-dot"/> YOUR DAILY PERSPECTIVE <span className="top-right">STAY CURIOUS. STAY INFORMED.</span></div></div>
      <header className="site-header">
        <div className="shell header-inner">
          <NavLink to="/" className="brand" onClick={() => setMenuOpen(false)} aria-label="NewsSky home">
            <span className="brand-symbol"><span className="brand-symbol-orbit"/><span className="brand-symbol-core"/></span>
            <span>news<span className="brand-accent">sky</span><span className="brand-period">.</span></span>
          </NavLink>
          <nav className={'nav-links ' + (menuOpen ? 'is-open' : '')} aria-label="Main navigation">
            {links.map(({to,label,icon:Icon,end}) => <NavLink key={to} to={to} end={end} onClick={() => setMenuOpen(false)} className={({isActive}) => 'nav-link ' + (isActive ? 'active' : '')}><Icon size={16}/>{label}</NavLink>)}
          </nav>
          <div className="header-actions">
            <button className="icon-button theme-button" onClick={() => setDark(v => !v)} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} title={dark ? 'Light mode' : 'Dark mode'}>{dark ? <Sun size={19}/> : <Moon size={19}/>}</button>
            <NavLink to="/news" className="header-explore">Explore <ArrowUpRight size={16}/></NavLink>
            <button className="icon-button mobile-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)}>{menuOpen ? <X size={22}/> : <Menu size={22}/>}</button>
          </div>
        </div>
      </header>
    </>
  );
}
