const departureDate = document.getElementById('departure-date');
const returnDate = document.getElementById('return-date');
const adultsInput = document.getElementById('adults');
const childrenInput = document.getElementById('children');
const breakfastInput = document.getElementById('breakfast');
const priceDisplay = document.getElementById('price-display');
const descriptionElement = document.getElementById('description');
const sliderImage = document.getElementById('slider-image'); // Image actuelle du slider
const prevButton = document.querySelector('.prev'); // Bouton précédent
const nextButton = document.querySelector('.next'); // Bouton suivant

let destinations = {}; // Déclaration d'un objet pour stocker les destinations et leurs informations


// Définir la date actuelle (aujourd'hui)
const today = new Date();
today.setHours(0, 0, 0, 0);

// Calculer la date de départ (lendemain)
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

// Formater les dates au format YYYY-MM-DD
const yyyyToday = today.getFullYear();
const mmToday = String(today.getMonth() + 1).padStart(2, '0');
const ddToday = String(today.getDate()).padStart(2, '0');
const todayString = `${yyyyToday}-${mmToday}-${ddToday}`;

const yyyyTomorrow = tomorrow.getFullYear();
const mmTomorrow = String(tomorrow.getMonth() + 1).padStart(2, '0');
const ddTomorrow = String(tomorrow.getDate()).padStart(2, '0');
const tomorrowString = `${yyyyTomorrow}-${mmTomorrow}-${ddTomorrow}`;

// Charger le fichier JSON
fetch('/json/data.json')
    .then(response => response.json())
    .then(data => {
        destinations = data.destinations; // Remplir l'objet destinations

        // Mise à jour de la description et de l'image au chargement de la page
        updatePageContent();
    })
    .catch(error => {
        console.error('Erreur lors du chargement du fichier JSON :', error);
    });

// Initialiser le formulaire avec des valeurs par défaut
window.addEventListener('DOMContentLoaded', () => {
    departureDate.value = todayString;
    departureDate.setAttribute('min', todayString);
    returnDate.value = tomorrowString; // Date de retour par défaut : lendemain
    returnDate.setAttribute('min', tomorrowString);
    adultsInput.value = "1";
    childrenInput.value = "0";
    calculatePrice(); // Calcul initial du prix
});

// Fonction pour calculer la durée du séjour
function calculateDays() {
    const startDate = new Date(departureDate.value);
    const endDate = new Date(returnDate.value);
    const diffTime = endDate - startDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
}

// Fonction pour calculer le prix total
function calculatePrice() {
    const days = calculateDays();
    const adults = parseInt(adultsInput.value, 10) || 0;
    const children = parseInt(childrenInput.value, 10) || 0;

    // Validation : Les enfants ne peuvent voyager seuls
    if (adults < 1 && children > 0) {
        priceDisplay.textContent = "Les enfants ne peuvent voyager sans adultes.";
        return;
    }

    // Validation : Dates incorrectes
    if (days === 0 && returnDate.value <= departureDate.value) {
        priceDisplay.textContent = "La date de retour doit être postérieure à la date de départ.";
        return;
    }

    let pricePerAdult = 100; // Prix de base par adulte par jour
    let pricePerChild = pricePerAdult * 0.4; // 40% du prix adulte pour un enfant
    let totalPrice = (adults * pricePerAdult + children * pricePerChild) * days;

    if (breakfastInput.checked) {
        totalPrice += (adults + children) * 15 * days; // 15€ par personne et par jour pour le petit-déjeuner
    }

    priceDisplay.textContent = `Prix total : ${totalPrice.toFixed(2)} €`;
}


// Ajouter des écouteurs pour recalculer le prix
departureDate.addEventListener('change', () => {
    returnDate.setAttribute('min', departureDate.value);
    calculatePrice();
});
returnDate.addEventListener('change', calculatePrice);
adultsInput.addEventListener('input', calculatePrice);
childrenInput.addEventListener('input', calculatePrice);
breakfastInput.addEventListener('change', calculatePrice);

// Fonction pour mettre à jour la description et l'image du voyage
function updatePageContent() {
    const params = new URLSearchParams(window.location.search);
    const destinationId = params.get('id');

    // Mise à jour de la description
    if (descriptionElement && destinations[destinationId]) {
        descriptionElement.textContent = destinations[destinationId].description;
    } else {
        descriptionElement.textContent = "Description non disponible pour cette destination.";
    }

    // Mise à jour de la première image
    if (sliderImage && destinations[destinationId]) {
        const images = destinations[destinationId].images;
        sliderImage.src = images[0]; // Affiche la première image par défaut
        currentIndex = 0; // Réinitialiser l'index à zéro
    }
}

// Fonction pour changer d'image
let currentIndex = 0;

function changeImage(direction) {
    const destinationId = new URLSearchParams(window.location.search).get('id');
    const images = destinations[destinationId].images;

    currentIndex = (currentIndex + direction + images.length) % images.length; // Logique pour passer d'une image à l'autre
    sliderImage.src = images[currentIndex]; // Changer l'image affichée
}

// Gestion du bouton précédent
prevButton.addEventListener('click', () => {
    changeImage(-1); // Changer d'image vers la gauche
});

// Gestion du bouton suivant
nextButton.addEventListener('click', () => {
    changeImage(1); // Changer d'image vers la droite
});

// Sélection du bouton de remise à zéro
const resetButton = document.getElementById('reset-button');

// Gestion de l'événement de clic sur le bouton de remise à zéro
resetButton.addEventListener('click', () => {
    // Réinitialiser les valeurs par défaut des dates
    departureDate.value = todayString; // Aujourd'hui
    returnDate.value = tomorrowString; // Demain

    // Réinitialiser le nombre d'adultes et d'enfants à 0
    adultsInput.value = "1";
    childrenInput.value = "0";

    // Décocher l'option petit-déjeuner
    breakfastInput.checked = false;

    // Recalculer le prix avec les valeurs par défaut
    calculatePrice();
});