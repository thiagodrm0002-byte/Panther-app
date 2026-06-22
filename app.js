const supabase = supabase.createClient(
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

if(error) return alert("Login error");

user = data.user;

loginView.style.display="none";
mainApp.style.display="flex";

renderCalendar();
loadArtists();
}

/* CALENDAR */
function renderCalendar(){

const grid = document.getElementById("calendarGrid");
grid.innerHTML = "";

document.getElementById("monthTitle").innerText =
currentMonth.toLocaleString('es',{month:'long',year:'numeric'});

let days = new Date(currentMonth.getFullYear(), currentMonth.getMonth()+1,0).getDate();

for(let i=1;i<=days;i++){
grid.innerHTML += `<div class="day" onclick="openDay(${i})">${i}</div>`;
}
}

/* DAY */
async function openDay(day){

selectedDay = day;

document.getElementById("selectedDay").innerText = "Día " + day;

let { data } = await supabase
.from("appointments")
.select("*")
.eq("date", day);

document.getElementById("appointments").innerHTML =
data.map(a=>`
<div class="card ${a.status}">
${a.time} - ${a.client_name}<br>${a.artist_name}
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
month: currentMonth.getMonth(),
user_id: user.id
}]);

closeModal();
openDay(selectedDay);
}

/* ARTISTS */
async function loadArtists(){

let { data } = await supabase.from("artists").select("*");

artist.innerHTML = "";

data.forEach(a=>{
artist.innerHTML += `<option>${a.name}</option>`;
});
}

/* MODAL */
function openModal(){
modal.style.display="flex";
}

function closeModal(){
modal.style.display="none";
}
