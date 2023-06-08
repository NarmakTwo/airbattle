function drawGround1() {
  let object = ground;
  //カメラから見た相対座標に変換
  let relativeVertexes = [];
  for(let j = 0; j < object.vertexes.length; j++) {
    let vertex = Object.assign({},object.vertexes[j]);
    vertex.x -= cam.x;
    vertex.y -= cam.y;
    vertex.z -= cam.z;
    vertex = rotate(cam.axis,vertex,-cam.rad);
    relativeVertexes.push(vertex);
  }
  //描く
  
  for (let j = 0; j < object.faces.length; j++) {
    ctx.beginPath();
    let began = false;
    
    for (let k = 0; k < object.faces[j].length; k++) {
      let p1;
      let p2;
      if (k === (object.faces[j].length-1)) {
        p1 = Object.assign({},relativeVertexes[object.faces[j][k]]);
        p2 = Object.assign({},relativeVertexes[object.faces[j][0]]);
      }else{
        p1 = Object.assign({},relativeVertexes[object.faces[j][k]]);
        p2 = Object.assign({},relativeVertexes[object.faces[j][k+1]]);
      }
      if (p1.z < 10 && p2.z > 10) {
        p1.x += (p2.x-p1.x)*(10-p1.z)/(p2.z-p1.z);
        p1.y += (p2.y-p1.y)*(10-p1.z)/(p2.z-p1.z);
        p1.z = 10;
      }else if (p1.z > 10 && p2.z < 10) {
        p2.x += (p1.x-p2.x)*(10-p2.z)/(p1.z-p2.z);
        p2.y += (p1.y-p2.y)*(10-p2.z)/(p1.z-p2.z);
        p2.z = 10;
      }
      
      if (p1.z > 0 && p2.z > 0) {
        let screenP1 = {"x":p1.x*800/p1.z, "y":p1.y*800/p1.z}
        let screenP2 = {"x":p2.x*800/p2.z, "y":p2.y*800/p2.z}
        if (!began) {
          ctx.moveTo(screenP1.x,-screenP1.y);
          began = true;
        }else{
          ctx.lineTo(screenP1.x,-screenP1.y);
        }
        ctx.lineTo(screenP2.x,-screenP2.y);
      }
    }
    ctx.closePath();
    ctx.fillStyle = "#669D34";
    ctx.lineWidth = 0.5;
    ctx.fill();
  }
}

