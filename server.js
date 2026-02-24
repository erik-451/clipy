
const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");
const bcrypt = require("bcryptjs");

const PASSWORD = process.env.PASSWORD;
const DATA_FILE = "/data/data.json";

const MAX_SIZE = 100000;
const MAX_ATTEMPTS = 10;
const BLOCK_TIME = 5 * 60 * 1000;

const passwordHash = bcrypt.hashSync(PASSWORD, 10);

// ---- LOAD DATA ----
let state;

if (fs.existsSync(DATA_FILE)) {
  state = JSON.parse(fs.readFileSync(DATA_FILE));
} else {
  state = { tabs: [ { name: "Tab 1", text: "" } ] };
  fs.writeFileSync(DATA_FILE, JSON.stringify(state,null,2));
}

// IP => { attempts, blockedUntil }
const clients = new Map();

function save(){
  fs.writeFileSync(DATA_FILE, JSON.stringify(state,null,2));
}

const server = http.createServer((req,res)=>{
  res.writeHead(200,{"Content-Type":"text/html"});
  res.end(fs.readFileSync("index.html"));
});

const wss = new WebSocket.Server({server});

function getClient(ip){
  if(!clients.has(ip)) clients.set(ip,{attempts:0,blockedUntil:0});
  return clients.get(ip);
}

function broadcast(){
  wss.clients.forEach(c=>{
    if(c.readyState===WebSocket.OPEN && c.authenticated){
      c.send(JSON.stringify(state));
    }
  });
}

wss.on("connection",(ws,req)=>{

  const ip=req.socket.remoteAddress;
  ws.authenticated=false;

  ws.on("message",async msg=>{

    if(msg.length>MAX_SIZE) return ws.close();

    const data=msg.toString();
    const client=getClient(ip);
    const now=Date.now();

    // BLOCK
    if(client.blockedUntil>now){
      ws.send(`__BLOCKED__:${Math.ceil((client.blockedUntil-now)/1000)}`);
      return ws.close();
    }

    // AUTH
    if(!ws.authenticated){

      const ok=await bcrypt.compare(data,passwordHash);
      if(!ok){
        client.attempts++;
        const left=MAX_ATTEMPTS-client.attempts;

        if(left<=0){
          client.blockedUntil=now+BLOCK_TIME;
          client.attempts=0;
          ws.send(`__BLOCKED__:${BLOCK_TIME/1000}`);
          return ws.close();
        }

        ws.send(`__AUTH_FAIL__:${left}`);
        return;
      }

      client.attempts=0;
      ws.authenticated=true;
      ws.send("__AUTH_OK__");
      ws.send(JSON.stringify(state));
      return;
    }

    // ---- CLIENT UPDATE ----
    const payload=JSON.parse(data);
    state=payload;
    save();
    broadcast();

  });

});

server.listen(3000,()=>console.log("clipy persistent running"));
