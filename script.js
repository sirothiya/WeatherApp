const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");

const renderWeatherInfo = (data) => {
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const dataTemp = document.querySelector("[data-tempreature]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humadity = document.querySelector("[data-humadity]");
  const cloud = document.querySelector("[data-cloud]");

  cityName.innerText = data?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
  desc.innerText = data?.weather?.[0]?.description;
  weatherIcon.src = `https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
  dataTemp.innerText = `${data?.main?.temp}°C`;
  windspeed.innerText = `${data?.wind?.speed}m/s`;
  humadity.innerText = `${data?.main?.humidity}%`;
  cloud.innerText = `${data?.clouds?.all}%`;
};

const fetchUserWeatherInfo = async (cord) => {
  const { lat, lon } = cord;
  grantAccessContainer.classList.remove("active");
  loadingScreen.classList.add("active");

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const data = await res.json();
    console.log(data);
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
    console.log("error", err);
  }
};
const getfromSessionsStorage = () => {
  const localCoordiantes = sessionStorage.getItem("user-coordinates");
  if (!localCoordiantes) {
    grantAccessContainer.classList.add("active");
  } else {
    const cord = JSON.parse(localCoordiantes);
    fetchUserWeatherInfo(cord);
  }
};

getfromSessionsStorage();

const switchTab = (clickedTab) => {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");
    if (!searchForm.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      // ab main your weather tab me aagaya hu , toh weather bhi display karna padega , so lets check
      // local storage first  for coordinates if we have saved them there.
      getfromSessionsStorage();
    }
  }
};

userTab.addEventListener("click", () => {
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("no geo location support availabe");
  }
};

const showPosition = (position) => {
    // console.log("positions are",position)
  const usercoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
//   console.log(usercoordinates);

  sessionStorage.setItem("user-coordinates", JSON.stringify(usercoordinates));
  console.log("coordinates", sessionStorage.getItem("user-coordinates"));
  fetchUserWeatherInfo(usercoordinates);
};

const grantAcessButton = document.querySelector("[data-grant-acces]");

grantAcessButton.addEventListener("click", getLocation);

let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (searchInput.value === "") return;
  fetchSearchWeatherInfo(searchInput.value);
});

const fetchSearchWeatherInfo = async (city) => {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await res.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
  }
};