function drawGround2() {
  let relativeVertexes = [];
  for (let i = -30000; i < 30000; i += 500) {
    let vertex1 = {"x":cam.x+i-((cam.x+200000000)%500),
                   "y":0,
                   "z":cam.z+Math.sqrt(30000**2 - (i)**2)};
    if (vertex1.x > 100000) {vertex1.x = 100000;}
    if (vertex1.x < -100000) {vertex1.x = -100000;}
    if (vertex1.z > 100000) {vertex1.z = 100000;}
    if (vertex1.z < -100000) {vertex1.z = -100000;}
    vertex1.x -= cam.x;
    vertex1.y -= cam.y;
    vertex1.z -= cam.z;
    vertex1 = rotate(cam.axis,vertex1,-cam.rad);
    relativeVertexes.push(vertex1);
    
    let vertex2 = {"x":cam.x+i-((cam.x+200000000)%500),
                   "y":0,
                   "z":cam.z-Math.sqrt(30000**2 - (i)**2)};
    if (vertex2.x > 100000) {vertex2.x = 100000;}
    if (vertex2.x < -100000) {vertex2.x = -100000;}
    if (vertex2.z > 100000) {vertex2.z = 100000;}
    if (vertex2.z < -100000) {vertex2.z = -100000;}
    vertex2.x -= cam.x;
    vertex2.y -= cam.y;
    vertex2.z -= cam.z;
    vertex2 = rotate(cam.axis,vertex2,-cam.rad);
    relativeVertexes.push(vertex2);
  }
  let polygons = [];
  for (let i = 0; i < 119; i++) {
    if ((i+Math.floor(cam.x/500))%2 === 0) {
      polygons.push([i*2, (i+1)*2, (i+1)*2+1, "#96D35F"]);
      polygons.push([(i+1)*2+1, i*2+1, i*2, "#96D35F"]);
    }
  }

  let startI = polygons.length/2;
  for (let i = -30000; i < 30000; i += 500) {
    let vertex1 = {"z":cam.z+i-((cam.z+200000000)%500),
                   "y":0,
                   "x":cam.x+Math.sqrt(30000**2 - (i)**2)};
    if (vertex1.x > 100000) {vertex1.x = 100000;}
    if (vertex1.x < -100000) {vertex1.x = -100000;}
    if (vertex1.z > 100000) {vertex1.z = 100000;}
    if (vertex1.z < -100000) {vertex1.z = -100000;}
    vertex1.x -= cam.x;
    vertex1.y -= cam.y;
    vertex1.z -= cam.z;
    vertex1 = rotate(cam.axis,vertex1,-cam.rad);
    relativeVertexes.push(vertex1);
    
    let vertex2 = {"z":cam.z+i-((cam.z+200000000)%500),
                   "y":0,
                   "x":cam.x-Math.sqrt(30000**2 - (i)**2)};
    if (vertex2.x > 100000) {vertex2.x = 100000;}
    if (vertex2.x < -100000) {vertex2.x = -100000;}
    if (vertex2.z > 100000) {vertex2.z = 100000;}
    if (vertex2.z < -100000) {vertex2.z = -100000;}
    vertex2.x -= cam.x;
    vertex2.y -= cam.y;
    vertex2.z -= cam.z;
    vertex2 = rotate(cam.axis,vertex2,-cam.rad);
    relativeVertexes.push(vertex2);
  }
  for (let i = 120; i < 239; i++) {
    if ((i+Math.floor(cam.z/500))%2 === 0) {
      polygons.push([i*2, (i+1)*2, (i+1)*2+1, "#96D35F"]);
      polygons.push([(i+1)*2+1, i*2+1, i*2, "#96D35F"]);
    }
  }

  //描く
  ctx.beginPath();
  let startingPoint = {"x":"nan","y":0};
  for (let i = 0; i < polygons.length; i++) {
    let polygon = polygons[i];
    let began = false;
    for (let j = 0; j < 3; j++) {
      let p1;
      let p2;
      if (j === 2) {
        p1 = Object.assign({},relativeVertexes[polygon[2]]);
        p2 = Object.assign({},relativeVertexes[polygon[0]]);
      }else{
        p1 = Object.assign({},relativeVertexes[polygon[j]]);
        p2 = Object.assign({},relativeVertexes[polygon[j+1]]);
      }
      if (p1.z < 10 && p2.z > 10) {
        p1.x += (p2.x-p1.x)*(10-p1.z)/(p2.z-p1.z);
        p1.y += (p2.y-p1.y)*(10-p1.z)/(p2.z-p1.z);
        p1.z = 10;
      }else if (p1.z > 10 && p2.z < 10) {
        p2.x += (p1.x-p2.x)*(10-p2.z)/(p1.z-p2.z);
        p2.y += (p1.y-p2.y)*(10-p2.z)/(p1.z-p2.z);
        p2.z = 10;
      }
      if (p1.z > 0 && p2.z > 0) {
        let screenP1 = {"x":p1.x*800/p1.z, "y":p1.y*800/p1.z}
        let screenP2 = {"x":p2.x*800/p2.z, "y":p2.y*800/p2.z}
        if (!began) {
          ctx.moveTo(screenP1.x,-screenP1.y);
          if (startingPoint.x === "nan") {
            startingPoint.x = screenP1.x;
            startingPoint.y = screenP1.y;
          }
          began = true;
        }else{
          ctx.lineTo(screenP1.x,-screenP1.y);
        }
        ctx.lineTo(screenP2.x,-screenP2.y);
      }
    }
  }
  ctx.moveTo(startingPoint.x,-startingPoint.y);
  ctx.lineTo(startingPoint.x+0.01,-startingPoint.y+0.01);
  ctx.lineTo(startingPoint.x+0.01,-startingPoint.y-0.01);
  ctx.fillStyle = "#96D35F";
  ctx.fill("evenodd");
}

