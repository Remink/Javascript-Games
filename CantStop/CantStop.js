
var Plateau = new Array(11); 
	for (i=0;i<11;i++) //crée une liste de liste, utilisable comme un tableau en deux dimensions
	{
		Plateau[i]= [0,0,0,0,0];
	} 
	
var Maximum = [3,5,7,9,11,13,11,9,7,5,3];
var Remplie=[0,0,0,0,0,0,0,0,0,0,0,]
var couleurJoueur = ["black","red","cyan","lime","yellow"];
var NbJoueurs=0;
var joueur = ["","","","",""];
var tourJoueur=0;
var des= [0,0,0,0];
var indiceDe1=[0,2,3,1];
var indiceDe2=[0,3,1,2];
var pions=[0,0,0,0];
var pionsRestants=3;
var Impossible=[0,0,0,0];
var points=[0,0,0,0,0];
var Nbtours=0;
var pointsGagnant=1;
var Auto=false;
var Vitesse=100;

function initialisation() // crée le plateau de jeu
{

	for (y=13;y>-1;y--) // boucle qui crée le tableau en HTML 10 sur 14
	{
		
		document.getElementById("plateau").innerHTML += "<tr id='ligne" + y + "'>";
		for(x=0;x<11;x++)
		{
			document.getElementById("ligne" + y).innerHTML += "<td class='case' id='case"+x+"-"+y+"'></td>";
			//Plateau[x][y]=0;
			if(y>Maximum[x])
			{
				document.getElementById("case"+x+"-"+y).className="caseInvisible";
			}
		}
		document.getElementById("plateau").innerHTML += "</tr>";
		
	}
	
	for (x=0;x<11;x++)
	{
		document.getElementById("case"+x+"-0").innerHTML=x+2;
		document.getElementById("case"+x+"-"+Maximum[x]).innerHTML=x+2;
		document.getElementById("case"+x+"-"+Maximum[x]).style.backgroundColor="grey";
		document.getElementById("case"+x+"-0").className="caseInvisible";
	}
	

	
}

function Joueurs() // Enregistre le nombre et les nom des joueurs
{
	
	for (i=1;i<5;i++)
	{
		joueur[i]=document.getElementById("nomjoueur"+i).value;
	}
	for(i=0;i<4;i++)
	{
		if(joueur[1]=="") 
		{
			joueur[1]=joueur[2];
			joueur[2]=joueur[3];
			joueur[3]=joueur[4];
			joueur[4]="";
		}
		
		if(joueur[2]=="")
		{
			joueur[2]=joueur[3];
			joueur[3]=joueur[4];
			joueur[4]="";
		}
		
		if(joueur[3]=="")
		{
			joueur[3]=joueur[4];
			joueur[4]="";
		}
	}
	
	if(joueur[1]!="")
	{
		
		if(joueur[4]!="")
		{
			NbJoueurs=4;
		}
		else 
		{
			NbJoueurs=3;
			for (j=3;j>1;j--)
			{
				if(joueur[j]=="")
				{
					NbJoueurs=j-1;
				}
			}
		}
	}
	if(document.getElementById("pointsGagnants").value>0 && document.getElementById("pointsGagnants").value<12 && document.getElementById("pointsGagnants").value<11/NbJoueurs)
	{
		pointsGagnant= parseInt(document.getElementById("pointsGagnants").value); //Convertit une chaine de caractère en nombre
	}
	else
	{
		pointsGagnant=3;
	}
	
	tourJoueur=NbJoueurs;
	if(joueur[1]!="" || joueur[2]!="" || joueur[3]!="" || joueur[4]!="")
		MiseEnForme(); //Démarre le jeu si au moins l'un des joueur est définis
	else
		alert("Veuillez entrer le noms des joueurs avant de démarrer")
	

}
function MiseEnForme() // Transforme le formulaire en zone de lancer de dés
{
	document.getElementById("espaceDe").innerHTML="";
	document.getElementById("espaceDe").innerHTML+="<h2 id='victoire'>Joueur</h2><h2 id='player'></h2>";
	document.getElementById("espaceDe").innerHTML+="<div id='zoneLancerDes'><button id='lancerDe' onclick='lancerDes()'>Lancer</button></div>";
	document.getElementById("espaceDe").innerHTML+="<div id='premierLancer'></div>";
	for(i=1;i<4;i++)
	{
		document.getElementById("espaceDe").innerHTML+="<div id='choix"+i+"'></div>";
		document.getElementById("espaceDe").innerHTML+="<div id='bouton"+i+"'></div>";
	}
	document.getElementById("espaceDe").innerHTML+="<div id='boutonsRelancer'></div>";
	TourSuivant();
}
function TourSuivant() //Change le joueur actif
{
	if(points[tourJoueur]==pointsGagnant)
	{
		document.getElementById("victoire").innerHTML="Victoire de"
	}
	else
	{
		if(tourJoueur==NbJoueurs)
		{
			tourJoueur=1;
		}
		else
		{
			tourJoueur++;
		}
		
		document.getElementById("player").innerHTML=joueur[tourJoueur];
		document.getElementById("player").style.backgroundColor=couleurJoueur[tourJoueur];
		if(Auto==false)
		{
			document.getElementById("zoneLancerDes").innerHTML="<button id='lancerDe' onclick='lancerDes()'>Lancer</button>";
		}
		Nbtours++
		Clear();
		AfficherCouleurs();
		pionsRestants=3;
		if(Auto==true)
		{
			lancerDes();
		}
	}
	
	
	
}

