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
.eq("active",true)
.single();

if(!data){
alert("Login incorrecto");
return;
}

user=data;

document.getElementById("login").style.display="none";
document.getElementById("app").style.display="grid";

document.getElementById("role").innerText=user.role;

initCalendar();
}

/* CALENDAR */
function initCalendar(){

let html="";
for(let i=1;i<=30;i++){
html+=`<div class='day' onclick='openDay(${i})'>${i}</div>`;
}

document.getElementById("calendar").innerHTML=html;
}

/* OPEN DAY */
async function openDay(day){

selectedDay=day;

document.getElementById("dayTitle")=`Día ${day}`;

const {data}=await sb
.from("appointments")
.select("*")
.eq("date","Dia "+day);

let html="";

data.forEach(t=>{
html+=`
<div class="card ${t.status}">
<b>${t.time}</b><br>
${t.client}<br>
${t.artist_name}
</div>
`;
});

document.getElementById("agenda").innerHTML=html;
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

const client=m_client.value;
const time=m_time.value;
const artist=m_artist.value;
const deposit=m_deposit.value;

let status="booked";
if(deposit && deposit!="") status="pending";

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
