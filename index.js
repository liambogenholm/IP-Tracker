const ipStackKey = ""; // Enter your ipstack API key here
const ipifyKey = ""; // Enter your ipify API key here
const map = L.map("map");

let searchButton = document.getElementById("search-btn");
let searchInput = document.getElementById("ip-search");

async function getClientIP() {
  let res = await fetch(
    `https://geo.ipify.org/api/v2/country?apiKey=${ipifyKey}&ipAddress=`
  );
  let data = await res.json();
  return data.ip;
}

async function ipify(ipAddress) {
  let res = await fetch(
    `https://geo.ipify.org/api/v2/country?apiKey=${ipifyKey}&ipAddress=${ipAddress}`
  );
  let data = await res.json();
  return data;
}

async function trackIP(ipAddress) {
  let res = await fetch(
    `http://api.ipstack.com/${ipAddress}?access_key=${ipStackKey}`
  );
  let data = await res.json();
  return data;
}

//-------------------------Event Listeners-------------------------//

searchButton.addEventListener("click", async () => {
  let ip = searchInput.value;
  let data;
  let data2;

  if (ip == "") {
    ip = await getClientIP();
    data2 = await ipify(ip);
    data = await trackIP(ip);
  } else {
    data2 = await ipify(ip);
    data = await trackIP(ip);
  }

  const lat = data.latitude;
  const lng = data.longitude;
  const location = data.city + ", " + data.region_name;
  const timezone = data2.location.timezone;
  const internet = data2.isp;

  document.getElementById("ip").innerHTML = ip;
  document.getElementById("location").innerHTML = location;
  document.getElementById("time").innerHTML = "UTC" + timezone;
  document.getElementById("internet").innerHTML = internet;

  map.setView([lat, lng], 14);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`Location of IP: ${ip}`)
    .openPopup();
});
