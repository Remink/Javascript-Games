var NbLignes = 16;
var NbColonnes = 16;
var NbMines=40;
var MinesRestantes=40;
var poserMine=false;
var gameOver=false;
var tableauCase = new Array(100); 
	for (i=0;i<100;i++) //crée une liste de liste, utilisable comme un tableau en deux dimensions
	{
		tableauCase[i]= new Array(100);
		
	} 

function initialisation()
{
	MinesRestantes=NbMines;
	poserMine=false;
	gameOver=false;
	document.getElementById("grille").innerHTML="";
	for (x=0;x<NbLignes;x++) // boucle qui crée le tableau en HTML à partir des variables NbLignes et NbColonnes
	{
		
		document.getElementById("grille").innerHTML += "<tr id='ligne" + x + "'>";
		for(y=0;y<NbColonnes;y++)
		{
			document.getElementById("ligne" + x).innerHTML += "<td class='case' id='case"+x+"-"+y+"' onclick='Afficher("+x+","+y+",true)'></td>";
			tableauCase[x][y]=0;
		}
		document.getElementById("grille").innerHTML += "</tr>";
		
	}
	
	document.getElementById("mine").innerHTML=NbMines;
	mines();
}

function mines()
{
	var NbMinesPose =0;
	var x=0;
	var y=0;
	while (NbMinesPose<NbMines)//tant que le nombre de mine posé est inférieur au nombre de mine demandé
	{
		x=random(NbLignes);
		y=random(NbColonnes);
		if(tableauCase[x][y]!=10)//si il n'y a pas de mine au coordonées (x;y)
		{
			tableauCase[x][y]=10;// ajoute une mine
			NbMinesPose++
		}
	}
	
	TrouverMines();
	
}
function random(Max)// renvoie un nombre entier aléatoire entre 0 et Max : intervalle [0;Max[
{
	var rand = Math.floor(Math.random()*Max);
	return rand;
}

function TrouverMines()
{
	for (x=0;x<NbLignes;x++)
	{
		for (y=0; y<NbColonnes;y++)
		{
			if (tableauCase[x][y]>9) // Si il y a une mine
			{
				Proximity(x,y);
				
			}
		}
	}
	
}

function Proximity(x,y) // Ajoute 1 a toutes les cases autour d'une mine
{
	if(x!=0)
	{
		if(y!=NbColonnes-1)
		{
			tableauCase[x-1][y+1]++;
		}
		if(y!=0)
		{
			tableauCase[x-1][y-1]++;
		}
		tableauCase[x-1][y]++;
		
	}
	
	if(x!=NbLignes-1)
	{
		if(y!=NbColonnes-1)
		{
			tableauCase[x+1][y+1]++;
		}
		if(y!=0)
		{
			tableauCase[x+1][y-1]++;
		}
		tableauCase[x+1][y]++;
	}
	
	if(y!=0)
	{
		tableauCase[x][y-1]++;
	}
	
	if(y!=NbColonnes-1)
	{
		tableauCase[x][y+1]++;
	}
	/*tableauCase[x+1][y]++;
	tableauCase[x-1][y]++;
	tableauCase[x][y+1]++;
	tableauCase[x][y-1]++;
	tableauCase[x+1][y+1]++;
	tableauCase[x-1][y-1]++;
	tableauCase[x+1][y-1]++;
	tableauCase[x-1][y+1]++;*/
}

function TestAffichage()
{
	for (x=0;x<NbLignes;x++)
	{
		for (y=0; y<NbColonnes;y++)
		{
			if (tableauCase[x][y]<9)
			{
				document.getElementById("case"+x+"-"+y).innerHTML=tableauCase[x][y];
				
			}
		}
	}
}

function Afficher(x,y,zero)
{
	if(document.getElementById("case"+x+"-"+y).className=="caseMarquee")
	{
		MinesRestantes++;
		document.getElementById("mine").innerHTML=MinesRestantes;
		
	}
	if(!poserMine && !gameOver)
		{
		if(tableauCase[x][y]!=0 && tableauCase[x][y]<9) // montre le nombre de mines à proximité
		{
			document.getElementById("case"+x+"-"+y).innerHTML=tableauCase[x][y];
			document.getElementById("case"+x+"-"+y).style.background="white";

			
		}
		
		else if(tableauCase[x][y]>9) // Dévoile les mines
		{
			AfficherMines();
			gameOver=true;
		}
		
		else if (zero==true) // Montre un 0 et ses 8 cases autour
		{
			
			setTimeout(AfficherZeros, 50,x,y);
		}
		else{ 
			
			Zeros(x,y);
		}
	}
	else if (!gameOver)// Marque une mine
	{
		document.getElementById("case"+x+"-"+y).className="caseMarquee"
		MinesRestantes--;
		document.getElementById("mine").innerHTML=MinesRestantes;
		poserMine=false;
	}
}

function AfficherMines()
{
	for (x=0;x<NbLignes;x++)
	{
		for (y=0; y<NbColonnes;y++)
		{
			if (tableauCase[x][y]>9)
			{
				document.getElementById("case"+x+"-"+y).style.background="red";
				
			}
		}
	}
}

function AfficherZeros(x,y)
{
	if (!gameOver)
	{
	document.getElementById("case"+x+"-"+y).style.background="white";
	
	/*if(x!=0)
	{
		//if (tableauCase[x-1][y]==0)
		Afficher(x-1,y, false);
	}
	
	if(x!=NbLignes-1)
	{
		//if (tableauCase[x+1][y]==0)
		Afficher(x+1,y, false);
	}
	
	if(y!=0)
	{
		//if (tableauCase[x][y-1]==0)
		Afficher(x,y-1, false);
	}
	
	if(y!=NbColonnes-1)
	{
		//if (tableauCase[x][y+1]==0)
		Afficher(x,y-1, false);
	}*/
	
			if(x!=0)
		{
			if(y!=NbColonnes-1)
			{
				Afficher(x-1,y+1);
			}
			if(y!=0)
			{
				Afficher(x-1,y-1);
			}
			Afficher(x-1,y);
			
		}
		
		if(x!=NbLignes-1)
		{
			if(y!=NbColonnes-1)
			{
				Afficher(x+1,y+1);
			}
			if(y!=0)
			{
				Afficher(x+1,y-1);
			}
			Afficher(x+1,y);
		}
		
		if(y!=0)
		{
			Afficher(x,y-1);
		}
		
		if(y!=NbColonnes-1)
		{
			Afficher(x,y+1);
		}
	}
}

function Zeros(x,y)
{
	document.getElementById("case"+x+"-"+y).style.background="white";
}

function PlacerMine()
{
	poserMine=true
}



function Restart(longueur,largeur,mines)
{
	NbLignes=longueur;
	NbColonnes=largeur;
	NbMines=mines;
	
	
	initialisation();
}


	
