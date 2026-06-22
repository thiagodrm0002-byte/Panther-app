const sb = supabase.createClient(
"https://muckmihrgifzxazghngw.supabase.co",
"sb_publishable_wNdAJjCUenMzrYSWMelwHw_-mbvowyW"
);

let user=null;
let profile=null;
let selectedDay=null;

/* USERS LOGIN (PROFILES TABLE) */

async function login(){

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

const {data} = await sb
.from("profiles")
.select("*")
.eq("username",username)
.eq("password",password)
.eq("active",true)
.single();

if(!data){
document.getElementById("msg").innerText="Login incorrecto";
return;
}

user=data;

localStorage.setItem("user",JSON.stringify(user));

startApp();
}

/* AUTO LOGIN */

(function(){
const saved = localStorage.getItem("user");
if(saved){
user=JSON.parse(saved);
startApp();
}
})();

function startApp(){
document.getElementById("auth").style.display="none";
document.getElementById("app").style.display="grid";

document.getElementById("roleBox").innerText =
"ROL: " + user.role;

showCalendar();
}

/* LOGOUT */

function logout(){
localStorage.removeItem("user");
location.reload();
}

/* CALENDAR */

function showCalendar(){

let html="<div class='calendar'>";

for(let i=1;i<=30;i++){
html+=`<div class='day' onclick='openDay(${i})'>${i}</div>`;
}

html+="</div>";

document.getElementById("calendar").innerHTML=html;
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
${t.artist_name || ""}
</div>
`;
});
}

document.getElementById("agenda").innerHTML=html;
}

/* CREATE TURN */

async function openModal(){

const client=prompt("Cliente");
const time=prompt("Hora (14:15)");
const artist=prompt("Tatuador");

await sb.from("appointments").insert([{
client,
time,
artist_name:artist,
date:"Dia "+selectedDay,
status:"pending",
user_id:user.id
}]);

openDay(selectedDay);
}

/* CLIENTS */

function showClients(){
alert("Clientes en siguiente módulo");
}

/* PAYMENTS */

function showPayments(){
alert("Pagos en siguiente módulo");
}

/* ARTISTS */

function showArtists(){
alert("Equipo en siguiente módulo");
}
