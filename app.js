let currentDate = new Date();
let selectedDay = null;

let turnos = [];
let tatuadores = ["Alex", "Martín", "Sofi"];

renderCalendar();
renderArtists();
renderSelect();

/* CALENDAR */
function renderCalendar(){

const grid = document.getElementById("calendarGrid");
grid.innerHTML = "";

const year = currentDate.getFullYear();
const month = currentDate.getMonth();

document.getElementById("monthTitle").innerText =
currentDate.toLocaleString('es', {month:'long', year:'numeric'});

let firstDay = new Date(year, month, 1).getDay();
let days = new Date(year, month+1, 0).getDate();

for(let i=0;i<firstDay;i++){
grid.innerHTML += `<div></div>`;
}

for(let d=1; d<=days; d++){

grid.innerHTML += `
<div class="day" onclick="openDay(${d})">
${d}
</div>`;
}
}

/* DAY */
function openDay(day){

selectedDay = day;

document.getElementById("selectedDay").innerText = "Día " + day;

let html = "";

turnos
.filter(t => t.day === day)
.forEach(t => {

html += `
<div class="card ${t.status}">
<b>${t.time}</b><br>
${t.client}<br>
${t.artist}
</div>
`;
});

document.getElementById("agendaList").innerHTML = html;
}

/* SAVE */
function save(){

turnos.push({
day:selectedDay,
client:client.value,
time:time.value,
artist:artistSelect.value,
status:status.value
});

closeModal();
openDay(selectedDay);
}

/* MODAL */
function openModal(){
modal.style.display="flex";
}

function closeModal(){
modal.style.display="none";
}

/* ARTISTS */
function addArtist(){

let name = prompt("Tatuador");

if(name){
tatuadores.push(name);
renderArtists();
renderSelect();
}
}

function renderArtists(){

artistList.innerHTML =
tatuadores.map(t => "• " + t).join("<br>");
}

function renderSelect(){

artistSelect.innerHTML = "";

tatuadores.forEach(t=>{
artistSelect.innerHTML += `<option>${t}</option>`;
});
}

/* CLEAN */
function clearAll(){
turnos = [];
renderCalendar();
agendaList.innerHTML = "";
}
