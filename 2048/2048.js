document.onkeydown = applyKey; 
KEY_DOWN	= 40;
KEY_UP		= 38;
KEY_LEFT	= 37;
KEY_RIGHT	= 39;
cooldown=[true,true,true,true]

tableSize=4;
NbFusions=1;
fusions=0;
score=0;
moves=0;
validMove=false;


var tableTile = new Array(tableSize);
	for (i=0;i<tableSize;i++)
	{
		tableTile[i]= new Array(tableSize);
			for (j=0; j<tableSize;j++)
			{
				tableTile[i][j]=0;
			}
		
	} 
function checkEventObj ( _event_ ){// Key pressed Mechanic
	// --- IE explorer
	if ( window.event )
		return window.event;
	// --- Netscape and other explorers
	else
		return _event_;
}

function applyKey (_event_){ 
	var winObj = checkEventObj(_event_);
	
	var touche = winObj.keyCode;
	
		if(touche==KEY_RIGHT || touche==KEY_LEFT || touche==KEY_UP || touche==KEY_DOWN)
		{
			if(cooldown[touche-37])
			{
				validMove=false;
				if(touche==KEY_RIGHT)
					MoveRight();
				if(touche==KEY_LEFT)
					MoveLeft();
				if(touche==KEY_UP)
					MoveUp();
				if(touche==KEY_DOWN)
					MoveDown();
				cooldown[touche-37]=false;
				setTimeout(ResetCooldown,500,touche);
				if(validMove)
				{
					AddTile();
					AddMove();
				}
			}
		}
	
}



function MoveRight(){
	for (x=0;x<tableSize;x++)
	{
		SetNbfusions(x,-1);
		for (y=tableSize-1;y>-1;y--)
		{
			for(i=0;i<tableSize-1;i++)
			{
				if(tableTile[x][y]==0)
				{
					if(y-1>-1)
						MoveTile(x,y-1,x,y);
					if(y-2>-1)
						MoveTile(x,y-2,x,y-1);
					if(y-3>-1)
						MoveTile(x,y-3,x,y-2);
					if(y-4>-1)
						MoveTile(x,y-4,x,y-3);
				}
				
				if(tableTile[x][y]==tableTile[x][y-1] && tableTile[x][y]!=0 && fusions<NbFusions)
				{
					MoveTile(x,y-1,x,y);
					DoubleTile(x,y);
				}
				
				if(y+1<tableSize)
				{
					if(tableTile[x][y]==tableTile[x][y+1] && tableTile[x][y]!=0 && fusions<NbFusions)
					{
						MoveTile(x,y,x,y+1);
						DoubleTile(x,y+1);
					}
				}
					
			}
		}
	}
}

function MoveLeft(){
	for (x=0;x<tableSize;x++)
	{
		SetNbfusions(x,-1);
		for (y=0;y<tableSize;y++)
		{
			for(i=0;i<tableSize-1;i++)
			{
				if(tableTile[x][y]==0)
				{
					if(y+1<tableSize)
						MoveTile(x,y+1,x,y);
					if(y+2<tableSize)
						MoveTile(x,y+2,x,y+1);
					if(y+3<tableSize)
						MoveTile(x,y+3,x,y+2);
					if(y+4<tableSize)
						MoveTile(x,y+4,x,y+3);
				}
				
				if(tableTile[x][y]==tableTile[x][y+1] && tableTile[x][y]!=0 && fusions<NbFusions)
				{
					MoveTile(x,y+1,x,y);
					DoubleTile(x,y);
				}
				
				if(y-1>-1)
				{
					if(tableTile[x][y]==tableTile[x][y-1] && tableTile[x][y]!=0 && fusions<NbFusions)
					{
						MoveTile(x,y,x,y-1);
						DoubleTile(x,y-1);
					}
				}
					
			}
		}
	}
}

