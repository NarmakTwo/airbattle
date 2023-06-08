const express = require("express");
const app = express();
const fs = require("fs");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const helmet = require("helmet");

const PORT = 3000;

/*app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        //"script-src":["'self'"]
      },
    },
  })
);*/

app.use(express.static("client"));


let players = {
  "id":[],
  "last":[]
};

io.on("connection", (socket)=>{
  let id = socket.id;
  let gameID = "";
  socket.join("lobby");
  socket.on("requestStartfrc",(content) => {
    io.to(id).emit("requestStartfrs",true);
    socket.leave("lobby");
    socket.join("room");
  });
  socket.on("datafrc", (content) => {
    if (!players.id.includes(content[0])) {
      gameID = content[0];
      players.id.push(content[0]);
      players.last.push(content[2]);
    }else{
      players.last.push(content[2]);
    };
    io.to("room").emit("datafrs",content);
  });
  socket.on("hitDatafrc", content => {
    io.to("room").emit("hitDatafrs",content);
  });
  socket.on("killDatafrc", content => {
    io.to("room").emit("killDatafrs",content);
  });
  socket.on("deathDatafrc", content => {
    const index = players.id.indexOf(gameID);
    players.id.splice(index,1);
    players.last.splice(index,1);
    io.to("room").emit("deathDatafrs",content);
  });
  socket.on("disconnect", (reason) => {
    if (players.id.indexOf(gameID) === -1) {
      
    }else{
      const index = players.id.indexOf(gameID);
      players.id.splice(index,1);
      players.last.splice(index,1);
    }
  })
});

function check() {
  const nowTime = (new Date()).getTime();
  for(let i = 0; i < players.id.length; i++) {
    if ((nowTime - players.last[i]) > 3000) {
      players.id.splice(i,1);
      players.last.splice(i,1);
      i--;
    }
  }
  io.to("lobby").emit("")
}

setInterval(check,3000);


function record() {
  console.log(players.id.length);
}

setInterval(record,60000);
// 3000番ポートでHTTPサーバーを起動
http.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
