function instruct(){
	alert("Welcome To Gnop!\nThe Goal of this game is to get the ball off the other player's side of the screen\nThe game is played to 9 points");
	alert("Player one controls with the 'w', 's', & 'd' key for up, down, & speed up respectively.\nPlayer two controls with the up, down, and left arrow keys.");
	alert("Enjoy!  ;^)");
}

var sound = true;
var diff = .925;

$(document).ready(function(){
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, 640, 480);
	ctx.fillStyle = "#FFFFFF";
	ctx.font = "100px Arial";
	ctx.fillText("GNOP!", 160, 280);
});

function toggleSound(){
	var soundB = $("#soundButton");
	if(sound){
		sound = false;
		soundB.css('background-color', 'rgb(255, 160, 122)');
	} else{
		sound = true;
		soundB.css('background-color', 'rgb(144, 238, 144)');
	}
	//console.log(sound);
}

function game(){
	var bing = document.getElementById("sound");
	var scoreSound = document.getElementById("score")
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	var running = true;
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,640,450);
	ctx.fillRect(0, 452, 640, 28);
	
	ctx.fillStyle = "#FFFFFF";
	ctx.font = "20px Arial";
	ctx.fillText("P1: 0", 10, 473);
	ctx.fillText("P2: 0", 580, 473);
	ctx.fillRect(0, 451, 640, 2)
	
	function player(x, y, human){
		this.x = x;
		this.y = y;
		this.human = human;
		this.score = 0;
		this.draw = function(bool){
			if(bool)
				ctx.fillStyle = "#FFFFFF";
			else
				ctx.fillStyle = "#000000";
			ctx.fillRect(this.x, this.y, 15, 60);
		}
		this.move = function(bool){              // bool true = +   false = -
			this.draw(false);
			if(!bool && this.y > 0)
				this.y -= 10;
			else if(bool && this.y < 390)
				this.y += 10;
			this.draw(true);
			//console.log("player moved!");
		}
		this.check = function(){
			if(Math.random() > diff && !human){
				if(this.y > b.y - 13)
					this.move(false);
				else if(this.y < b.y - 23)
					this.move(true);
				//console.log(this + " moved");
			}
		}
	}	
	
	function drawText(){
		ctx.fillStyel = "#000000";
		ctx.fillRect(0, 452, 640, 28);
	
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText("P1: " + p1.score, 10, 473);
		ctx.fillText("P2: " + p2.score, 580, 473);
	}
	var hc = document.getElementById("h1but");
	p1 = new player(10, 10, hc.checked);
	var hc = document.getElementById("h2but");
	p2 = new player(615, 380, hc.checked);
	
	function ball(x, y, dx, dy){
		this.draw = function(bool){  // bool true = draw  false = erase
			if(bool)
				ctx.fillStyle = "#FFFFFF";
			else
				ctx.fillStyle = "#000000";
			ctx.fillRect(this.x, this.y, 10, 10);
		}
		this.resetBall = function(){
			this.x = 315;
			this.y = Math.floor((Math.random() * 400) + 25);
			var d1 = Math.floor(Math.random() * 2);
			var d2 = Math.floor(Math.random() * 2);
			if(d1 == 1)
				this.dx = true;
			else
				this.dx = false;
			if(d2 == 1)
				this.dy = true;
			else
				this.dy = false;
		}
		this.resetBall();
		this.move = function(){
			this.draw(false);
			if(!this.dy && this.y > 0)
				this.y -= 1;
			else if(this.dy && this.y < 440)
				this.y += 1;
				
			if(!this.dx && this.x > -15)
				this.x -= 1;
			else if(this.dx && this.x < 645)
				this.x += 1;
				
			if(this.y == 440)
				this.dy = false;
			else if(this.y == 0)
				this.dy = true;
			
			var scored = false;
			if(this.x == -15){
				p2.score++;
				scored = true;
			}else if(this.x == 645){
				p1.score++;
				scored = true;
			}
			
			if(this.x >= p2.x - 10 && this.x <= p2.x - 8 && this.y >= p2.y - 10 && this.y <= p2.y + 60){
				this.dx = false;
				if(sound)
					bing.play();
			} else if(this.x <= p1.x + 15 && this.x >= p1.x + 13 && this.y >= p1.y - 10 && this.y <= p1.y + 60){
				if(sound)
					bing.play();
				this.dx = true;
			}
			
			if(scored){
				if(sound)
					score.play();
				drawText();
				//console.log("GOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOAL!");
				if(p1.score == 9 || p2.score == 9){
					running = false;
					ctx.fillStyle = "#FFFFFF";
					ctx.font = "33px Arial";
					if(p1.score > p2.score)
						ctx.fillText("Player 1 wins!", 220, 241);
					else
						ctx.fillText("Player 2 wins!", 220, 230);
				}
				this.resetBall();
			}
			this.draw(true);
		}
	}
	
	function checkInput(){
		if(running){
			var event = window.event;
			//console.log("Input Checked!");
			//console.dir(event);
			if(event.keyCode == 83 && p1.human == true)
				p1.move(true);
			else if(event.keyCode == 87 && p1.human == true)
				p1.move(false);
			else if(event.keyCode == 40 && p2.human == true)
				p2.move(true);
			else if(event.keyCode == 38 && p2.human == true)
				p2.move(false);
			else if(event.keyCode == 81 || event.keyCode == 27)
				running = false;
			else if((event.keyCode == 68 && p1.human == true) || (event.keyCode == 37 && p2.human == true)){
				b.move();
				b.move();
			}
		}
	}
	
	b = new ball();
	
	
	p1.draw(true);
	p2.draw(true);
	b.draw(true);
	
	var frame = 0;
	
	var gameLoop = setInterval(function(){
		b.move();
		p1.check();
		p2.check();
		frame++;
		document.onkeydown = function(){
			checkInput();
		};
		//console.log("frame=" + frame + " b.x=" + b.x + " b.y=" + b.y);
		if(!running){
			var gameOverSound = document.getElementById("gameOverSound");
			if(sound)
				gameOverSound.play();
			clearInterval(gameLoop);
		}
		
	}, (1000 / document.getElementById("gameSpeed").value));
		
}

function start(){
	var startButton = document.getElementById("start");
	if(startButton.disabled == false){
		startButton.disabled = true;
		game();
		$("#speed").html(Math.floor($("#gameSpeed").val()));
		dArray = document.getElementsByName("diff");
		for(var i = 0; i < dArray.length; i++){
			if(dArray[i].checked)
				diff=dArray[i].value;
			dArray[i].disabled="true";
		}
		diff = parseFloat(diff);
	}
}