function MoveUp()
{
	for(y=0;y<tableSize;y++)
	{
		SetNbfusions(-1,y);
		for (x=0;x<tableSize;x++)
		{
			for (i=0;i<tableSize;i++)
			{
				if(tableTile[x][y]==0)
				{
					if(x+1<tableSize)
						MoveTile(x+1,y,x,y);
					if(x+2<tableSize)
						MoveTile(x+2,y,x+1,y);
					if(x+3<tableSize)
						MoveTile(x+3,y,x+2,y);
					if(x+4<tableSize)
						MoveTile(x+4,y,x+3,y);
				}
				
				if(x+1<tableSize)
				{
					if(tableTile[x][y]==tableTile[x+1][y] && tableTile[x][y]!=0 && fusions<NbFusions)
					{
						MoveTile(x+1,y,x,y);
						DoubleTile(x,y);
					}
				}
				
				if(x-1>-1)
				{
					if(tableTile[x][y]==tableTile[x-1][y] && tableTile[x][y]!=0 && fusions<NbFusions)
					{
						MoveTile(x,y,x-1,y);
						DoubleTile(x-1,y);
					}
				}
			}
		}
	}
}

function MoveDown()
{
	for(y=0;y<tableSize;y++)
	{
		SetNbfusions(-1,y)
		for (x=tableSize-1;x>-1;x--)
		{
			for (i=0;i<tableSize-1;i++)
			{
				if(tableTile[x][y]==0)
				{
					if(x-1>-1)
						MoveTile(x-1,y,x,y);
					if(x-2>-1)
						MoveTile(x-2,y,x-1,y);
					if(x-3>-1)
						MoveTile(x-3,y,x-2,y);
					if(x-4>-1)
						MoveTile(x-4,y,x-3,y);
				}
				
				if(x-1>-1)
				{
					if(tableTile[x][y]==tableTile[x-1][y] && tableTile[x][y]!=0 && fusions<NbFusions)
					{
						MoveTile(x-1,y,x,y);
						DoubleTile(x,y);
					}
				}
				
				if(x+1<tableSize)
				{
					if(tableTile[x][y]==tableTile[x+1][y] && tableTile[x][y]!=0 && fusions<NbFusions)
					{
						MoveTile(x,y,x+1,y);
						DoubleTile(x+1,y);
					}
				}
			}
		}
	}
}

function MoveTile(x1,y1,x2,y2){
	
	if(tableTile[x1][y1]!=0 || tableTile[x2][y2]!=0)
	{
	tableTile[x2][y2]=tableTile[x1][y1];
	tableTile[x1][y1]=0;
	
	ChangeTile(x1,y1,tableTile[x1][y1]);
	ChangeTile(x2,y2,tableTile[x2][y2]);
	validMove=true;
	}
	
}

function DoubleTile(x,y){
	
		tableTile[x][y]=tableTile[x][y]*2;
		ChangeTile(x,y,tableTile[x][y]);
		fusions++;
		AddScore(tableTile[x][y]);
}

function SetNbfusions(x,y){
	NbFusions=1;
	fusions=0;
	if(tableSize==4)
	{
		if(y==-1)
		{
			if(tableTile[x][0]==tableTile[x][1] && tableTile[x][2]==tableTile[x][3])
			{
				NbFusions=2;
			}
		}
		if(x==-1)
		{
			if(tableTile[0][y]==tableTile[1][y] && tableTile[2][y]==tableTile[3][y])
			{
				NbFusions=2;
			}
		}
	}
	
	if(tableSize==5)
	{
		if(y==-1)
		{
			if(tableTile[x][0]==tableTile[x][1] && tableTile[x][0]!=0 && tableTile[x][2]==tableTile[x][3] && tableTile[x][2]!=0)
				NbFusions=2
			if(tableTile[x][0]==tableTile[x][1] && tableTile[x][0]!=0 && tableTile[x][2]==tableTile[x][4] && tableTile[x][2]!=0)
				NbFusions=2
			if(tableTile[x][0]==tableTile[x][1] && tableTile[x][0]!=0 && tableTile[x][3]==tableTile[x][4] && tableTile[x][3]!=0)
				NbFusions=2
			if(tableTile[x][0]==tableTile[x][2] && tableTile[x][0]!=0 && tableTile[x][3]==tableTile[x][4] && tableTile[x][3]!=0)
				NbFusions=2
			if(tableTile[x][1]==tableTile[x][2] && tableTile[x][1]!=0 && tableTile[x][3]==tableTile[x][4] && tableTile[x][3]!=0)
				NbFusions=2
		}
		if(x==-1)
		{
			if(tableTile[0][y]==tableTile[1][y] && tableTile[0][y]!=0 && tableTile[2][y]==tableTile[3][y] && tableTile[2][y]!=0)
				NbFusions=2
			if(tableTile[0][y]==tableTile[1][y] && tableTile[0][y]!=0 && tableTile[2][y]==tableTile[4][y] && tableTile[2][y]!=0)
				NbFusions=2
			if(tableTile[0][y]==tableTile[1][y] && tableTile[0][y]!=0 && tableTile[3][y]==tableTile[4][y] && tableTile[3][y]!=0)
				NbFusions=2
			if(tableTile[0][y]==tableTile[2][y] && tableTile[0][y]!=0 && tableTile[3][y]==tableTile[4][y] && tableTile[3][y]!=0)
				NbFusions=2
			if(tableTile[1][y]==tableTile[2][y] && tableTile[1][y]!=0 && tableTile[3][y]==tableTile[4][y] && tableTile[3][y]!=0)
				NbFusions=2
		}
	}
}