function draw() {
  ctx.clearRect(-400,-(300),800,600);
  ctx.fillStyle = "#93E3FD";
  ctx.fillRect(-400,-(300),800,600);

  drawGround1();
  drawGround2();
  
  let relativeVertexes = [];
  let polygons = [];
  let arrToSort = [];
  
  for(let i = 0; i < objects.length; i++) {
    if (objects[i].visible) {
      //頂点リストの何番目からなのかを取っておく
      let nowObjIdx = relativeVertexes.length;
      //頂点（相対座標）をリストに片っ端から追加
      let object = objects[i];
      for(let j = 0; j < object.vertexes.length; j++) {
        let vertex = Object.assign({},object.vertexes[j]);
        vertex.x -= cam.x;
        vertex.y -= cam.y;
        vertex.z -= cam.z;
        vertex = rotate(cam.axis,vertex,-cam.rad);
        relativeVertexes.push(vertex);
      }
      //ポリゴン（もしくは点）の情報をリストに片っ端から追加
      for (let j = 0; j < object.faces.length; j++) {
        if (object.faces.length > 3) {
          //ポリゴン
          const p1 = relativeVertexes[nowObjIdx+object.faces[j][0]];
          const p2 = relativeVertexes[nowObjIdx+object.faces[j][1]];
          const p3 = relativeVertexes[nowObjIdx+object.faces[j][2]];
          //すると見せかけて裏向いてるポリゴンは追加しない
          const sightVec = {"x":p1.x,"y":p1.y,"z":p1.z};
          const hors = vectorProduct({"x":p2.x-p1.x,"y":p2.y-p1.y,"z":p2.z-p1.z},
                                    {"x":p3.x-p1.x,"y":p3.y-p1.y,"z":p3.z-p1.z})//表に生えるベクトル
          const cos = (sightVec.x*hors.x+sightVec.y*hors.y+sightVec.z*hors.z)/(Math.sqrt(sightVec.x**2+sightVec.y**2+sightVec.z**2)*Math.sqrt(hors.x**2+hors.y**2+hors.z**2));
          if (cos < 0) {
            //順番決める用のz
            let z;
            if (cos > -0.707) {
              z = (10 * Math.max(p1.z,p2.z,p3.z) + (p1.z+p2.z+p3.z)/3)/11;
            }else{
              z = (p1.z+p2.z+p3.z)/3;
            }
            //明暗
            const lightVec = rotate(cam.axis,{"x":-1,"y":-5,"z":-1},-cam.rad);
            const cos2 = (lightVec.x*hors.x+lightVec.y*hors.y+lightVec.z*hors.z)/(Math.sqrt(lightVec.x**2+lightVec.y**2+lightVec.z**2)*Math.sqrt(hors.x**2+hors.y**2+hors.z**2));
            const coef = 0.875-cos2/8;
            //const color = object.faces[j][3];
            const oc = getRGB(object.faces[j][3]);//元々の色
            const color = "rgb("+(oc.r*coef)+","+(oc.g*coef)+","+(oc.b*coef)+")";
            //追加
            polygons.push([nowObjIdx+object.faces[j][0], nowObjIdx+object.faces[j][1], nowObjIdx+object.faces[j][2], z, color]);
            arrToSort.push([-z,polygons.length-1]);
          }
        }else{
          //点
          const p = relativeVertexes[nowObjIdx+object.faces[j][0]];
          polygons.push([nowObjIdx+object.faces[j][0], object.faces[j][1], p.z, object.faces[j][2]]);
          arrToSort.push([-p.z,polygons.length-1]);
        }
        
      }
    }
  }
  arrToSort = sort(arrToSort);
  //描く
  for (let i = 0; i < polygons.length; i++) {
    let polygon = polygons[arrToSort[i][1]];
    if (polygon.length > 4) {
      //ポリゴン
      let began = false;
      ctx.beginPath();
      for (let j = 0; j < 3; j++) {
        let p1;
        let p2;
        if (j === 2) {
          p1 = Object.assign({},relativeVertexes[polygon[2]]);
          p2 = Object.assign({},relativeVertexes[polygon[0]]);
        }else{
          p1 = Object.assign({},relativeVertexes[polygon[j]]);
          p2 = Object.assign({},relativeVertexes[polygon[j+1]]);
        }
        if (p1.z < 10 && p2.z > 10) {
          p1.x += (p2.x-p1.x)*(10-p1.z)/(p2.z-p1.z);
          p1.y += (p2.y-p1.y)*(10-p1.z)/(p2.z-p1.z);
          p1.z = 10;
        }else if (p1.z > 10 && p2.z < 10) {
          p2.x += (p1.x-p2.x)*(10-p2.z)/(p1.z-p2.z);
          p2.y += (p1.y-p2.y)*(10-p2.z)/(p1.z-p2.z);
          p2.z = 10;
        }
        if (p1.z > 0 && p2.z > 0) {
          let screenP1 = {"x":p1.x*800/p1.z, "y":p1.y*800/p1.z}
          let screenP2 = {"x":p2.x*800/p2.z, "y":p2.y*800/p2.z}
          if (!began) {
            ctx.moveTo(screenP1.x,-screenP1.y);
            began = true;
          }else{
            ctx.lineTo(screenP1.x,-screenP1.y);
          }
          ctx.lineTo(screenP2.x,-screenP2.y);
        }
      }
      ctx.closePath();
      ctx.fillStyle = polygon[4];
      ctx.strokeStyle = polygon[4];
      ctx.fill();
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }else{
      //点
      ctx.beginPath();
      const p = Object.assign({},relativeVertexes[polygon[0]]);
      if (p.z > 10) {      
        let screenP = {"x":p.x*800/p.z, "y":p.y*800/p.z}
        ctx.moveTo(screenP.x,-screenP.y);
        ctx.arc(screenP.x, -screenP.y, polygon[1]*800/p.z, 0, 2*Math.PI)
        ctx.fillStyle = polygon[3];
        ctx.fill();
      }
    }
  }
  //各種データ
  drawMiniMap();
  drawMarker();
  drawLeaderBoard();
  ctx.font = "20px sans-serif";
  ctx.fillStyle = "black";
  ctx.textAlign = "left";
  ctx.fillText("speed : "+ Math.round(aircraft.speed.z), -350, -(200));
  ctx.fillText("y : "+ Math.round(aircraft.y), -350, -(150));
  ctx.fillText("throttle : "+ Math.round(aircraft.throttle*100)/100, -350, -(100));
  ctx.fillText("hp : "+ aircraft.hp, -350, -(50));
  ctx.fillText("score : "+ aircraft.score, -350, -(0));
  
  ctx.font = "25px sans-serif";
  ctx.textAlign = "center";
  ctx.globalAlpha = msg.counter/60;
  ctx.fillText(msg.content,0,-(100));
  ctx.globalAlpha = 1;
}

