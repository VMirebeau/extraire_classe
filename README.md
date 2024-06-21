Mise en place : 

Pour utiliser le programme, il faut d’abord créer le favori (« bookmark »). Pour ce faire, ouvrir le gestionnaire des favoris (Ctrl+Maj+O) ; à droite, il y a trois points verticaux. Cliquer dessus pour ouvrir le menu, et sélectionner « Ajouter un favori » 

 

Voici les paramètres à rentrer : 

 

 

Nom : Synthèse classe 

URL : javascript:(function(){fetch('https://raw.githubusercontent.com/VMirebeau/extraireclasse/main/exporterdocuments.js').then(response => response.text()).then(scriptContent => { const script = document.createElement('script'); script.textContent = scriptContent; document.head.appendChild(script); console.log('Le script a été chargé et exécuté avec succès.'); }).catch(error => console.error('Erreur de chargement du script', error));})(); 

 

Utilisation du programme :  

Ouvrir la page pour la circulation de documents, et cliquer sur « Prêts » 

Cliquer sur le favori « Synthèse classe » (si les favoris ne sont pas visibles, faire Ctrl+Maj+B) 

Coller la liste des élèves (voir plus bas « Copier la liste des élèves ») 

Cliquer sur « OK » 

Le programme se lance. En cas de problème, un message s’affiche en rouge : c’est le cas quand plusieurs noms ont été trouvés. Dans ce cas, il faut reformuler le nom ; le programme repart quand un seul nom correspond à la recherche. 

Une fois que tous les noms ont été traités, un message s’affiche. Pour copier le tableau de synthèse, il faut cliquer sur « Tout sélectionner », et copier (Ctrl+C). On peut ensuite coller ce tableau dans un mail (Ctrl+V) 

 

Copier la liste des élèves : 

Dans Pronote, aller dans Ressources -> Classes (et cliquer sur le bouton « Liste » s’il n’est pas sélectionné par défaut) 

Sélectionner la classe dans la liste de gauche 

Sur le bord droit de l’écran, il y a une petite icône avec deux feuilles de papier l’une sur l’autre : cliquez pour copier la liste des élèves 
