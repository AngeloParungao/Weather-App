import React, {useState, useEffect} from "react";
import axios from "axios";
import './App.css';
import cloudy from './assets/icons/cloudy.png'
import rainy from './assets/icons/rainy.png'
import thunderstorm from './assets/icons/thunderstorm.png'
import sunny from './assets/icons/sunny.png'
import { FontAwesomeIcon }  from '@fortawesome/react-fontawesome';
import { faCloud , faSearch , faSun , faMoon , faLocationDot , faCalendar} from '@fortawesome/free-solid-svg-icons';


function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState(); 
  const [locationTime, setLocationTime] = useState('');
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=3ba5effe2efa1b657ae10f0f35b68365`

  useEffect(() => {
    let interval;
    if (data.timezone) {
      interval = setInterval(() => {
        // Calculate the local time by adding the timezone offset (in seconds) to the UTC time
        const localTime = new Date(new Date().getTime() + data.timezone * 1000);
        
        // Update the state with the local time
        setLocationTime(localTime.toLocaleTimeString());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [data.timezone]);

  
  const getWeather = (evt) => {
    if(evt.key === "Enter"){
      axios.get(url).then(response => {
        setData(response.data);
        console.log(response.data);
      })
    }
  }

  const getColor = () => {
    const celcius = Math.ceil(data.main.temp - 273.15);

    if(celcius <= 15 && celcius >= 0){
      return "#09f";
    }
    else if(celcius > 15 && celcius < 25){
      return "#f90";
    }
    else if (celcius >= 25){
      return "#f00";
    }
    else{
      return "#00f";
    }
  }

  const getIcon = () => {
    if(data.weather[0].main === "Clear"){
      return sunny;
    }
  }

  const toggleDarkMode = () => {
    document.querySelector("body").setAttribute('data-theme' , 'dark');
    document.querySelector(".dark-icon").style.display = "none";
    document.querySelector(".light-icon").style.display = "block";
  };
  
  const toggleLightMode = () => {
    document.querySelector("body").setAttribute('data-theme' , 'light');
    document.querySelector(".light-icon").style.display = "none";
    document.querySelector(".dark-icon").style.display = "block";
  };

  return (
    <div>
      <div className="wrapper">
        <div className="navbar">
          <div className="logo">
            <FontAwesomeIcon icon={faCloud} />
            <span>SkyCast</span>
          </div>
          <div className="search">
            <div className="search-bar">
              <FontAwesomeIcon icon={faSearch} className="search-icon"/>
              <input
                placeholder="Enter Location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                onKeyPress={getWeather}
              >
              </input>
            </div>
            <div className="theme">
              <FontAwesomeIcon icon={faSun} onClick={toggleLightMode} className="light-icon"/>
              <FontAwesomeIcon icon={faMoon} onClick={toggleDarkMode} className="dark-icon"/>
            </div>
          </div>
        </div>
        {
          data.weather ? (
            <div className="weather">
              <div className="weather-content">
                <div>
                  <FontAwesomeIcon icon={faLocationDot} className="location-dot"/>
                  <span className="location-name">{data.name}</span>
                </div>
                <div>
                  <span className="location-temp" style={{color: getColor()}}>{Math.ceil(data.main.temp -  273.15)} °C</span>
                  <div>
                    <img src={getIcon()} alt="" className="weather-icon"/>
                  </div>
                  {/*data.weather ? <h1>{data.weather[0].main}</h1> : null*/}
                </div>
                <div>
                  <span className="date-today">
                    <FontAwesomeIcon icon={faCalendar} className="calendar"/>
                    {new Date().toLocaleDateString()}
                  </span>
                  <span className="time-today">
                    {locationTime}
                  </span>
                </div>
              </div>
              <div className="highlights">
                
              </div>
            </div>
          ) : (null)
        }
        <div className="icon-wrapper">
          {/*<div className="icons">
            <img src={cloudy} className="cloudy"></img>
            <img src={rainy} className="rainy"></img>
            <img src={thunderstorm} className="thunderstorm"></img>
            <img src={sunny} className="sunny"></img>
          </div>*/}
        </div>
      </div>
    </div>
  );
}

export default App;
