//Tableau
var NbLignes=6;
var NbColonnes=7;



var tableauCase = new Array(NbLignes);
	for (x=0;x<NbLignes;x++)
	{
		tableauCase[x]= new Array(NbColonnes);
	} 
	
var joueur=1;
var gameRunning=true;

var PreviousX=-1;
var PreviousY=-1;

var Priority=new Array(NbColonnes);
	for(i=0;i<NbColonnes;i++)
	{
		Priority[i]=0;
		
	}

//Preview
var preview=true;
var PreviewX=-1;
var PreviewY=-1;

//IA
var AIenabled=false;
var description=false;
var AILevel=-1;
var maxLevel=5;
var AccuracyAI=100;
var checkAlignsAbove=false;
var AIPreference=0;
var descriptionText=[
						"- L'IA place ses pions aléatoirement<br>Peut on réellement parler d'intelligence ?",
						"- L'IA complète ses alignements de 2 pions ou plus",
						"- L'IA bloque les alignements de 4 pions<br><br>- Ses chances de voir un alignement diminuent de 4% par tour",
						"- L'IA bloque les alignements de 3 pions ou plus<br><br>- Ses chances de voir un alignement diminuent de 2% par tour",
						"- L'IA évite de placer un pion qui permettrait à l'adversaire de gagner<br><br>- Ses chances de voir un alignement diminuent de 1% par tour",
						"- Quand elle a le choix, l'IA préfère bloquer les alignements adverses plutôt que de créer ses alignements"]

function Initialisation()
{
	AccuracyAI=100;
	AIPriority=0;
	PreviousX=-1;
	PreviousY=-1;
	SetupTable();
	gameRunning=true;
	joueur=1;
	JoueurSuivant()
	ReverseOldPreview();
}


function SetupTable()
{
	document.getElementById("grille").innerHTML="";
	for (x=0;x<NbLignes;x++) // boucle qui crée le tableau en HTML à partir des variables NbLignes et NbColonnes
	{
		
		document.getElementById("grille").innerHTML += "<tr id='ligne" + x + "'>";
		for(y=0;y<NbColonnes;y++)
		{
			document.getElementById("ligne" + x).innerHTML += "<td class='case' id='case"+x+"-"+y+"' onclick='PlacerPionColonne("+y+")' onmouseover='PreviewColonne("+y+")'></td>";
			
		}
		document.getElementById("grille").innerHTML += "</tr>";
		
	}
	
	for (x=0;x<NbLignes;x++)
	{
		for (y=0;y<NbColonnes;y++)
		{
			tableauCase[x][y]=0
		}
	} 
}

function PremierJoueur()
{
	if(AIenabled)
		joueur=Random(2)+1;
	else
		joueur=2;
	JoueurSuivant();
}

function Random(Max)
{
	var rand = Math.floor(Math.random()*(Max));
	return rand;
}
function PlacerPionColonne(y)
{
	var x = BasColonne(y)
	if(InTheTable(x,y))
	{
		PlacerPion(x,y)
	}
	else if(AIenabled && joueur==2)
	{
		PlayAI()
	}
	
	
}

function BasColonne(y)
{
	isPlaced=false;
	for (x=NbLignes-1;x>-1;x--)
	{
		if(CaseVide(x,y) && !isPlaced && gameRunning)
		{
			
			isPlaced=true;
			return x;
		}
	}
	if(!isPlaced)
	{
		invalid=-2
		return -2
	}
}

function CaseVide(x,y)
{
	if(tableauCase[x][y]==0)
		return true;
	else
		return false;
}

function PlacerPion(x,y)
{
	tableauCase[x][y]=joueur
	document.getElementById("case"+x+"-"+y).className="case joueur"+joueur;
	
	if(AIenabled)
	{
		MarkPion(x,y);
	}
	
	CheckWin(x,y);
	if(gameRunning)
	{
		JoueurSuivant();
		PreviewColonne(y);
	}
	
}

function MarkPion(x,y)
{
	if(InTheTable(x,y))
	{
		document.getElementById("case"+x+"-"+y).innerHTML="X"
	}
	if(InTheTable(PreviousX,PreviousY))
	{
		document.getElementById("case"+PreviousX+"-"+PreviousY).innerHTML=""
	}
	PreviousX=x;
	PreviousY=y;
}

