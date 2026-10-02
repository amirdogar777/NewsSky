import { useEffect, useState } from 'react';
import { ArrowRight, Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Droplets, LocateFixed, MapPin, Search, Sun, Sunrise, Sunset, Wind } from 'lucide-react';

const savedCitiesKey='newssky-weather-cities';
const readCities=()=>{try{return JSON.parse(localStorage.getItem(savedCitiesKey))||['Multan','Lahore','Islamabad','Karachi'];}catch{return ['Multan','Lahore','Islamabad','Karachi'];}};
function getCondition(code) {
  if(code===0) return {label:'Clear sky', icon:Sun};
  if([1,2,3].includes(code)) return {label:'Partly cloudy', icon:CloudSun};
  if([45,48].includes(code)) return {label:'Foggy', icon:CloudFog};
  if([51,53,55,56,57].includes(code)) return {label:'Drizzle', icon:CloudDrizzle};
  if([61,63,65,66,67,80,81,82].includes(code)) return {label:'Rainy', icon:CloudRain};
  if([71,73,75,77,85,86].includes(code)) return {label:'Snowy', icon:CloudSnow};
  if([95,96,99].includes(code)) return {label:'Thunderstorm', icon:CloudLightning};
  return {label:'Cloudy', icon:Cloud};
}
const fmtTime=(iso)=>iso?.split('T')[1]?.slice(0,5)||'—';
const convert=(value,unit)=>value==null?'—':`${Math.round(unit==='F'?value*9/5+32:value)}°`;