function ResetCooldown(direction){
	cooldown[direction-37]=true;
}

function Initialisation(){
	NewGame();
}

function NewGame(){
	SetTableSize();
	CreateTable();
	Reset();
	AddTile();
	AddTile();
}

function SetTableSize()
{
	if(document.getElementsByName("size")[0].checked)
	{
		tableSize=4;
	}
	else if(document.getElementsByName("size")[1].checked){
		tableSize=5;
	}
}

function CreateTable(){
	document.getElementById("grid").innerHTML="";
	for (x=0;x<tableSize;x++) 
	{
		
		document.getElementById("grid").innerHTML += "<tr id='line" + x + "'>";
		for(y=0;y<tableSize;y++)
		{
			document.getElementById("line" + x).innerHTML += "<td class='tile0' id='tile"+x+"-"+y+"'></td>";
			document.getElementById("tile"+x+"-"+y).innerHTML+="<p id='number"+x+"-"+y+"' class='number'></p>";
			
			if(tableSize==4)
			{
				document.getElementById("number"+x+"-"+y).style.fontSize="2.7em";
				document.getElementById("tile"+x+"-"+y).style.width="100px";
				document.getElementById("tile"+x+"-"+y).style.height="100px";
			}
			else if(tableSize==5)
			{
				document.getElementById("number"+x+"-"+y).style.fontSize="1.4em";
				document.getElementById("tile"+x+"-"+y).style.width="50px";
				document.getElementById("tile"+x+"-"+y).style.height="50px";
			}
			
		}
		document.getElementById("grid").innerHTML += "</tr>";
		
	}
	
	
}

function Reset(){
	tableTile = new Array(tableSize);
	for (i=0;i<tableSize;i++)
	{
		tableTile[i]= new Array(tableSize);
			for (j=0; j<tableSize;j++)
			{
				tableTile[i][j]=0;
				ChangeTile(i,j,0);
			}
		
	} 
	SetScore(0);
	ResetMoves();
}

function Random(Max){
	var rand = Math.floor(Math.random()*(Max));
	return rand;
}

function AddTile(){
	xTile=Random(tableSize);
	yTile=Random(tableSize);
	
	if(tableTile[xTile][yTile]==0)
	{
		tileNumber= ChooseNumber();
		tableTile[xTile][yTile]=tileNumber;
		ChangeTile(xTile,yTile,tileNumber)
	}
	else{
		AddTile();
	}
	
}

function ChooseNumber(){
	probability=Random(100);
	if(probability<=10)
	{
		return 4;
	}
	else{
		return 2;
	}
}

function ChangeTile(x,y,tileNumber){
	
	document.getElementById("tile"+x+"-"+y).className= "tile"+tileNumber
	
	document.getElementById("number"+x+"-"+y).innerHTML=tileNumber
	document.getElementById("number"+x+"-"+y).style.opacity=1;
	
	if(tileNumber==0)
	{
			document.getElementById("number"+x+"-"+y).style.opacity=0;
	}
	
	

}

function SetScore(newScore){
	score=newScore;
	document.getElementById("Score").innerHTML=newScore;
}
function ResetMoves(){
	moves=0;
	document.getElementById("Moves").innerHTML=moves;
}

function AddScore(point){
	score+=point;
	SetScore(score);
}
function AddMove(){
	moves+=1;
	document.getElementById("Moves").innerHTML=moves;
}