function random() //donne un nombre aléatoire entre 1 et 6
{
	var rand = Math.floor(Math.random()*6+1);
	return rand;
}

function lancerDes() //Lance les 4 dés
{
	Clear();
	AfficherCouleurs();
	AfficherPionsRestants();
	Impossible=[0,0,0,0];
	for (i=0;i<4;i++)
	{
		des[i]=random();
	}
	if(Auto==false)
	{
		for(i=0;i<4;i++)
		{
			setTimeout(AfficherDes, i*100,i);
		}
		
		setTimeout(AfficherChoix, 500);
	}
	else
	{
		setTimeout(ChoixAuto, Vitesse);
	}
}

function AfficherDes(n)// Affiche les 4 dés
{
	document.getElementById("premierLancer").innerHTML+="<img src='dice"+des[n]+".png' id='dice"+n+"' class='de'>";
}

function AfficherChoix()// Affiche les 3 choix de combinaisons
{
	for(i=1;i<4;i++)
	{
		document.getElementById("choix"+i).innerHTML+="<img src='dice"+des[0]+".png'>"+"<img src='dice"+des[i]+".png'>";
		document.getElementById("choix"+i).innerHTML+="<img src='plus.png' id='plus'>";
		document.getElementById("choix"+i).innerHTML+="<img src='dice"+des[indiceDe1[i]]+".png'>"+"<img src='dice"+des[indiceDe2[i]]+".png'>";
		
		var colonne1=des[0]+des[i];
		var colonne2=des[indiceDe1[i]]+des[indiceDe2[i]];
		document.getElementById("bouton"+i).innerHTML+="<button onclick='AvancerPions("+colonne1+","+colonne2+")'>Avancer "+colonne1+" + "+colonne2+"</button>";
		Verification(colonne1,colonne2, i);
	}
}



function AvancerPions(pion1, pion2)// Avance les pions sur le plateau
{
	if(pion1!=-1)// Si on peut avancer le pion
	{
		pion1=pion1-2;
		
		if(Plateau[pion1][0]!=Maximum[pion1])// Si le pion n'est pas déjà sur la case la plus haute
		{
			if(Plateau[pion1][0]==0)// Si le pion n'a pas été avancé ce tour
			{
				Plateau[pion1][0]=Plateau[pion1][tourJoueur];// Le pion commence à la position du pion du joueur
				pionsRestants--;// Le nombre de pions que le joueur peut avancer diminue de 1
			}
			Plateau[pion1][0]++;//le pion avance
		}
	}
	if(pion2!=-1)//même chose que pour le pion 1
	{
		pion2=pion2-2;
		if(Plateau[pion2][0]!=Maximum[pion2])
		{
			if(Plateau[pion2][0]==0)
			{
				Plateau[pion2][0]=Plateau[pion2][tourJoueur];
				pionsRestants--;
			}
			Plateau[pion2][0]++;
		}
	}
	AfficherPionsRestants(); // Actualise la section "pion restant"
	AfficherCouleurs();// Actualise la position des joueurs
	Relancer();// Propose de relancer
	
}

