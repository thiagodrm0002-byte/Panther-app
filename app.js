const sb = supabase.createClient(
"https://muckmihrgifzxazghngw.supabase.co",
"sb_publishable_wNdAJjCUenMzrYSWMelwHw_-mbvowyW"
);

let user=null;
let profile=null;

/* ================= AUTH ================= */

async function login(){
const {data,error}=await sb.auth.signInWithPassword({
email:email.value,
password:password.value
});

if(error){msg("error login");return;}

user=data.user;
await loadProfile();
start();
}

async function register(){
await sb.auth.signUp({
email:email.value,
password:password.value
});
msg("usuario creado");
}

async function recover(){
await sb.auth.resetPasswordForEmail(email.value);
msg("mail enviado");
}

/* SESSION */

(async()=>{
const {data}=await sb.auth.getUser();
if(data.user){
user=data.user;
await loadProfile();
start();
}
})();

async function loadProfile(){
const {data}=await sb.from("profiles")
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
title.innerText="Panel "+profile.role;

renderCalendar();
}

/* ================= CALENDAR PRO ================= */

function getSlots(){
return ["10:05","12:15","14:30","16:00","18:00"];
}

async function renderCalendar(){

let html="<div class='grid'>";

for(let i=1;i<=25;i++){
html+=`<div class='card' onclick='openDay(${i})'>Día ${i}</div>`;
}

html+="</div>";

content.innerHTML=html;
}

async function openDay(day){

const {data}=await sb.from("appointments")
.select("*")
.eq("date","Dia "+day);

let slots=getSlots();

let html=`<div class='panel'><h3>Día ${day}</h3>`;

slots.forEach(s=>{

let found=data.find(d=>d.time===s);

let cls="free";
let label="Libre";

if(found){
cls=found.status;
label=found.client;
}

html+=`
<div class="card ${cls}" onclick="book('${day}','${s}')">
${s} - ${label}
</div>
`;
});

html+=`
<input id="client" placeholder="Cliente">
<input id="deposit" placeholder="Seña (opcional)">
<button onclick="save('${day}')">Guardar turno</button>
</div>`;

content.innerHTML=html;
}

async function book(day,time){
let client=prompt("cliente");

await sb.from("appointments").insert([{
date:"Dia "+day,
time,
client,
status:"pending",
user_id:user.id
}]);

openDay(day);
}

/* SAVE MANUAL */

async function save(day){

await sb.from("appointments").insert([{
date:"Dia "+day,
time:time.value,
client:client.value,
status:"pending",
deposit:deposit.value || 0,
user_id:user.id
}]);

openDay(day);
}

/* ================= CLIENTS ================= */

function renderClients(){
content.innerHTML=`
<h3>Clientes</h3>
<input id="cname" placeholder="Nombre">
<input id="cphone" placeholder="Tel">
<button onclick="saveClient()">Guardar</button>
`;
}

async function saveClient(){
await sb.from("clients").insert([{
name:cname.value,
phone:cphone.value,
user_id:user.id
}]);
}

/* ================= PAYMENTS ================= */

function renderPayments(){
content.innerHTML=`
<h3>Pagos</h3>
<input id="pclient" placeholder="Cliente">
<input id="pamount" placeholder="Monto">
<button onclick="savePayment()">Guardar</button>
`;
}

async function savePayment(){
await sb.from("payments").insert([{
client:pclient.value,
amount:pamount.value,
status:"pending",
user_id:user.id
}]);
}

/* ================= FILTERS ================= */

function renderFilters(){
content.innerHTML=`
<h3>Filtros</h3>
<input id="fdate" placeholder="Dia">
<input id="fclient" placeholder="Cliente">
<button onclick="search()">Buscar</button>
`;
}

async function search(){

let q=sb.from("appointments").select("*");

if(fdate.value) q=q.eq("date",fdate.value);
if(fclient.value) q=q.eq("client",fclient.value);

const {data}=await q;

content.innerHTML=data.map(t=>`
<div class="card">${t.client} - ${t.time} - ${t.status}</div>
`).join("");
}

/* UTIL */

function msg(t){
document.getElementById("msg").innerText=t;
}
