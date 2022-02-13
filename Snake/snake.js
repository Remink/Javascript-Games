document.onkeydown = applyKey; 
KEY_DOWN	= 40;
KEY_UP		= 38;
KEY_LEFT	= 37;
KEY_RIGHT	= 39;

KEY_S		= 83;
KEY_Z		= 90;
KEY_Q		= 81;
KEY_D		= 68;

var NbLignes = 15;
var NbColonnes = 17;
//Player variables
var xHead = [-2,-1];
var yHead = [-1,-1];
var xDepart = [2,12];
var yDepart = [2,14];
var colorDepart=["orange","lime"];
var startDirection = [KEY_RIGHT,KEY_LEFT];
var direction = [KEY_RIGHT,KEY_LEFT];
var longueur = [10,3];
var CanChangeDirection = [true,true];
var IsRunning = [false,false];
var PlayerColor=["red","green"];
var Point=[0,0];

var timer;
var time=0;
var speed=4;
var Started=false;
var Seconds=0;
var Minutes=0;
var IGTime=0;


var BackColor=["Turquoise","DeepSkyBlue"];
var AppleColor="purple";
var NbJoueurs=1;

//Names Variables
var apple=-1;
var nothing = 0;

//Variants

//EatToWin - Respawn Mechanic
var EatToWin = false;
var RespawnTime=3*60;
var PlayerRespawn=[0,0];
var IsRespawning=[false,false];
var Respawnx=[0,0,NbLignes-1,NbLignes-1];
var Respawny=[0,NbColonnes-1,0,NbColonnes-1];
var RespawnDirection=[KEY_RIGHT,KEY_DOWN,KEY_UP,KEY_LEFT];
var PreviousSpawnLocation=[-1];
var IsGameRunning= false;
var PointsToWin=0;
var FastDespawn=0;

for(x=0;x<NbLignes;x++)// Setup respawn locations
{
	Respawnx[x]=x;
	Respawny[x]=0;
	RespawnDirection[x]=KEY_RIGHT
	
	Respawnx[x+NbLignes]=x;
	Respawny[x+NbLignes]=NbColonnes-1;
	RespawnDirection[x+NbLignes]=KEY_LEFT;
	
}

for(y=0;y<NbColonnes;y++)
{
	Respawnx[y+2*NbLignes]=0;
	Respawny[y+2*NbLignes]=y;
	RespawnDirection[y+2*NbLignes]=KEY_DOWN;
	
	Respawnx[y+3*NbLignes+NbColonnes-NbLignes]=NbLignes-1;
	Respawny[y+3*NbLignes+NbColonnes-NbLignes]=y;
	RespawnDirection[y+3*NbLignes+NbColonnes-NbLignes]=KEY_UP;
	
}

//WallEmergence - Walls
var WallEmergence = false;
var wall = NbLignes*NbColonnes+1;
var WallColor="Blue";


//tableauCase
var tableauCase = new Array(NbLignes);
	for (i=0;i<NbLignes;i++)
	{
		tableauCase[i]= new Array(NbColonnes);
		
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
	
	if(touche==KEY_DOWN || touche==KEY_LEFT || touche==KEY_RIGHT || touche==KEY_UP)
	{
		if(CanChangeDirection[0])
		{
			changeDirection(touche, 0);
			CanChangeDirection[0]=false;
		}
	}
	
	if(NbJoueurs==2)
	{
		if(touche==KEY_S || touche==KEY_Q || touche==KEY_D || touche==KEY_Z)
		{
			if(CanChangeDirection[1])
			{
				changeDirection(touche, 1);
				CanChangeDirection[1]=false;
			}
		}
	}
}

