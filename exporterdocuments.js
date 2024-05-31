let names = [];
let all_docs = [];
var checkBookInterval, checkTableLoansInterval, checkListePrets;
let currentIdName = 0;
const delay = 100;
let associations_douteuses = [];

function updateProgression() {
    let textId = document.getElementById("topTextId");
    if (textId) {
        textId.innerText = currentIdName + " / " + names.length;
    }
}

function updateInfo(texte, err = false) {
    let textId = document.getElementById("bottomTextId");
    if (textId) {
        textId.innerText = texte;
        if (err) {
            textId.style.backgroundColor = "lightcoral"; // Rouge clair
        } else {
            textId.style.backgroundColor = "lightgreen"; // Vert clair
        }
    }
}


// Fonction pour créer le div et la zone grise
function createPopup() {
    // Création du div
    let popupDiv = document.createElement('div');
    popupDiv.id = 'popup';
    popupDiv.style.width = '400px';
    popupDiv.style.height = '400px';
    popupDiv.style.background = 'white';
    popupDiv.style.position = 'fixed';
    popupDiv.style.top = '50%';
    popupDiv.style.left = '50%';
    popupDiv.style.transform = 'translate(-50%, -50%)';
    popupDiv.style.border = '1px solid black';
    popupDiv.style.padding = '20px';
    popupDiv.style.zIndex = '1000';

    // Création de la textarea
    var textarea = document.createElement('textarea');
    textarea.style.width = '100%';
    textarea.style.height = '80%';
    textarea.style.resize = 'none';
    textarea.style.marginBottom = '20px';

    // Ajouter un écouteur d'événement à la textarea pour observer les modifications
    textarea.addEventListener('input', function () {
        // Récupérer le texte collé dans la textarea
        const texte = textarea.value.trim();
        // Vérifier si le texte correspond au format attendu
        if (texte.startsWith("Élève\t\"Né(e) le\"\t\"Classe de rattachement\"\tGroupes")) {
            // Si oui, normaliser le texte et mettre à jour la textarea avec la liste des prénoms normalisée
            const nomsNormalises = normaliserTexte(texte);
            textarea.value = nomsNormalises.join('\n');
        }
    });

    // Fonction pour normaliser le texte collé au bon format
    function normaliserTexte(texte) {
        const lignes = texte.split('\n').slice(1); // Supprimer la première ligne (en-têtes)
        const noms = lignes.map(ligne => ligne.split('\t')[0].trim().replace(/"/g, '')); // Extraire les noms et supprimer les guillemets doubles
        return noms;
    }

    // Création du bouton OK
    var okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.style.display = 'block';
    okButton.style.margin = '0 auto';

    // Ajout des éléments au div
    popupDiv.appendChild(textarea);
    popupDiv.appendChild(okButton);

    // Ajout du div à la page
    document.body.appendChild(popupDiv);

    // Ajout d'un événement au bouton OK
    okButton.addEventListener('click', function () {
        var texte = textarea.value;
        getTexte(texte);
        overlay.remove();
        document.getElementById("popup").remove();
        document.getElementById("popup").remove();
        //popupDiv.remove();
        //document.body.removeChild(popupDiv);

    });
}



// Fonction pour récupérer le texte de la textarea
function getTexte(texte) {
    // Séparation des lignes du texte
    const lignes = texte.split('\n');

    // Vérifier si la première ligne correspond aux en-têtes spécifiés
    /*const entetesAttendues = [
        "Élève",
        "Né(e) le",
        "Classe de rattachement",
        "Groupes"
    ];

    const premierLigne = lignes[0].trim();
    const premierLigneEntetes = premierLigne.split('\t');

    // Vérifier si les en-têtes correspondent aux en-têtes attendues
    const entetesValides = entetesAttendues.every((entete, index) => {
        return premierLigneEntetes[index].replace(/"/g, '') === entete;
    });

    if (!entetesValides) {
        updateInfo("Le texte collé ne correspond pas au format attendu.", true);
        return;
    }*/

    // Parcourir chaque ligne à partir de la deuxième ligne
    for (let i = 0; i < lignes.length; i++) {
        const ligne = lignes[i].trim();
        // Si la ligne n'est pas vide, extraire le nom de l'élève et l'ajouter à la liste des noms
        if (ligne !== '') {
            const nomEleve = ligne.split('\t')[0].trim().replace(/"/g, '');
            names.push(nomEleve);
        }
    }

    console.log("Noms extraits :", names);
    // Appeler la fonction pour traiter les prêts
    checkPretMain();
}



// Création de la zone grise
var overlay = document.createElement('div');
overlay.id = 'overlay';
overlay.style.position = 'fixed';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100%';
overlay.style.height = '100%';
overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
overlay.style.zIndex = '999';
overlay.addEventListener('click', function (event) {
    if (event.target === overlay) {
        document.body.removeChild(popup);
        overlay.remove();
    }
});


function createBox() {
    // Créer le div flottant
    var floatingDiv = document.createElement('div');
    floatingDiv.id = 'floatingDiv';

    // Créer le texte en haut
    var topText = document.createElement('div');
    topText.className = 'topText';
    topText.id = "topTextId";
    topText.textContent = '10/20';

    // Créer le texte en bas
    var bottomText = document.createElement('div');
    bottomText.className = 'bottomText';
    bottomText.id = "bottomTextId";
    bottomText.textContent = 'En attente';

    // Ajouter les éléments enfants au div flottant
    floatingDiv.appendChild(topText);
    floatingDiv.appendChild(bottomText);

    // Ajouter le div flottant au body
    document.body.appendChild(floatingDiv);

    // Ajouter les styles pour le div flottant
    var style = document.createElement('style');
    style.textContent = `
            #floatingDiv {
                position: fixed;
                top: 100px;
                right: 100px;
                width: 400px;
                height: 200px;
                background-color: white;
                border: 1px solid #000;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                padding: 20px;
            }

            .topText {
                font-size: 48px;
                font-weight: bold;
                text-align: center;
                width: 100%;
            }

            .bottomText {
                background-color: lightgreen;
                width: 100%;
                text-align: center;
                padding: 10px;
            }
        `;
    document.head.appendChild(style);
    updateProgression();
}



////////////////////

// Fonction pour cliquer sur l'élément loansTab
function clickOnLoansTab() {
    var loansTab = document.getElementById("loansTab");
    if (loansTab) {
        clearInterval(checkTableLoansInterval);
        loansTab.click();

        checkListePrets = setInterval(checkListe, delay); // Vérifier toutes les 500 millisecondes

        // Là on vérifie la présence de table-loans


    }
}

function checkListe() {
    clearInterval(checkListePrets); // Arrêter la vérification une fois que l'élément est trouvé
    processTableContent();
    //console.log(all_docs);
    currentIdName++;
    if (currentIdName < names.length) checkPretMain(); else {
        updateProgression();

        updateInfo("Termine !")
        createPopupWithTable();
    }
}

// Fonction pour remplacer l'événement lorsque le clic sur l'icône du livre a été effectué
/*
function replaceEventListener() {
    document.getElementById("loansTab").addEventListener("click", function() {
        // Vérifier si l'élément d'ID "table-loans" existe
        var tableLoans = document.getElementById("table-loans");
        if (tableLoans) {
            clearInterval(checkTableLoansInterval); // Arrêter la vérification une fois que l'élément est trouvé
            processTableContent();
            console.log(all_docs);
            currentIdName++;
            checkPretMain();
        }
    });
}*/

function processTableContent() {
    let table = document.getElementById('table-loans');
    if (table) {
        let tbody = table.querySelector('tbody');
        if (tbody) {
            let rows = tbody.querySelectorAll('tr');
            let contents = [];
            rows.forEach(row => {
                let firstCell = row.querySelector('td:first-child');
                if (firstCell && !firstCell.classList.contains('select-checkbox-stop')) {
                    let thirdCell = row.querySelector('td:nth-child(3)');
                    if (thirdCell) {
                        let text = thirdCell.innerText.trim();

                        // Trouver l'index du premier '/'
                        let firstSlashIndex = text.indexOf('/');
                        if (firstSlashIndex !== -1) {
                            // Garder uniquement la partie avant le premier '/'
                            text = text.substring(0, firstSlashIndex).trim();
                        }

                        // Supprimer tous les caractères '[' et ']'
                        text = text.replace(/\[|\]/g, '');

                        // Si le texte se termine par ':', supprimer ce caractère
                        if (text.endsWith(':')) {
                            text = text.slice(0, -1);
                        }

                        // Trim le résultat final
                        text = text.trim();

                        contents.push(text);
                    }
                }
            });

            if (contents.length > 0) {
                console.log("Utilisateur : " + names[currentIdName] + ". Documents trouvés : " + contents.join(" / "));
                all_docs.push([names[currentIdName], contents]);
                if (!resemble(names[currentIdName], document.getElementById('nameHead').innerText)) {
                    let avertissement = names[currentIdName] + " > " + document.getElementById('nameHead').innerText;
                    console.log("!!! ATTENTION, une association douteuse a été identifiée : " + avertissement + " !!!");
                    associations_douteuses.push(avertissement);
                }
            } else {
                console.log("Utilisateur : " + names[currentIdName] + ". Aucun document trouvé.");
            }
        }
    }
}



// Fonction pour cliquer sur l'élément une fois qu'il est présent sur la page
function clickOnBookIcon() {
    var bookIcon = document.querySelector('.fa.fa-book');
    if (bookIcon) {
        clearInterval(checkBookInterval); // Arrêter la vérification une fois que l'élément est trouvé
        bookIcon.click();

        checkTableLoansInterval = setInterval(clickOnLoansTab, delay); // Vérifier toutes les 500 millisecondes


        //replaceEventListener(); // Remplacer l'événement une fois que le clic sur l'icône du livre a été effectué

    }
}


// Chargement de l'utilisateur
//transaction.loadUser("0000PREN051023");


function simulateKeypress(character, element) {
    let inputEvent = new Event('input', { bubbles: true, cancelable: true });
    element.value += character;
    element.dispatchEvent(inputEvent);
}

function simulateClickOnProfileCard() {
    let checkProfileCardInterval = setInterval(() => {
        let profileCard = document.getElementsByClassName('ProfileCard u-cf');
        //console.log(profileCard)
        if (profileCard && profileCard.length == 1) {
            clearInterval(checkProfileCardInterval);
            let clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
            profileCard[0].dispatchEvent(clickEvent);

            checkBookInterval = setInterval(clickOnBookIcon, delay); // Vérifier toutes les 500 millisecondes

        } else {
            updateInfo("Tapez le nom correct (sans cliquer)", true)

        }
    }, 1000); // Vérifier toutes les 500 millisecondes
}

function checkPretMain() {
    updateProgression();
    updateInfo("Exportation en cours...")
    let input = document.getElementById('usernameInput');


    input.focus();
    input.value = '';  // Clear any existing value

    let delay = 1;  // Adjust the delay (in milliseconds) to simulate typing speed
    names[currentIdName].split('').forEach((char, index) => {
        setTimeout(() => {
            simulateKeypress(char, input);
            if (index === names[currentIdName].length - 1) {
                // Simulate click after typing the last character
                //setTimeout(() => {
                simulateClickOnProfileCard();
                //simulateClickOnPrêtsEnCours(names[currentIdName]); // Simulate click on "Prêts en cours"
                //waitForLoansTab(); // Wait for "loansTab" to appear
                // Vérifier périodiquement si l'élément .fa.fa-book est présent

                //checkTableLoansInterval = setInterval(clickOnLoansTab, 500); // Vérifier toutes les 500 millisecondes
                // Vérifier périodiquement si l'élément d'ID "table-loans" est présent


                //}, 700);
            }
        }, delay * index);
    });


    //setTimeout(processTableContent, 2000); // Adjust the delay as needed

}

function go() {
    names = [];
    all_docs = [];
    checkBookInterval, checkTableLoansInterval, checkListePrets = null;
    currentIdName = 0;
    associations_douteuses = [];

    createPopup();

}

var btn = document.getElementById("loan-btn");
if (btn.classList.contains("disabled")) {
    alert("Il faut lancer ce programme sur l'onglet \"Prêt\" !");
} else {
    document.body.appendChild(overlay);
    createBox();
    go();
}



///////////// exportation du tableau

function createTable() {
    // Créer l'élément table
    const table = document.createElement("table");
    table.border = "1";

    // Créer et ajouter l'en-tête du tableau
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const th1 = document.createElement("th");
    th1.innerText = "Élève";
    th1.style.padding = "8px"; // Add padding to cell
    headerRow.appendChild(th1);

    const th2 = document.createElement("th");
    th2.innerText = "Nombre de documents en prêt";
    th2.style.padding = "8px"; // Add padding to cell
    headerRow.appendChild(th2);

    const th3 = document.createElement("th");
    th3.innerText = "Document(s)";
    th3.style.padding = "8px"; // Add padding to cell
    headerRow.appendChild(th3);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Créer et ajouter le corps du tableau
    const tbody = document.createElement("tbody");
    let totalDocuments = 0;

    all_docs.forEach(name => {
        const row = document.createElement("tr");

        const td1 = document.createElement("td");
        td1.innerText = name[0];
        td1.style.padding = "8px"; // Add padding to cell
        row.appendChild(td1);

        const td2 = document.createElement("td");
        td2.innerText = name[1].length;
        td2.style.textAlign = "right"; // Align to right
        td2.style.padding = "8px"; // Add padding to cell
        row.appendChild(td2);

        const td3 = document.createElement("td");
        td3.innerText = name[1].join(" / ");
        td3.style.padding = "8px"; // Add padding to cell
        row.appendChild(td3);

        tbody.appendChild(row);
        totalDocuments += name[1].length;
    });

    table.appendChild(tbody);

    // Ajouter la ligne du total des documents
    const tfoot = document.createElement("tfoot");
    const footerRow = document.createElement("tr");
    const footerCell = document.createElement("td");
    footerCell.colSpan = 3;
    footerCell.innerText = "Total des documents : " + totalDocuments;
    footerCell.style.textAlign = "right"; // Align to right
    footerCell.style.padding = "8px"; // Add padding to cell
    footerRow.appendChild(footerCell);
    tfoot.appendChild(footerRow);

    table.appendChild(tfoot);

    return table; // Return the table element
}




var table = null;

function createPopupWithTable() {
    // Création du div
    let popupDiv = document.createElement('div');
    popupDiv.id = 'popup';
    popupDiv.style.width = '600px';
    popupDiv.style.height = '400px';
    popupDiv.style.background = 'white';
    popupDiv.style.position = 'fixed';
    popupDiv.style.top = '50%';
    popupDiv.style.left = '50%';
    popupDiv.style.transform = 'translate(-50%, -50%)';
    popupDiv.style.border = '1px solid black';
    popupDiv.style.padding = '20px';
    popupDiv.style.zIndex = '1000';
    popupDiv.style.display = 'flex';
    popupDiv.style.flexDirection = 'column';

    // Création du div contenant le tableau
    let tableContainer = document.createElement('div');
    tableContainer.style.overflow = 'auto'; // Ajout d'un ascenseur
    tableContainer.style.height = '350px'; // Hauteur spécifiée
    tableContainer.appendChild(createTable());

    // Ajout du div contenant le tableau au div du popup
    popupDiv.appendChild(tableContainer);

    // Création du div pour les boutons
    let buttonDiv = document.createElement('div');
    buttonDiv.style.display = 'flex';
    buttonDiv.style.justifyContent = 'center'; // Centrage horizontal
    buttonDiv.style.alignItems = 'center'; // Centrage vertical
    buttonDiv.style.height = '50px'; // Hauteur spécifiée

    // Création du bouton "Tout sélectionner"
    var selectAllButton = document.createElement('button');
    selectAllButton.textContent = 'Tout sélectionner';
    selectAllButton.style.marginRight = '20px'; // Marge entre les boutons

    selectAllButton.addEventListener('click', function () {
        selectText(tableContainer); // Sélectionne seulement le contenu du tableau
    });

    // Ajout du bouton "Tout sélectionner" au div des boutons
    buttonDiv.appendChild(selectAllButton);

    // Création du bouton OK
    var okButton = document.createElement('button');
    okButton.textContent = 'Recommencer';

    okButton.addEventListener('click', function () {
        //currentIdName = 0;
        popupDiv.remove();
        overlay.remove();
        go();
    });

    // Ajout du bouton OK au div des boutons
    buttonDiv.appendChild(okButton);

    // Ajout du div des boutons au div du popup
    popupDiv.appendChild(buttonDiv);

    // Ajout du div du popup à la page
    document.body.appendChild(popupDiv);

    if (associations_douteuses.length > 0) // si on a trouvé des associations douteuses en chemin...
    {
        if (associations_douteuses.length == 1) {
            alert("Attention, une association douteuse a été trouvée.\nMerci de bien vouloir vérifier l'association suivante :\n" + associations_douteuses[0])
        }
        else {
            alert("Attention, " + associations_douteuses.length + " associations douteuses ont été trouvées.\nMerci de bien vouloir vérifier les associations suivantes :\n" + associations_douteuses.join("\n"))
        }

    }
}



// Fonction pour sélectionner tout le texte dans un élément
function selectText(element) {
    var range, selection;
    if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}


///////////// on teste la ressemblance

function resemble(name1, name2) {
    // Fonction pour vérifier si deux mots ont plus de 50% de ressemblance
    function isSimilar(word1, word2) {
        const len1 = word1.length;
        const len2 = word2.length;
        const minLength = Math.min(len1, len2);

        if (minLength <= 3) {
            // Considérer les mots de 3 lettres ou moins comme similaires par défaut
            return true;
        }

        // Calculer la distance de Levenshtein
        const distance = levenshteinDistance(word1, word2);
        return (distance / Math.max(len1, len2)) <= 0.5;
    }

    // Fonction pour calculer la distance de Levenshtein
    function levenshteinDistance(s1, s2) {
        const matrix = Array.from({ length: s1.length + 1 }, () => Array(s2.length + 1).fill(0));
        for (let i = 0; i <= s1.length; i++) matrix[i][0] = i;
        for (let j = 0; j <= s2.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= s1.length; i++) {
            for (let j = 1; j <= s2.length; j++) {
                if (s1[i - 1] === s2[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j - 1] + 1
                    );
                }
            }
        }

        return matrix[s1.length][s2.length];
    }

    // Convertir les noms en minuscules et les séparer en mots
    const words1 = name1.toLowerCase().split(' ');
    const words2 = name2.toLowerCase().split(' ');

    // Vérifier si tous les mots sont en commun
    const allCommon = words1.every(word1 => words2.includes(word1)) &&
        words2.every(word2 => words1.includes(word2));
    if (allCommon) {
        return true;
    }

    // Vérifier la similarité de chaque mot de plus de trois lettres
    for (let word1 of words1) {
        if (word1.length > 3) {
            let similarFound = false;
            for (let word2 of words2) {
                if (word2.length > 3 && isSimilar(word1, word2)) {
                    similarFound = true;
                    break;
                }
            }
            if (!similarFound) {
                return false;
            }
        }
    }

    return true;
}