function drawMiniMap() {
  ctx.fillStyle = "black";
  ctx.fillRect(-370,-(-120),150,150);
  
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeRect(-370,-(-120),150,150);
  
  //-370から-220,-120から-270
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-295,-(-120));
  ctx.lineTo(-295,-(-270));
  ctx.moveTo(-370,-(-195));
  ctx.lineTo(-220,-(-195));
  ctx.stroke();
  let targetsOnMap = [];
  {
    let relTarget = {"x":-aircraft.x, "y":-aircraft.y, "z":-aircraft.z};
    relTarget = rotate(aircraft.axis,relTarget,-aircraft.rad);
    targetsOnMap.push({"x":relTarget.x,"z":relTarget.z,"warning":false});
  }
  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    let relTarget = {"x":target.x-aircraft.x, "y":target.y-aircraft.y, "z":target.z-aircraft.z};
    relTarget = rotate(aircraft.axis,relTarget,-aircraft.rad);
    targetsOnMap.push({"x":relTarget.x,"z":relTarget.z,"warning":false});
  }
  for (let i = 0; i < otherAircrafts.length; i++) {
    const oa = otherAircrafts[i];
    let relTarget = {"x":oa.x-aircraft.x, "y":oa.y-aircraft.y, "z":oa.z-aircraft.z};
    relTarget = rotate(aircraft.axis,relTarget,-aircraft.rad);
    targetsOnMap.push({"x":relTarget.x,"z":relTarget.z,"warning":false});
    if (oa.targetting.value) {
      targetsOnMap[targetsOnMap.length-1].warning = true;
    }
  }
  ctx.fillStyle = "white";
  for(let i = 0; i < targetsOnMap.length; i++) {
    const pos = targetsOnMap[i];
    if (pos.z > 15000 && Math.abs(pos.x) < pos.z) {
      //上にはみ出している
      pos.x = pos.x * (15000/pos.z);
      pos.z = 15000;
    }else if (pos.z < -15000 && Math.abs(pos.x) < -pos.z) {
      //下にはみ出している
      pos.x = pos.x * (-15000/pos.z);
      pos.z = -15000;
    }else if (pos.x < -15000 && Math.abs(pos.z) < -pos.x) {
      //左にはみ出している
      pos.z = pos.z * (-15000/pos.x);
      pos.x = -15000;
    }else if (pos.x > 15000 && Math.abs(pos.z) < pos.x) {
      //右にはみ出している
      pos.z = pos.z * (15000/pos.x);
      pos.x = 15000;
    }
    if (i === 0) {
      ctx.beginPath();
      const x = -295+(pos.x*0.005);
      const y = -195+(pos.z*0.005);
      ctx.moveTo(x-3,-(y+3));
      ctx.lineTo(x+3,-(y-3));
      ctx.moveTo(x-3,-(y-3));
      ctx.lineTo(x+3,-(y+3));
      
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }else{
      if (pos.warning) {
        ctx.fillStyle = "red";
      }else{
        ctx.fillStyle = "white";
      }
      ctx.fillRect(-295+(pos.x*0.005)-2.5,-(-195+(pos.z*0.005)+2.5),5,5);
    }
  }
}

