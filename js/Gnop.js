var SHAPE = {
	RECTANGLE :0, 
	BALL: 1
};
Object.freeze(SHAPE);
//get sound setting from local storage, initialize to true if there is none
var sound = (localStorage.getItem("sound") !== 'false');
localStorage.setItem("sound", sound);

var diff = .925;

$(document).ready(function(){
	if(parseInt(localStorage.getItem("speed")) > 0)
		$('#gameSpeed').val(parseInt(localStorage.getItem("speed")));
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, 640, 480);
	ctx.fillStyle = "#FFFFFF";
	ctx.font = "100px Arial";
	ctx.fillText("GNOP!", 160, 280);
	if(!sound){
		$("#soundButton").css('background-color', 'rgb(255, 160, 122)');
	} else {
		$("#soundButton").css('background-color', 'rgb(144, 238, 144)');
	}	

	$('#soundButton').click(function(){
		var soundB = $("#soundButton");
		if(sound){
			sound = false;
			soundB.css('background-color', 'rgb(255, 160, 122)');
		} else{
			sound = true;
			soundB.css('background-color', 'rgb(144, 238, 144)');
		}
		localStorage.setItem("sound", sound);
		console.log(sound);
	});

	$('#instruct').click(function(){
		alert("Welcome To Gnop!\nThe Goal of this game is to get the ball off the other player's side of the screen\nThe game is played to 9 points");
		alert("Player one controls with the 'w', 's', & 'd' key for up, down, & speed up respectively.\nPlayer two controls with the up, down, and left arrow keys.");
		alert("Enjoy!  ;^)");				
	});

});


function game(){
	$('#canvasDiv').focus();
	$('*').keydown(function(e){checkInput(e)});
	var bing = document.getElementById("sound");
	var scoreSound = document.getElementById("score");
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
	ctx.fillRect(0, 451, 640, 2);
	
	function draw(){
		ctx.fillStyle = "#FFFFFF";
		fillShape(this.x, this.y, this.shape);
	}
	
	function erase(){
		ctx.fillStyle = "#000000";
		fillShape(this.x, this.y, this.shape);
	}
	
	function fillShape(x,y,shape){
		if(shape == SHAPE.RECTANGLE){
			ctx.fillRect(x, y, 15, 60);
		}else if(shape == SHAPE.BALL){
			//console.log("ball");
			ctx.fillRect(x, y, 10, 10);
		}

	}
	
	function player(x, y, human){
		this.x = x;
		this.y = y;
		this.human = human;
		this.score = 0;
		this.shape = SHAPE.RECTANGLE;
		this.draw = draw;
		this.erase = erase;
		this.move = function(bool){              // bool true = +   false = -
			this.erase();
			if(!bool && this.y > 0)
				this.y -= 10;
			else if(bool && this.y < 390)
				this.y += 10;
			this.draw();
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

	p1 = new player(10, 10, $('#h1but').is(':checked'));
	p2 = new player(615, 380, $('#h2but').is(':checked'));
	
	function ball(x, y, dx, dy){
		
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
		this.shape = SHAPE.BALL;
		
		
		this.draw = draw;
		this.erase = erase;

		this.move = function(){
			this.erase();
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
			this.draw();
		}
	}
	
	function checkInput(e){
		if(running){
			//console.dir(e);
			if(e.which == 83 && p1.human)
				p1.move(true);
			if(e.which == 87 && p1.human)
				p1.move(false);
			if(e.which == 40 && p2.human)
				p2.move(true);
			if(e.which == 38 && p2.human)
				p2.move(false);
			if(e.which == 81 || e.which == 27)
				running = false;
			if((e.which == 68 && p1.human) || (e.which == 37 && p2.human)){
				b.move();
				b.move();
			}
			e.stopPropagation();
		}
		return false;
	}
	
	b = new ball();
	p1.draw();
	p2.draw();
	b.draw();
	
	var frame = 0;
	
	var gameLoop = setInterval(function(){
		b.move();
		p1.check();
		p2.check();
		frame++;
		//console.log("frame=" + frame + " b.x=" + b.x + " b.y=" + b.y);
		if(!running){
			var gameOverSound = document.getElementById("gameOverSound");
			if(sound)
				gameOverSound.play();
			clearInterval(gameLoop);
		}
		
	}, (1000 / $("#speed").html()));
		
}

function start(){
	var startButton = $("#start");
	if(!startButton.attr('disabled')){
		startButton.attr('disabled', 'disabled');
		localStorage.setItem("speed", $("#gameSpeed").val());
		$("#speed").html(Math.floor($("#gameSpeed").val()));
		diff = parseFloat($("input[type='radio'][name='diff']:checked").val());
		game();
	}
}
