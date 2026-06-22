const sb = supabase.createClient(
"https://muckmihrgifzxazghngw.supabase.co",
"sb_publishable_wNdAJjCUenMzrYSWMelwHw_-mbvowyW"
);

let user=null;
let selectedDay=null;

/* LOGIN */
async function login(){

const u=document.getElementById("username").value;
const p=document.getElementById("password").value;

const {data}=await sb
.from("profiles")
.select("*")
.eq("username",u)
.eq("password",p)
.eq("active",true);

if(!data || data.length===0){
alert("Login incorrecto");
return;
}

user=data[0];

document.getElementById("login").style.display="none";
document.getElementById("app").style.display="grid";

document.getElementById("roleTag").innerText=user.role;

renderCalendar();
}

/* CALENDAR REAL SIMPLE */
function renderCalendar(){

let html="";

for(let i=1;i<=30;i++){
html+=`<div class="day" onclick="openDay(${i})">${i}</div>`;
}

document.getElementById("grid").innerHTML=html;
}

/* OPEN DAY */
async function openDay(day){

selectedDay=day;

document.getElementById("dayTitle").innerText="Día "+day;

const {data}=await sb
.from("appointments")
.select("*")
.eq("date","Dia "+day);

let html="";

if(data){
data.forEach(t=>{
html+=`
<div class="card ${t.status}">
<b>${t.time}</b><br>
${t.client}<br>
${t.artist_name}
</div>
`;
});
}

document.getElementById("agendaList").innerHTML=html;
}

/* MODAL */
function openModal(){
document.getElementById("modal").style.display="flex";
}

function closeModal(){
document.getElementById("modal").style.display="none";
}

/* SAVE TURN */
async function saveTurn(){

const client=document.getElementById("m_client").value;
const time=document.getElementById("m_time").value;
const artist=document.getElementById("m_artist").value;
const deposit=document.getElementById("m_deposit").value;

let status="booked";
if(deposit) status="pending";

await sb.from("appointments").insert([{
client,
time,
artist_name:artist,
deposit,
status,
date:"Dia "+selectedDay,
user_id:user.id
}]);

closeModal();
openDay(selectedDay);
}

/* LOGOUT */
function logout(){
location.reload();
}