function drawMarker() {
  let oaOnScr = [];
  for (let i = 0; i < otherAircrafts.length; i++) {
    let oa = otherAircrafts[i];
    let oaPos = {"x":oa.x,"y":oa.y,"z":oa.z}
    oaPos.x -= cam.x;
    oaPos.y -= cam.y;
    oaPos.z -= cam.z;
    oaPos = rotate(cam.axis,oaPos,-cam.rad);
    if (oaPos.z > 10) {
      const dis = Math.sqrt(oaPos.x**2+oaPos.y**2+oaPos.z**2);
      let onscr = {"x":oaPos.x*800/oaPos.z, "y":oaPos.y*800/oaPos.z, "size":100*800/oaPos.z, "dis":dis, "name":oa.name, "hp":oa.hp};
      oaOnScr.push(onscr);
    }
  }
  for (let i = 0; i < oaOnScr.length; i++) {
    let p = oaOnScr[i];
    if (p.size < 10) {
      p.size = 10;
    }
    //菱形
    ctx.beginPath();
    ctx.moveTo(p.x,-(p.y+p.size));
    ctx.lineTo(p.x+p.size,-(p.y));
    ctx.lineTo(p.x,-(p.y-p.size));
    ctx.lineTo(p.x-p.size,-(p.y));
    ctx.closePath();
    ctx.strokeStyle = p.dis < 30000 ? "#FFFFFF" : "#999999";
    ctx.lineWidth = p.size/10;
    ctx.stroke();
    //hp
    ctx.beginPath();
    ctx.moveTo(p.x-p.size*1.5,-(p.y+p.size*1.3));
    ctx.lineTo(p.x+p.size*1.5,-(p.y+p.size*1.3));
    ctx.strokeStyle = "#999999";
    ctx.lineWidth = p.size/5;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(p.x-p.size*1.5,-(p.y+p.size*1.3));
    ctx.lineTo(p.x-p.size*1.5+(p.hp/(100/(p.size*3))),-(p.y+p.size*1.3));
    ctx.strokeStyle = "white";
    ctx.stroke();
    //名前
    ctx.font = (p.size*1.2)+"px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(p.name, p.x,-(p.y+p.size*1.6));
  }
}

