// 🔐 CONEXIÓN SUPABASE
const supabaseUrl = "https://muckmihrgifzxazghngw.supabase.co";
const supabaseKey = "sb_publishable_wNdAJjCUenMzrYSWMelwHw_-mbvowyW";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);


// 🔑 LOGIN
async function login(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if(error){
    alert("Error login: " + error.message);
    return;
  }

  document.getElementById("login").style.display = "none";
  document.getElementById("app").style.display = "block";
}


// 🧭 NAV SIMPLE
function show(section){
  const c = document.getElementById("content");

  if(section === "turnos"){
    c.innerHTML = `
      <h3>Turnos</h3>
      <input id="client" placeholder="Cliente">
      <input id="date" placeholder="Fecha">
      <input id="time" placeholder="Hora">
      <button onclick="saveTurno()">Guardar turno</button>
    `;
  }

  if(section === "clientes"){
    c.innerHTML = `
      <h3>Clientes</h3>
      <input id="name" placeholder="Nombre">
      <input id="phone" placeholder="Teléfono">
      <button onclick="saveClient()">Guardar cliente</button>
    `;
  }

  if(section === "pagos"){
    c.innerHTML = `
      <h3>Pagos</h3>
      <input id="pclient" placeholder="Cliente">
      <input id="amount" placeholder="Monto">
      <button onclick="savePayment()">Guardar pago</button>
    `;
  }
}


// 👤 CLIENTES
async function saveClient(){
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  const { error } = await supabaseClient.from("clients").insert([
    { name, phone }
  ]);

  if(error){
    alert(error.message);
  } else {
    alert("Cliente guardado");
  }
}


// 📅 TURNOS
async function saveTurno(){
  const client = document.getElementById("client").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  const { error } = await supabaseClient.from("appointments").insert([
    {
      client,
      date,
      time,
      status: "ocupado"
    }
  ]);

  if(error){
    alert(error.message);
  } else {
    alert("Turno guardado");
  }
}


// 💰 PAGOS
async function savePayment(){
  const client = document.getElementById("pclient").value;
  const amount = document.getElementById("amount").value;

  const { error } = await supabaseClient.from("payments").insert([
    {
      client,
      amount,
      status: "pendiente"
    }
  ]);

  if(error){
    alert(error.message);
  } else {
    alert("Pago guardado");
  }
}