function initialisation() // Activated when realoading, create and fill tables
{
	for (x=0;x<NbLignes;x++) // boucle qui crée le tableau en HTML à partir des variables NbLignes et NbColonnes
	{
		
		document.getElementById("grille").innerHTML += "<tr id='ligne" + x + "'>";
		for(y=0;y<NbColonnes;y++)
		{
			document.getElementById("ligne" + x).innerHTML += "<td class='case' id='case"+x+"-"+y+"'></td>";
			
		}
		document.getElementById("grille").innerHTML += "</tr>";
		
	}
	
	for (x=0; x<NbLignes; x++) { //Remplis la boucle js de 0
		for (y=0; y<NbColonnes; y++) {
			tableauCase[x][y] = nothing;
			colorBack(x,y);
		}
	}
	
	Update();
	//setInterval(verification,200);
	//setInterval(mouvement,200);
	
}
function Start() //Reset every variables and start
{
	NbJoueurs= parseInt(document.getElementById("Nbjoueurs").value);
	var longueurDepart = parseInt(document.getElementById("TailleDepart").value);
	speed = parseInt(document.getElementById("Vitesse").value);
	var NbPommes = parseInt(document.getElementById("Nbpommes").value);
	
	
	IsGameRunning=true;
	
	CheckVariants();
	for(i=0;i<NbJoueurs;i++)
	{
		longueur[i]=longueurDepart;
		xHead[i]=xDepart[i]
		yHead[i]=yDepart[i]
		tableauCase[xHead[i]][yHead[i]] = longueur[i]
		direction[i]=startDirection[i];
		IsRunning[i]=true;
		
	}
	
	for (x=0; x<NbLignes; x++) { //Remplis la boucle js de 0
		for (y=0; y<NbColonnes; y++) {
			tableauCase[x][y] = nothing;
			colorBack(x,y);
		}
	}
	
	for (j=0;j<2;j++)
	{
		Point[j]=-1;
		AddPoint(j);
		IsRespawning[j]=false; // EatToWin
		PlayerRespawn[j]=0;
	}
	Seconds=0;
	Minutes=0;
	IGTime=0;
	UpdateRealTime();
	HideIGTime();
	
	
	IsGameRunning=true;
	Started=true;
	time=0;
	for(i=0;i<NbPommes;i++)
	{
		SpawnThing(apple);
	}
	
	
}
function Update()//Function activated every tick  (1/60 seconds)
{
	if(IsGameRunning)
	{
		time++;
		if(time%speed==0)
		{
			
			for(i=0;i<NbJoueurs;i++)
			{
				if(IsRunning[i])
				{
					mouvement(i);
					CanChangeDirection[i]=true;
				}
				
				if(EatToWin && !IsRunning[i] && tableauCase[xHead[i]][yHead[i]] == 0 && !IsRespawning[i]) //EatToWin
				{
					IsRespawning[i]=true;
				}
				
			}
			Couleurs();
			if(IsRunning[0]||IsRunning[1])
				UpdateIGTime();

			
			
			
		}
		if(time%60==0 && Started)
			{
				UpdateRealTime();
			}
		
		if(IsRespawning[0]) //EatToWin
		{
			CheckRespawn(0);
		}
		if(IsRespawning[1])
		{
			CheckRespawn(1);
		}
		
		if(EatToWin)
		{
			WinCheck();
		}
	}
	
	
	timer = requestAnimationFrame(Update)
}

function Couleurs() //Color Mechanic
{
	if(xHead[0]!=-2)
	{
		for (x=0; x<NbLignes; x++) {
			for (y=0; y<NbColonnes; y++) {
				if(tableauCase[x][y]==wall) // WallEmergence
				{
					document.getElementById("case"+x+"-"+y).style.backgroundColor= WallColor;
				}
				else if(tableauCase[x][y] > nothing) {
					
					tableauCase[x][y]--;
				} 
				else if(tableauCase[x][y]== nothing){
					
					colorBack(x,y);
				}
				else if(tableauCase[x][y]==apple)
				{
					document.getElementById("case"+x+"-"+y).style.backgroundColor= AppleColor;
					
				}
				
				
				
			}
		}
		
		if(IsRunning[0])
		{
			colorHead(0);
		}
		if(IsRunning[1])
		{
			colorHead(1);
		}
	
	}
}

function colorHead(player)
{
	
		if(IsRunning[player])
		{
			document.getElementById("case"+xHead[player]+"-"+yHead[player]).style.backgroundColor=PlayerColor[player];
		}
	
}

function colorBack(x,y)
{
	if(x%2==0 && y%2==0 || x%2!=0 && y%2!=0)
		{
			document.getElementById("case" + x +"-"+ y).style.backgroundColor = BackColor[0];
		}
		else
		{
			document.getElementById("case" + x +"-"+ y).style.backgroundColor = BackColor[1];
		}
}


function mouvement(player) // Movement and direction Mechanic
{
	if(direction[player] == KEY_RIGHT) {
		yHead[player]++;
		
	}
	else if(direction[player] == KEY_DOWN) {
		xHead[player]++;
	}
	else if(direction[player] == KEY_LEFT) {
		yHead[player]--;
	}
	else if(direction[player] == KEY_UP) {
		xHead[player]--;
	}
	
	if(IsRunning[player])
	{
		ColisionCheck(player);
	}
	if(IsRunning[player])
	{
		
		tableauCase[xHead[player]][yHead[player]] = longueur[player];
	}
	
}

function changeDirection(toucheApuyée, player)
{
	if(toucheApuyée==KEY_D)
	{
		toucheApuyée=KEY_RIGHT;
	}
	
	if(toucheApuyée==KEY_S)
	{
		toucheApuyée=KEY_DOWN;
	}
	
	if(toucheApuyée==KEY_Q)
	{
		toucheApuyée=KEY_LEFT;
	}
	
	if(toucheApuyée==KEY_Z)
	{
		toucheApuyée=KEY_UP;
	}
	
	if(direction[player]!=toucheApuyée+2 && direction[player]!=toucheApuyée-2)
	{
		direction[player] = toucheApuyée;
	}
}

function ColisionCheck(player) // Colision Mechanic
{
	if(xHead[player]>=NbLignes||xHead[player]<0 || yHead[player]>=NbColonnes || yHead[player]<0)
	{
		
		ColisionDetected(player);
	}
	else if(tableauCase[xHead[player]][yHead[player]]> nothing)
	{
		ColisionDetected(player);
	}
	else if(tableauCase[xHead[player]][yHead[player]]== apple)
	{
		EatApple(player);
		
	}
	
	
}

