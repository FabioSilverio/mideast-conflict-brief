/* ── Map Initialization ── */
const map = L.map("map", {
  center: [29, 50],
  zoom: 5,
  zoomControl: true,
  attributionControl: false,
  minZoom: 3,
  maxZoom: 10,
});

L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png", {
  subdomains: "abcd",
  maxZoom: 19,
}).addTo(map);

/* Labels layer on top so country/city names are always readable */
L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png", {
  subdomains: "abcd",
  maxZoom: 19,
  pane: "overlayPane",
}).addTo(map);

/* ── Custom Marker Factory ── */
function createMarker(color, size) {
  size = size || 12;
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="position:relative;display:flex;align-items:center;justify-content:center">
      <div class="marker-pulse" style="border-color:${color};width:${size + 10}px;height:${size + 10}px"></div>
      <div class="marker-dot" style="background:${color};border-color:rgba(255,255,255,0.6);width:${size}px;height:${size}px;box-shadow:0 0 ${size}px ${color}"></div>
    </div>`,
    iconSize: [size + 10, size + 10],
    iconAnchor: [(size + 10) / 2, (size + 10) / 2],
  });
}

/* ── Color palette ── */
const C = {
  airstrike: "#ef4444",
  missile: "#ef4444",
  ground: "#f59e0b",
  naval: "#3b82f6",
  airspace: "#06b6d4",
  energy: "#a855f7",
  proxy: "#f97316",
};

/* ── Map Data ── */
const incidents = [
  // Iran - Airstrikes
  { lat: 35.70, lng: 51.42, label: "Tehran — 5,000+ Targets Hit", desc: "UPDATED: Joint Chiefs confirms 5,000+ targets struck. 'Most intense day' underway. 1,270+ killed. Toxic smoke from oil strikes over city.", color: C.airstrike, size: 16, tag: "airstrike", severity: "high" },
  { lat: 32.65, lng: 51.68, label: "Isfahan — Natanz Nuclear", desc: "Natanz enrichment facility severely damaged. F-14s destroyed at 8th Tactical Airbase.", color: C.airstrike, size: 14, tag: "airstrike", severity: "high" },
  { lat: 34.90, lng: 50.60, label: "Fordow Nuclear Facility", desc: "Underground enrichment facility struck. 440kg of 60%-enriched uranium unaccounted for.", color: C.airstrike, size: 14, tag: "airstrike", severity: "high" },
  { lat: 28.95, lng: 50.83, label: "Bushehr Airport", desc: "Airport destroyed in IDF strikes Mar 3.", color: C.airstrike, size: 10, tag: "airstrike", severity: "medium" },
  { lat: 29.62, lng: 52.53, label: "Shiraz — SEI Complex", desc: "Shiraz Electronics Industries hit 13+ times. Radar/avionics/missile production.", color: C.airstrike, size: 12, tag: "airstrike", severity: "high" },
  { lat: 35.58, lng: 51.50, label: "Tehran Oil Refineries", desc: "NEW: First strikes on oil infrastructure Mar 7-8. Tondgouyan & Shahran refineries hit.", color: C.energy, size: 14, tag: "energy", severity: "high" },
  { lat: 35.50, lng: 53.40, label: "Shahroud Missile Facility", desc: "Major missile production/storage facility struck Mar 7.", color: C.airstrike, size: 10, tag: "airstrike", severity: "high" },
  { lat: 36.68, lng: 48.49, label: "Zanjan — Hidden Launchers", desc: "Vehicle inspection center with hidden missile launchers destroyed Mar 9.", color: C.airstrike, size: 10, tag: "airstrike", severity: "medium" },

  // Lebanon
  { lat: 33.88, lng: 35.50, label: "Beirut — Dahiyeh", desc: "UPDATED: 570 killed, 750K displaced in Lebanon. Al-Qard Al-Hassan financial network hit again today. New wave of strikes across country.", color: C.airstrike, size: 14, tag: "airstrike", severity: "high" },
  { lat: 33.12, lng: 35.50, label: "South Lebanon — IDF Ground Op", desc: "Multiple IDF brigades advancing. 300th Bde, 36th Div, 401st Bde in ground incursion.", color: C.ground, size: 14, tag: "ground", severity: "high" },
  { lat: 34.10, lng: 36.22, label: "Nabi Chit — Bekaa Valley", desc: "IDF strike killed 41, injured 40+. Alleged Ron Arad intelligence operation.", color: C.airstrike, size: 12, tag: "airstrike", severity: "high" },

  // Israel — Incoming
  { lat: 32.80, lng: 35.00, label: "Haifa — Hezbollah Missiles", desc: "Hezbollah rockets hitting Haifa and Golan Heights. 8 IDF soldiers injured.", color: C.missile, size: 12, tag: "missile", severity: "high" },
  { lat: 31.93, lng: 34.87, label: "Central Israel — Deep Strikes", desc: "Hezbollah \"high-quality missiles\" hit Rehavam Camp (135km) and Elah Valley (160km). Deepest strikes ever.", color: C.missile, size: 12, tag: "missile", severity: "high" },

  // Gaza
  { lat: 31.50, lng: 34.47, label: "Gaza — Blockade Reimposed", desc: "Crossings closed since Feb 28. IDF operations within Yellow Line. Humanitarian crisis.", color: C.ground, size: 10, tag: "ground", severity: "medium" },

  // Gulf States
  { lat: 25.27, lng: 55.30, label: "Dubai — Airport Closed 5 Days", desc: "World's busiest international airport closed March 1-5. Limited Emirates/Etihad service resuming.", color: C.airspace, size: 14, tag: "airspace", severity: "high" },
  { lat: 24.45, lng: 54.65, label: "Abu Dhabi — Iranian Strikes", desc: "UPDATED: 6 killed, 122 injured in UAE since Feb 28. Nearly 30 more drones/missiles intercepted today. Fire crews battling Ruwais blaze.", color: C.missile, size: 12, tag: "missile", severity: "high" },
  { lat: 26.56, lng: 50.10, label: "Ras Tanura — Refinery Hit", desc: "Saudi Arabia's 550,000 bpd refinery shut down after drone debris fire.", color: C.energy, size: 14, tag: "energy", severity: "high" },
  { lat: 25.89, lng: 51.55, label: "Ras Laffan — LNG Shutdown", desc: "Qatar's LNG terminal struck. 20% of global LNG supply halted. Force majeure declared.", color: C.energy, size: 14, tag: "energy", severity: "high" },
  { lat: 25.09, lng: 51.35, label: "Doha — Al Udeid Air Base", desc: "63 drones + 117 missiles at Qatar. IRGC cell arrested. Qatar Airways on limited schedule.", color: C.missile, size: 12, tag: "missile", severity: "high" },
  { lat: 26.23, lng: 50.56, label: "Bahrain — 5th Fleet HQ", desc: "UPDATED: 100 missiles + 175 drones intercepted since war began. Residential building hit in Manama killing 1.", color: C.missile, size: 12, tag: "missile", severity: "high" },
  { lat: 29.38, lng: 47.98, label: "Kuwait — Ali al Salem AB", desc: "394 drones + 212 missiles. Air base fire. US Embassy struck and closed. Force majeure.", color: C.missile, size: 12, tag: "missile", severity: "high" },

  // Strait of Hormuz
  { lat: 26.60, lng: 56.30, label: "Strait of Hormuz — CLOSED", desc: "Tanker traffic at ZERO. 17 vessels attacked, 2 sunk, 3 seafarers killed. Only Chinese/Turkish ships permitted.", color: C.naval, size: 16, tag: "naval", severity: "high" },
  { lat: 26.56, lng: 54.88, label: "Bandar Lengeh — Corvette Sunk", desc: "Iranian Shahid Soleimani-class corvette sunk by combined force. 43+ Iranian naval vessels destroyed.", color: C.naval, size: 10, tag: "naval", severity: "medium" },

  // Iraq
  { lat: 33.30, lng: 44.40, label: "Baghdad — Militia Attacks", desc: "67+ drone/missile attacks on US forces. US Embassy targeted. PMF architecture fractured.", color: C.proxy, size: 14, tag: "missile", severity: "high" },
  { lat: 36.20, lng: 44.00, label: "Erbil — Harir Airbase", desc: "Repeated militia drone/missile attacks on US facilities.", color: C.proxy, size: 10, tag: "missile", severity: "high" },
  { lat: 30.50, lng: 47.78, label: "Basra — Rumaila Oil Field", desc: "Iran/proxies struck major oil field. Production down 70% (4.3M → 1.3M bpd). Baker Hughes facility hit.", color: C.energy, size: 14, tag: "energy", severity: "high" },

  // Syria
  { lat: 33.00, lng: 36.10, label: "Daraa — IDF Incursion", desc: "Israeli ground forces entered southern Syria. 4 civilians arrested near Jamla/Saisoun.", color: C.ground, size: 10, tag: "ground", severity: "medium" },

  // Red Sea / Houthis
  { lat: 14.80, lng: 42.95, label: "Yemen — Houthi Readiness", desc: "Signaled return to Red Sea operations. Reinforcements deployed to Hudaydah and Marib.", color: C.proxy, size: 12, tag: "missile", severity: "medium" },
  { lat: 12.50, lng: 43.50, label: "Bab el-Mandeb — Watch Zone", desc: "Critical chokepoint. Maersk re-rerouted around Cape of Good Hope. Houthi attacks expected.", color: C.naval, size: 12, tag: "naval", severity: "medium" },

  // Turkey
  { lat: 39.00, lng: 35.00, label: "Turkey — NATO Patriot Deployment", desc: "UPDATED: US Patriot system deployed to Malatya province. NATO strengthening Turkey air defenses near Kureik base.", color: C.airspace, size: 12, tag: "airspace", severity: "high" },

  // Saudi Pipeline
  { lat: 24.10, lng: 38.10, label: "Yanbu — Saudi Oil Reroute", desc: "Saudi Arabia rerouting crude via East-West Pipeline (7 mb/d capacity) to bypass Hormuz.", color: C.energy, size: 10, tag: "energy", severity: "medium" },

  // Mar 10 15:40 BRT updates
  { lat: 26.22, lng: 50.58, label: "Manama — Residential Building Hit", desc: "Iranian strike on residential building in Bahrain capital. 29-year-old woman killed, 8 injured. First confirmed civilian fatality.", color: C.missile, size: 12, tag: "missile", severity: "high" },
  { lat: 31.77, lng: 35.23, label: "Jerusalem — Sirens Activated", desc: "Fresh Iranian missile salvo toward Israel. Sirens in Jerusalem. Air defenses engaging incoming threats.", color: C.missile, size: 12, tag: "missile", severity: "high" },
  { lat: 32.08, lng: 34.78, label: "Tel Aviv — Explosions Reported", desc: "Explosions heard as Iron Dome intercepts Iranian missiles. 14 killed in Israel since war began.", color: C.missile, size: 12, tag: "missile", severity: "high" },

  // NEW — Mar 10 16:43 BRT updates
  { lat: 24.11, lng: 52.73, label: "Ruwais — ADNOC Refinery Shut Down", desc: "NEW: Iranian drone strike caused fire at Ruwais Industrial Complex. ADNOC shut world's largest refinery as precaution. No injuries.", color: C.energy, size: 14, tag: "energy", severity: "high" },
  { lat: 26.30, lng: 50.00, label: "Saudi Eastern Province — Drones Intercepted", desc: "NEW: Saudi defense ministry intercepted and destroyed 2 Iranian drones over oil-rich eastern territory.", color: C.missile, size: 10, tag: "missile", severity: "medium" },
  { lat: 29.50, lng: 47.75, label: "Kuwait — 6 Drones Downed", desc: "NEW: Kuwait National Guard shot down 6 Iranian drones across multiple regions.", color: C.missile, size: 10, tag: "missile", severity: "medium" },
  { lat: 36.19, lng: 44.01, label: "Kirkuk — Militia Airstrike", desc: "NEW: Airstrike in Kirkuk killed at least 5 Iran-linked militia members. Responsible party unclear.", color: C.airstrike, size: 10, tag: "airstrike", severity: "medium" },
  { lat: 36.40, lng: 44.40, label: "Erbil — UAE Consulate Hit", desc: "NEW: Iranian drone struck UAE consulate in Iraqi Kurdistan. Material damage, no injuries.", color: C.missile, size: 10, tag: "missile", severity: "medium" },
];

/* ── Add markers to map ── */
const markerLayers = {};
incidents.forEach(function (d) {
  var m = L.marker([d.lat, d.lng], { icon: createMarker(d.color, d.size) }).addTo(map);
  var sevColor = d.severity === "high" ? "#ef4444" : d.severity === "medium" ? "#f59e0b" : "#22c55e";
  var sevLabel = d.severity.toUpperCase();
  m.bindPopup(
    '<div class="popup-title">' + d.label + "</div>" +
    '<span class="popup-severity" style="background:' + sevColor + '20;color:' + sevColor + '">' + sevLabel + "</span>" +
    '<div style="margin-top:6px">' + d.desc + "</div>",
    { maxWidth: 280 }
  );
  if (d.label) markerLayers[d.label] = { marker: m, data: d };
});

/* ── Draw Strait of Hormuz zone ── */
L.polygon(
  [
    [26.0, 55.5],
    [27.0, 56.5],
    [26.8, 57.0],
    [25.8, 56.5],
    [25.5, 55.8],
  ],
  {
    color: "#ef4444",
    fillColor: "#ef4444",
    fillOpacity: 0.08,
    weight: 1,
    dashArray: "6,4",
  }
).addTo(map);

/* ── Draw Red Sea zone ── */
L.polygon(
  [
    [12.0, 43.0],
    [13.5, 43.5],
    [15.0, 42.0],
    [13.0, 41.5],
    [11.5, 42.0],
  ],
  {
    color: "#f59e0b",
    fillColor: "#f59e0b",
    fillOpacity: 0.06,
    weight: 1,
    dashArray: "6,4",
  }
).addTo(map);

/* ── Events Data ── */
var events = [
  { time: "Mar 10 16h", title: "ADNOC Shuts Ruwais Refinery After Drone Strike", desc: "Iranian drone caused fire at UAE's Ruwais Industrial Complex. ADNOC shut one of world's largest refineries as precaution. No injuries reported.", tag: "airstrike", severity: "high" },
  { time: "Mar 10 16h", title: "Trump Threatens Iran '20x Harder' Over Hormuz", desc: "Truth Social post: 'death, fire and fury will reign' if Iran blocks oil flow. Calls it a 'gift' to China and oil-dependent nations.", tag: "diplomacy", severity: "high" },
  { time: "Mar 10 16h", title: "Saudi, Kuwait Intercept Drones Over Territory", desc: "Saudi destroyed 2 drones over eastern oil region. Kuwait downed 6 drones. UAE consulate in Iraqi Kurdistan struck.", tag: "missile", severity: "medium" },
  { time: "Mar 10 16h", title: "US Eases Russian Oil Sanctions to Calm Markets", desc: "Treasury grants 30-day exemption for India to buy Russian oil in transit. Aims to offset Gulf supply disruption.", tag: "shipping", severity: "high" },
  { time: "Mar 10 16h", title: "South Korea Patriots Redeployed to Iran Theater", desc: "US pulling Patriot air defense systems from South Korea for Middle East. Seoul says it cannot stop the withdrawal.", tag: "diplomacy", severity: "medium" },
  { time: "Mar 10 16h", title: "Kirkuk Airstrike Kills 5 Militia Members", desc: "Airstrike in Kirkuk, Iraq killed at least 5 Iran-linked militia fighters. Responsible party unclear.", tag: "airstrike", severity: "medium" },
  { time: "Mar 10 16h", title: "Gold Corrects to $5,105 on Rising Yields", desc: "Down from $5,195 as Treasury yields rise and dollar firms. But safe-haven demand remains strong floor.", tag: "shipping", severity: "medium" },
  { time: "Mar 10 15h", title: "Hegseth: \"Most Intense Day\" of Strikes", desc: "5,000+ targets hit. 140 US troops injured (108 returned to duty). Iran missile launches at lowest rate since war began.", tag: "airstrike", severity: "high" },
  { time: "Mar 9", title: "Hezbollah Strikes Central Israel", desc: "\"High-quality missiles\" hit Rehavam Camp (135km) and IDF satellite station in Elah Valley (160km). Deepest Hezbollah strike into Israel.", tag: "missile", severity: "high" },
  { time: "Mar 9", title: "IDF Kills Nasr Unit Commander", desc: "Abu Hussein Ragheb killed in eastern South Lebanon. IDF 300th Brigade, 36th Div advancing.", tag: "ground", severity: "high" },
  { time: "Mar 9", title: "Iranian Corvette Sunk", desc: "Shahid Soleimani-class corvette sunk off Bandar Lengeh. 43+ Iranian naval vessels destroyed since Feb 28.", tag: "naval", severity: "medium" },
  { time: "Mar 8", title: "Mojtaba Khamenei Elected Supreme Leader", desc: "Son of assassinated Ali Khamenei elected by Assembly of Experts. No diplomatic signals yet.", tag: "diplomacy", severity: "high" },
  { time: "Mar 7-8", title: "Israel Strikes Oil Infrastructure", desc: "NEW ESCALATION: First strikes on Iranian oil — Tondgouyan Refinery, Shahran Refinery, Karaj depots.", tag: "airstrike", severity: "high" },
  { time: "Mar 8", title: "Oil Crosses $100/bbl", desc: "Brent surpassed $100 for first time since 2022. Peak $126 on Mar 3. Now $89-92 on de-escalation hopes.", tag: "shipping", severity: "high" },
  { time: "Mar 7", title: "Iraq Oil Production Down 70%", desc: "Southern fields at 1.3M bpd from 4.3M bpd. Kuwait declared force majeure. UAE lowered output.", tag: "shipping", severity: "high" },
  { time: "Mar 6", title: "Qatar LNG Force Majeure", desc: "Ras Laffan terminal shut after strikes. 20% of global LNG supply halted. TTF gas spiked to €60/MWh.", tag: "shipping", severity: "high" },
  { time: "Mar 6", title: "Bahrain Water Plant Hit", desc: "Iranian drone strikes Bahrain desalination plant. 3 injured by interception debris near university.", tag: "missile", severity: "high" },
  { time: "Mar 5", title: "Insurance Cancellations", desc: "Major P&I clubs canceled war risk coverage for Gulf vessels. Premiums surged to 3% of hull value.", tag: "shipping", severity: "high" },
  { time: "Mar 4", title: "NATO Intercepts Iranian Missile Over Turkey", desc: "First of two interceptions. Article 5 threshold under NATO discussion.", tag: "missile", severity: "high" },
  { time: "Mar 3", title: "IDF Ground Invasion of Lebanon", desc: "Multiple brigades enter South Lebanon. Seize Kfar Kila, Houla, Khiam. 500+ Hezbollah targets struck.", tag: "ground", severity: "high" },
  { time: "Mar 2", title: "Dubai Airport Closed", desc: "World's busiest international airport for travel closed for 5 consecutive days. Largest disruption since COVID.", tag: "shipping", severity: "high" },
  { time: "Mar 2", title: "Hezbollah Breaks Ceasefire", desc: "Fires rockets at Israel including Haifa missile defense site. IDF bombs Beirut at 3am.", tag: "missile", severity: "high" },
  { time: "Feb 28", title: "Operation Epic Fury Begins", desc: "US-Israel launch joint air campaign. Supreme Leader Khamenei assassinated. 500+ targets on day 1. Iran responds with Operation True Promise IV.", tag: "airstrike", severity: "high" },
];

/* ── Render Events ── */
var feedEl = document.getElementById("eventFeed");
events.forEach(function (ev) {
  var tagClass = "tag-" + ev.tag;
  var tagLabel = ev.tag.charAt(0).toUpperCase() + ev.tag.slice(1);
  var div = document.createElement("div");
  div.className = "event-item";
  div.setAttribute("data-severity", ev.severity);
  div.innerHTML =
    '<div class="event-time">' + ev.time + "</div>" +
    '<div class="event-body">' +
    '<div class="event-title">' + ev.title + "</div>" +
    '<div class="event-desc">' + ev.desc + "</div>" +
    '<span class="event-tag ' + tagClass + '">' + tagLabel + "</span>" +
    "</div>";
  feedEl.appendChild(div);
});

/* ── Tab Switching ── */
document.querySelectorAll(".tab-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".tab-btn").forEach(function (b) {
      b.classList.remove("active");
    });
    document.querySelectorAll(".tab-panel").forEach(function (p) {
      p.classList.remove("active");
    });
    btn.classList.add("active");
    document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
  });
});

/* ── Audio Player ── */
var audio = new Audio("./assets/brief-audio.mp3");
var playBtn = document.getElementById("playBtn");
var progressFill = document.getElementById("progressFill");
var progressBar = document.getElementById("progressBar");
var currentTimeEl = document.getElementById("currentTime");
var durationEl = document.getElementById("duration");
var isPlaying = false;

function formatTime(s) {
  var m = Math.floor(s / 60);
  var sec = Math.floor(s % 60);
  return m + ":" + (sec < 10 ? "0" : "") + sec;
}

playBtn.addEventListener("click", function () {
  if (isPlaying) {
    audio.pause();
    playBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>';
  } else {
    audio.play();
    playBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
  }
  isPlaying = !isPlaying;
});

audio.addEventListener("loadedmetadata", function () {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", function () {
  if (audio.duration) {
    progressFill.style.width = (audio.currentTime / audio.duration) * 100 + "%";
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
});

audio.addEventListener("ended", function () {
  isPlaying = false;
  playBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>';
  progressFill.style.width = "0%";
});

progressBar.addEventListener("click", function (e) {
  if (audio.duration) {
    var rect = progressBar.getBoundingClientRect();
    var pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  }
});

/* ── Responsive map resize ── */
window.addEventListener("resize", function () {
  map.invalidateSize();
});

/* Force map to recalculate size multiple times on load.
   This is critical for iframe/embed contexts where the
   container dimensions may not be available immediately. */
[100, 300, 500, 1000, 2000, 4000].forEach(function (ms) {
  setTimeout(function () {
    map.invalidateSize({ animate: false });
  }, ms);
});

/* Also invalidate when the document gains visibility (e.g. tab switch, iframe activation) */
document.addEventListener("visibilitychange", function () {
  if (!document.hidden) {
    map.invalidateSize({ animate: false });
  }
});
