////////////////////////
//                    //
//     Constants      //
//                    //
////////////////////////


LEN = 30;
GRID = [];
SCORE = -1;

//fills 2d array with 0s
for(var r=0;r<LEN;r++) {
  GRID[r] = [];
  for(var c=0;c<LEN;c++) {
    GRID[r][c] = 0;
  }
}


////////////////////////
//                    //
//        Main        //
//                    //
////////////////////////


//sets up canvas
function setup() {
  createCanvas(600,600);
  G = new Grid();
  G.initSnake();
}

//main loop
function draw() {
  background(255);
  frameRate(10);
  G.move();
  G.printGrid();
  updateScore();
}

//key event handlers
function keyPressed() {
  if (keyCode === 87) {
    //up
    G.dir(-1, 0);
  } else if (keyCode === 83) {
    //down
    G.dir(1, 0);
  } else if (keyCode === 68) {
    //right
    G.dir(0, 1);
  } else if (keyCode === 65) {
    //left
    G.dir(0, -1);
  }
}

//handles mobile touch movement
function touchStarted() {

  //moves left
  if(mouseX<100) G.dir(0,-1);

  //moves right
  else if(mouseX>600) G.dir(0,1);

  //moves up
  if(mouseY<100) G.dir(-1,0);

  //moves down
  else if(mouseY>600) G.dir(1,0);
}


////////////////////////
//                    //
//        Grid        //
//                    //
////////////////////////


//Grid object
function Grid() {

  //attributes
  this.grid = GRID;
  this.speedX = 0;
  this.speedY = -1;
  this.canMove = true;

  //direction handler
  this.dir = function(x,y) {
    this.speedX = y;
    this.speedY = x;

    this.checkMove();
  }

  //prints and stylises grid
  this.printGrid = function() {

    //prints grid background
    for(var row=1;row<LEN-1;row++) {
      for(var col=1;col<LEN-1;col++) {
        if(this.grid[row][col]==0) {
          stroke(9,72,123);
          fill(9,72,123);
          rect(col*20,row*20,20,20);
        } else if(this.grid[row][col]==-1) {
          stroke(171,36,36);
          fill(171,36,36);
          rect(col*20,row*20,20,20);
        } else {
          stroke(9,72,123);
          fill(20,172,223);
          rect(col*20,row*20,20,20);
        }

      }
    }

    //prints grid wall
    for(var row=0;row<LEN;row++) {
      stroke(7,54,92);
      fill(7,54,92);
      rect(580,row*20,20,20);
      rect(0,row*20,20,20);
      rect(row*20,0,20,20);
      rect(row*20,580,20,20);
    }


  }

  //initialises snake on grid
  this.initSnake = function() {
    var index = 1;
    for(var x=15;x<21;x++) {
      this.grid[x][15] = index;
      index++;
    }
  }

  //handles movement of head
  this.move = function() {

    if(this.canMove) {
      var swapA = 0;
      var swapB = 0;

      outerLoop:
      for(var row=1;row<LEN-1;row++) {
        for(var col=0;col<LEN;col++) {
          if(this.grid[row][col]==1) {
            swapA = row+this.speedY;
            swapB = col+this.speedX;
            this.grid[swapA][swapB+this] = this.grid[row][col];

            break outerLoop;
          }
        }
      }

      this.checkMove();
      this.moveBody(swapA,swapB);


    } else {
      gameOver();
    }
  }

  //handles movement of body
  this.moveBody = function(swapA,swapB) {
    var tail = this.getLength();
    var index = 1;

    while(index<=tail) {
      outerLoop:
      for(var row=1;row<LEN-1;row++) {
        for(var col=0;col<LEN;col++) {
          if(this.grid[row][col]==index) {
            this.grid[swapA][swapB] = this.grid[row][col];
            swapA = row;
            swapB = col;
            break outerLoop;
          }
        }
      }
      index++;
    }

    //gets score before attempting to place apple
    var PREV = SCORE;
    this.placeApple(swapA,swapB);

    //if the apple is placed the score has changed, so extend snake
    if(SCORE>PREV) this.grid[swapA][swapB] = index+1;
    else this.grid[swapA][swapB] = 0;
  }

  //gets length of snake
  this.getLength = function() {
    var max = 1;

    for(var row=1;row<LEN-1;row++) {
      for(var col=0;col<LEN;col++) {
        if(this.grid[row][col]>max) max = this.grid[row][col];
      }
    }

    return max;
  }

  //places apple onto grid
  this.placeApple = function(A,B) {

    //checks if apple is present
    var appleThere = false;

    for(var row=1;row<LEN-1;row++) {
      for(var col=0;col<LEN;col++) {
        if(this.grid[row][col]==-1) {
          appleThere = true;
        }
      }
    }

    //if there is no apple there
    if(!appleThere) {

      SCORE++;

      var x = Math.floor((Math.random() * 27) + 2);
      var y = Math.floor((Math.random() * 27) + 2);

      while(this.grid[x][y]>0 || x==A || x==B || y==A || y==B || x>=28 || y>=28) {
        x = Math.floor((Math.random() * 27) + 2);
        y = Math.floor((Math.random() * 27) + 2);
      }

      this.grid[x][y] = -1;
    }

  }

  //checks if the snake can move in specified direction
  this.checkMove = function() {
    for(var row=1;row<LEN-1;row++) {
      for(var col=0;col<LEN;col++) {
        if(this.grid[row][col]==1) {
          nextA = row + this.speedY;
          nextB = col + this.speedX;
             //up         //down          //left       //right
          if(nextA<=0 || nextA>=29 || nextB<=0 || nextB>=LEN-1) {
            gameOver();
          } else if(this.grid[nextA][nextB]>0) {
            gameOver();
          }
        }
      }
    }
  }


}


