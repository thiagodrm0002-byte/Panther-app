const supabase = window.supabase.createClient(
"https://rtuaentwbbqkbndzeeyo.supabase.co",
"sb_publishable_C44-EmJ5vKN8Kv6rEBrUdA_ZGVba0SQ"
);

let user = null;
let selectedDay = null;
let currentMonth = new Date();

/* LOGIN */
async function login(){

const { data, error } = await supabase.auth.signInWithPassword({
email: email.value,
password: password.value
});

if(error){
msg("Login incorrecto");
return;
}

user = data.user;

loginBox.style.display="none";
main.style.display="block";

renderCalendar();
loadArtists();
}

/* CALENDAR */
function renderCalendar(){

const grid = document.getElementById("calendarGrid");
grid.innerHTML="";

document.getElementById("monthTitle").innerText =
currentMonth.toLocaleString('es',{month:'long',year:'numeric'});

let days = new Date(
currentMonth.getFullYear(),
currentMonth.getMonth()+1,
0
).getDate();

for(let i=1;i<=days;i++){
grid.innerHTML += `<div class="day" onclick="openDay(${i})">${i}</div>`;
}
}

/* DAY */
async function openDay(day){

selectedDay = day;

selectedDayTitle.innerText = "Día " + day;

const { data } = await supabase
.from("appointments")
.select("*")
.eq("date", day);

appointments.innerHTML = data.map(t=>`
<div class="card ${t.status}">
${t.time} - ${t.client_name}<br>${t.artist_name}
</div>
`).join("");
}

/* SAVE */
async function save(){

await supabase.from("appointments").insert([{
client_name: client.value,
artist_name: artist.value,
time: time.value,
status: status.value,
date: selectedDay,
user_id: user.id
}]);

closeModal();
openDay(selectedDay);
}

/* ARTISTS */
async function loadArtists(){

const { data } = await supabase.from("artists").select("*");

artist.innerHTML="";

data.forEach(a=>{
artist.innerHTML += `<option>${a.name}</option>`;
});
}

/* MONTH */
function nextMonth(){
currentMonth.setMonth(currentMonth.getMonth()+1);
renderCalendar();
}

function prevMonth(){
currentMonth.setMonth(currentMonth.getMonth()-1);
renderCalendar();
}

/* MODAL */
function openModal(){
modal.style.display="flex";
}

function closeModal(){
modal.style.display="none";
}

/* MSG */
function msg(t){
document.getElementById("msg").innerText=t;
}