function JoueurSuivant()
{
	if(joueur==1)
	{
		joueur=2
		if(AIenabled)
		{
			PlayAI()
		}
		else
			document.getElementById("tourJoueur").innerHTML="Tour Joueur : Jaune"
	}
	else
	{
		joueur=1;
		document.getElementById("tourJoueur").innerHTML="Tour Joueur : Rouge"
	}
		
}

function PreviewColonne(y)
{
	var x = BasColonne(y);
	
		Preview(x,y)
	if(!InTheTable(x,y))
	{
		DisableClickColonne(y);
		
	}
}



function Preview(x,y)
{
	if(PreviewX!=-1)
	{
		ReverseOldPreview();
	}
	if(InTheTable(x,y))
	{
		PreviewX=x;
		PreviewY=y;
		document.getElementById("case"+x+"-"+y).className="case preview joueur"+joueur;
	}
	
}

function DisableClickColonne(y)
{
	for (x=0;x<NbLignes;x++)
	{
		document.getElementById("case"+x+"-"+y).style.cursor="default"
		document.getElementById("case"+x+"-"+y).onmouseover=""
		document.getElementById("case"+x+"-"+y).onclick=""
		
	}
}
function ReverseOldPreview()
{
	if(InTheTable(PreviewX,PreviewY))
	{
		if(CaseVide(PreviewX,PreviewY) && preview)
		{
		document.getElementById("case"+PreviewX+"-"+PreviewY).className="case";
		}
		PreviewX=-1;
		PreviewY=-1;
	}
}

function CheckWin(x,y)
{
	var HAlign= HorizontalAlign(x,y,joueur);
	var VAlign= VerticalAlign(x,y,joueur);
	var DAlign= DiagonalAlign(x,y,joueur);
	
	if(HAlign>=4 || VAlign>=4 || DAlign>=4)
	{
		Win();
	}
}

function CheckAligns(x,y,player)
{
	var HAlign=0;
	var VAlign=0;
	var DAlign=0;
	
	if(Random(100)+1<=AccuracyAI)
		HAlign= HorizontalAlign(x,y,player);
	if(Random(100)+1<=AccuracyAI)
		VAlign= VerticalAlign(x,y,player);
	if(Random(100)+1<=AccuracyAI)
		DAlign= DiagonalAlign(x,y,player);
	
	var Max=BiggestNumber([HAlign,VAlign,DAlign])
	
	
	return Max;
}

function BiggestNumber(list)
{
	MaxID=0
	for(i=1;i<list.length;i++)
	{
		if(list[i]>list[MaxID])
		{
			MaxID=i;
		}
	}
	return list[MaxID]
}

function HorizontalAlign(x,y,player)
{
	var HAlign=1;
	
	for (direction=-1;direction<2;direction=direction+2)
	{
		var stop=false;
		for(j=1;j<4;j++)
		{
			if(InTheTable(x,y+j*direction) && !stop)
			{
				if(tableauCase[x][y+j*direction]==player)
				{
					HAlign++
				}
				else
					stop=true
			}
			else
				stop=true;
		}
	}
	
	return HAlign
}

function VerticalAlign(x,y,player)
{
	var VAlign=1;
	
	var stop=false;
	for(j=1;j<4;j++)
	{
		if(InTheTable(x+j,y) && !stop)
		{
			if(tableauCase[x+j][y]==player)
			{
				VAlign++
			}
			else
				stop=true
		}
		else
			stop=true;
	}
	return VAlign;
		
	
}

function DiagonalAlign(x,y,player)
{
	var DAlign=[1,0,1];
	
	for(i=0;i<3;i=i+2)
	{
		for (direction=-1;direction<2;direction=direction+2)
		{
			var stop=false;
			for(j=1;j<4;j++)
			{
				if(InTheTable(x+j*direction*(i-1),y+j*direction) && !stop)
				{
					if(tableauCase[x+j*direction*(i-1)][y+j*direction]==player)
					{
						DAlign[i]++
					}
					else
						stop=true
				}
				else
					stop=true;
			}
		}
	}
	
	
	if(DAlign[0]>DAlign[2])
		return DAlign[0]
	else
		return DAlign[2]
}
function Win()
{
	alert("Player "+joueur+" wins !");
	gameRunning=false;
}

function Draw()
{
	alert("Game finished ! Nobody won !")
	gameRunning=false;
}

function InTheTable(x,y)
{
	if(x>-1 && x<NbLignes && y>-1 && y<NbColonnes)
		return true;
	else
		return false;
}

