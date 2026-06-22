let currentDate = new Date();
let selectedDay = null;

let turnos = [];
let tatuadores = ["Alex", "Martín", "Sofi"];

/* INIT */
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

let today = new Date().getDate();
let isToday = d === today;

grid.innerHTML += `
<div class="day ${isToday ? 'today' : ''}" onclick="openDay(${d})">
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
${t.time} - ${t.client}<br>
${t.artist}
</div>
`;
});

document.getElementById("agendaList").innerHTML = html;
}

/* SAVE */
function save(){

let client = document.getElementById("client").value;
let time = document.getElementById("time").value;
let artist = document.getElementById("artistSelect").value;
let status = document.getElementById("status").value;

turnos.push({
day:selectedDay,
client,
time,
artist,
status
});

closeModal();
openDay(selectedDay);
}

/* MODAL */
function openModal(){
document.getElementById("modal").style.display="flex";
}

function closeModal(){
document.getElementById("modal").style.display="none";
}

/* TATUADORES */
function addArtist(){

let name = prompt("Nombre tatuador");

if(name){
tatuadores.push(name);
renderArtists();
renderSelect();
}
}

function renderArtists(){

let html = "";

tatuadores.forEach(t=>{
html += `<div>• ${t}</div>`;
});

document.getElementById("artists").innerHTML = html;
}

function renderSelect(){

let sel = document.getElementById("artistSelect");
sel.innerHTML = "";

tatuadores.forEach(t=>{
sel.innerHTML += `<option>${t}</option>`;
});
}

/* NAV MONTH */
function prevMonth(){
currentDate.setMonth(currentDate.getMonth()-1);
renderCalendar();
}

function nextMonth(){
currentDate.setMonth(currentDate.getMonth()+1);
renderCalendar();
}

/* CLEAN */
function clearAll(){
turnos = [];
renderCalendar();
document.getElementById("agendaList").innerHTML = "";
}