function drawLeaderBoard() {
  ctx.font = "20px sans-serif";
  ctx.fillStyle = "black";
  let list = [];
  if (!aircraft.exploded) {
    list.push([player.name+" (you)",aircraft.score,0]);
  }
  for (let i = 0; i < otherAircrafts.length; i++) {
    list.push([otherAircrafts[i].name,otherAircrafts[i].score,0]);
  }
  const bsort = () => {
    for (let i = 0; i < list.length; i++) {
      for (let j = list.length - 1; j > i; j--) {
        if (list[j][1] > list[j - 1][1]) {
          let tmp = Array.from(list[j]);
          list[j] = Array.from(list[j - 1]);
          list[j - 1] = tmp;
        }
      }
    }
  };
  bsort();
  //同率
  let num = 1;
  let old = -10;
  for (let i = 0; i < list.length; i++) {
    if (old === list[i][1]) {
      list[i][2] = num;
      old = list[i][1];
    }else{
      num = i + 1;
      list[i][2] = num;
      old = list[i][1];
    }
  }
  if (!aircraft.exploded) {
    //順位はかる
    for (let i = 0; i < list.length; i++) {
      if (list[i][0] === player.name+" (you)") {
        aircraft.rank = list[i][2];
        break;
      }
    }
  }
  for (let i = 0; i < Math.min(list.length,10); i++) {
    ctx.textAlign = "right";
    ctx.fillText((list[i][2])+". ",120,-(200-i*22));
    ctx.textAlign = "left";
    ctx.fillText(list[i][0],140,-(200-i*22));
    ctx.textAlign = "right";
    ctx.fillText(list[i][1],350,-(200-i*22));
  }
  if (!aircraft.eploded) {
    if (aircraft.rank > 10) {
      ctx.textAlign = "right";
      ctx.fillText(aircraft.rank+". ",120,-(-50));
      ctx.textAlign = "left";
      ctx.fillText(list[aircraft.rank-1][0],140,-(-50));
      ctx.textAlign = "right";
      ctx.fillText(list[aircraft.rank-1][1],350,-(-50));
    }
  }
}

function sort(arr) {
  if (arr.length < 2) {
    return arr;
  }

  let middle = Math.floor(arr.length / 2);
  let left = arr.slice(0, middle);
  let right = arr.slice(middle);

  return merge(sort(left), sort(right));
}

function merge(left, right) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i][0] < right[j][0]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}

function getRGB(colorCode) {
  const split = colorCode.split("");
  const r = parseInt(split[1]+split[2],16);
  const g = parseInt(split[3]+split[4],16);
  const b = parseInt(split[5]+split[6],16);
  return {"r":r,"g":g,"b":b};
}

function drawLobby() {
  ctx.clearRect(-400,-(300),800,600);
  ctx.fillStyle = "#93E3FD";
  ctx.fillRect(-400,-(300),800,600);

  ctx.fillStyle = "white";
  ctx.fillRect(-300,-(200),600,400)
  ctx.font = "40px sans-serif";
  ctx.fillStyle = "black";
  ctx.textAlign = "center"
  ctx.fillText("Air Battle",0,-(100));
  ctx.font = "35px sans-serif";
  ctx.fillStyle = "black";
  ctx.fillText("- ONLINE-",0,-(40));
}

function drawGameOver() {
  draw();

  ctx.globalAlpha = 0.7;
  ctx.fillStyle = "black";
  ctx.fillRect(-400,-(300),800,600);
  ctx.globalAlpha = 1;
  
  ctx.font = "60px sans-serif";
  ctx.fillStyle = "white";
  ctx.textAlign = "center"
  ctx.fillText("Game Over", 0, -(120));
  ctx.font = "25px sans-serif";
  ctx.fillText(causeOfDeath,0,-(50));

  ctx.font = "30px sans-serif";
  ctx.fillText("score : "+aircraft.score,0,-(-20));
  ctx.fillText("rank  : "+aircraft.rank,0,-(-60));
  ctx.font = "25px sans-serif";
  ctx.fillText("R to restart",0,-(-150));
}