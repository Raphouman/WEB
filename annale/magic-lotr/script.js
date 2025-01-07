function parseMana(manaCost) {  // Fonction pour parser les symboles de mana et les séparer en liste
    return manaCost.split(/\s*({\w*})\s*/g).filter(Boolean);
}


// function ecrireCartes(){
//     fetch("https://api.scryfall.com/cards/search?q=e:ltr%20lang:fr&format=json&order=set&unique=prints")
//     .then(response => response.json())
//     .then(donnees => {
//             for (cartes of donnees.data)  {    //*for cartes OF parce que ce sont des éléments d'un tableau et pas les indices (for in)//
//                let myP = document.createElement('p')
//                myP.innerText = cartes.printed_name
//                document.body.appendChild(myP)

//             }         
        
//     })

// }

// async function ecrireCartesV2(){
//     let reponse= await fetch("https://api.scryfall.com/cards/search?q=e:ltr%20lang:fr&format=json&order=set&unique=prints")
//     let donnees = await reponse.json()
//     for (let cartes of donnees.data)  {    //*for cartes OF parce que ce sont des éléments d'un tableau et pas les indices (for in)//
//                let myP = document.createElement('p')
//                myP.innerText = cartes.printed_name
//                document.body.appendChild(myP)

                 
        
//     }

// }


async function afficherCartes() {
    let url = "https://api.scryfall.com/cards/search?q=e:ltr%20lang:fr&format=json&order=set&unique=prints";    //%20 pour espace
    let cardTemplate = document.querySelector('#card-template');   // Template HTML
    let cartes = [];    // Liste des cartes
    let symbolList = await getSymbols();    // Liste des symboles de mana, await car il va continuer la boucle après avoir récupéré les symboles

    let hasMore = true;
    while (hasMore) {
        let response = await fetch(url);
        let donnees = await response.json();

        for (let card of donnees.data) {    //data car c'est le tableau ou sont les données dans l'api
            // Clone le contenu du template
            let cardClone = cardTemplate.content.cloneNode(true); //true pour copier tout le contenu
            let NewContent = cardClone.firstElementChild.innerHTML  // Récupère le contenu du template
            .replace(/{{texte}}/g, card.printed_name)   // Remplace le texte du html par le nom de la carte


            cardClone.firstElementChild.innerHTML = NewContent; // Remplace le contenu du template par le nouveau

            mana = parseMana(card.mana_cost);   // mana devient le dico renv par la fonction parsemana avec les symboles de mana

            for (symb of mana) {    // Pour chaque symbole de mana qui est une liste

                let img = document.createElement('img');    // Crée un élément img en html, let important ici
                img.classList.add("mana")  // Ajoute la classe mana à l'élément img d'au dessus
                img.src = symbolList[symb]; // Remplace l'image par le symbole de mana
                cardClone.querySelector('.mana-img').appendChild(img); // Ajoute l'image à la carte, query selector  ca selectionne l'élément html dont la classe est mana-img qu'on a rjoutré pour les images de mana

                }



            cardClone.querySelector('.card-img').src = card.image_uris.normal ;  // Remplace l'image du template par l'image de la carte
            document.querySelector('#grid-container').appendChild(cardClone); // Ajoute le template modifié à la page, attention c'est important de mettre l'etape query selkector après la boucle for car dedans on y fait des modif c'est donc après qu'on doit le rajouter dans le html

            cartes.push(card.printed_name) // Ajoute la carte à la liste des cartes


        }

        hasMore = donnees.has_more; // Vérifie s'il y a une autre page, attention c'est données et pas data car hasmore et next_page sont des éléments de données
        url = donnees.next_page;    // Passe à la page suivante
    }

    // Affiche la taille totale des cartes récupérées
    console.log(`Nombre total de cartes récupérées: ${cartes.length}`);
}



async function getSymbols() {
    let reponse = await fetch("https://api.scryfall.com/symbology");
    let donnees = await reponse.json();

    let dico_symbols = {};
    for (let symbole of donnees.data) {
        dico_symbols[symbole.symbol] = symbole.svg_uri;   // Crée un dictionnaire avec les symboles de mana et leur image, le .symbol est le nom du symbole et le .svg_uri est l'url de l'image
    }

    return dico_symbols;
}
