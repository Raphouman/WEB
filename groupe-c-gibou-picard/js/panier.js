

document.addEventListener('DOMContentLoaded', () => {   //recup les données du storage de réservation
    const reservationData = JSON.parse(localStorage.getItem('reservationData'));

    if (reservationData) {
        const adultsElement = document.getElementById('adults');
        const childrenElement = document.getElementById('children');
        const breakfastElement = document.getElementById('breakfast');
        const priceElement = document.getElementById('price');
        const departureDateElement = document.getElementById('departure-date');
        const returnDateElement = document.getElementById('return-date');
        const daysElement = document.getElementById('days');
        const dayText = reservationData.days > 1 ? 'jours' : 'jour';

        adultsElement.textContent = `Nombre d’adultes : ${reservationData.adults}`;
        childrenElement.textContent = `Nombre d’enfants : ${reservationData.children}`;
        breakfastElement.textContent = `Petit-déjeuner : ${reservationData.breakfast ? 'Oui' : 'Non'}`;
        priceElement.textContent = `Prix total : ${reservationData.price} `;
        departureDateElement.textContent = `Date de départ : ${reservationData.departureDate}`;
        returnDateElement.textContent = `Date de retour : ${reservationData.returnDate}`;
        daysElement.textContent = `Durée du séjour : ${reservationData.days} ${dayText}`;


    }else {
        // Afficher un message indiquant que le panier est vide
        const panierDetails = document.querySelector('.panier-details');
        panierDetails.innerHTML = '<p>Votre panier est vide.</p>';
    }
});

// Gestion de la barre de progression en fonction de la page
const currentPage = window.location.pathname;

// Réinitialiser les couleurs
const circles = document.querySelectorAll(".circle");
const lines = document.querySelectorAll(".line");

circles.forEach(circle => circle.classList.remove("red", "yellow", "green", "completed"));
lines.forEach(line => line.classList.remove("red", "yellow", "green", "completed"));

// Appliquer les couleurs dynamiquement
if (currentPage.includes("panier.html")) {
    circles[0].classList.add("completed", "red");
    lines[0].classList.add("completed", "red");
} else if (currentPage.includes("payement.html")) {
    circles[0].classList.add("completed", "red");
    lines[0].classList.add("completed", "red");
    circles[1].classList.add("completed", "yellow");
    lines[1].classList.add("yellow");
} else if (currentPage.includes("confirmation.html")) {
    circles[0].classList.add("completed", "red");
    lines[0].classList.add("completed", "red");
    circles[1].classList.add("completed", "yellow");
    lines[1].classList.add("completed", "yellow");
    circles[2].classList.add("completed", "green");
}

document.getElementById("reset-button-form").addEventListener("click", function() {
    document.getElementById("payment-form").reset();
});

document.getElementById("payment-form").addEventListener("submit", function(event) {
    // Récupération des valeurs des champs
    const today = new Date();
    const birthDateValue = new Date(document.getElementById("birth-date").value);
    const expirationDateValue = document.getElementById("expiration-date").value;
    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    // const birthDate = document.getElementById("birth-date").value;
    const creditCard = document.getElementById("credit-card").value.trim(); // On enlève les espaces et on vérifie si c'est un nombre de 16 chiffres
    // const expirationDate = document.getElementById("expiration-date").value;
    const cvv = document.getElementById("cvv").value.trim();
    const address = document.getElementById("address").value.trim();

    let errorMessage = "";

    // Vérification des champs
    if (!firstName) errorMessage += "Le prénom est obligatoire.\n";
    if (!lastName) errorMessage += "Le nom est obligatoire.\n";
    if (!birthDateValue) errorMessage += "La date de naissance est obligatoire.\n";
    // Validation de la date de naissance
    if (birthDateValue > today) {
        errorMessage += "La date de naissance ne peut pas être dans le futur.\n";
    }

    if (!creditCard.match(/^(\d{16}|(\s?\d{4}){4})$/)) {
        errorMessage += "Le numéro de carte bancaire est invalide.\n";
    }
    if (!expirationDateValue) errorMessage += "La date d'expiration est obligatoire.\n";
    if (!cvv.match(/^\d{3}$/)) errorMessage += "Le CVV doit comporter 3 chiffres.\n";
    if (!address) errorMessage += "L'adresse de facturation est obligatoire.\n";

    // Si des erreurs existent, on empêche la soumission et on les affiche
    if (errorMessage) {
        event.preventDefault(); // Empêche la soumission du formulaire
        alert(errorMessage); // Affiche les erreurs
    }
});

// Vérification de la date de naissance pour pas mettre qu'on est né après aujourd'hui
const birthDate = document.getElementById("birth-date");
birthDate.addEventListener("input", function () {
    const today = new Date();
    const selectedDate = new Date(birthDate.value);

    if (selectedDate > today) {
        birthDate.setCustomValidity("La date de naissance ne peut pas être dans le futur.");
    } else {
        birthDate.setCustomValidity(""); // Réinitialiser la validation personnalisée
    }
});

// Vérification de la date d'expiration de la carte bancaire (pas qu'on puisse mettre des lettres)
const expirationDate = document.getElementById("expiration-date");
expirationDate.addEventListener("input", function () {

    const regex = /^(0[1-9]|1[0-2])\/([0-9]{4})$/; // Format MM/AAAA
    if (!regex.test(expirationDate.value)) {
        expirationDate.setCustomValidity("Veuillez entrer une date valide au format MM/AAAA.");
    } else {
        expirationDate.setCustomValidity("");
    }
});



document.getElementById("payment-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Empêche la soumission normale du formulaire

    // Valider le formulaire (ajoutez votre propre logique ici)
    const isValid = validateForm(); // Remplacez par votre propre fonction de validation
    if (isValid) {
        // Afficher la barre de chargement
        const loadingOverlay = document.getElementById("loading-overlay");
        loadingOverlay.style.display = "flex";

        // Simulez un délai de 5 secondes
        setTimeout(function () {
            // Stocke le message de confirmation pour la page principale
            localStorage.setItem("confirmationMessage", "Votre voyage est bien enregistré. Vous recevrez un récapitulatif par e-mail.");

            // Redirige vers la page principale après 5 secondes
            window.location.href = "page_principale.html";
        }, 5000);
    } else {
        alert("Veuillez remplir tous les champs correctement.");
    }
});

// Valdation
function validateForm() {
    const form = document.getElementById("payment-form");
    return form.checkValidity(); // Vérifie si le formulaire est valide
}


//vidéo pour panier et résa

// Liste des vidéos à afficher dans le carrousel
const videos = [
    '/video/video1.mp4',
    '/video/video2.mp4',
    '/video/video3.mp4'
];

// Référence à l'élément vidéo
const videoPlayer = document.getElementById('video-carousel');

// Indice de la vidéo actuelle
let currentVideoIndex = 0;

// Fonction pour changer la vidéo
function changeVideo() {
    currentVideoIndex = (currentVideoIndex + 1) % videos.length; // Passer à la vidéo suivante, revenir à la première après la dernière
    videoPlayer.src = videos[currentVideoIndex];  // Mettre à jour la source de la vidéo
    videoPlayer.load();  // Recharger la vidéo
    videoPlayer.play();  // Rejouer la vidéo
}

// Initialiser le carrousel en changeant de vidéo toutes les 10 secondes
setInterval(changeVideo, 10000);  // 10 secondes (ajustez ce délai selon vos besoins)
