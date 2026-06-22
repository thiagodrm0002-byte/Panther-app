let currentDate = new Date();
let selectedDay = null;

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
grid.innerHTML += `<div class="day" onclick="openDay(${d})">${d}</div>`;
}
}

/* DAY */
function openDay(day){
selectedDay = day;
document.getElementById("selectedDay").innerText = "Día " + day;

document.getElementById("agendaList").innerHTML = `
<div class="card">10:00 - Juan</div>
<div class="card">12:15 - Ana (Seña)</div>
<div class="card">18:00 - Lucas</div>
`;
}

/* MODAL */
function openModal(){
document.getElementById("modal").style.display="flex";
}

function closeModal(){
document.getElementById("modal").style.display="none";
}

/* SAVE */
function save(){
closeModal();
}

/* INIT */
renderCalendar();