function ChangeOpponent()
{
	if(!AIenabled)
	{
		AIenabled=true;
		ChangeAILevel(1);
		document.getElementById("Opponent").innerHTML="IA"
		document.getElementById("IADescription").style.display="block";
		document.getElementById("IADescription").style.cursor="auto";
		
		if(joueur==2)
		{
			PlayAI();
			ReverseOldPreview();
		}
	}
	else
	{
		AIenabled=false;
		AILevel=-1;
		document.getElementById("Opponent").innerHTML="Joueur";
		document.getElementById("IADescription").style.display="none"
		document.getElementById("IADescription").style.cursor="default";
		MarkPion(-1,-1)
	}
}

function ChangeAILevel(direction)
{
	AILevel=AILevel+direction
	if(AILevel<0)
		AILevel=maxLevel;
	if(AILevel>maxLevel)
		AILevel=0;
	
	document.getElementById("AILevel").innerHTML=AILevel;
	ChangeAIDescription();
}

function ShowDescription()
{
	if(!description)
	{
		document.getElementById("description").style.display="block"
		description=true;
		document.getElementById("DescriptionButton").innerHTML="Cacher"
	}
	else
	{
		document.getElementById("description").style.display="none"
		description=false;
		document.getElementById("DescriptionButton").innerHTML="Montrer"
	}
}

function ChangeAIDescription()
{
	document.getElementById("description").innerHTML=descriptionText[AILevel]
}


function PlayAI()
{
	for(i=0;i<NbColonnes;i++)
	{
		Priority[i]=0;
		
	}
	if(AILevel<4)
	{
		checkAlignsAbove=false;
	}
	if(AILevel==5)
	{
		AIPreference=1;//AI prefer blocking over making aligns
	}
	else
	{
		AIPreference=0;
	}
	
	if(AILevel==0)
	{
		//Random
	}
	if(AILevel>=1)
	{
		AlignPriority(3,2);//Priority for creating aligns of 3 or more
	}
	if(AILevel==2)
	{
		AccuracyAI=AccuracyAI-4;
		AlignPriority(4,1) //Priority for blocking Opponent 4 aligns
	}
	if(AILevel==3)
	{
		AccuracyAI=AccuracyAI-2;
	}
	if(AILevel>=3)
	{
		AlignPriority(3,1) //Priority for blocking Opponent 3 or more aligns
	}
	if(AILevel>=4)
	{
		AccuracyAI--;
		checkAlignsAbove=true;
	}
	
	
	y=HighestPriority();
	if(y==-1)
	{
		Draw();
	}
	else
	{
		PlacerPionColonne(y);
	}
}

function AlignPriority(Max,player)
{
	var x=0;
	var y=0;
	for(k=0;k<NbColonnes;k++)
	{
		y=k
		x=BasColonne(y)
		if(InTheTable(x,y))
		{
			PossibleAligns= CheckAligns(x,y,player)
			if(PossibleAligns>=Max)
			{
				if(PossibleAligns>=4)
				{
					Priority[y]+=20;
				}
				else
				{
					Priority[y]+=PossibleAligns;
					if(player==AIPreference)
					{
						Priority[y]++;
					}
				}
			}
			
			if(InTheTable(x-1,y) && checkAlignsAbove && PossibleAligns<4)
			{
				
				var PossibleAlignsAboveOpponent=CheckAligns(x-1,y,1)
				if(PossibleAlignsAboveOpponent>=4)
				{
					Priority[y]=-1
				}
				
				var PossibleAlignsAbove=CheckAligns(x-1,y,2)
				if(PossibleAlignsAbove>=4)
				{
					Priority[y]--
				}
			}
		}
	}
}


function HighestPriority()
{
	var MaxPriority=BiggestNumber(Priority)
	
	var PriorityColonne= CheckBestPossiblePlays(MaxPriority)
	if(PriorityColonne.length==0)
	{
		PriorityColonne=CheckBestPossiblePlays(-1)
	}
	
	if(PriorityColonne.length==0)
	{
		return -1;
	}
	else
	{
		var PlayColonne= PriorityColonne[Random(PriorityColonne.length)];
		return PlayColonne;
	}
	
}

function CheckBestPossiblePlays(MaxPriority)
{
	var PriorityColonne= new Array(0)
	for(i=0;i<NbColonnes;i++)
	{
		if(Priority[i]==MaxPriority && tableauCase[0][i]==0)
		{
			PriorityColonne.push(i)
		}
	}
	return PriorityColonne
}
