import { ArrowRight, ArrowUpRight, Bookmark, CloudSun, Globe2, MoveUpRight, Newspaper, Radar, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router';

const today = new Intl.DateTimeFormat('en-US', {weekday:'long', month:'long', day:'numeric', year:'numeric'}).format(new Date());

export default function Home() {
  return <>
    <section className="home-hero"><div className="shell hero-grid">
      <div className="hero-copy"><span className="eyebrow"><span className="live-pulse"/> A BETTER WAY TO STAY UPDATED</span>
        <h1>The world moves fast.<br/><em>Stay a step ahead.</em></h1>
        <p>Your daily destination for the stories that matter and the weather that shapes your day. Beautifully simple. Effortlessly useful.</p>
        <div className="hero-cta"><Link className="primary-btn" to="/news">Explore today's news <ArrowUpRight size={18}/></Link><Link className="text-btn" to="/weather">Check the weather <ArrowRight size={18}/></Link></div>
        <div className="hero-meta"><span className="meta-avatars"><span><Newspaper size={15}/></span><span><CloudSun size={15}/></span><span><Globe2 size={15}/></span></span><span><strong>One beautiful place</strong><br/>for everything happening around you</span></div>
      </div>
      <div className="hero-art" aria-label="Illustration of news and weather features">
        <div className="hero-grid-lines"/>
        <div className="art-circle circle-one"/><div className="art-circle circle-two"/>
        <div className="art-frame"><div className="art-small-top"><span className="tiny-dot red"/><span className="tiny-dot yellow"/><span className="tiny-dot green"/><span>YOUR DAILY DIGEST</span><span className="art-top-plus">✳</span></div>
          <div className="art-headline"><span className="art-kicker">THE BIG PICTURE</span><strong>Good morning,<br/>curious mind<span>.</span></strong><span className="art-date">{today}</span></div>
          <div className="art-stories"><div className="art-story-feature"><span className="art-photo-shape"><span/></span><div><span className="art-fake-label">DISCOVER</span><div className="art-fake-lines"><i/><i/><i/></div></div></div><div className="art-small-cards"><div><Newspaper size={20}/><span>Top stories</span><ArrowUpRight size={14}/></div><div><CloudSun size={20}/><span>Weather</span><ArrowUpRight size={14}/></div></div></div>
        </div>
        <div className="floating-weather"><span className="floating-icon"><CloudSun size={30}/></span><div><small>YOUR FORECAST</small><strong>Know before you go.</strong></div><MoveUpRight size={18}/></div>
        <span className="floating-sparkle one">✳</span><span className="floating-sparkle two">✳</span>
      </div>
    </div></section>

    <section className="home-feature-section shell"><div className="section-intro"><div><span className="eyebrow dark-eyebrow">EXPLORE NEWSSKY</span><h2>Everything you need.<br/><span>Nothing you don't.</span></h2></div><p>Less switching tabs. More of what matters. Make a little room for clarity in your day.</p></div>
      <div className="feature-grid">
        <Link to="/news" className="feature-card feature-news"><div className="feature-card-top"><span className="feature-tag"><Radar size={15}/> THE LATEST</span><ArrowUpRight className="feature-arrow" size={21}/></div><div className="feature-art-news"><span className="feature-orbit"/><div className="feature-globe"><Globe2 size={92} strokeWidth={0.7}/></div><span className="mini-news-tag">BREAKING STORIES</span></div><div className="feature-info"><h3>Stories worth<br/>your time.</h3><p>Headlines, categories, powerful search and articles worth saving.</p><span>Discover news <ArrowRight size={18}/></span></div></Link>
        <Link to="/weather" className="feature-card feature-weather"><div className="feature-card-top"><span className="feature-tag"><Zap size={15}/> LIVE CONDITIONS</span><ArrowUpRight className="feature-arrow" size={21}/></div><div className="feature-art-weather"><div className="sun-orb"/><div className="cloud-shape cloud-a"/><div className="cloud-shape cloud-b"/><div className="little-weather-line">YOUR DAY, DECODED.</div></div><div className="feature-info"><h3>A brighter<br/>forecast.</h3><p>Find current conditions for cities around the world in seconds.</p><span>Explore weather <ArrowRight size={18}/></span></div></Link>
      </div>
    </section>
    <section className="home-bottom shell"><div className="bottom-banner"><div><span className="eyebrow">BUILT FOR THE CURIOUS</span><h2>Make every day<br/><em>a little brighter.</em></h2><p>Good information changes how you see the world.</p><Link className="white-btn" to="/news">Let's explore <ArrowUpRight size={17}/></Link></div><div className="bottom-decoration"><span className="decor-star large">✳</span><span className="decor-star small">✳</span><div className="decor-orbit"/></div></div></section>
  </>;
}
