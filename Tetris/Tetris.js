document.onkeydown = applyKey;
document.onkeyup = function(){down=false} 
KEY_DOWN	= 40;
KEY_UP		= 38;
KEY_LEFT	= 37;
KEY_RIGHT	= 39;
down=false;

//Grid
NbLignes=20;
NbColonnes=10;
var grille = new Array(NbLignes);
for (i=0;i<NbLignes;i++)
{
	grille[i]= new Array(NbColonnes);
	
} 

nothing=0;
movingPiece=1;
notMovingPiece=2;
bottom=NbLignes-1;
right=1;
left=-1;
background="gray";

IsGameRunning=true;
stopMove=false;
time=0;

//Alignements
LinePosition=[-1,-1,-1,-1]
lineFormed=false;
//Pieces and turnStates
nextState=2;
turnState=1
previousState=4
spawnX=-1;
spawnY=3;
currentX=-1;
currentY=3;
currentPiece="";
colorIndex=4;
voidLine=["0","0","0","0"];
LinePiece=[
["0","24","0","0"],
["13","1234","13","13"],
["0","24","0","0"],
["0","24","0","0"],
"darkOrange"
];
SquarePiece=[
["0","0","0","0"],
["0","1234","1234","0"],
["0","1234","1234","0"],
["0","0","0","0"],
"red"
];
TPiece=[
["0","234","0","0"],
["123","1234","134","0"],
["0","124","0","0"],
["0","0","0","0"],
"yellow"
]
NPieceLeft=[
["0","0","24",""],
["13","1234","24","0"],
["0","1234","13","0"],
["0","0","0","0"],
"lime"
]
NPieceRight=[
["0","24","0","0"],
["0","1234","1234","0"],
["13","13","24","0"],
["0","0","0","0"],
"Turquoise"
]
LPieceLeft=[
["2","24","3","0"],
["13","1234","13","0"],
["1","24","4","0"],
["0","0","0","0"],
"DodgerBlue"
]

LPieceRight=[
["3","24","4","0"],
["13","1234","13","0"],
["2","24","1","0"],
["0","0","0","0"],
"Fuchsia"
]
pieceList=[LinePiece,SquarePiece,TPiece,NPieceLeft,NPieceRight,LPieceLeft,LPieceRight];
nextPiece=[0,0,0];
nextPieceList=[LinePiece,SquarePiece,TPiece,NPieceLeft,NPieceRight,LPieceLeft,LPieceRight];
ChooseNextPiece();
ChooseNextPiece();
ChooseNextPiece();

numberOfLines=-1;
linesToNextLevel=1;
points=0;
level=0;
speed=[48,43,38,33,28,23,18,13,8,6]

function initialisation() // Activé au démarrage, crée et remplis les tableaux
{
	for (x=0;x<NbLignes;x++) // boucle qui crée le tableau en HTML à partir des variables NbLignes et NbColonnes
	{
		
		document.getElementById("grille").innerHTML += "<tr id='ligne" + (x) + "'>";
		for(y=0;y<NbColonnes;y++)
		{
			document.getElementById("ligne" + (x)).innerHTML += "<td class='case' id='case"+(x)+"-"+y+"'></td>";
			
		}
		document.getElementById("grille").innerHTML += "</tr>";
		
	}
	
	for (x=0; x<NbLignes; x++) { //Remplis la boucle js de 0
		for (y=0; y<NbColonnes; y++) {
			grille[x][y] = nothing;
		}
	}
	
	for(i=0;i<3;i++)
	{
		for (x=0;x<4;x++)
		{
			document.getElementById("NextPiece"+i).innerHTML += "<tr id='ligne" + x + "Np"+i+"'>";
			for(y=0;y<4;y++)
			{
				document.getElementById("ligne" + x+"Np"+i).innerHTML += "<td class='caseVide' id='case"+x+"-"+y+"Np"+i+"'></td>";
			}
			document.getElementById("grille").innerHTML += "</tr>";
		}
	}
	
	Update(); // Lance la boucle principale
}

function Update()// Fonction qui s'éxecute toute les secondes et qui gère tous les évennements
{
	time++;
	if(IsGameRunning)
	{
		if(down && time%3==0 && !lineFormed)//Si la touche bas est enfoncée, la pièce descend plus vite
		{
			if(stopMove)
			{
				StopPieces();
				CheckLines();
				stopMove=false;
				if(!lineFormed)
					NewPiece();
			}
			else
				CheckMoves();
		}
		else if(time%speed[level]==0)
		{
			if(stopMove)
			{
				StopPieces();
				CheckLines();
				stopMove=false;
				if(!lineFormed)
					NewPiece();
			}
			else if(lineFormed)
			{
				MoveDownAll()
				lineFormed=false;
				NewPiece();
			}
			else
				CheckMoves();
		}
		
		
	}
	
	timer = requestAnimationFrame(Update)
}

function SetColor(x,y,color)
{
	document.getElementById("case"+x+"-"+y).style.backgroundColor=color
}

function GetColor(x,y)
{
	return document.getElementById("case"+x+"-"+y).style.backgroundColor
}

