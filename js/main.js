const elList = document.querySelector(".hero__cities-list");
const countryTemplate = document.querySelector(".country-template").content;
const elForm = document.querySelector(".site-form");
const elInput = document.querySelector(".form-input");
const searchTemplate = document.querySelector(".search-template").content;
const searchWrapper = document.querySelector(".search-wrapper");

const initialCountry = ["London", "Tokio", "Toshkent", "Istanbul", "Dubai"];
const fragment = new DocumentFragment();

initialCountry.forEach((item) => {
  function getData(country) {
    const response = fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${country}&units=metric&appid=1103290dc7ddc44fe0752d04f883a253`
    )
      .then((res) => res.json())
      .then((data) => renderCountry(data));
  }

  getData(item);
});

function renderCountry(obj) {
  const template = countryTemplate.cloneNode(true);
  const weatherData = obj.weather[0];

  template.querySelector(".hero__city-title").textContent = obj.name;
  template.querySelector(
    ".hero__country-temp-img"
  ).src = `http://openweathermap.org/img/wn/${weatherData.icon}.png`;
  template.querySelector(".hero__city-tem-num").textContent = Math.round(
    obj.main.temp
  );
  template.querySelector(".sunrise").textContent = defineTime(
    obj.sys.sunrise,
    obj.timezone
  );
  template.querySelector(".sunset").textContent = defineTime(
    obj.sys.sunset,
    obj.timezone
  );
  template.querySelector(
    ".hero__country-link"
  ).href = `https://openweathermap.org/weathermap?basemap=map&cities=true&layer=temperature&lat=${obj.coord.lat}&lon=${obj.coord.lon}&zoom=5`;

  fragment.appendChild(template);
  elList.appendChild(fragment);
}

function defineTime(sunTime, timeZone) {
  const time = new Date(sunTime * 1000);

  const hour = time.getHours() - 5;
  const finalSoat = String(hour + timeZone / 3600).padStart(2, 0);
  const mint = String(time.getMinutes()).padStart(2, 0);
  return `${finalSoat}:${mint}`;
}

elForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const inputVal = elInput.value;

  const response = fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&units=metric&appid=1103290dc7ddc44fe0752d04f883a253`
  )
    .then((res) => res.json())
    .then((data) => renderSearch(data))
    .catch((err) =>
      alert("There is no this country. Please enter right country")
    );
  elInput.value = "";
});

function renderSearch(obj) {
  searchWrapper.innerHTML = "";
  const template = searchTemplate.cloneNode(true);
  const weatherData = obj.weather[0];
  template.querySelector(
    ".search-left__img"
  ).src = `http://openweathermap.org/img/wn/${weatherData.icon}.png`;
  template.querySelector(".search-left__condition").textContent =
    weatherData.main;
  template.querySelector(".search-left__country-title").textContent = obj.name;
  template.querySelector(".search-left__num").textContent = Math.round(
    obj.main.temp
  );
  template.querySelector(".num-humidity").textContent = `${obj.main.humidity}%`;
  template.querySelector(
    ".num-pressure"
  ).textContent = `${obj.main.pressure}PS`;
  template.querySelector(".num-speed").textContent = `${obj.wind.speed}kh/h`;
  searchWrapper.appendChild(template);
}
