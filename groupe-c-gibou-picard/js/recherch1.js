const apiKey = ''; //  clé API OpenWeatherMap remplacez par votre propre clé pour éviter des vols de données

// Exemple de données de voyages , attention les noms des destinations doivent etre les memes que sur l'api météo
const voyages = [
    {
        destination: "Nairobi",
        type: "aventure",
        budget: "low",
        pets: true,
        description: "Explorez la savane africaine à travers des safaris inoubliables."
        
    },
    {
        destination: "New York",
        type: "romantique",
        budget: "high",
        pets: true,
        description: "Vivez la magie de New York, la ville qui ne dort jamais."
      
    },
    {
        destination: "Paris",
        type: "romantique",
        budget: "mid",
        pets: false,
        description: "Profitez d'un week-end romantique à Paris, ville de l'amour."
    },
    {
        destination: "Sydney",
        type: "famille",
        budget: "mid",
        pets: false,
        description: "Découvrez Sydney, un paradis pour les familles avec ses plages et attractions."
    },
    {
        destination: "Tokyo",
        type: "aventure",
        budget: "low",
        pets: true,
        description: "Plongez dans la culture et l'aventure à Tokyo."
    },
    {
        destination: "Rio",
        type: "aventure",
        budget: "mid", 
        pets: true,
        description: "Découvrez la vibrante ville de Rio avec ses plages célèbres et son carnaval."
    }
];

// Fonction pour générer dynamiquement les éléments HTML pour les voyages
function generateVoyages() {
    const voyagesContainer = document.querySelector('.voyage-items'); // Sélectionner la classe voyage-items
    voyagesContainer.innerHTML = ''; // Réinitialiser les éléments précédents

    voyages.forEach(voyage => {
        console.log(`Chargement de l'image pour: ${voyage.destination}`);
        const voyageElement = document.createElement('div');
        voyageElement.classList.add('voyage-item', 'destination-card'); //en css, une classe voyage item (sans s) sera utilisé
        voyageElement.setAttribute('data-destination', voyage.destination);
        voyageElement.setAttribute('data-type', voyage.type);   
        voyageElement.setAttribute('data-budget', voyage.budget);
        voyageElement.setAttribute('data-pets', voyage.pets);
        if (voyage.destination.toLowerCase() === 'new york') {
            voyageElement.innerHTML = `
            <a href="reservation.html?id=${voyage.destination}" class="zoom-container">
                <p class="temperature-overlay" id="temperature-${voyage.destination.toLowerCase()}"></p>
                <img src="../image/new-york.jpg" title="${voyage.destination}" class="zoom-image" alt="${voyage.destination}">
                <div class="destination-info">
                <p>${voyage.destination}</p>
                <p class="price">Un budget ${voyage.budget}</p>
                </div>
            </a>
            `;
        } else {
            voyageElement.innerHTML = `
            <a href="reservation.html?id=${voyage.destination}" class="zoom-container">
                <p class="temperature-overlay" id="temperature-${voyage.destination.toLowerCase()}"></p>
                <img src="../image/${voyage.destination.toLowerCase()}.jpg" title="${voyage.destination}" class="zoom-image" alt="${voyage.destination}">
                <div class="destination-info">
                <p>${voyage.destination}</p>
                <p class="price">Un budget ${voyage.budget}</p>
                </div>
            </a>
            `;
        }
        voyagesContainer.appendChild(voyageElement);



        // Ajouter l'événement mouseover pour afficher la température
        voyageElement.addEventListener('mouseover', () => {
            fetchTemperature(voyage.destination.toLowerCase());
        });

        // Ajouter l'événement mouseout pour masquer la température
        voyageElement.addEventListener('mouseout', () => {
            const temperatureElement = document.getElementById(`temperature-${voyage.destination.toLowerCase()}`);
            temperatureElement.textContent = '';
        });

    });
}


function fetchTemperature(destination) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${destination}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP ! statut : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.main && data.main.temp !== undefined) {
                const temperature = data.main.temp;
                const temperatureElement = document.getElementById(`temperature-${destination}`);
                temperatureElement.textContent = `Température actuelle : ${temperature}°C`;
            } else {
                throw new Error('Données de température non disponibles');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération de la température:', error);
            const temperatureElement = document.getElementById(`temperature-${destination}`);
            temperatureElement.textContent = 'Température non disponible';
        });
}
// Fonction pour filtrer les voyages en fonction des critères
function filterVoyages(event) {
    event.preventDefault(); // Empêcher le rechargement de la page

    const destinationInput = document.getElementById('destination').value.toLowerCase();
    const travelTypeInput = document.getElementById('travel-type').value;
    const budgetInput = document.getElementById('budget').value;
    const petsInput = document.getElementById('pets-allowed').checked;

    const voyageItems = document.querySelectorAll('.voyage-item'); // Sélectionner toutes les cartes

    voyageItems.forEach(voyageItem => {
        const destination = voyageItem.getAttribute('data-destination').toLowerCase();
        const type = voyageItem.getAttribute('data-type');
        const budget = voyageItem.getAttribute('data-budget');
        const pets = petsInput; // Utiliser directement la valeur de petsInput


        

        const matchesDestination = destination.includes(destinationInput);
        const matchesType = travelTypeInput ? type === travelTypeInput : true;
        const matchesBudget = budgetInput ? budget === budgetInput : true;
        const matchesPets = petsInput ? voyageItem.getAttribute('data-pets') === 'true' : true;

        // Afficher ou cacher le voyage en fonction des critères
        if (matchesDestination && matchesType && matchesBudget && matchesPets) {
            voyageItem.style.display = 'block'; // Afficher l'élément
        } else {
            voyageItem.style.display = 'none'; // Cacher l'élément
        }
    });
}

// Ajouter un écouteur d'événements pour déclencher la recherche lorsque l'utilisateur soumet le formulaire
document.querySelector('.search-form').addEventListener('submit', filterVoyages);

// Ajouter un écouteur d'événements pour filtrer en temps réel
document.getElementById('destination').addEventListener('input', filterVoyages);
document.getElementById('travel-type').addEventListener('change', filterVoyages);
document.getElementById('budget').addEventListener('change', filterVoyages);
document.getElementById('pets-allowed').addEventListener('change', filterVoyages);


// Générer les voyages au démarrage
generateVoyages();





// pour le message de validation de voyage
window.addEventListener("DOMContentLoaded", function () {
    const confirmationMessage = localStorage.getItem("confirmationMessage");

    if (confirmationMessage) {
        // Sélectionnez ou créez l'élément où afficher le message
        const confirmationDiv = document.createElement("div");
        confirmationDiv.className = "confirmation-message"; // Classe pour le style
        confirmationDiv.textContent = confirmationMessage;

        // Ajoute le message au début du body ou dans une section spécifique
        document.body.prepend(confirmationDiv);

        // Supprime le message du localStorage pour éviter qu'il réapparaisse
        localStorage.removeItem("confirmationMessage");

        // Supprime le message après quelques secondes
        setTimeout(() => {
            confirmationDiv.remove();
        }, 8000); // 5000 ms = 8 secondes
    }
});