function CheckMoves()//Verifie si les pieces peuvent tomber, puis fait tomber les pièces
{
	for (x=NbLignes-1;x>-1;x--)
	{
		if(!stopMove)
		{
			for (y=0;y<NbColonnes;y++)
			{
				if(grille[x][y]==movingPiece && (x==bottom || grille[x+1][y]==notMovingPiece))
				{
					stopMove=true;
				}			
			}
		}
	}
	
	if(!stopMove)
	{
		for (x=NbLignes-1;x>-1;x--)
		{
			for (y=0;y<NbColonnes;y++)
			{
				if(x!=bottom && grille[x+1][y]==nothing && grille[x][y]==movingPiece)
					MoveDown(x,y,movingPiece);				
			}
		}
	}
}

function MoveDown(x,y,piece)
{
	grille[x+1][y]=piece
	grille[x][y]=nothing
	SetColor(x+1,y,GetColor(x,y))
	SetColor(x,y,background)
	
	if(piece=movingPiece)
		currentX=currentX+1/4
}

function StopPieces()// Bloque les pièces une fois qu'elles ont atteint le sol
{
	for (x=0;x<NbLignes;x++)
	{
		for (y=0;y<NbColonnes;y++)
		{
			if(grille[x][y]==movingPiece)
				grille[x][y]=notMovingPiece
		}
	}
}

function checkEventObj ( _event_ ){// Ces deux fonctions gèrent les touches appuyées
	// --- IE explorer
	if ( window.event )
		return window.event;
	// --- Netscape and other explorers
	else
		return _event_;
}

function applyKey (_event_){ //Mouvements des pièces vers la gauche ou la droite en fonction de la touche appuyée
	var winObj = checkEventObj(_event_);
	
	var touche = winObj.keyCode;
	if(!stopMove)
	{
		if(touche==KEY_RIGHT)
		{
			if(CanMoveSide(right))
				MoveRight();
		}
		
		if(touche==KEY_LEFT)
		{
			if(CanMoveSide(left))
				MoveLeft();
		}
		
		if(touche==KEY_UP)
		{
			if(CanTurn())
			{
				TurnPiece()
				NextTurnState();
			}
		}
		
		if(touche==KEY_DOWN)
		{
			down=true;
		}
		else{
			down=false;
		}
	}
		
}

function CanMoveSide(dir)//Vérifie si la pièce peux bouger horizontalement
{
	canMove=true;
	
	for (x=0;x<NbLignes;x++)
	{
		if(grille[x][NbColonnes-1]==movingPiece && dir==right)
			return false;
		
		else if(grille[x][0]==movingPiece && dir ==left)
			return false;
	}
	
	for (x=0;x<NbLignes;x++)
	{
		for (y=0;y<NbColonnes;y++)
		{
			if(grille[x][y]==movingPiece && grille[x][y+dir]==notMovingPiece)
			{
				return false;
			}
		}
	}

	return true;
}

function MoveRight()//Bouge tous les blocs vers la droite
{
	for (x=0;x<NbLignes;x++)
	{
		for (y=NbColonnes-1;y>-1;y--)
		{
			if(grille[x][y]==movingPiece)
			{
				MoveSide(x,y,right)
			}
		}
	}
	currentY++;
}

function MoveLeft()// Bouge tous les blocs vers la gauche
{
	for (x=0;x<NbLignes;x++)
	{
		for (y=0;y<NbColonnes;y++)
		{
			if(grille[x][y]==movingPiece)
			{
				MoveSide(x,y,left)
			}
		}
	}
	currentY--;
}

function MoveSide(x,y,dir)
{
	grille[x][y+dir]=movingPiece
	grille[x][y]=nothing
	SetColor(x,y+dir,GetColor(x,y))
	SetColor(x,y,background)
}

function NewPiece()// Prépare l'arrivée d'une nouvelle pièce
{
	turnState=4
	nextState=1
	currentX=-1;
	currentY=3;
	currentPiece=nextPiece[0]
	
	ChooseNextPiece();
	ShowNextPiece();
	
	if(CanTurn())
	{
		SpawnPiece();
		NextTurnState();
	}
	else
	{
		alert("Game Over !")
	}
}

function Spawn(x,y,color)// Fait apparaitre un MovingBloc à l'emplacement visé
{
	grille[x][y]=movingPiece;
	SetColor(x,y,color);
}

function Delete(x,y)
{
	grille[x][y]=nothing;
	SetColor(x,y,background);
}

function random(Max)// renvoie un nombre entier aléatoire entre 0 et Max
{
	var rand = Math.floor(Math.random()*(Max));
	return rand;
}

function NextTurnState()
{
	turnState=nextState
	nextState++;
	if(nextState>4)
		nextState=1;
}


function SpawnPiece()
{
	for (x=0;x<4;x++)
	{
		for(y=0;y<4;y++)
		{
			if(currentPiece[x][y].indexOf(1) >-1)	//Le code de la pièce est une grille de 4x4, les nombre correspondent 
			{									//à la Partie visible à un moment donné, qui change quand on tourne la pièce;
				Spawn(x+spawnX,y+spawnY,currentPiece[colorIndex])//On cherche ici à montrer la phase 1 de la pièce
			}
		}
	}
}