function ColisionDetected(player)
{
	
	IsRunning[player]=false;
	
	if(direction[player]+2<41)
	{
		direction[player]+=2;
	}
	else{
		direction[player]-=2;
	}
	mouvement(player);
	
	if(EatToWin && FastDespawn==1)
	{
		InstantDespawn(player);
	}
	if( !EatToWin && IsRunning[0]==false && IsRunning[1]==false)
	{
		GameOver();
	}
	

	
}



function SpawnThing(Thing) { // Apple Mechanic   //Wall Mechanic
	var xThing=random(NbLignes)
	var yThing=random(NbColonnes)
	if(tableauCase[xThing][yThing]== nothing)
	{
		tableauCase[xThing][yThing]= Thing;
	}
	else {
		SpawnThing(Thing);
	}
}

function random(Max)// renvoie un nombre entier aléatoire entre 0 et Max
{
	var rand = Math.floor(Math.random()*(Max));
	return rand;
}

function EatApple(player)
{
	Grow(player);
	AddPoint(player);
	if(WallEmergence)// WallEmergence
		SpawnThing(wall);
	
	SpawnThing(apple);
}
function Grow(player)
{
	longueur[player]++;
	
	for (x=0; x<NbLignes; x++) {
		for (y=0; y<NbColonnes; y++) {
			if(document.getElementById("case"+x+"-"+y).style.backgroundColor== PlayerColor[player])
			{
				tableauCase[x][y]++;//Chaque case durera un déplacement de plus
			}
		}
	}
}

function AddPoint(player)
{
	Point[player]++;
	document.getElementById("Score"+player).innerHTML=Point[player];
}

function UpdateRealTime() //Time Mechanic
{
	var Zero="";
	if(Seconds<10)
	{
		Zero=0
	}
	
	document.getElementById("Time0").innerHTML=""+Minutes+":"+Zero+Seconds;
	Seconds++;
	
	if(Seconds==60)
	{
		Seconds=0;
		Minutes++;
	}
	
}

function UpdateIGTime()
{
	IGTime++;
}

function ShowIGTime()
{
	document.getElementById("Time1").innerHTML=IGTime;
}
function HideIGTime()
{
	document.getElementById("Time1").innerHTML="";
}
// Variants
function Activate (variante)
{
	if(document.getElementById(variante).style.backgroundColor=="lime")
	{
		document.getElementById(variante).style.backgroundColor="gray";
		document.getElementById(variante+"Atributes").style.display="none";
	}
	else
	{
		document.getElementById(variante).style.backgroundColor="lime";
		document.getElementById(variante+"Atributes").style.display="block";
	}
}

function CheckVariants ()
{
	if(document.getElementById("EatToWin").style.backgroundColor=="lime")
	{
		EatToWin=true;
		var RespawnSeconds = parseInt(document.getElementById("RespawnSeconds").value); // EatToWin
		RespawnTime = 60*RespawnSeconds;
		PointsToWin = parseInt(document.getElementById("PointsToWin").value);
		FastDespawn = parseInt(document.getElementById("InstantDespawn").value);
	}
	else
		EatToWin=false;
	
	if(document.getElementById("WallEmergence").style.backgroundColor=="lime")
		WallEmergence=true;
	else
		WallEmergence=false;
	
}

function CloseAtributes(atribute)
{
	document.getElementById(atribute).style.display="none";
}


function CheckRespawn(player) // EatToWin
{
	PlayerRespawn[player]++;
	if(PlayerRespawn[player]>RespawnTime)
	{
		Respawn(player);
	}
}

function Respawn(player)
{
	ChooseLocation(player);
	IsRunning[player]=true;
	IsRespawning[player]=false;
	PlayerRespawn[player]=0;
	
}

function ChooseLocation(player)
{
	var rand= random(RespawnDirection.length);
	if(tableauCase[Respawnx[rand]][Respawny[rand]]==nothing && rand!=PreviousSpawnLocation)
	{
		xHead[player]=Respawnx[rand];
		yHead[player]=Respawny[rand];
		direction[player]=RespawnDirection[rand];
		PreviousSpawnLocation=rand;
	}
	else
	{
		ChooseLocation(player);
	}
}

function InstantDespawn(player)
{
	for (x=0; x<NbLignes; x++) { 
		for (y=0; y<NbColonnes; y++) {
			if(document.getElementById("case"+x+"-"+y).style.backgroundColor==PlayerColor[player])
			{
				tableauCase[x][y]=nothing;
			}
		}
	}
}

function WinCheck()// Win mechanic (In progress)
{
	for(i=0;i<NbJoueurs;i++)
	{
		if(Point[i]==PointsToWin)
		{
			Win(i);
		}
	}
}

function Win(player)
{
	IsGameRunning=false;
	player++;
	Started=false;
	alert("Player "+player+" , WIN !");
	ShowIGTime();
	
}

function GameOver()
{
	Started=false
	ShowIGTime();
	
}