function AfficherCouleurs() //Affiche les pions colorés sur le plateau
{
	
	for (j=0;j<11;j++)//Remplace tout par des cases blanches
	{
		for(h=0;h<14;h++)
		{
			document.getElementById("case"+j+"-"+h).style.backgroundColor="white";
		}
	}
	for (i=0;i<11;i++)//Met les cases correspondant au positions des pions en couleur
	{
		document.getElementById("case"+i+"-"+Maximum[i]).style.backgroundColor="grey";
		for(player=0;player<5;player++)
		{
			if(Plateau[i][player]!=0)
			{
				document.getElementById("case"+i+"-"+Plateau[i][player]).style.backgroundColor=couleurJoueur[player];
			}
			
		}
	}
	for (i=0;i<11;i++)//Met les couleurs du joueur actif et des pions en cours en avant
	{
		//document.getElementById("case"+i+"-"+Maximum[i]).style.backgroundColor="grey";
			if(Plateau[i][tourJoueur]!=0)
			{
				document.getElementById("case"+i+"-"+Plateau[i][tourJoueur]).style.backgroundColor=couleurJoueur[tourJoueur];
			}
			if(Plateau[i][0]!=0)
			{
				document.getElementById("case"+i+"-"+Plateau[i][0]).style.backgroundColor=couleurJoueur[0];
			}
			
	}
	
	for(i=0;i<11;i++)
	{
		for(player=1;player<5;player++)
		{
			if(Remplie[i]!=0)// Si la colonne est remplie
			{
				for(j=1;j<Maximum[i]+1;j++)//Mettre de la couleur du joueur toute les cases de la colonne
				{
					document.getElementById("case"+i+"-"+j).style.backgroundColor=couleurJoueur[Remplie[i]];
				}
			}
		}
	}
}

function Relancer()// Affiche le choix entre relancer ou s'arreter
{
	Clear();
	
	document.getElementById("choix1").innerHTML="<h2>Souhaitez vous continuer, au risque de tout perdre ?</h2>"
	document.getElementById("boutonsRelancer").innerHTML="<button class='relancer' onclick='lancerDes()'>Relancer les dés</button>"
	document.getElementById("boutonsRelancer").innerHTML+="<button class='relancer' onclick='Sauvegarder()'>Sauvegarder les pions</button>"
}

function Clear()// enlève tous les dés de la zone de lancé
{
	for(i=1;i<4;i++)
	{
		document.getElementById("choix"+i).innerHTML="";
		document.getElementById("bouton"+i).innerHTML="";
	}
	document.getElementById("boutonsRelancer").innerHTML="";
	document.getElementById("premierLancer").innerHTML="";
}

function Sauvegarder()// Sauvegarde la position du joueur qui a choisis de s'arrêter
{
	for (i=0;i<11;i++)
	{
		if(Plateau[i][0]!=0)
		{
			Plateau[i][tourJoueur]=Plateau[i][0];
			Plateau[i][0]=0;
		}
	}
	ColonneRemplie();
	AfficherCouleurs();
	TourSuivant();
	Clear();
	
}

function AfficherPionsRestants()
{
	document.getElementById("zoneLancerDes").innerHTML="<div><p>Pions Restants :</p><p>"+pionsRestants+"</p></div>";
	//if(NbJoueurs==1)
	//{
		document.getElementById("zoneLancerDes").innerHTML+="<div><p>Nombres de tours :</p><p>"+Nbtours+"</p></div>";
	//}
}