////////////////////////
//                    //
//      Utilities     //
//                    //
////////////////////////


//updates score on html page
function updateScore() {
  document.getElementById('final').innerHTML = 'Score: ' + SCORE;
  document.getElementById('running').innerHTML = 'Score: ' + SCORE;
}

//extends snake by 3 when eats apple, untested
function extendThree() {
  if(this.grid[swapA+1][swapB]>0) {
    this.grid[swapA][swapB] = index + 1;
    this.grid[swapA-1][swapB] = index + 2;
    this.grid[swapA-2][swapB] = index + 3;
    this.grid[swapA-3][swapB] = index + 4;
  } else if(this.grid[swapA-1][swapB]>0) {
      this.grid[swapA][swapB] = index + 1;
      this.grid[swapA+1][swapB] = index + 2;
      this.grid[swapA+2][swapB] = index + 3;
      this.grid[swapA+3][swapB] = index + 4;
  } else if(this.grid[swapA][swapB+1]>0) {
      this.grid[swapA][swapB] = index + 1;
      this.grid[swapA][swapB-1] = index + 2;
      this.grid[swapA][swapB-2] = index + 3;
      this.grid[swapA][swapB-3] = index + 4;
  } else if(this.grid[swapA][swapB-1]>0) {
      this.grid[swapA][swapB] = index + 1;
      this.grid[swapA][swapB+1] = index + 2;
      this.grid[swapA][swapB+2] = index + 3;
      this.grid[swapA][swapB+3] = index + 4;
  }
}

//game over
function gameOver() {
  remove();
  document.getElementById('gameOver').style.opacity = 1;
  document.getElementById('up').style.opacity = 0;
  document.getElementById('down').style.opacity = 0;
  document.getElementById('left').style.opacity = 0;
  document.getElementById('right').style.opacity = 0;
  document.getElementById('bottom').style.height = '0';
}


//from https://github.com/smali-kazmi/detect-mobile-browser
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};
