const sb = supabase.createClient(
"https://muckmihrgifzxazghngw.supabase.co",
"sb_publishable_wNdAJjCUenMzrYSWMelwHw_-mbvowyW"
);

let user=null;
let profile=null;
let selectedDay=null;

/* ================= AUTH ================= */

async function login(){
const {data,error}=await sb.auth.signInWithPassword({
email:email.value,
password:password.value
});

if(error){msg("Error login");return;}

user=data.user;
await loadProfile();
start();
}

async function register(){
await sb.auth.signUp({
email:email.value,
password:password.value
});
msg("Usuario creado");
}

async function recover(){
await sb.auth.resetPasswordForEmail(email.value);
msg("Mail enviado");
}

/* SESSION AUTO */

(async()=>{
const {data}=await sb.auth.getUser();
if(data.user){
user=data.user;
await loadProfile();
start();
}
})();

/* PROFILE / ROLES */

async function loadProfile(){

const {data}=await sb
.from("profiles")
.select("*")
.eq("id",user.id)
.single();

profile=data;

if(!profile){
await sb.from("profiles").insert([{
id:user.id,
role:"admin"
}]);
profile={role:"admin"};
}
}

/* ================= START ================= */

function start(){
auth.style.display="none";
app.style.display="block";
roleTitle.innerText=profile.role.toUpperCase();
showCalendar();
}

/* ================= CALENDAR MONTH ================= */

function showCalendar(){

let html="<div class='grid'>";

for(let i=1;i<=30;i++){
html+=`<div class='day' onclick='openDay(${i})'>${i}</div>`;
}

html+="</div>";
content.innerHTML=html;
}

/* ================= RESOURCES (CINE STYLE) ================= */

const tatuadores=["ALEX","MARTIN","LUCA","SOFI"];

async function openDay(day){

selectedDay=day;

const {data}=await sb
.from("appointments")
.select("*")
.eq("date","Dia "+day);

let html="<div class='matrix'>";

// header
html+="<div></div>";
tatuadores.forEach(t=>{
html+=`<div class='cell'>${t}</div>`;
});

// rows
let slots=["10:00","11:00","12:00","13:00","14:00"];

slots.forEach(time=>{
html+=`<div class='cell'>${time}</div>`;

tatuadores.forEach(t=>{
let found=data.find(d=>d.time===time && d.artist===t);

let cls="free";
let label="";

if(found){
cls=found.status;
label="●";
}

html+=`
<div class='cell ${cls}' onclick="book('${time}','${t}')">
${label}
</div>`;
});
});

html+="</div>";

content.innerHTML=html;
}

/* ================= BOOK ================= */

async function book(time,artist){

let client=prompt("Cliente");
let status="pending";

await sb.from("appointments").insert([{
date:"Dia "+selectedDay,
time,
artist,
client,
status,
user_id:user.id
}]);

openDay(selectedDay);
}

/* ================= CLIENTS ================= */

function showClients(){
content.innerHTML=`
<div class="card">
<input id="cname" placeholder="Cliente">
<button onclick="saveClient()">Guardar</button>
</div>
`;
}

async function saveClient(){
await sb.from("clients").insert([{
name:cname.value,
user_id:user.id
}]);
}

/* ================= PAYMENTS ================= */

function showPayments(){
content.innerHTML=`
<div class="card">
<input id="pclient" placeholder="Cliente">
<input id="amount" placeholder="Monto">
<button onclick="savePay()">Guardar</button>
</div>
`;
}

async function savePay(){
await sb.from("payments").insert([{
client:pclient.value,
amount:amount.value,
status:"pending",
user_id:user.id
}]);
}

/* ================= UTIL ================= */

function msg(t){
document.getElementById("msg").innerText=t;
}
