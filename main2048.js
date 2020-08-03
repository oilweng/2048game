var board = [];
var score = 0;
var hasConflicted = [];

$(document).ready(function(){//DOM加载后发生ready事件（运行function)
	newgame();
});

function newgame(){
	//初始化棋盘格
	init();
	//在随机两个盒子生成数字
	generateOneNumber();
	generateOneNumber();
}

function init(){////初始化棋盘格
	for( var i = 0; i < 4; i++)
		for(var j = 0; j < 4; j++){//双重循环，遍历每一个小格子
			var gridCell = $("#grid-cell-"+i+"-"+j);//通过id获取每一个小格子对象
			gridCell.css('top',getPosTop(i,j));//通过函数计算top值，并对css相应top进行操作
			gridCell.css('left',getPosLeft(i,j));
		}

	for( var i = 0 ; i < 4 ; i++ ){
		board[i] = [];//board[i]声明成一个数组，board变成了二维数组
		hasConflicted[i] = [];
		for( var j = 0 ; j < 4 ; j++ ){
			board[i][j] = 0;//初始化每一个值
			hasConflicted[i][j] = false;
		}
	}	
	updateBoardView();//调用函数通知前端对number-cell里的元素进行显示上的设定

	score = 0;
}

function updateBoardView(){//对number-cell里的元素进行显示上的设定
	$(".number-cell").remove();//如果已有number-cell元素，这些元素删除掉
	for(i = 0; i < 4; i++ )
		for(j = 0; j < 4; j++){//双重循环遍历board元素
			$("#grid-container").append('<div class = "number-cell" id = "number-cell-'+i+'-'+j+'")</div>')
			//对每个board元素生成一个number-cell;append方法在被选元素结尾插入指定内容；
			var theNumberCell = $('#number-cell-'+i+'-'+j);//为操作方便，用变量操作当前i j 下的number-cell值 
            
            if( board[i][j] == 0){
            	theNumberCell.css('width', '0px');
            	theNumberCell.css('height', '0px'); //使number-cell显示不出来
            	theNumberCell.css('top', getPosTop(i,j) + 50);
            	theNumberCell.css('left', getPosLeft(i,j) + 50);//每一个grid-cell左上角坐标加50，得到grid-cell中间位置
            }else{
            	theNumberCell.css('width', '100px');
            	theNumberCell.css('height', '100px'); 
            	theNumberCell.css('top', getPosTop(i,j));
            	theNumberCell.css('left', getPosLeft(i,j));//字的左上角与grid一样
            	theNumberCell.css('background-color', getNumberBackgroundColor( board[i][j] ));//根据数字不同设置不同颜色
            	theNumberCell.css('color', getNumberColor( board[i][j] )); //返回文字前景色
            	theNumberCell.text( board[i][j] );//显示数字值
            }		
            hasConflicted[i][j] = false;
		}
}

function generateOneNumber(){//生成随机数
	if( nospace( board) )
		return false;
	//随机一个位置
	var randx = parseInt(Math.floor(Math.random() * 4 ));//random:0~1随机数；floor:下取整；parseInt:取整形
	var randy = parseInt(Math.floor(Math.random() * 4 ));


    var times = 0;
	while( times < 50 ){//死循环 直到找到产生可用坐标
		if( board[randx][randy] == 0 )
			break;

		randx = parseInt(Math.floor(Math.random() * 4 ));
		randy = parseInt(Math.floor(Math.random() * 4 ));

		times++;
	}

	if ( times == 50 ){
		for( var i = 0; i < 4; i++ )
			for( var j = 0; j < 4; j++ ){
				if( board[i][j] == 0 ){
					randx = i;
					randy = j;
				}
			}
	}

	//随机一个数字
	var randNumber = Math.random() < 0.5 ? 2 : 4;

	//在随机位置显示随机数字
	board[randx][randy] = randNumber;//更新board变量
	showNumberWithAnimation ( randx, randy, randNumber );//显示动画函数
	
	return true;
}