function Verification(colonne1,colonne2, i)// Vérifie si il est possible d'avancer sur les deux colonnes, et remplace les boutons
{
	var indicecolonne1=colonne1-2;
	var indicecolonne2=colonne2-2;
	if(pionsRestants==0)//Si il reste 0 pions à placer
	{
		if(Plateau[indicecolonne1][0]==0)//Si il n'y a pas de pion sur la colonne1
		{
			document.getElementById("bouton"+i).innerHTML="<button onclick='AvancerPions(-1,"+colonne2+")'>Avancer "+colonne2+"</button>";
		}
		if(Plateau[indicecolonne2][0]==0)//Si il n'y a pas de pion sur la colonne 2
		{
			document.getElementById("bouton"+i).innerHTML="<button onclick='AvancerPions("+colonne1+",-1)'>Avancer "+colonne1+"</button>";
		}
		if(Plateau[indicecolonne1][0]==0 && Plateau[indicecolonne2][0]==0)//Si il n'y a pas de pion sur les deux colonnes
		{
			document.getElementById("bouton"+i).innerHTML="<p>"+colonne1+"+"+colonne2+": Impossible</p>";
			Impossible[i]=1;
		}
		
	}
	
	if(pionsRestants==1 && Plateau[indicecolonne1][0]==0 && Plateau[indicecolonne2][0]==0)//Si il reste 1 pion à placer et que les deux emplacement sont libres
	{
	
		document.getElementById("bouton"+i).innerHTML="<button onclick='AvancerPions("+colonne1+",-1)'>Avancer "+colonne1+"</button>";
		document.getElementById("bouton"+i).innerHTML+="<button onclick='AvancerPions(-1,"+colonne2+")'>Avancer "+colonne2+"</button>";
	}
	
	if(pionsRestants>0)
	{
		if(Remplie[indicecolonne1]!=0)
		{
			document.getElementById("bouton"+i).innerHTML="<button onclick='AvancerPions(-1,"+colonne2+")'>Avancer "+colonne2+"</button>";
		}
		
		if(Remplie[indicecolonne2]!=0)
		{
			document.getElementById("bouton"+i).innerHTML="<button onclick='AvancerPions("+colonne1+",-1)'>Avancer "+colonne1+"</button>";
		}
		
		if(Remplie[indicecolonne1]!=0 && Remplie[indicecolonne2]!=0)
		{
			document.getElementById("bouton"+i).innerHTML="<p>"+colonne1+"+"+colonne2+": Impossible</p>";
			Impossible[i]=1;
		}
		
	}
	
	
	if(Impossible[1]==1 && Impossible[2]==1 && Impossible[3]==1)
	{
		document.getElementById("zoneLancerDes").innerHTML="<Button onclick='FinDeTour()'>Fin de tour</button>"
	}
	
}

function FinDeTour()// Efface les nouvelles positions du joueur ayant perdu
{
	for(i=0;i<11;i++)
	{
		Plateau[i][0]=0;
	}
	TourSuivant();
}

function ColonneRemplie()
{
	for (i=0;i<11;i++)
	{
		for(player=0;player<5;player++)
		{
			if (Plateau[i][player]==Maximum[i] && Remplie[i]==0)//Si un pion d'un joueur est en haut d'une colonne
			{
				Remplie[i]=player;
				points[player]++;
				
			}
		}
	}
	
}

function AutoPlay()
{
	Auto=true;
	Joueurs();
}

function ChoixAuto()
{
	var colonne1=des[0]+des[1];
	var colonne2=des[2]+des[3];
	var indicecolonne1=colonne1-2;
	var indicecolonne2=colonne2-2;
	
	if(Remplie[indicecolonne1]==0)
	{
		Plateau[indicecolonne1][tourJoueur]++
	}
	ColonneRemplie();
	if(Remplie[indicecolonne2]==0)
	{
		Plateau[indicecolonne2][tourJoueur]++
	}
	
	Sauvegarder();
	
}