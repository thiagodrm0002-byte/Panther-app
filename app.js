let currentDate = new Date();
let selectedDay = null;

let artists = ["Alex", "Sofi"];
let appointments = [];

/* INIT */
renderCalendar();
renderArtists();

/* NAV VIEWS */
function showView(view){

document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
document.getElementById(view+"View").classList.add("active");
}

/* CALENDAR */
function renderCalendar(){

const grid = document.getElementById("calendarGrid");
grid.innerHTML = "";

document.getElementById("monthTitle").innerText =
currentDate.toLocaleString('es',{month:'long',year:'numeric'});

let firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
let days = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 0).getDate();

for(let i=0;i<firstDay;i++){
grid.innerHTML += `<div></div>`;
}

for(let d=1;d<=days;d++){
grid.innerHTML += `<div class="day" onclick="openDay(${d})">${d}</div>`;
}
}

/* DAY */
function openDay(day){

selectedDay = day;

document.getElementById("selectedDay").innerText = "Día " + day;

let list = appointments.filter(a=>a.day===day);

document.getElementById("appointmentsList").innerHTML =
list.map(a=>`
<div class="card ${a.status}">
${a.time}<br>${a.client}<br>${a.artist}
</div>
`).join("");
}

/* SAVE */
function saveAppointment(){

appointments.push({
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
function openModal(){modal.style.display="flex"}
function closeModal(){modal.style.display="none"}

/* ARTISTS */
function addArtist(){

if(newArtist.value){
artists.push(newArtist.value);
newArtist.value="";
renderArtists();
}
}

function renderArtists(){

artistSelect.innerHTML="";
artists.forEach(a=>{
artistSelect.innerHTML += `<option>${a}</option>`;
});
}

/* MONTH */
function prevMonth(){
currentDate.setMonth(currentDate.getMonth()-1);
renderCalendar();
}

function nextMonth(){
currentDate.setMonth(currentDate.getMonth()+1);
renderCalendar();
}
