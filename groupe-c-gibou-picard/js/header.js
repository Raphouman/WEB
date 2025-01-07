// Charger le contenu du header
fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-container').innerHTML = data;

        // Ajoutez un événement de clic à tous les liens d'ancre
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                // Obtenez la position de l'élément cible
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Calculez la position de défilement
                    const headerOffset = document.querySelector('.top-page').offsetHeight; // Hauteur du header
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset;

                    // Défilez vers l'élément
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth" // Ajoute un défilement fluide
                    });
                }
            });
        });
    })
    .catch(error => console.error('Erreur lors du chargement du header:', error));