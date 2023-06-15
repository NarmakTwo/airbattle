let cam;

let objects;

let hit;
let target;
let msg;

let coolTime;

class Vertex {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

let ground;
let bullets;
let targets;
let blasts;
let causeOfDeath;

//draw();

function reset() {
  cam = {
    "axis": { "x": 0, "y": 1, "z": 0 },
    "rad": 0,
    "x": 0,
    "y": 40,
    "z": 0
  }
  objects = [];

  hit = [];
  msg = {
    content:"",
    counter:0,
    setMsg:function(arg){
      this.content = arg;
      this.counter = 60;
    },
    update:function(){
      if (this.counter > 0) {
        this.counter--;
        if (this.counter <= 0) {
          this.content = "";
        }
      }
    }
  };
  coolTime = 15;

  otherAircrafts = [];
  causeOfDeath = "";
  
  ground = new Ground();
  bullets = [];
  targets = [];
  blasts = [];
  //targets.push(new Target(0, 282, 600));
  //objects.push(targets[0]);
  aircraft = new Aircraft(rndInt(-20000,20000), 100, rndInt(-20000,20000));
  objects.push(aircraft);
}

function start() {
  if (nameBox1.value === "") {
    player.name = nameBox2.value;
  }else{
    player.name = nameBox1.value + " " + nameBox2.value;
  }
  player.name = document.getElementById("nameBox").value
  document.getElementById("startBtn").style.display = "none";
  document.getElementById("name1").style.display = "none";
  document.getElementById("name2").style.display = "none";
  reset();
  mainLoop();
  commLoop();
}

function mainLoop() {

  if (key.e) {
    aircraft.rudder = 1;
  }else if (key.q) {
    aircraft.rudder = -1;
  }else{
    aircraft.rudder = 0;
  }
  if (key.a) {
    aircraft.aileron = 1;
  }else if (key.d) {
    aircraft.aileron = -1;
  }else{
    aircraft.aileron = 0;
  }
  if (key.w) {
    aircraft.elevator = 1;
  }else if (key.s) {
    aircraft.elevator = -1;
  }else{
    aircraft.elevator = 0;
  }
  
  if (key.i) {
    if (aircraft.throttle < 1) {
      aircraft.throttle += 0.01;
    }
  }
  if (key.k) {
    if (aircraft.throttle > 0) {
      aircraft.throttle -= 0.01;
    }
  }
  
  
  aircraftPB();

  if (!aircraft.exploded) {
    if (coolTime > 0) {
      coolTime -= 1 * gameSpeed;
    }
    if (key.j && coolTime <= 0) {
      let vec = getLocalZAxis(aircraft.axis,aircraft.rad);
      vec.x *= 150 * gameSpeed;
      vec.y *= 150 * gameSpeed;
      vec.z *= 150 * gameSpeed;
      let add = rotate(aircraft.axis,aircraft.speed,aircraft.rad);
      vec.x += add.x * gameSpeed;
      vec.y += add.y * gameSpeed;
      vec.z += add.z * gameSpeed;
      bullets.push(new Bullet(aircraft.x, aircraft.y, aircraft.z, vec));
      objects.push(bullets[bullets.length-1]);
      coolTime = 6;
    }
    aircraft.update();

    if (Math.abs(aircraft.x) > 80000 || Math.abs(aircraft.z) > 80000) {
      msg.setMsg("Go back to the center (× mark is center)");
    }
    if (Math.abs(aircraft.x) > 100000 || Math.abs(aircraft.z) > 100000) {
      aircraft.hp--;
      if (aircraft.hp <= 0) {
        aircraft.exploded = true;
        causeOfDeath = "U Ded";
      }
    }
    
    aircraft.recentPosture.shift();
    aircraft.recentPosture.push([aircraft.axis, aircraft.rad]);
    let newCamPos = rotate(aircraft.recentPosture[0][0], { "x": 0, "y": 50, "z": -300 }, aircraft.recentPosture[0][1]);
    cam.x = aircraft.x + newCamPos.x;
    cam.y = aircraft.y + newCamPos.y;
    if (cam.y < 10) {
      cam.y = 10;
    }
    cam.z = aircraft.z + newCamPos.z;
    cam.axis = aircraft.recentPosture[0][0];
    cam.rad = aircraft.recentPosture[0][1];
  
    ground.update();

    msg.update();

    if (isNaN(aircraft.y)) {
      aircraft.exploded = true;
      causeOfDeath = "U Ded";
      sendDeathData();
    }
  
    for (let i = 0; i < bullets.length; i++) {
      bullets[i].x += bullets[i].vec.x * gameSpeed;
      bullets[i].y += bullets[i].vec.y * gameSpeed;
      bullets[i].z += bullets[i].vec.z * gameSpeed;
      bullets[i].vertexes = [];
      bullets[i].vertexes.push(new Vertex(bullets[i].x,bullets[i].y,bullets[i].z));
      let relX = bullets[i].x-aircraft.x;
      let relY = bullets[i].y-aircraft.y;
      let relZ = bullets[i].z-aircraft.z;
      //地面と距離から判定
      if (Math.sqrt(relX**2+relY**2+relZ**2) > 30000 || bullets[i].y < 10) {
        bullets[i].dead = true;
        bullets.splice(i,1);
        i--;
      }else{
        let esc = false;
        for (let j = 0; j < targets.length; j++) {
          relX = bullets[i].x-targets[j].x;
          relY = bullets[i].y-targets[j].y;
          relZ = bullets[i].z-targets[j].z;
          if (Math.sqrt(relX**2+relY**2+relZ**2) < 400) {
            for (let k = 0; k < 20; k++) {
              blasts.push(new Blast(targets[j].x,targets[j].y,targets[j].z,400,70));
              objects.push(blasts[blasts.length-1]);
            }
            targets[j].dead = true;
            targets.splice(j,1);
            j--;
            bullets[i].dead = true;
            bullets.splice(i,1);
            i--;
  
            targets.push(new Target(aircraft.x+rndInt(-20000,20000), rndInt(1000,3000), aircraft.z+rndInt(-10000,10000)));
            objects.push(targets[targets.length-1]);
            esc = true;
            break;
          }
        }
        if (!esc) {
/*          for (let j = 0; j < otherAircrafts.length; j++) {
*            relX = bullets[i].x-otherAircrafts[j].x;
*            relY = bullets[i].y-otherAircrafts[j].y;
*            relZ = bullets[i].z-otherAircrafts[j].z;
*            if (Math.sqrt(relX**2+relY**2+relZ**2) < 300) {
*              for (let k = 0; k < 5; k++) {
*                blasts.push(new Blast(otherAircrafts[j].x,otherAircrafts[j].y,otherAircrafts[j].z,100,10));
*                objects.push(blasts[blasts.length-1]);
*              }
*              bullets[i].dead = true;
*              bullets.splice(i,1);
*              i--;
*              hit.push(otherAircrafts[j].id);
*              aircraft.score += 10;
*              msg.setMsg("You hit "+otherAircrafts[j].name);
*              break;
*            }
*          }
*        }*/
          for (let j = 0; j < otherAircrafts.length; j++) {
            relX = bullets[i].x - otherAircrafts[j].x;
            relY = bullets[i].y - otherAircrafts[j].y;
            relZ = bullets[i].z - otherAircrafts[j].z;
            if (Math.sqrt(relX * relX + relY * relY + relZ * relZ) < 10 && Math.abs(bullets[i].y - otherAircrafts[j].y) < 5) {
                for (let k = 0; k < 5; k++) {
                    blasts.push(new Blast(otherAircrafts[j].x, otherAircrafts[j].y, otherAircrafts[j].z, 100, 10));
                    objects.push(blast[blast.length - 1]);
                }
                bullets[i].dead = true;
                bullets.splice(i, 1);
                i--;
                hit.push(otherAircrafts[j].id);
                aircraft.score += 10;
                message.setMsg("You hit " + otherAircrafts[j].name);
                break;
            }
         }
      }
    }
  
    for (let i = 0; i < blasts.length; i++) {
      let blast = blasts[i];
      blast.prog += 0.02 * gameSpeed;
      if (blast.prog <= 1) {
        blast.x = blast.center.x + (blast.vec.x * (1-(1-blast.prog)**2));
        blast.y = blast.center.y + (blast.vec.y * (1-(1-blast.prog)**2));
        blast.z = blast.center.z + (blast.vec.z * (1-(1-blast.prog)**2));
        const size = blast.size * ((1-blast.prog)**2);
        blast.vertexes = [];
        blast.vertexes.push(new Vertex(blast.x,blast.y,blast.z));
        blast.faces = [];
        blast.faces.push([0,size,"#FFFFFF"])
      }else{
        blast.dead = true;
        blasts.splice(i,1);
        i--;
      }
    }
    
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].dead) {
        objects.splice(i,1);
        i--;
        break;
      }
    
      let relX = objects[i].x-aircraft.x;
      let relY = objects[i].y-aircraft.y;
      let relZ = objects[i].z-aircraft.z;
      //地面と距離から判定
      if (Math.sqrt(relX**2+relY**2+relZ**2) < 30000 || objects[i].visible === "ground") {
        objects[i].visible = true;
      }else{
        objects[i].visible = false;
      }
    }
    