export default function Weather() {
  const [city,setCity]=useState('Multan');
  const [weather,setWeather]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [unit,setUnit]=useState('C');
  const [cities,setCities]=useState(readCities);
  const [query,setQuery]=useState('Multan');

  useEffect(()=>{const controller=new AbortController();searchWeather('Multan',controller.signal);return()=>controller.abort();},[]);
  async function searchWeather(name=city,signal) {
    const wanted=name.trim();if(!wanted)return;
    setLoading(true);setError('');
    try {
      const locResp=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(wanted)}&count=1&language=en&format=json`,{signal});
      if(!locResp.ok)throw new Error('Could not find this location right now.');
      const locData=await locResp.json();
      if(!locData.results?.length)throw new Error('City not found. Please try a different name.');
      const location=locData.results[0];
      const dataResp=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&forecast_days=4&timezone=auto`,{signal});
      if(!dataResp.ok)throw new Error('Weather service is unavailable. Please try again.');
      const data=await dataResp.json();
      if(!data.current || !data.daily)throw new Error('Weather data was incomplete. Please try again.');
      if(signal?.aborted)return;
      setWeather({city:location.name,country:location.country,region:location.admin1, current:data.current,daily:data.daily,unitWind:data.current_units?.wind_speed_10m || 'km/h'});
      setCity(location.name);setQuery(location.name);
      setCities(old=>{const result=[location.name,...old.filter(s=>s.toLowerCase()!==location.name.toLowerCase())].slice(0,5);localStorage.setItem(savedCitiesKey,JSON.stringify(result));return result;});
    } catch(err){if(err.name!=='AbortError'){setError(err.message||'Something went wrong.');setWeather(null);}}
    finally{if(!signal?.aborted)setLoading(false);}
  }
  const condition=getCondition(weather?.current?.weather_code);
  const MainIcon=condition.icon;
  return <div className="weather-page shell page-enter">
    <section className="page-heading"><span className="eyebrow dark-eyebrow"><span className="live-pulse"/> YOUR DAILY FORECAST</span><div className="heading-line"><div><h1>A little more <em>sunshine.</em></h1><p>Whatever the sky brings, you'll be ready for it.</p></div><div className="heading-mark"><CloudSun size={50} strokeWidth={1}/></div></div></section>
    <div className="weather-search-section"><form onSubmit={e=>{e.preventDefault();searchWeather(query);}} className="weather-search-form"><MapPin size={19}/><input aria-label="City name" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search a city anywhere in the world..."/><button type="submit" disabled={loading}>Find weather <ArrowRight size={17}/></button></form><div className="weather-quick"><span>QUICK SEARCH</span>{cities.map(c=><button key={c} onClick={()=>searchWeather(c)}>{c}</button>)}</div></div>
    {error&&<div className="weather-error" role="alert">{error} <button onClick={()=>searchWeather(query)}>Try again <ArrowRight size={14}/></button></div>}
    {loading&&<div className="weather-loading"><span className="loading-spinner"/>Checking the skies...</div>}
    {weather&&!loading&&<>
      <div className="weather-layout"><section className="weather-main-card"><div className="weather-card-top"><span className="weather-live"><span className="live-pulse"/> LIVE CONDITIONS</span><span>LOCAL WEATHER</span></div><div className="weather-location"><MapPin size={21}/><div><h2>{weather.city}<span>, {weather.country}</span></h2>{weather.region&&<small>{weather.region}</small>}</div></div><div className="weather-center"><div className="weather-temperature">{convert(weather.current.temperature_2m,unit)}<span>{unit}</span></div><div className="weather-condition"><div className="giant-weather-icon"><MainIcon size={82} strokeWidth={1.2}/></div><strong>{condition.label}</strong><span>Feels like {convert(weather.current.apparent_temperature,unit)}{unit}</span></div></div><div className="weather-main-bottom"><div><span>CURRENT CONDITIONS</span><p>Your day at a glance.</p></div><div className="unit-picker" role="group" aria-label="Temperature unit"><button className={unit==='C'?'active':''} onClick={()=>setUnit('C')}>°C</button><button className={unit==='F'?'active':''} onClick={()=>setUnit('F')}>°F</button></div></div></section>
      <section className="weather-details"><div className="detail-heading"><span className="eyebrow dark-eyebrow">THE DETAILS</span><h3>Today's outlook</h3><p>Everything you need to plan your day.</p></div><div className="detail-grid"><div className="detail-tile"><span className="detail-icon humidity"><Droplets size={22}/></span><span>HUMIDITY</span><strong>{weather.current.relative_humidity_2m}%</strong><small>Relative humidity</small></div><div className="detail-tile"><span className="detail-icon breeze"><Wind size={22}/></span><span>WIND SPEED</span><strong>{weather.current.wind_speed_10m}</strong><small>{weather.unitWind}</small></div><div className="detail-tile"><span className="detail-icon sunrise"><Sunrise size={23}/></span><span>SUNRISE</span><strong className="time-text">{fmtTime(weather.daily.sunrise?.[0])}</strong><small>Local time</small></div><div className="detail-tile"><span className="detail-icon sunset"><Sunset size={23}/></span><span>SUNSET</span><strong className="time-text">{fmtTime(weather.daily.sunset?.[0])}</strong><small>Local time</small></div></div></section></div>
      <section className="forecast-section"><div className="forecast-intro"><div><span className="eyebrow dark-eyebrow">PLAN AHEAD</span><h2>The next few days</h2></div><span>4-DAY OUTLOOK</span></div><div className="forecast-grid">{weather.daily.time.slice(0,4).map((day,i)=>{const info=getCondition(weather.daily.weather_code[i]);const Icon=info.icon;return <div className="forecast-card" key={day}><span>{i===0?'Today':new Date(day+'T12:00:00').toLocaleDateString('en-US',{weekday:'long'})}</span><Icon size={33} strokeWidth={1.5}/><strong>{convert(weather.daily.temperature_2m_max[i],unit)} <small>{convert(weather.daily.temperature_2m_min[i],unit)}</small></strong><p>{info.label}</p></div>})}</div></section>
    </>}
    <div className="weather-footnote"><LocateFixed size={15}/> Forecast data provided by Open-Meteo. Conditions may change.</div>
  </div>;
}
