const socket = io({
  reconnectionDelay:500,
  reconnectionDelayMax:500
});
var nameBox1 = document.getElementById("name1");
var nameBox2 = document.getElementById("name2");

let id = "";
for (let i = 0; i < 10; i++) {
  id = id + "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM123456789".charAt(rndInt(0,60));
}
let player = {
  "name":"",
  "id":id
}

let updateCooltime = 10;
let waitingForResponce = false;

document.getElementById("startBtn").addEventListener("click",() => {
  if (!waitingForResponce) {
    socket.emit("requestStartfrc","");
    waitingForResponce = true;
  }
});

socket.on("requestStartfrs",(content) =>{
  //入室したか
  if (content) {
    start();
  }
  waitingForResponce = true;
})


function commLoop() {
  if (!aircraft.exploded) {
    updateCooltime -= 1 * gameSpeed;
    if (updateCooltime <= 0) {
      const postureData = [player.name,
                           Math.round(aircraft.x),
                           Math.round(aircraft.y),
                           Math.round(aircraft.z),
                           aircraft.axis,
                           aircraft.rad,
                           aircraft.hp,
                           aircraft.score,
                           aircraft.exploded];
      const nowTime = (new Date()).getTime();
      socket.emit("datafrc", [player.id,postureData,nowTime]);
      updateCooltime += 10;
    }
  }
  for (let i = 0; i < hit.length; i++) {
    socket.emit("hitDatafrc",[player.id,hit[i]]);
  }
  hit = [];

  for (let i = 0; i < otherAircrafts.length; i++) {
    let oa = otherAircrafts[i];
    oa.int += 1 * gameSpeed;
    oa.now.x = oa.old.x + (oa.new.x-oa.old.x)*(oa.int)/20;
    oa.now.y = oa.old.y + (oa.new.y-oa.old.y)*(oa.int)/20;
    oa.now.z = oa.old.z + (oa.new.z-oa.old.z)*(oa.int)/20;
    oa.now.axis = oa.new.axis;
    oa.now.rad = oa.new.rad;
    oa.x = oa.now.x;
    oa.y = oa.now.y;
    oa.z = oa.now.z;
    oa.axis = oa.now.axis;
    oa.rad = oa.now.rad;
    oa.update();
    
    if (oa.targetting.counter > 0) {
      oa.targetting.counter--;
      if (oa.targetting.counter <= 0) {
        oa.targetting.value = false;
      }
    }

    
    const nowTime = (new Date()).getTime();
    if (nowTime - oa.lastUpdate > 3000 || oa.exploded || isNaN(oa.y)) {
      if (oa.exploded) {
        for (let k = 0; k < 15; k++) {
          blasts.push(new Blast(oa.x,oa.y,oa.z,300,50));
          objects.push(blasts[blasts.length-1]);
        }
      }
      otherAircrafts[i].dead = true;
      otherAircrafts.splice(i,1);
      i--;
    }

  }
  requestAnimationFrame(commLoop);
}

socket.on("datafrs",(content) => {
  //content→データ [id,新しい位置,送ったときの時間]
  
  if (content[0] !== player.id) {
    let exist = false;
    for (let i = 0; i < otherAircrafts.length; i++) {
      if (otherAircrafts[i].id === content[0]) {
        exist = true;
        if (content[2] > otherAircrafts[i].lastUpdate) {
          //送られてきたデータの持ち主の古いデータを上書きする
          otherAircrafts[i].old = Object.assign({}, otherAircrafts[i].now);
          otherAircrafts[i].new = {"x":content[1][1],"y":content[1][2],"z":content[1][3],"axis":content[1][4],"rad":content[1][5]};
          otherAircrafts[i].int = 0;
          otherAircrafts[i].hp = content[1][6]
          otherAircrafts[i].score = content[1][7]
          otherAircrafts[i].exploded = content[1][8];
          otherAircrafts[i].lastUpdate = content[2];
          break;
        }
      }
    }
    if (!exist) {
      otherAircrafts.push(new Aircraft(0,500,1600));
      otherAircrafts[otherAircrafts.length-1].id = content[0];
      otherAircrafts[otherAircrafts.length-1].name = content[1][0];
      otherAircrafts[otherAircrafts.length-1].new = {"x":content[1][1],"y":content[1][2],"z":content[1][3],"axis":content[1][4],"rad":content[1][5]};
      otherAircrafts[otherAircrafts.length-1].old = {"x":content[1][1],"y":content[1][2],"z":content[1][3],"axis":content[1][4],"rad":content[1][5]};;
      otherAircrafts[otherAircrafts.length-1].now = {"x":content[1][0],"y":content[1][1],"z":content[1][3],"axis":content[1][4],"rad":content[1][5]};;
      otherAircrafts[otherAircrafts.length-1].int = 0;
      otherAircrafts[otherAircrafts.length-1].hp = content[1][6];
      otherAircrafts[otherAircrafts.length-1].score = content[1][7];
      otherAircrafts[otherAircrafts.length-1].lastUpdate = content[2];
      otherAircrafts[otherAircrafts.length-1].exploded = false;
      otherAircrafts[otherAircrafts.length-1].targetting = {"value":false,"counter":0};
      otherAircrafts[otherAircrafts.length-1].update();

      objects.push(otherAircrafts[otherAircrafts.length-1]);
    }
    
  }
});

socket.on("hitDatafrs", (content) => {
  //[打った人のid,相手]
  if (content[1] === player.id && !aircraft.exploded) {
    let oa;
    for (let i = 0; i < otherAircrafts.length; i++) {
      if (otherAircrafts[i].id === content[0]) {
        oa = otherAircrafts[i];
      }
    }
    oa.targetting = {
      "value":true,
      "counter":300
    }
    msg.setMsg("You were hit by "+oa.name);
    
    for (let k = 0; k < 10; k++) {
      blasts.push(new Blast(aircraft.x,aircraft.y,aircraft.z,100,6));
      objects.push(blasts[blasts.length-1]);
    }
    aircraft.hp -= 10;
    if (aircraft.hp < 0) {
      aircraft.hp = 0;
    }
    if (aircraft.hp === 0) {
      aircraft.exploded = true;
      causeOfDeath = "You were destroyed by "+oa.name;
      socket.emit("killDatafrc",[player.id,content[0]]);
    }
  }
});

socket.on("killDatafrs",(content) => {
  //[キルされた人のid,やった人のid]let oa;
  let oa;
  for (let i = 0; i < otherAircrafts.length; i++) {
    if (otherAircrafts[i].id === content[0]) {
      oa = otherAircrafts[i];
    }
  }
  if (content[1] === player.id && !aircraft.exploded) {
    aircraft.score += 50;
    msg.setMsg("You destroyed "+oa.name);
  }
});

socket.on("deathDatafrs",(content) => {
  //id
  if (content !== player.id) {
    let oa;
    let oaI = 0;
    for (let i = 0; i < otherAircrafts.length; i++) {
      if (otherAircrafts[i].id === content) {
        oa = otherAircrafts[i];
        oaI = i;
      }
    }
    for (let k = 0; k < 15; k++) {
      blasts.push(new Blast(oa.x,oa.y,oa.z,300,50));
      objects.push(blasts[blasts.length-1]);
    }
    oa.dead = true;
    otherAircrafts.splice(oaI,1);
  }
});

function sendDeathData() {
  socket.emit("deathDatafrc",player.id);
}