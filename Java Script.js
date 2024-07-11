// Prosty obiekt symulujący bazę danych PIN-ów
const pinDatabase = {
    "impreza1": "1234",
    "impreza2": "5678",
    // Dodaj więcej PIN-ów dla innych imprez tutaj
};

// Funkcja do zapisywania danych w plikach cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Funkcja do odczytywania danych z plików cookie
function getCookie(name) {
    const cookieName = name + "=";
    const cookies = document.cookie.split(';');
    for(let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return "";
}

// Funkcja do sprawdzania, czy PIN jest poprawny
function checkPIN(eventName, inputPIN) {
    return pinDatabase[eventName] && inputPIN === pinDatabase[eventName];
}

document.addEventListener('DOMContentLoaded', function() {
    const pinForm = document.querySelector('.pin-form');
    const photosContainer = document.querySelector('.photos');
    const downloadAllButton = document.querySelector('.download-all');
    const eventName = "impreza1"; // Tutaj można ustawić nazwę imprezy dynamicznie

    // Sprawdzenie, czy użytkownik ma już zapisany identyfikator urządzenia
    let deviceId = getCookie('deviceId');
    if (!deviceId) {
        // Generowanie nowego identyfikatora urządzenia
        deviceId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        // Zapisanie identyfikatora urządzenia w pliku cookie na 30 dni
        setCookie('deviceId', deviceId, 30);
    }

    // Sprawdzenie, czy użytkownik już wprowadził PIN
    const storedPIN = getCookie(eventName + '_' + deviceId);
    if (storedPIN && checkPIN(eventName, storedPIN)) {
        // PIN został już wprowadzony wcześniej i jest poprawny - pokaż galerię zdjęć
        photosContainer.style.display = 'grid';
        downloadAllButton.style.display = 'block';
    }

    // Obsługa formularza PIN
    pinForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const inputPIN = pinForm.querySelector('input[type="password"]').value;

        if (checkPIN(eventName, inputPIN)) {
            // PIN poprawny - zapamiętaj w pliku cookie dla danego urządzenia
            setCookie(eventName + '_' + deviceId, inputPIN, 30);
            // Pokaż galerię zdjęć i przycisk "Pobierz Wszystko"
            photosContainer.style.display = 'grid';
            downloadAllButton.style.display = 'block';
        } else {
            // PIN niepoprawny - możesz dodać obsługę błędu
            alert('Nieprawidłowy PIN. Spróbuj ponownie.');
        }
    });

    // Obsługa pobierania wszystkich zdjęć
    downloadAllButton.addEventListener('click', function() {
        const links = document.querySelectorAll('.download');
        links.forEach(link => {
            link.click();
        });
    });

    // Pokaż opcje pobierania po kliknięciu na trzy kropki
    document.querySelectorAll('.dots').forEach(dots => {
        dots.addEventListener('click', function() {
            const downloadOptions = this.nextElementSibling;
            if (downloadOptions.style.display === 'block') {
                downloadOptions.style.display = 'none';
            } else {
                downloadOptions.style.display = 'block';
            }
        });
    });
});
