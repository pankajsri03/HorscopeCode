import {
  Origin,
  Horoscope
} from 'circular-natal-horoscope-js';

// Function to calculate Horoscope data based on provided inputs
function calculateHoroscope(data) {
  const origin = new Origin({
    year: data.year,
    month: data.month,
    date: data.date,
    hour: data.hour,
    minute: data.minute,
    latitude: data.latitude,
    longitude: data.longitude
  });

  return new Horoscope({
    origin: origin,
    houseSystem: "Campanus",
    zodiac: "tropical",
    customOrbs: {},
    language: "en"
  });
}

// Function to extract the UTC date details from a Date object
function getUTCDateDetails(date) {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(), // 0 = January, 11 = December
    date: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    latitude: 38.889805, // Default latitude
    longitude: -77.009056 // Default longitude
  };
}

// Function to transform celestial body data into key-value pairs
function getChartPlanetsData(celestialBodies) {
  return Object.assign({},
    ...celestialBodies.map((body) => ({
      [capitalizeFirstLetter(body.key)]: [body.ChartPosition.Ecliptic.DecimalDegrees]
    }))
  );
}



// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Function to hide specific chart elements by ID
function hideChartElements(elementIds) {
  elementIds.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = 'none';
    }
  });
}

// Function to draw the astrological chart on the page
function drawChart(data) {
  document.getElementById('paper').innerHTML = ''; // Clear previous chart
  const horoscopeData = calculateHoroscope(data);
  
  const chartPlanets = getChartPlanetsData(horoscopeData.CelestialBodies.all);
  console.log(chartPlanets);
  const asc = horoscopeData.Ascendant.ChartPosition.Horizon.DecimalDegrees;
  const desc = (asc + 180) % 360;
  const mc = horoscopeData.Midheaven.ChartPosition.Horizon.DecimalDegrees;
  const ic = (mc + 180) % 360;
  const chartCusps = [
    0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330
  ];
  // const chartCusps = horoscopeData.Houses.map((cusp) => cusp.ChartPosition.StartPosition.Ecliptic.DecimalDegrees);
  const chartData = {
    planets: chartPlanets,
    cusps: chartCusps
  };

  const chart = new astrochart.Chart('paper', 1200, 1200);
  const radix = chart.radix(chartData);
  radix.addPointsOfInterest({
    As: [asc],
    Mc: [mc],
    Ds: [desc],
    Ic: [ic]
  });
  radix.aspects();

  hideChartElements(['paper-astrology-radix-axis', 'paper-astrology-radix-cusps']);

  const chartPlanets2 = getPlanetData(horoscopeData); // Extract planet data
  renderPlanetInfo(chartPlanets2); // Render planet info in the left section
  const paperElement = document.getElementById('paper');
  const cx = paperElement.clientWidth / 2;
  const cy = paperElement.clientHeight / 2;
  const radius = Math.min(paperElement.clientWidth, paperElement.clientHeight) / 2 - 20; // Example with some padding
  var settings  = default_settings;
  console.log(settings);
  const extendedRadix = new ExtendedRadix(chart.paper, cx, cy, radius, chartData, settings);

  extendedRadix.drawCircles(); // Call the new method to draw degree lines

}


// Initialize the date and time picker using Flatpickr
function initializeDateTimePicker() {
  const currentUTCDate = new Date(new Date().toUTCString());

  flatpickr("#datetime-picker", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    defaultDate: currentUTCDate, // Set default date to current UTC time

    onChange: function (selectedDate) {
      const data = getUTCDateDetails(new Date(selectedDate));
      drawChart(data);
    }


  });
}

document.addEventListener("DOMContentLoaded", initializeDateTimePicker);

// On window load, draw the default chart with the current UTC date and time
window.onload = function () {
  const currentUTCDate = new Date(); // Get current UTC date and time
  const data = getUTCDateDetails(currentUTCDate);
  console.log(data);
  drawChart(data);
  initializeDateTimePicker(); // Initialize the date-time picker after drawing the chart
};

function getCombinedChartPlanetsData(celestialBodies, celestialPoints) {
  const chartPlanets1 = getChartPlanetsData(celestialBodies);
  const chartPlanets2 = Object.assign(
    {},
    ...celestialPoints.map((body) => ({
      [capitalizeFirstLetter(body.key)]: [body.ChartPosition.Ecliptic.DecimalDegrees]
    }))
  );
  
  return Object.assign({}, chartPlanets1, chartPlanets2);
}

function getPlanetData(horoscopeData) {
  const signs = [{
      name: "Aries",
      icon: "♈"
    },
    {
      name: "Taurus",
      icon: "♉"
    },
    {
      name: "Gemini",
      icon: "♊"
    },
    {
      name: "Cancer",
      icon: "♋"
    },
    {
      name: "Leo",
      icon: "♌"
    },
    {
      name: "Virgo",
      icon: "♍"
    },
    {
      name: "Libra",
      icon: "♎"
    },
    {
      name: "Scorpio",
      icon: "♏"
    },
    {
      name: "Sagittarius",
      icon: "♐"
    },
    {
      name: "Capricorn",
      icon: "♑"
    },
    {
      name: "Aquarius",
      icon: "♒"
    },
    {
      name: "Pisces",
      icon: "♓"
    },
    {
      name: "Northnode",
      icon: "☊"
    },
    {
      name: "Southnode",
      icon: "☊"
    },
    {
      name: "Lilith",
      icon: "♓"
    },

  ];

  const planetIcons = {
    Sun: '🌞',
    Moon: '🌙',
    Mercury: '☿️',
    Venus: '♀️',
    Mars: '♂️',
    Jupiter: '♃',
    Saturn: '♄',
    Uranus: '♅',
    Neptune: '♆',
    Pluto: '♇',
    NorthNode: '☊',
    Chiron: '⚷',
    Lilith: '☋',
    Sirius: '🌟'
  };

  return horoscopeData.CelestialBodies.all.map((body) => {
    const degree = body.ChartPosition.Ecliptic.DecimalDegrees;
    const signIndex = Math.floor(degree / 30); // 360 degrees divided into 12 signs
    const sign = signs[signIndex];

    return {
      name: capitalizeFirstLetter(body.key),
      degree: degree % 30, // Degree within the sign
      sign: sign.name,
      signIcon: sign.icon,
      planetIcon: planetIcons[capitalizeFirstLetter(body.key)]
    };
  });
}

function renderPlanetInfo(planetsData) {
  const planetList = document.querySelector('.left-section ul');
  planetList.innerHTML = ''; // Clear any existing content

  planetsData.forEach((planet) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<span class="planet-icon">${planet.planetIcon}</span> ${planet.name}  - in  ${planet.degree.toFixed(2)} ° <span class="zodiac-icon">${planet.signIcon}</span>  ${planet.sign}`;
    planetList.appendChild(listItem);
  });
}

const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme'); // Toggle the dark theme class
  themeToggle.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙'; // Change icon
});