function CanTurn()
{
	for (x=0;x<4;x++)
	{
		for(y=0;y<4;y++)
		{
			if(currentPiece[x][y].indexOf(nextState) >-1) 
			{									
				if(currentX+x>=NbLignes || currentX+x<0 || currentY+y>=NbColonnes || currentY+y<0)
				{
					return false
				}
				else if(grille[currentX+x][currentY+y]==notMovingPiece)
					return false
			}
		}
	}
	return true;
}

function TurnPiece()
{
	for(x=0;x<4;x++)
	{
		for(y=0;y<4;y++)
		{
			if(currentPiece[x][y].indexOf(turnState) >-1)
			{
				Delete(x+currentX,y+currentY)
			}
			if(currentPiece[x][y].indexOf(nextState) >-1)
			{
				Spawn(x+currentX,y+currentY,currentPiece[colorIndex]);
			}
		}
	}
}

function CheckLines()
{
	LinesNumber=0
	lineFormed=false;
	LinePosition=[-1,-1,-1,-1]
	for(x=0;x<NbLignes;x++)
	{
		line=true
		for(y=0;y<NbLignes;y++)
		{
			if(grille[x][y]==nothing)
				line=false;
		}
		if(line)
		{
			DeleteLine(x);
			LinePosition[LinesNumber]=x;
			lineFormed=true;
			LinesNumber++
		}
	}
	if(LinesNumber>0)
		AddPoints(LinesNumber)
}

function DeleteLine(x)
{
	for(y=0;y<NbColonnes;y++)
	{
		Delete(x,y)
	}
}

function MoveDownAll()
{
	for(i=0;i<4;i++)
	{
		if(LinePosition[i]>-1)
		{
			for (x=LinePosition[i];x>-1;x--)
			{
				for(y=0;y<NbColonnes;y++)
				{
					if(grille[x][y]==notMovingPiece)
					{
						MoveDown(x,y,notMovingPiece);
					}
				}
			}
		}
	}
}

function ShowNextPiece()
{
	for(i=0;i<3;i++)
	{
		for (x=0;x<4;x++)
		{
			for(y=0;y<4;y++)
			{
				if(nextPiece[i][x][y].indexOf(1)>-1)
				{
					document.getElementById("case"+x+"-"+y+"Np"+i).style.backgroundColor=nextPiece[i][colorIndex];
					document.getElementById("case"+x+"-"+y+"Np"+i).style.border="2px black solid";
				}
				else{
					document.getElementById("case"+x+"-"+y+"Np"+i).style.backgroundColor="";
					document.getElementById("case"+x+"-"+y+"Np"+i).style.border="1px mediumblue solid";
				}
			}
		}
	}
}

function Restart()
{
	ClearTables();
	nextPieceList=[LinePiece,SquarePiece,TPiece,NPieceLeft,NPieceRight,LPieceLeft,LPieceRight]
	ChooseNextPiece();
	ChooseNextPiece();
	ChooseNextPiece();
	
	points=0;
	level=0;
	linesToNextLevel=1
	UpdateInterface();
	NewPiece();
	down=false;
}

function ClearTables()
{
	for(x=0;x<NbLignes;x++)
	{
		for(y=0;y<NbColonnes;y++)
		{
			grille[x][y]=nothing
			SetColor(x,y,background);
		}
	}
}

function ChooseNextPiece()
{
	if(nextPieceList.length==0)
		nextPieceList=[LinePiece,SquarePiece,TPiece,NPieceLeft,NPieceRight,LPieceLeft,LPieceRight];
	
	rand=random(nextPieceList.length)
	nextPiece[0]=nextPiece[1];
	nextPiece[1]=nextPiece[2];
	nextPiece[2]=nextPieceList[rand];
	nextPieceList.splice(rand,1);
}

function AddPoints(LinesNumber)
{
	if(LinesNumber==1)
	{
		points+=100*level;
		numberOfLines+=1;
		linesToNextLevel-=1;
	}
	else if(LinesNumber==2)
	{
		points+=300*level;
		numberOfLines+=3;
		linesToNextLevel-=3;
	}
	else if(LinesNumber==3)
	{
		points+=500*level;
		numberOfLines+=5;
		linesToNextLevel-=5;
	}
	else{
		points+=800*level;
		numberOfLines+=8;
		linesToNextLevel-=8;
	}
	
	CheckLevelUp()
	UpdateInterface();
}

function CheckLevelUp()
{
	if(linesToNextLevel<=0 && level<speed.length)
	{
		numberOfLines= numberOfLines-3*level
		level++
		linesToNextLevel=3*level-numberOfLines
		CheckLevelUp();
	}
	
}

function UpdateInterface()
{
	document.getElementById("points").innerHTML=points;
	document.getElementById("level").innerHTML=level;
	document.getElementById("linesToNextLevel").innerHTML=linesToNextLevel;
}

