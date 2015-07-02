/* CREATED BY Marcus Atty - marcus.atty@gmail.com */

var KEY = {
    'BACKSPACE': 8, 'TAB': 9, 'NUM_PAD_CLEAR': 12, 'ENTER': 13, 'SHIFT': 16,
    'CTRL': 17, 'ALT': 18, 'PAUSE': 19, 'CAPS_LOCK': 20, 'ESCAPE': 27,
    'SPACEBAR': 32, 'PAGE_UP': 33, 'PAGE_DOWN': 34, 'END': 35, 'HOME': 36,
    'ARROW_LEFT': 37, 'ARROW_UP': 38, 'ARROW_RIGHT': 39, 'ARROW_DOWN': 40,
    'PRINT_SCREEN': 44, 'INSERT': 45, 'DELETE': 46, 'SEMICOLON': 59,
    'WINDOWS_LEFT': 91, 'WINDOWS_RIGHT': 92, 'SELECT': 93,
    'NUM_PAD_ASTERISK': 106, 'NUM_PAD_PLUS_SIGN': 107,
    'NUM_PAD_HYPHEN-MINUS': 109, 'NUM_PAD_FULL_STOP': 110,
    'NUM_PAD_SOLIDUS': 111, 'NUM_LOCK': 144, 'SCROLL_LOCK': 145,
    'EQUALS_SIGN': 187, 'COMMA': 188, 'HYPHEN-MINUS': 189,
    'FULL_STOP': 190, 'SOLIDUS': 191, 'GRAVE_ACCENT': 192,
    'LEFT_SQUARE_BRACKET': 219, 'REVERSE_SOLIDUS': 220,
    'RIGHT_SQUARE_BRACKET': 221, 'APOSTROPHE': 222
};
(function () {
	/* 0 - 9 */
	for (var i = 48; i <= 57; i++) {
        KEY['' + (i - 48)] = i;
	}
	/* A - Z */
	for (i = 65; i <= 90; i++) {
        KEY['' + String.fromCharCode(i)] = i;
	}
	/* NUM_PAD_0 - NUM_PAD_9 */
	for (i = 96; i <= 105; i++) {
        KEY['NUM_PAD_' + (i - 96)] = i;
	}
	/* F1 - F12 */
	for (i = 112; i <= 123; i++) {
        KEY['F' + (i - 112 + 1)] = i;
	}
})();
var Minesweeper = {};
Minesweeper.Consts = [
  {name: "State", consts: ["WAITING", "PAUSED", "PLAYING", "DYING"]},
  {name: "Dir",   consts: ["UP", "DOWN","LEFT","RIGHT"]}
];
Minesweeper.Game = function(_width,_height,_bombs){
	var _width = _width,
		_height = _height,
		_numberBombs = _bombs,
		_gameOver = false,
		_flags = 0,
		_win = false;
		_grid = new Array();
		_grid2 = new Array();
		bombs = new Array();
	
	createGame();
	
	function createGame(){
		_grid = [];
		_grid2 = [];
		bombs = [];
		_gameOver = _win = false;
		_flags = 0;
		createGrid();
		createBombs();
	}
	function createGrid(){
		/* i=x co-ord, j=y co-ord, k=value, to start all blank*/
		for( var q=0;q<height();q++){
			var p = 0;
			var data = [];
			while( p < width() ){
				data.push("");
				p++;
			}
			_grid2.push(data);
		}
		
		/*var i=1, j=1, k='';
		while( j <= height() ){
			i=1;
			while( i <= width() ){
				square = [i,j,k];
				i++;
				_grid.push(square);
			}
			j++;
		}*/
	}
	function createBombs(){
		var randomX = Math.floor(Math.random()*width());
		var randomY = Math.floor(Math.random()*height());
		var add = true;
		for(var i=0;i<bombs.length;i++){
			var bomb = bombs[i];
			if(bomb[0] == randomX && bomb[1] == randomY ){
				add = false;
				break;
			}
		}
		if( add == true ){
			var random = [randomX,randomY];
			bombs.push(random);
		}
		if( bombs.length != numberBombs() ){
			createBombs();
		}
	}
	
	function update(x1,y1){
		var x = x1,
			y = y1;
		if( !_grid2[y][x] ){
			_grid2[y][x] = updatePositionValue(x,y);
			if( _grid2[y][x] == "X" ){
				gameOver();
			}
			else if( _grid2[y][x] == "0" ){
				updateZeroValue(x,y);
			}
		}
		/*for(var i=0;i<_grid.length;i++){
			var position = _grid[i];
			if( position[0] == x && position[1] == y ){
				if( !position[2] ){
					position[2] = updatePositionValue(position);
					if( position[2] == "X" ){
						gameOver();
					}
					else if( position[2] == "0" ){
						updateZeroValue(position[0],position[1]);
					}
				}
				break;
			}
		}*/
		if( _gameOver == false ){
			checkForWin();
		}
	}
	function checkForWin(){
		var sq = /*flags =*/ 0;
		var square;
		for(var i=0;i<_grid2.length;i++){
			var row = _grid2[i];
			for(var j=0;j<row.length;j++){
				square = _grid2[i][j];
				if(square != '' && square != 'F' ){
					sq = sq + 1;
				}
			}
		}
		if( sq == ( height() * width() ) - numberBombs() ){
			winner();
		}
	}
	
	function updateZeroValue(x1,y1){
		var x = x1;
		var y = y1;
		if( x < 0 || y < 0 || x-1 > width() || y-1 > height() ){
			return false;
		}
		if( y > 0 && x > 0 ){
			if( _grid2[y-1][x-1] === "" ){
				_grid2[y-1][x-1] = calculateNumberOfBombs(x-1,y-1);
				if( _grid2[y-1][x-1] === "0" ) updateZeroValue(x-1,y-1);
			}
		}
		if( y > 0 ){
			if( _grid2[y-1][x] === "" ){
				_grid2[y-1][x] = calculateNumberOfBombs(x,y-1);
				if( _grid2[y-1][x] === "0" ) updateZeroValue(x,y-1);
			}
		}
		if( y > 0 && x + 1 < width() ){
			if( _grid2[y-1][x+1] === "" ){
				_grid2[y-1][x+1] = calculateNumberOfBombs(x+1,y-1);
				if( _grid2[y-1][x+1] === "0" ) updateZeroValue(x+1,y-1);
			}
		}
		if( x > 0 ){
			if( _grid2[y][x-1] === "" ){
				_grid2[y][x-1] = calculateNumberOfBombs(x-1,y);
				if( _grid2[y][x-1] === "0" ) updateZeroValue(x-1,y);
			}
		}
		if( x + 1 < width() ){
			if( _grid2[y][x+1] === "" ){
				_grid2[y][x+1] = calculateNumberOfBombs(x+1,y);
				if( _grid2[y][x+1] === "0" ) updateZeroValue(x+1,y);
			}
		}
		if( y + 1 < height() && x > 0){
			if( _grid2[y+1][x-1] === "" ){
				_grid2[y+1][x-1] = calculateNumberOfBombs(x-1,y+1);
				if( _grid2[y+1][x-1] === "0" ) updateZeroValue(x-1,y+1);
			}
		}
		if( y + 1 < height() ){
			if( _grid2[y+1][x] === "" ){
				_grid2[y+1][x] = calculateNumberOfBombs(x,y+1);
				if( _grid2[y+1][x] === "0" ) updateZeroValue(x,y+1);
			}
		}
		if( y + 1 < height()  && x + 1 < width() ){
			if( _grid2[y+1][x+1] === "" ){
				_grid2[y+1][x+1] = calculateNumberOfBombs(x+1,y+1);
				if( _grid2[y+1][x+1] === "0" ) updateZeroValue(x+1,y+1);
			}
		}
	}
	
	function updatePositionValue(x1,y1){
		var x = x1,
			y = y1;
		if( hasBomb(x,y)){
			return "X";
		}else{
			return calculateNumberOfBombs(x,y);
		}
	}
	
	function calculateNumberOfBombs(x1,y1){
		var x = x1,
			y = y1;
		var num = 0;
		if( hasBomb(x-1, y-1)){ num = num + 1 };
		if( hasBomb(x,y - 1)){ num = num + 1 };
		if( hasBomb(x + 1,y - 1)){ num = num + 1 };
		if( hasBomb(x - 1,y)){ num = num + 1 };
		if( hasBomb(x + 1,y)){ num = num + 1 };
		if( hasBomb(x - 1,y + 1)){ num = num + 1 };
		if( hasBomb(x,y + 1)){ num = num + 1 };
		if( hasBomb(x + 1,y + 1)){ num = num + 1 };
		return String(num);
	}
	
	function gameOver(){
		var set = 0;
		for(var i=0;i<_grid2.length;i++){
			var row = _grid2[i];
			for( var j=0;j<row.length;j++){
				if( hasBomb( j, i )){
					_grid2[i][j] = 'X';
					set++;
				}
				if( set === numberBombs() ){
					break;
				}
			}
			if( set === numberBombs() ){
				break;
			}
		}
		_gameOver = true;
	}
	
	function isGameOver(){
		return _gameOver;
	}
	
	function hasWon(){
		return _win;
	}
	
	function hasBomb(x1,y1){
		var x = x1,
			y = y1;
		if( x < 0 || y < 0 || x-1 > width() || y-1 > height() ){
			return false;
		}
		var hasbomb=false;
		for(var j=0;j<bombs.length;j++){
			var bomb = bombs[j];
			if(bomb[0] == x && bomb[1] == y ){
				hasbomb = true;
				break;
			}
		}
		return hasbomb;
	}
	
	function setFlag(x1,y1){
		var x = x1,
			y = y1;
		if( _grid2[y][x] == "F" ){
			_grid2[y][x] = "";
			_flags--;
		}else if(_grid2[y][x] == ""){
			_grid2[y][x] = "F";
			_flags++;
		}
	}
	
	function winner(){	_win = true; }
	function reset(){ createGame();}	
	function width(){ return _width; }
	function height(){ return _height;}
	function numberBombs(){ return _numberBombs; }
	function grid(){ return _grid2; }
	function flags(){ return _flags; }
	
	return {
        "width":width,
		"height": height,
		"numberBombs": numberBombs,
		"grid": grid,
		"update":update,
		"hasWon": hasWon,
		"isGameOver": isGameOver,
		"reset": reset,
		"setFlag": setFlag,
		"flags":flags
    };
}
Minesweeper.Screen = function(){
	var ctx = null,
		game = null,
		squareWidth = 40,
		squareHeight = 40,
		xgap = squareWidth / 4,
		ygap = squareHeight / 2 + 4;
	var flag = new Image();
	flag.src = 'flag.png';
	flag.onload = function(){
		flag.width = squareWidth;
		flag.height = squareHeight;
	}
	
	function draw(_ctx,_game) {
		ctx = _ctx;
		game = _game;
		drawHeader();
		drawGrid();
		ctx.font="bold " + squareWidth / 1.5 + "px Georgia";
		/*ctx.fillRect(0, 0, _width, _height-100);
        ctx.fill();
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, _height-100, _width, 100);
        ctx.fill();*/
    }
	
	function drawHeader(){
	
	}
	
	function drawGrid(){
		var grid = game.grid();
		for(var i=0;i<grid.length;i++){
			var row = grid[i];
			for(var j=0;j<row.length;j++){
				var a,b,bg,txt;
				a = ( j ) * squareWidth;
				b = ( i ) * squareHeight;
				switch( row[j] )
				{
					case "X":
						bg = 'red';
						txt = 'red';
						break;
					case "":
						bg = '#C0C0C0';
						break;
					case "0":
						bg = "#FFFFFF";
						txt = "#FFFFFF";
						break;
					case "1":
						bg = "#FFFFFF";
						txt = "#0000FF";
						break;
					case "2":
						bg = "#FFFFFF";
						txt = "#007700";
						break;
					case "3":
						bg = "#FFFFFF";
						txt = "#FF0000";
						break;
					case "F":
						bg = "#FFFFFF";
						break;
					default:
						bg = "#FFFFFF";
						txt = "#000080";
					
				}
				ctx.fillStyle = bg;
				ctx.fillRect(a,b,squareWidth,squareHeight);
				ctx.strokeRect(a,b,squareWidth,squareHeight);
			
				if( row[j] && row[j] != "0" && row[j] != "F" ){
					ctx.fillStyle = txt;
					ctx.fillText(row[j], a+xgap , b+ ygap);
				}
				else if( row[j] == "F" ){
					ctx.drawImage(flag,a,b);
				}
			}
		}
		if( game.isGameOver() ){
			alert("Game Over");
			game.reset();
			drawGrid();
		}
		if( game.hasWon() ){
			alert("Winner");
			game.reset();
			drawGrid();
		}
	}
	
	function getSquareWidth(){
		return squareWidth;
	}
	function getSquareHeight(){
		return squareHeight;
	}
	
	return {
        "draw":draw,
		"getSquareHeight": getSquareHeight,
		"getSquareWidth": getSquareWidth
    };
}
var MINESWEEPER = (function() {

    /* Generate Constants */
    (function (glob, consts) {
        for (var x, i = 0; i < consts.length; i += 1) {
            glob[consts[i].name] = {};
            for (x = 0; x < consts[i].consts.length; x += 1) {
                glob[consts[i].name][consts[i].consts[x]] = x;
            }
        }
    })(Minesweeper, Minesweeper.Consts);
	
	var screen = null,
		ctx = null,
		game = null,
		canvas;
	
	function click(e) {
		var x,y;
		if( e.offsetX ){ //Chrome
			x = e.offsetX,
			y = e.offsetY;
		}else{  //Firefox
			coords = canvas.relMouseCoords(e);
			x = coords.x;
			y = coords.y;
		}
		var x1 = x / screen.getSquareWidth();
		x1 = Math.floor(x1);
		var y1 = y / screen.getSquareHeight();
		y1 = Math.floor(y1);
		game.update(x1,y1);
		screen.draw(ctx,game);
    }
	
	function setFlag(e){
		var x,y;
		if( e.offsetX ){ //Chrome
			x = e.offsetX,
			y = e.offsetY;
		}else{ //Firefox
			coords = canvas.relMouseCoords(e);
			x = coords.x;
			y = coords.y;
		}
		var x1 = x / screen.getSquareWidth();
		x1 = Math.floor(x1);
		var y1 = y / screen.getSquareHeight();
		y1 = Math.floor(y1);
		game.setFlag(x1,y1);
		screen.draw(ctx,game);
		e.preventDefault();
		return false;
	}
	
	function newGame(_width,_height,_mines) {
		var width,
            height,
			bombs;
		
		game = screen = null;
		width = _width;
		height = _height;
		bombs = _mines;
		if(isNaN(width)) width = 10;
		if(isNaN(height)) height = 10;
		if(isNaN(bombs)) bombs = 10;
		
		if( !width || !height || !bombs ){
			alert('You can not have zero values');
			return false;
		}
		if( bombs >= height * width ){
			alert('Too many mines');
			return false;
		}
		canvas = document.getElementById("canvas");
		canvas.addEventListener("click", click, true);
		canvas.addEventListener("contextmenu", setFlag, true);
		ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		game = new Minesweeper.Game(width,height,bombs);
		screen = new Minesweeper.Screen();
		canvas.width = screen.getSquareWidth() * width;
		canvas.height = screen.getSquareHeight() * height;
		var body = document.getElementsByTagName('body');
		body[0].style.width = canvas.width;
		screen.draw(ctx,game);
    }
	
	function init(){
		HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;
		newGame();
		loaded();
	}
	
	function startScreen() {
        //screen.draw(ctx,game);
    }


    function loaded() {
        startScreen();
    }
	function relMouseCoords(event){
		var totalOffsetX = 0;
		var totalOffsetY = 0;
		var canvasX = 0;
		var canvasY = 0;
		var currentElement = this;

		do{
			totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
			totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
		}
		while(currentElement = currentElement.offsetParent)

		canvasX = event.pageX - totalOffsetX;
		canvasY = event.pageY - totalOffsetY;

		return {x:canvasX, y:canvasY}
	}

    return {
        "init" : init,
		"newGame": newGame
    };
}());