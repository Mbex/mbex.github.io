  numberOfBalls = 50;
  extraBalls = 5;
  ballLimit = numberOfBalls*2;
  radius = 10;

  // Ball object - multiple balls can be created by instantiating new objects
  function Ball(svg, x, y, id, color, aoa, weight) {
      this.posX = x; // cx
      this.posY = y; // cy
      this.color = color;
      this.radius = radius; // radius and weight same
      this.jumpSize = 1; // equivalent of speed default to 1
      this.svg = svg; // parent SVG
      this.id = id; // id of ball
      this.aoa = aoa; // initial angle of attack
      this.weight = weight;
      if (!this.aoa)
          this.aoa = Math.PI / 7;
      if (!this.weight)
          this.weight = 10;
      this.radius = this.radius;// + (this.weight * 0.2);
      this.data = [this.id]; // allow us to use d3.enter()
      var thisobj = this; // i like to use thisobj instead of this. this many times not reliable particularly handling evnet
      // **** aoa is used only here -- earlier I was using to next move position.
      // Now aoa and speed together is velocity
      this.vx = Math.random() * (Math.random() < 0.5 ? -1 : 1); // velocity x
      this.vy = Math.random() * (Math.random() < 0.5 ? -1 : 1); // velocity y
      this.initialVx = this.vx;
      this.initialVy = this.vy;
      this.initialPosX = this.posX;
      this.initialPosY = this.posY;
      // when speed changes, go to initial setting
      this.GoToInitialSettings = function (newjumpSize) {
          thisobj.posX = thisobj.initialPosX;
          thisobj.posY = thisobj.initialPosY;
          thisobj.vx = Math.cos(thisobj.aoa) * newjumpSize; // velocity x
          thisobj.vy = Math.sin(thisobj.aoa) * newjumpSize; // velocity y
          thisobj.Draw();
      }
      this.Draw = function () {
          var svg = thisobj.svg;
          var ball = svg.selectAll('#' + thisobj.id)
                      .data(thisobj.data)
                  ;
          ball.enter()
              .append("circle")
              .attr({"id" : thisobj.id, 'class' : 'ball', 'r' : thisobj.radius, 'weight' : thisobj.weight})
              .style("fill", thisobj.color)
              ;
          ball
              //.transition()//.duration(50)
              .attr("cx", thisobj.posX)
              .attr("cy", thisobj.posY)
          ;
      }
      this.Move = function () {
          var svg = thisobj.svg;
          //thisobj.posX += Math.cos(thisobj.aoa) * thisobj.jumpSize;
          //thisobj.posY += Math.sin(thisobj.aoa) * thisobj.jumpSize;
          thisobj.posX += thisobj.vx;
          thisobj.posY += thisobj.vy;
          if (parseInt(svg.attr('width')) <= (thisobj.posX + thisobj.radius)) {
              thisobj.posX = parseInt(svg.attr('width')) - thisobj.radius - 1;
              thisobj.aoa = Math.PI - thisobj.aoa;
              thisobj.vx = -thisobj.vx;
          }
          if ( thisobj.posX < thisobj.radius) {
              thisobj.posX = thisobj.radius+1;
              thisobj.aoa = Math.PI - thisobj.aoa;
              thisobj.vx = -thisobj.vx;
          }
          if (parseInt(svg.attr('height')) < (thisobj.posY + thisobj.radius)) {
              thisobj.posY = parseInt(svg.attr('height')) - thisobj.radius - 1;
              thisobj.aoa = 2 * Math.PI - thisobj.aoa;
              thisobj.vy = -thisobj.vy;
          }
          if (thisobj.posY < thisobj.radius) {
              thisobj.posY = thisobj.radius+1;
              thisobj.aoa = 2 * Math.PI - thisobj.aoa;
              thisobj.vy = -thisobj.vy;
          }
          // **** NOT USING AOA except during initilization. Just left this for future reference *****
          if (thisobj.aoa > 2 * Math.PI)
              thisobj.aoa = thisobj.aoa - 2 * Math.PI;
          if (thisobj.aoa < 0)
              thisobj.aoa = 2 * Math.PI + thisobj.aoa;
          // change color if collision is fast
          var tempThresh = 1.5;
          if (Math.abs(thisobj.vx) >= tempThresh || Math.abs(thisobj.vy) >= tempThresh) {
            d3.select("circle#".concat(thisobj.id))
              .style("fill",  "red");  // <== Add these
          } else {
            d3.select("circle#".concat(thisobj.id))
              .style("fill",  "blue");  // <== Add these
          }
          thisobj.Draw();
      }
  }
  function CheckCollision(ball1, ball2) {
      var absx = Math.abs(parseFloat(ball2.posX) - parseFloat(ball1.posX));
      var absy = Math.abs(parseFloat(ball2.posY) - parseFloat(ball1.posY));
      // find distance between two balls.
      var distance = (absx * absx) + (absy * absy);
      distance = Math.sqrt(distance);
      // check if distance is less than sum of two radius - if yes, collision
      if (distance < (parseFloat(ball1.radius) + parseFloat(ball2.radius))) {
          return true;
      }
      return false;
  }
  balls = []; // global array representing balls
  //courtsey thanks to several internet sites for formulas
  //detect collision, find intersecting point and set new speed+direction for each ball based on weight (weight=radius)
  function ProcessCollision(ball1, ball2) {
      if (ball2 <= ball1)
          return;
      if (ball1 >= (balls.length-1) || ball2 >= balls.length )
          return;
      ball1 = balls[ball1];
      ball2 = balls[ball2];
      if ( CheckCollision(ball1, ball2) ) {
          // intersection point
          var interx = ((ball1.posX * ball2.radius) + ball2.posX * ball1.radius)
          / (ball1.radius + ball2.radius);
          var intery = ((ball1.posY * ball2.radius) + ball2.posY  * ball1.radius)
          / (ball1.radius + ball2.radius);
          // calculate new velocity of each ball.
          var vx1 = (ball1.vx * (ball1.weight - ball2.weight)
              + (2 * ball2.weight * ball2.vx )) / (ball1.weight + ball2.weight);
          var vy1 = (ball1.vy * (ball1.weight - ball2.weight)
              + (2 * ball2.weight * ball2.vy)) / (ball1.weight + ball2.weight);
          var vx2 = (ball2.vx * (ball2.weight - ball1.weight)
              + (2 * ball1.weight * ball1.vx)) / (ball1.weight + ball2.weight);
          var vy2 = (ball2.vy * (ball2.weight - ball1.weight)
              + (2 * ball1.weight * ball1.vy)) / (ball1.weight + ball2.weight);
          //set velocities for both balls
          ball1.vx = vx1;
          ball1.vy = vy1;
          ball2.vx = vx2;
          ball2.vy = vy2;
          //ensure one ball is not inside others. distant apart till not colliding
          while (CheckCollision(ball1, ball2)) {
              ball1.posX += ball1.vx;
              ball1.posY += ball1.vy;
              ball2.posX += ball2.vx;
              ball2.posY += ball2.vy;
          }
          ball1.Draw();
          ball2.Draw();
      }
  }
  function Initialize(containerId) {
      height = document.getElementById(containerId).clientHeight;
      width = document.getElementById(containerId).clientWidth;
      gContainerId = containerId;
      gCanvasId = containerId + '_canvas';
      gTopGroupId = containerId + '_topGroup';
      var svg = d3.select("#" + containerId).append("svg")
          .attr("id", gCanvasId)
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("id", gTopGroupId)
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", width)
          .attr("height", height)
          .style("fill", "none")
      //.attr("transform", "translate(" + 1 + "," + 1 + ")")
      ;
      for (var i = 0; i < numberOfBalls; ++i) {
          balls.push(new Ball(svg, width/2, height/2, 'n'+(i+1).toString(), "blue", Math.PI / (i+1), (i%2)==0?5 : (5+i)));
      }
      for (var i = 0; i < balls.length; ++i) {
          balls[i].Draw();
      }
      return svg;
  }
  var startStopFlag = null;
  function StartStopGame() {
      if (startStopFlag == null) {
          d3.timer(function () {
              for (var i = 0; i < balls.length; ++i) {
                  var r = balls[i].Move();
                  for (var j = i + 1; j < balls.length; ++j) {
                      ProcessCollision(i, j);
                  }
              }
              if (startStopFlag == null)
                  return true;
              else
                  return false;
          }, 500);
          startStopFlag = 1;
          document.getElementById('startStop').innerHTML = 'Stop';
      }
      else {
          startStopFlag = null;
          document.getElementById('startStop').innerHTML = 'Start';
      }
  }
  // I always like to handle ESC key
  d3.select('body')
          .on('keydown', function () {
              if (balls.length == 0)
                  return;
              console.log(d3.event);
              if (d3.event.keyCode == 27) { // if ESC key - toggle start stop
                  StartStopGame();
              }
          });
  function OnSpeedChange(val) {
    var vxBar = [];
    var vyBar = [];
    speedLim = 0.2 * balls.length;
    balls.forEach( function (b) {
      vxBar.push(Math.abs(b.vx));
      vyBar.push(Math.abs(b.vy));
    });
    var vxMax = Math.max.apply(Math, vxBar);
    var vyMax = Math.max.apply(Math, vyBar);
    console.log("vxMax: ", vxMax);
    console.log("vyMax: ", vyMax);
    if (val == "+"  && (vxMax > speedLim || vyMax> speedLim)){
      console.log("Above speed limit");
    } else if (val == "+" ){
      for (var i = 0; i < balls.length; ++i) {
            balls[i].vx *= 2;
            balls[i].vy *= 2;
      }
    } else {
      for (var i = 0; i < balls.length; ++i) {
            balls[i].vx /= 2;
            balls[i].vy /= 2;
      }
    }
  }
  function OnNumberOfBallsChanged(val) {
      if (val == "+"){
        if (balls.length < ballLimit){
          var newBalls = [];
          for (var i = balls.length; i < balls.length + extraBalls; ++i) {
            newBalls.push(new Ball(svg,
                                   width/2,
                                   height/2,
                                   'n'+(i+1).toString(),
                                   "blue",
                                   Math.PI / (i+1),
                                   1
                                   // (i%2)==0?5 : (5+i)
                                   )
            );
          }
          balls = balls.concat(newBalls);
        } else {
          console.log("balls.length >= ".concat(ballLimit.toString()));
          return;
        }
      } else if (val == "-"){
        for (var i = balls.length; i > balls.length - extraBalls; --i) {
          d3.selectAll("circle#n"+(i).toString()).remove();
        }
        balls.splice(balls.length - extraBalls, extraBalls);
      } else {
        console.log("Incorrect 'val' passed to OnNumberOfBallsChanged");
        return;
      }
    console.log("Number of Balls: ", balls.length);
  }

var svg = Initialize('drawArea');
StartStopGame();