var wall=-1;
var nothing=0;
var chien=1;
var lapin=2;
var iconeChien="<img src=\"Images/Chien.png\" class=\"chien\">";
var iconeLapin="<img src=\"Images/Lapin.png\" class=\"lapin\">";
var tour = lapin;

var xDepart=-1;
var yDepart=-1;
var selected=false;

var NbColonnes=5;
var NbLignes=3;
var PosDepartChiens=[[1,0],[0,1],[2,1]];
var PosDepartLapin=[1,4];
var board=new Array(NbLignes)
for(i=0;i<NbLignes;i++)
{
	board[i]=new Array(NbColonnes);
	for(j=0;j<NbColonnes;j++)
	{
		board[i][j]=nothing;
	}
}
function initialisation() {
	SetupBoard();
	PlaceAnimals();
	NextTurn();
	AfficherPions();
}


function SetupBoard()
{
	document.getElementById("grille").innerHTML="";
	for (x=0;x<NbLignes;x++) // boucle qui crée le tableau en HTML à partir des variables NbLignes et NbColonnes
	{
		
		document.getElementById("grille").innerHTML += "<tr id='ligne" + x + "'>";
		for(y=0;y<NbColonnes;y++)
		{
			document.getElementById("ligne" + x).innerHTML += "<td class='case' id='case"+x+"-"+y+"' onclick='Test("+x+","+y+")'></td>";
			
			if(x%2==0 && y%2!=0 || x%2!=0 && y%2==0)
			{
				document.getElementById("case"+x+"-"+y).className+=" diagonale"
			}
		}
		document.getElementById("grille").innerHTML += "</tr>";
		
	}
	document.getElementById("case0-0").onclick="none";
	board[0][0]=wall;
	document.getElementById("case0-4").onclick="none";
	board[0][4]=wall;
	document.getElementById("case2-0").onclick="none";
	board[2][0]=wall;
	document.getElementById("case2-4").onclick="none";
	board[2][4]=wall;
	
}
function Test(x,y)
{
	if(board[x][y]==tour)// Si la case cliquée correspond à un pion du joueur qui doit jouer
	{
		if(x==xDepart&&y==yDepart)// Si la case était déjà selectionnée
		{
			selected=false;// La case se déselectionne
			xDepart=-1;
			yDepart=-1;
			AfficherPions();
		}
		else
		{
			selected=true;
			xDepart=x;
			yDepart=y;
		}
		
		if(selected)
		{
			//alert(""+xDepart+","+yDepart);
			AfficherPions();
			AfficherFleches();
		}
		
	}
	else if (document.getElementById("case"+x+"-"+y).innerHTML!="" 
			&& document.getElementById("case"+x+"-"+y).innerHTML!=iconeLapin 
			&& document.getElementById("case"+x+"-"+y).innerHTML!=iconeChien)
	{
		Deplacer(x,y);
	}
}

function PlaceAnimals()
{
	for(x=0;x<3;x++)
	{
		var xChien = PosDepartChiens[x][0];
		var yChien = PosDepartChiens[x][1];
		board[xChien][yChien]=chien;
		//document.getElementById("case"+xChien+"-"+yChien).innerHTML=iconeChien;
	}
	
	var xLapin = PosDepartLapin[0]
	var yLapin = PosDepartLapin[1]
	board[xLapin][yLapin]=lapin;
	//document.getElementById("case"+xLapin+"-"+yLapin).innerHTML=iconeLapin;
}

function NextTurn()
{
	if(tour==chien)
	{
		tour = lapin;
		document.getElementById("tour").innerHTML="Tour du Lièvre";
	}
	else{
		tour = chien;
		document.getElementById("tour").innerHTML="Tour des Chiens";
	}
}

function AfficherPions()
{
	for(x=0;x<NbLignes;x++)
	{
		for(y=0;y<NbColonnes;y++)
		{
			if(board[x][y]==lapin)
			{
				document.getElementById("case"+x+"-"+y).innerHTML=iconeLapin;
			}
			else if(board[x][y]==chien)
			{
				document.getElementById("case"+x+"-"+y).innerHTML=iconeChien;
			}
			else
			{
				document.getElementById("case"+x+"-"+y).innerHTML="";
			}
		}
	}
}

function AfficherFleches()
{
	var x=xDepart;
	var y=yDepart;
	var diagonale=false;
	if(document.getElementById("case"+xDepart+"-"+yDepart).classList[1]=="diagonale")
	{
		diagonale=true;
	}
	
	for(v=-1;v<2;v++)// v = Déplacement vertical; -1=Haut, 0=Rien, 1=Bas
	{
		for(h=-1;h<2;h++)// Déplacement horizontal; -1=Gauche, 0=Rien, 1=Droite
		{
			var xArrivee=x+v;
			var yArrivee=y+h;
			var DeplacementPossible=true;
			if(xArrivee>-1 && xArrivee<3 && yArrivee>-1 && yArrivee<5)//Si la case d'arrivee fait partie du plateau
			{
				if(h==-1 && tour==chien)// Le chien ne peux pas se déplacer vers la gauche
				{
					DeplacementPossible=false;
				}
				if(v==0 && h==0)// Si on ne bouge pas, pas de déplacement
				{
					DeplacementPossible=false;
				}
				if(board[xArrivee][yArrivee]!=0)// Si la case d'arrivée n'est pas vide
				{
					DeplacementPossible=false;
				}
				if(!diagonale && v!=0 && h!=0)// Si on se déplace horizontalement et verticalement, mais que la case ne nous le permet pas
				{
					DeplacementPossible=false;
				}
				if(DeplacementPossible)
				{
					//alert(xArrivee+";"+yArrivee);
					document.getElementById("case"+xArrivee+"-"+yArrivee).innerHTML="<img src='Images/Fleche "+v+" "+h+".png' class='lapin'>"
				}
			}
		}
	}
}

function Deplacer(x,y)
{
	board[x][y]=tour;
	board[xDepart][yDepart]=nothing;
	xDepart=-1;
	yDepart=-1;
	AfficherPions();
	NextTurn();
}

function Restart()
{
	for(i=0;i<NbLignes;i++)
	{
		for(j=0;j<NbColonnes;j++)
		{
			board[i][j]=nothing;
		}
	}
	board[0][0]=wall;
	board[0][4]=wall;
	board[2][0]=wall;
	board[0][4]=wall;
	PlaceAnimals();
	AfficherPions();
	tour=lapin;
	NextTurn();
}