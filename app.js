const supabaseUrl = "https://muckmihrgifzxazghngw.supabase.co";
const supabaseKey = "sb_publishable_wNdAJjCUenMzrYSWMelwHw_-mbvowyW";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);


// LOGIN (simple)
function login(){
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  if(email && pass){
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
  }
}


// NAV
function show(section){
  const c = document.getElementById("content");

  if(!c){
    alert("No existe #content en HTML");
    return;
  }

  if(section === "turnos"){
    c.innerHTML = `
      <h3>📅 Turnos</h3>
      <input id="client" placeholder="Cliente"><br>
      <input id="date" placeholder="Fecha"><br>
      <input id="time" placeholder="Hora"><br>
      <button onclick="saveTurno()">Guardar turno</button>
    `;
  }

  if(section === "clientes"){
    c.innerHTML = `
      <h3>👤 Clientes</h3>
      <input id="name" placeholder="Nombre"><br>
      <input id="phone" placeholder="Teléfono"><br>
      <button onclick="saveClient()">Guardar cliente</button>
    `;
  }

  if(section === "pagos"){
    c.innerHTML = `
      <h3>💰 Pagos</h3>
      <input id="pclient" placeholder="Cliente"><br>
      <input id="amount" placeholder="Monto"><br>
      <button onclick="savePayment()">Guardar pago</button>
    `;
  }
}


// GUARDAR CLIENTE
async function saveClient(){
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  await supabaseClient.from("clients").insert([{ name, phone }]);

  alert("Cliente guardado");
}


// GUARDAR TURNO
async function saveTurno(){
  const client = document.getElementById("client").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  await supabaseClient.from("appointments").insert([{
    client, date, time, status:"ocupado"
  }]);

  alert("Turno guardado");
}


// GUARDAR PAGO
async function savePayment(){
  const client = document.getElementById("pclient").value;
  const amount = document.getElementById("amount").value;

  await supabaseClient.from("payments").insert([{
    client, amount, status:"pendiente"
  }]);

  alert("Pago guardado");
}