$(document).keydown(function( event ){//keydown事件（按下按键）传入函数（通过event参数获取玩家操作信息）
	switch ( event.keyCode ){
		case 37://left
			if ( moveLeft() ){//不一定可以向左移动，需要if判断
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);//判断游戏是否结束
			}
			break;
		case 38://up
			if ( moveUp() ){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);//判断游戏是否结束
			}
			break;
		case 39://right
			if ( moveRight() ){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);//判断游戏是否结束
			}
			break;
		case 40://down
			if ( moveDown() ){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);//判断游戏是否结束
			}
			break;	
		default://default （按其他键没有反应）	
			break;	
	}
});

function isgameover(){
	if( nospace( board ) && nomove( board )){
		gameover();
	}
}

function gameover(){
	alert('gameover!')
}

function moveLeft(){
	if( !canMoveLeft( board ))//判断是否可以向左移动
		return false;

	//moveLeft
	for (var i = 0; i < 4; i++)
		for(var j = 1; j < 4; j++){//4x4格子的后三列进行搜索
			if( board[i][j] != 0){//当前元素不等于0，有可能可以左移
				for( var k =0; k < j; k++){//对左侧进行考察，在进行一次循环
					if( board[i][k] == 0 && noBlockHorizontal( i, k, j, board ) ){//ik为0且中间没有障碍物
						//move
						showMoveAnimation( i, j, i, k );
						board[i][k] = board[i][j];
						board[i][j] = 0;//i j位置移动到i k位置
						continue;
					}
					else if ( board[i][k] == board[i][j] && noBlockHorizontal( i, k, j, board) && !hasConflicted[i][k] ){
						//move
						showMoveAnimation( i, j, i, k );
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[i][k];
						updateScore( score );//通知前台

						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		
		}
	setTimeout("updateBoardView()",200);
	return true;
}

function moveRight(){
	if( !canMoveRight( board ))
		return false;

	//moveRight
	for (var i = 0; i < 4; i++)
		for(var j = 2; j >= 0 ; j--){
			if( board[i][j] != 0){
				for( var k = 3; k > j; k--){
					if( board[i][k] == 0 && noBlockHorizontal( i, j, k, board ) ){
						//move
						showMoveAnimation( i, j, i, k );
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if ( board[i][k] == board[i][j] && noBlockHorizontal( i, j, k, board ) && !hasConflicted[i][k]){
						//move
						showMoveAnimation( i, j, i, k );
						//add
						board[i][k] *= 2;
						board[i][j] = 0;
						//add score
						score += board[i][k];
						updateScore( score );//通知前台

						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		
		}
	setTimeout("updateBoardView()",200);
	return true;
}

function moveUp(){
	if( !canMoveUp( board ))
		return false;

	//moveUp
	for (var j = 0; j < 4; j++)
		for(var i = 1; i < 4 ; i++){
			if( board[i][j] != 0){
				for( var k = 0; k < i; k++){
					if( board[k][j] == 0 && noBlockVertical( j, k, i, board ) ){
						//move
						showMoveAnimation( i, j, k, j );
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if ( board[k][j] == board[i][j] && noBlockVertical( j, k, i, board ) && !hasConflicted[k][j]){
						//move
						showMoveAnimation( i, j, k, j );
						//add
						board[k][j] *= 2;
						board[i][j] = 0;
						//add score
						score += board[k][j];
						updateScore( score );//通知前台

						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		
		}
	setTimeout("updateBoardView()",200);
	return true;
}

function moveDown(){
	if( !canMoveDown( board ))
		return false;

	//moveDown
	for (var j = 0; j < 4; j++)
		for(var i = 2; i >= 0 ; i--){
			if( board[i][j] != 0){
				for( var k = 3; k > i; k--){
					if( board[k][j] == 0 && noBlockVertical( i, j, k, board ) ){
						//move
						showMoveAnimation( i, j, i, k );
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if ( board[k][j] == board[i][j] && noBlockVertical( j, i, k, board )&& !hasConflicted[k][j]){
						//move
						showMoveAnimation( i, j, k, j );
						//add
						board[k][j] *= 2;
						board[i][j] = 0;
						//add score
						score += board[k][j];
						updateScore( score );//通知前台

						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		
		}
	setTimeout("updateBoardView()",200);
	return true;
}