    draw();
    requestAnimationFrame(mainLoop);
  }else{
    for (let k = 0; k < 15; k++) {
      blasts.push(new Blast(aircraft.x,aircraft.y,aircraft.z,300,50));
      objects.push(blasts[blasts.length-1]);
    }
    sendDeathData();
    gameOverLoop();
  }
}

function gameOverLoop() {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].x += bullets[i].vec.x * gameSpeed;
    bullets[i].y += bullets[i].vec.y * gameSpeed;
    bullets[i].z += bullets[i].vec.z * gameSpeed;
    bullets[i].vertexes = [];
    bullets[i].vertexes.push(new Vertex(bullets[i].x,bullets[i].y,bullets[i].z));
    let relX = bullets[i].x-aircraft.x;
    let relY = bullets[i].y-aircraft.y;
    let relZ = bullets[i].z-aircraft.z;
    //地面と距離から判定
    if (Math.sqrt(relX**2+relY**2+relZ**2) > 30000 || bullets[i].y < 10) {
      bullets[i].dead = true;
      bullets.splice(i,1);
      i--;
    }else{
      let esc = false;
      for (let j = 0; j < targets.length; j++) {
        relX = bullets[i].x-targets[j].x;
        relY = bullets[i].y-targets[j].y;
        relZ = bullets[i].z-targets[j].z;
        if (Math.sqrt(relX**2+relY**2+relZ**2) < 400) {
          for (let k = 0; k < 20; k++) {
            blasts.push(new Blast(targets[j].x,targets[j].y,targets[j].z,400,70));
            objects.push(blasts[blasts.length-1]);
          }
          targets[j].dead = true;
          targets.splice(j,1);
          j--;
          bullets[i].dead = true;
          bullets.splice(i,1);
          i--;

          targets.push(new Target(aircraft.x+rndInt(-20000,20000), rndInt(1000,3000), aircraft.z+rndInt(-10000,10000)));
          objects.push(targets[targets.length-1]);
          esc = true;
          break;
        }
      }
      if (!esc) {
        for (let j = 0; j < otherAircrafts.length; j++) {
          relX = bullets[i].x-otherAircrafts[j].x;
          relY = bullets[i].y-otherAircrafts[j].y;
          relZ = bullets[i].z-otherAircrafts[j].z;
          if (Math.sqrt(relX**2+relY**2+relZ**2) < 300) {
            for (let k = 0; k < 5; k++) {
              blasts.push(new Blast(otherAircrafts[j].x,otherAircrafts[j].y,otherAircrafts[j].z,100,10));
              objects.push(blasts[blasts.length-1]);
            }
            bullets[i].dead = true;
            bullets.splice(i,1);
            i--;
            hit.push(otherAircrafts[j].id);
            msg.setMsg("You hit "+otherAircrafts[j].name);
            break;
          }
        }
      }
    }
  }

  for (let i = 0; i < blasts.length; i++) {
    let blast = blasts[i];
    blast.prog += 0.02 * gameSpeed;
    if (blast.prog <= 1) {
      blast.x = blast.center.x + (blast.vec.x * (1-(1-blast.prog)**2));
      blast.y = blast.center.y + (blast.vec.y * (1-(1-blast.prog)**2));
      blast.z = blast.center.z + (blast.vec.z * (1-(1-blast.prog)**2));
      const size = blast.size * ((1-blast.prog)**2);
      blast.vertexes = [];
      blast.vertexes.push(new Vertex(blast.x,blast.y,blast.z));
      blast.faces = [];
      blast.faces.push([0,size,"#FFFFFF"])
    }else{
      blast.dead = true;
      blasts.splice(i,1);
      i--;
    }
  }
  
  for (let i = 0; i < objects.length; i++) {
    if (objects[i].dead) {
      objects.splice(i,1);
      i--;
      break;
    }
  
    let relX = objects[i].x-aircraft.x;
    let relY = objects[i].y-aircraft.y;
    let relZ = objects[i].z-aircraft.z;
    //地面と距離から判定
    if ((Math.sqrt(relX**2+relY**2+relZ**2) < 30000 || objects[i].visible === "ground")&&(objects[i].exploded === undefined)) {
      objects[i].visible = true;
    }else{
      objects[i].visible = false;
    }
  }
  
  drawGameOver();
  if (key.r) {
    reset();
    mainLoop();
  }else{
    requestAnimationFrame(gameOverLoop);
  }
}

drawLobby();
