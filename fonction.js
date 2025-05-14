'use strict';

/* global Noty */

/**
 * bibliothèque de fonctions facilitant la saisie, la conversion et la mise en forme
 *
 * @Author : Guy Verghote
 * @Version 2025.3
 * @Date : 2025-05-14
 */

// -----------------------------------------------------------
// Fonctions pour le chargement dynamique des bibliothèques
// ------------------------------------------------------------

/**
 * Charge un fichier css
 * @param {string} nom de la feuille de style sans son extension
 */
export function loadCSS(nom) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = nom;
    document.head.appendChild(link);
}

/**
 * Insère un script dans l'en-tête du document de manière asynchrone.
 *
 * @param {string} source - L'URL du script à insérer.
 * @returns {Promise<void>} Une promesse qui résout lorsque le script est chargé avec succès
 * ou est rejetée en cas d'erreur de chargement.
 */
function loadJs(source) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = source;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

/**
 * Charge la bibliothèque Noty de manière asynchrone si elle n'est pas déjà chargée.
 */
export async function loadNoty() {
    if (typeof Noty === 'undefined') {
        try {
            await loadJs('https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.js');
            await loadCSS('https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.css');
            await loadCSS('https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.1/animate.min.css');
        } catch (error) {
            console.error('Erreur lors du chargement de Noty', error);
        }
    }
}

/**
 * Charge la bibliothèque Noty de manière asynchrone si elle n'est pas déjà chargée.
 */
export async function loadDOMPurify() {
    if (typeof  DOMPurify === 'undefined') {
        try {
            await loadJs('https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.2.5/purify.min.js');
        } catch (error) {
            console.error('Erreur lors du chargement de DOMPurify', error);
        }
    }
}


// -----------------------------------------------------------
// Fonctions d'affichage
// ------------------------------------------------------------

/**
 * Affiche le contenu de la réponse dans la console en ayant retiré toutes les balises HTML
 * @param reponse
 */
export async function afficherDansConsole(reponse) {
    await loadDOMPurify();
    let config = {
        ALLOWED_TAGS: [], // Liste des balises autorisées
        KEEP_CONTENT: true // Conserver le contenu des balises non autorisées
    };
    let message = DOMPurify.sanitize(reponse, config);
    console.log(message);
}

/**
 * Génération d'un message dans une mise en forme bootstrap (class='alert-dismissible')
 * Nécessite le composant bootstrap avec la partie js !!!
 * @param {string} texte à afficher.
 * @param {string} couleur de fond : vert, rouge ou orange
 * @return {string} Chaîne au format HTML
 */

export function genererMessage(texte, couleur = 'rouge') {
    // Ne pas transformer un message x_debug
    if (texte.startsWith('<br />')) {
        return texte;
    }
    // détermination de la classe bootstrap à utiliser en fonction de la couleur choisie
    let code;
    let icone;
    if (couleur === 'vert') {
        code = '#1FA055';
        icone = 'bi-check-circle';
    } else if (couleur === 'rouge') {
        code = '#C60800';
        icone = 'bi-x-circle';
    } else if (couleur === 'orange') {
        code = '#FF7415';
        icone = 'bi-exclamation-triangle';
    }
    return `
            <div class="alert alert-dismissible fade show" 
                 style="color:white; background-color:${code}" 
                 role="alert">
                 <i class="bi ${icone}" ></i>
                 ${texte}
                 <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>
            </div>`;
}

/**
 * Affiche un message dans une fenêtre modale 'Noty'
 * Nécessite le composant noty
 * @param {object} parametre doit contenir les propriétés suivantes
 * <br> message : message à afficher
 * <br>type : [facultatif] alert, success, error (défaut), warning, info
 * <br>position : [facultatif] top, topLeft, topCenter, topRight, center (center), centerLeft, centerRight, bottom, bottomLeft, bottomCenter, bottomRight
 * <br>fermeture :[facultatif] 0 (défaut) la fenêtre disparait automatiquement, 1 il faut cliquer dans la fenêtre pour la fermer
 * <br>surFermeture : [facultatif] fonction à lancer après l'affichage
 *  <br>delai : [facultatif] délai avant la fermeture automatique de la fenêtre
 */

export async function afficherMessage(parametre) {
    const type = (parametre.type) ? parametre.type : 'error';
    const position = (parametre.position) ? parametre.position : 'center';
    const fermeture = (parametre.fermeture) ? parametre.fermeture : 0;
    const delai = (parametre.delai) ? parametre.delai : 500;
    if (fermeture === 1) {
        if (typeof Noty === 'undefined') {
            await loadNoty();
        }
        const n = new Noty({
            text: parametre.message,
            type: type,
            modal: true,
            killer: true,
            layout: position,
            theme: 'sunset',
            buttons: [
                Noty.button('Ok', 'btn btn-sm btn-secondary float-end mt-0 mb-1', function () {
                    n.close();
                    if (parametre.surFermeture) {
                        parametre.surFermeture();
                    }
                })],
            animation: {
                open: 'animated lightSpeedI',
                close: 'animated lightSpeedOut'
            },
        });
        n.show();
    } else {
        const n = new Noty({
            text: parametre.message,
            type: type,
            modal: true,
            layout: position,
            theme: 'sunset',
            animation: {
                open: 'animated lightSpeedI',
                close: 'animated lightSpeedOut'
            },
            callbacks: {
                onClose: parametre.surFermeture
            }
        });
        n.show().setTimeout(delai);
        if (parametre.surFermeture) {
            parametre.surFermeture();
        }
    }
}

/**
 * Affiche le message d'erreur dans une boîte de dialogue
 * @param {string} message message à afficher
 */

export async function afficherErreur(message) {
    // Vérifier si la fenêtre modale existe déjà
    let modal = document.getElementById('erreurModale');
    if (!modal) {
        // Créer la fenêtre modale dynamiquement
        modal = document.createElement('div');
        modal.setAttribute('id', 'erreurModale');
        modal.setAttribute('class', 'modal fade');
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'exampleModalLabel');
        modal.setAttribute('aria-hidden', 'true');
        modal.innerHTML = `
      <div class="modal-dialog" style="transform: translate(0, -50%); top: 40%;max-width: 350px;">
        <div class="modal-content" style="font-size: 0.9em;">
            <div class="modal-header" style="background-color: #f00; color: #fff;padding : 1px 15px 1px 15px">
                <div class="modal-title">Erreur</div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" style="width: auto;">
                <p id="messageErreur"></p>
            </div>
        </div>
    </div>
    `;
        // Ajouter la fenêtre modale au DOM
        document.body.appendChild(modal);
    }
    // Afficher le message dans la fenêtre modale
    document.getElementById('messageErreur').textContent = message;
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();

}

export async function afficherErreur2(message) {
    if (typeof Noty === 'undefined') {
        await loadNoty();
    }
    const n = new Noty({
        text: message,
        type: 'error',
        modal: true,
        killer: true,
        layout: 'center',
        theme: 'sunset',
        buttons: [
            Noty.button('Ok', 'btn btn-sm btn-secondary float-end mt-0 mb-1', function () {
                n.close();
            })],
        animation: {
            open: 'animated lightSpeedI',
            close: 'animated lightSpeedOut'
        },
    });
    n.show();
}

/**
 * Affiche le message de succès de l'opération dans une boîte de dialogue avec fermeture automatique
 * la boîte sera affichée dans le coin supérieur droit
 * @param {string} message message à afficher
 */
export async function afficherSucces(message) {
    if (typeof Noty === 'undefined') {
        await loadNoty();
    }
    const n = new Noty({
        text: message,
        type: 'success',
        modal: true,
        killer: true,
        layout: 'topRight',
        theme: 'sunset',
        animation: {
            open: 'animated lightSpeedI',
            close: 'animated lightSpeedOut'
        },
    });
    n.show().setTimeout(500);
}

/**
 * Affiche le message dans une boîte de dialogue avec fermeture automatique
 * le type et la position de la boîte sont personnalisables
 * @param {string} message message à afficher
 * @param {string} type
 * @param {string} position
 */
export async function prevenir(message, type = 'success', position = 'center') {
    if (typeof Noty === 'undefined') {
        await loadNoty();
    }
    const n = new Noty({
        text: message,
        type: type,
        modal: true,
        killer: true,
        layout: position,
        theme: 'sunset',
        animation: {
            open: 'animated lightSpeedI',
            close: 'animated lightSpeedOut'
        },
    });
    n.show().setTimeout(500);
}

/**
 * Affiche le message dans une boîte de dialogue avec fermeture par l'utilisateur
 * le type et la position de la boîte sont personnalisables
 * @param {string} message message à afficher
 * @param type : error, success alert, warning, info
 * @param position
 */
export async function avertir(message, type = 'success', position = 'center') {
    if (typeof Noty === 'undefined') {
        await loadNoty();
    }
    const n = new Noty({
        text: message,
        type: type,
        modal: true,
        killer: true,
        layout: position,
        theme: 'sunset',
        buttons: [
            Noty.button('Ok', 'btn btn-sm btn-secondary float-end mt-0 mb-1', function () {
                n.close();
            })],
        animation: {
            open: 'animated lightSpeedI',
            close: 'animated lightSpeedOut'
        },
    });
    n.show();
}

/**
 * Affiche le message de succès dans une boîte de dialogue
 * La fenêtre doit être fermée par l'utilisateur
 * @param {string} message message à afficher
 */
export async function confirmerSucces(message) {
    if (typeof Noty === 'undefined') {
        await loadNoty();
    }
    const n = new Noty({
        text: message,
        type: 'success',
        modal: true,
        killer: true,
        layout: 'center',
        theme: 'sunset',
        buttons: [
            Noty.button('Ok', 'btn btn-sm btn-secondary float-end mt-0 mb-1', function () {
                n.close();
            })],
        animation: {
            open: 'animated lightSpeedI',
            close: 'animated lightSpeedOut'
        },
    });
    n.show();
}

/**
 * Affiche le message dans une fenêtre modale et redirige l'utilisateur vers l'url passée en paramètre
 * La fenêtre se ferme automatiquement
 * @param {string} message
 * @param {string} url
 */
export async function retournerVers(message, url) {
    if (typeof Noty === 'undefined') {
        await loadNoty();
    }
    const n = new Noty({
        text: message,
        type: 'success',
        modal: true,
        layout: 'center',
        theme: 'sunset',

        animation: {
            open: 'animated lightSpeedI',
            close: 'animated lightSpeedOut'
        },
        callbacks: {
            onClose: () => {
                location.href = url;
            }
        }
    });
    n.show().setTimeout(500);
}

/**
 * Affiche le message dans une fenêtre modale et redirige l'utilisateur vers l'url passée en paramètre
 * La fenêtre doit être fermée par l'utilisateur
 * @param {string} message
 * @param {string} url
 */
export async function retournerVersApresConfirmation(message, url) {
    if (typeof Noty === 'undefined') {
        await loadNoty();
    }
    const n = new Noty({
        text: message,
        type: 'success',
        modal: true,
        layout: 'center',
        theme: 'sunset',
        buttons: [
            Noty.button('Ok', 'btn btn-sm btn-secondary float-end mt-0 mb-1', function () {
                n.close();
            })],
        animation: {
            open: 'animated lightSpeedI',
            close: 'animated lightSpeedOut'
        },
        callbacks: {
            onClose: () => {
                location.href = url;
            }
        }
    });
    n.show();
}

/**
 * Affiche le message d'erreur dans une boîte de dialogue puis replace dans le champ son ancienne valeur
 * S'il s'agit d'une case à cocher la propriété checked est inversée
 * Si la balise input comporte un attribut data old, sa valeur remplace la valeur actuelle sinon la valeur est effacée
 * @param {Node} input
 * @param {string} message
 * @param {?string} oldValue
 */
export async function corriger(input, message = input.validationMessage, oldValue = null) {
    if (typeof Noty === 'undefined') {
        await loadNoty();
    }
    const n = new Noty({
        text: message,
        type: 'error',
        modal: true,
        killer: true,
        layout: 'center',
        theme: 'sunset',
        buttons: [
            Noty.button('Ok', 'btn btn-sm btn-secondary float-end mt-0 mb-1', function () {
                n.close();
            })],
        animation: {
            open: 'animated lightSpeedI',
            close: 'animated lightSpeedOut'
        },
        callbacks: {
            onClose: () => {
                if (input.type === 'checkbox') {
                    input.checked = !input.checked;
                } else if (input.hasAttribute('data-old')) {
                    input.value = input.dataset.old;
                } else {
                    input.value = oldValue;
                }
            }
        }
    });
    n.show();
}

/**
 * Affiche le message d'erreur lié au champ dans une boîte de dialogue puis replace dans le champ son ancienne valeur
 * la balise input doit comporter un attribut data old
 * @param {object} input
 */
export async function corrigerInput(input) {
    if (typeof Noty === 'undefined') {
        await loadNoty();
    }
    const n = new Noty({
        text: input.validationMessage,
        type: 'error',
        modal: true,
        killer: true,
        layout: 'center',
        theme: 'sunset',
        buttons: [
            Noty.button('Ok', 'btn btn-sm btn-secondary float-end mt-0 mb-1', function () {
                n.close();
            })],
        animation: {
            open: 'animated lightSpeedI',
            close: 'animated lightSpeedOut'
        },
        callbacks: {
            onClose: () => {
                input.value = input.dataset.old;
            }
        }
    });
    n.show();
}

/**
 * Demande de confirmation avant de lancer un traitement
 * @param {function} callback pointeur sur la fonction à lancer
 * @param {string} message message à afficher
 */
export async function confirmer(callback, message = '') {
    if (typeof Noty === 'undefined') {
        await loadNoty();
    }
    const n = new Noty({
        text: message === '' ? 'Confirmer votre demande ' : message,
        layout: 'center',
        theme: 'sunset',
        modal: true,
        type: 'info',
        animation: {
            open: 'animated lightSpeedIn',
            close: 'animated lightSpeedOut'
        },
        buttons: [
            Noty.button('Oui', 'btn btn-sm btn-success marge ', function () {
                callback();
                n.close();
            }),
            Noty
                .button('Non', 'btn btn-sm btn-danger', function () {
                    n.close();
                })
        ]
    }).show();
}

// ------------------------------------------------------------
// Fonctions pour afficher et fermer une fenêtre modale de chargement
// ------------------------------------------------------------

export async function afficherVeuillezPatienter() {
    // Vérifier si la fenêtre modale existe déjà
    var modal = document.getElementById('modalVeuillezPatienter');
    if (!modal) {
        // Créer la fenêtre modale dynamiquement
        modal = document.createElement('div');
        modal.setAttribute('id', 'modalVeuillezPatienter');
        modal.setAttribute('class', 'modal fade');
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'exampleModalLabel');
        modal.setAttribute('aria-hidden', 'true');
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body text-center">
                        <p>Veuillez patienter...</p>
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Chargement en cours...</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        // Ajouter la fenêtre modale au DOM
        document.body.appendChild(modal);
    }
    // Afficher la fenêtre modale
    const modalInstance = new bootstrap.Modal(modal, {backdrop: 'static', keyboard: false});
    modalInstance.show();
    return modalInstance;
}

export async function fermerVeuillezPatienter(modalInstance) {
    // Cacher la fenêtre modale
    if (modalInstance) {
        modalInstance.hide();
        // modalInstance.dispose(); // Supprimer l'instance de la fenêtre modale
    }
}


/**
 * Affiche un compteur animé avec montée en opacité et effet de grossissement temporaire.
 *
 * @param {HTMLElement} conteneur - Élément HTML cible
 * @param {number} valeurFinale - Valeur numérique finale à atteindre
 * @param {number} [duree=1000] - Durée totale de l’animation en ms
 */
export function afficherCompteur(conteneur, valeurFinale, duree = 4000, fontSize = '30px', color='black', textAlign = 'center') {
    const debut = performance.now();
    const depart = 0;

    // Styles initiaux
    conteneur.innerText = depart;
    conteneur.style.opacity = '0';
    conteneur.style.transform = 'scale(1)';
    conteneur.style.transition = 'opacity 0.4s ease-in, transform 0.2s ease-out';
    conteneur.style.color = color;
    conteneur.style.textAlign = textAlign;
    conteneur.style.fontSize = fontSize;
    conteneur.style.fontWeight = 'bold';

    function easing(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad
    }

    function step(timestamp) {
        const tempsEcoule = timestamp - debut;
        let progression = Math.min(tempsEcoule / duree, 1);
        const facteur = easing(progression);

        const valeurCourante = Math.floor(depart + (valeurFinale - depart) * facteur);
        conteneur.innerText = valeurCourante;

        // Apparition
        if (progression >= 0.05 && conteneur.style.opacity !== '1') {
            conteneur.style.opacity = '1';
        }

        // Zoom pendant la montée (facultatif mais visuel)
        if (progression < 0.5) {
            const scale = 1 + 0.3 * (1 - Math.abs(0.5 - progression) * 2); // max scale 1.3
            conteneur.style.transform = `scale(${scale})`;
        } else {
            conteneur.style.transform = 'scale(1)';
        }

        if (progression < 1) {
            requestAnimationFrame(step);
        } else {
            conteneur.innerText = valeurFinale;
            conteneur.style.transform = 'scale(1)'; // fin propre
        }
    }

    requestAnimationFrame(step);
}



// ------------------------------------------------------------
// fonctions de contrôle sur les données saisies
// ------------------------------------------------------------

/**
 * Création d'un style 'messageErreur' et Ajout après chaque balise input d'une balise div utilisant ce style
 * Cette balise div sera utilisée pour afficher le message d'erreur
 * @param {boolean} onInput false par défaut, si true le message d'erreur est affiché après chaque caractère saisi
 */
export function configurerFormulaire(onInput = false) {
    // ajout d'un style dans la section head du document
    const style = document.createElement('style');
    style.innerHTML = '.messageErreur { color: red; margin-bottom: 15px; font-size: 0.75rem; font-style: italic; padding: 0; margin: 0; }';
    document.head.appendChild(style);
    // ajout d'une balise div après chaque balise input ou textarea
    // remarque : les balises select sont incluses et aussi les balises textarea qui devront être contrôlés par le programmeur
    for (const input of document.querySelectorAll('input, textarea, select')) {
        const div = document.createElement('div');
        div.classList.add('messageErreur');
        input.insertAdjacentElement('afterend', div);

        // Ajout d'un écouteur d'événement sur l'événement input pour signaler l'erreur après chaque caractère saisi
        if (onInput) {
            input.addEventListener('input', () => {
                input.nextElementSibling.innerText = input.validationMessage;
            });
        }
    }
}


/**
 * @param {Node} [zone=document] - La zone dans laquelle les champs doivent être contrôlés.
 */
export function effacerDonneesSaisies(zone = document) {
    // remarque : les balises select ne sont pas incluses
    for (const input of zone.querySelectorAll('input, textarea')) {
        input.value = '';
    }
}

/**
 * Affiche un message d'erreur de saisie à côté de l'élément d'entrée spécifié.
 *
 * @param {string} idInput - L'ID de l'élément d'entrée.
 * @param {string | null} message - Le message d'erreur personnalisé (facultatif).
 */
export function afficherErreurSaisie(idInput, message = null) {
    const input = document.getElementById(idInput);
    if (input) {
        let msg = input.validationMessage;
        if (message !== null) {
            msg = message;
        }
        // Parcourir les balises suivantes pour trouver la div devant afficher le message de validation
        let nextElement = input.nextElementSibling;
        let trouve = false;

        while (nextElement && !trouve) {
            // Vérifier si l'élément a l'attribut class avec la valeur 'messageErreur'
            if (nextElement.classList.contains('messageErreur')) {
                nextElement.innerText = msg;
                trouve = true;
            }
            nextElement = nextElement.nextElementSibling;
        }
        if (!trouve) {
            // Si aucun élément avec la classe 'messageErreur' n'a été trouvé, on affiche le message dans la console
            console.error(`L'élément d'entrée ${idInput} n'est pas suivi d'une balise div de classe 'messageErreur'`);
        }
    } else {
        console.error(`L'élément d'entrée ${idInput} n'existe pas.`);
    }
}

/**
 * Filtre les caractères autorisés lors de la saisie
 * @param {string} idInput attribut id de la balise input
 * @param {RegExp} regExp expression régulière contenant les caractères autorisés
 */
export function filtrerLaSaisie(idInput, regExp) {
    const input = document.getElementById(idInput);
    if (input) {
        input.addEventListener('keydown', (e) => {
            // Autoriser le passage des touches spéciales
            if (e.key.length > 1) {
                return;
            }
            // Vérifier si la touche est un chiffre
            if (!regExp.test(e.key)) {
                e.preventDefault(); // Empêcher la saisie de caractères non contenus dans l'expression régulière
            }
        });
    } else {
        console.error(`L'élément d'entrée ${idInput} n'existe pas.`);
    }
}

/**
 * Contrôle la valeur saisie
 * En cas d'erreur un message d'erreur sous la balise input correspondante est affiché
 * La classe 'erreur' est ajouté au niveau de la balise ce qui ajoute une image à la fin du champ
 * à condition d'avoir défini le style 'input.erreur' dans la feuille de style
 * @param {string} idInput attribut id de la balise input
 * @return {boolean} true si la valeur saisie est valide
 */
export function controler(idInput) {
    const input = document.getElementById(idInput);
    if (input) {
        afficherErreurSaisie(idInput);
        if (input.checkValidity()) {
            input.classList.remove('erreur');
            return true;
        } else {
            input.classList.add('erreur');
            return false;
        }
    } else {
        console.error(`L'élément d'entrée ${idInput} n'existe pas.`);
    }
}

/**
 * Contrôle la valeur saisie
 * En cas d'erreur la couleur du texte et de la bordure change de couleur (rouge)
 * et le message d'erreur est placé dans l'attribut title
 * @param {object} input balise input
 * @returns {boolean} true si la valeur saisie est valide
 */
export function verifier(input) {
    input.title = input.validationMessage;
    if (input.checkValidity()) {
        input.style.borderColor = '';
        return true;
    } else {
        input.style.borderColor = 'red';
        return false;
    }
}

/**
 * Vérifie si l'objet file possède une extension et un type mime autorisés
 * Le message d'erreur est renvoyé dans la propriété réponse du paramètre controle
 * @param {object} file objet file à contrôler
 * @param {object} controle
 * controle peut contenir les propriétés suivantes :
 * <br> lesExtensions : [Facultatif] tableau contenant les extensions autorisées
 * <br> taille : [Facultatif] Taille maximale en octet du fichier
 * <br> reponse : message d'erreur
 * @returns {boolean} true si le fichier est valide
 */
export function fichierValide(file, controle) {
    controle.reponse = '';
    // vérification qu'un fichier est bien transmis
    if (file === undefined) {
        controle.reponse = 'Aucun fichier transmis';
        return false;
    }
    // si la taille à ne pas dépasser est précisée, on contrôle la taille du fichier
    if (controle.taille && file.size > controle.taille) {
        const size = conversionOctet(file.size, 'Ko');
        const taille = conversionOctet(controle.taille, 'Ko');
        controle.reponse = `La taille du fichier (${size}) dépasse la taille autorisée (${taille})`;
        return false;
    }
    // si les extensions sont précisées, on contrôle l'extension du fichier
    if (controle.lesExtensions) {
        // récupération de l'extension : découpons au niveau du '.' et prenons le dernier élement
        const eltFichier = file.name.split('.');
        const extension = eltFichier[eltFichier.length - 1].toLowerCase();
        if (controle.lesExtensions.indexOf(extension) === -1) {
            controle.reponse = `Extension ${extension} non acceptée`;
            return false;
        }
    }
    return true;
}

/**
 * Contrôle tous les champs input et textarea et select
 * chaque champ xxx doit être suivi d'une balise <div class='messageErreur'></div> pour afficher le message d'erreur : méthode configurerFormulaire
 * @param {Node} [zone=document] - La zone dans laquelle les champs doivent être contrôlés.
 * @returns {boolean} true si tous les champs respectent les contraintes définies dans leurs attributs pattern, minlength, maxlength, required, min, max ...
 */
export function donneesValides(zone = document) {
    let valide = true;

    // Sélectionner tous les éléments input et select qui sont required et non désactivés
    const lesInputs = zone.querySelectorAll('input[required]:not([disabled]), select[required]:not([disabled])');

    // Parcourir et traiter les éléments sélectionnés
    lesInputs.forEach(x => {
        afficherErreurSaisie(x.id);
        if (!x.checkValidity()) {
            valide = false;
        }
    });

    // Vérifier séparément les champs non-required qui ont une valeur
    const champsNonRequired = zone.querySelectorAll('input:not([required]):not([disabled]), select:not([required]):not([disabled])');
    champsNonRequired.forEach(x => {
        if (x.value !== '') {
            afficherErreurSaisie(x.id);
            if (!x.checkValidity()) {
                valide = false;
            }
        }
    });

    return valide;
}



/**
 * Contrôle qu'au moins une propriété de l'objet a été modifiée sur l'interface
 * chaque propriété de l'objet est normalement associé à un champ via l'attribut id
 * @returns {boolean} true si la valeur d'au moins un champ a été modifiée
 */
export function donneesModifiees(element) {
    // parcourir les propriétés de element : chaque propriété doit normalement correspondre à un champ sur l'interface
    for (const cle in element) {
        // Récupérer la valeur du champ correspondant au nom de la propriété
        const champ = document.getElementById(cle);
        if (!champ) {
            // Champ non trouvé, passer à la prochaine propriété
            continue;
        }
        // Si la valeur du champ ne correspond pas à la valeur de la propriété, une modification est détectée
        //  La comparaison ne doit pas tenir compte du type
        /* jshint -W116 */
        if (champ.value != element[cle]) {
            return true;
        }
        /* jshint +W116 */
    }
    // aucune modification constatée
    return false;
}


/**
 * Controle la validité de la date saisie (format jj/mm/aaaa) dans la balise input dont l'id est trasnmis en paramètre
 * @param {string} idInput attribut id de la balise input
 * @returns {boolean} true si la date est valide
 */
export function dateValide(idInput) {
    const input = document.getElementById(idInput);

    if (input) {
        // Vérifier le format jj/mm/aaaa avec une expression régulière
        const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        if (!dateRegex.test(input.value)) {
            afficherErreurSaisie(idInput, 'Cette date ne respecte pas le format attendu (jj/mm/aaaa)');
            return false; // Le format n'est pas correct
        }

        // Récupération des éléments de la date
        const [jour, mois, annee] = input.value.split('/').map(Number);

        // création d'un objet Date avec les éléments de la date
        const date = new Date(annee, mois - 1, jour);

        // La date est valide si l'année, le mois et le jour sont identiques à ceux de l'objet Date
        if (date.getFullYear() === annee && date.getMonth() === mois - 1 && date.getDate() === jour) {
            return true;
        } else {
            afficherErreurSaisie(idInput, 'Cette date n\'est pas valide');
            return false;
        }
    } else {
        console.error(`L'élément d'entrée ${idInput} n'existe pas.`);
    }
}

/**
 * Vide les champs de formulaire (input et textarea) dans une zone spécifiée.
 *
 * @param {Node} [zone=document] - La zone dans laquelle les champs doivent être vidés.
 * Par défaut, il s'agit du document entier.
 */
export function viderLesChamps(zone = document) {
    for (const input of zone.querySelectorAll('input, textarea')) {
        input.value = '';
    }
}

/**
 * Protége tous les champs de type input, textarea, select button dans une zone spécifiée.
 * @param {Node} [zone=document] - La zone dans laquelle les champs doivent être protégés.
 * Par défaut, il s'agit du document entier.
 */
export function protegerLesChamps(zone = document) {
    for (const input of zone.querySelectorAll('input, textarea, select, button')) {
        input.disabled = true;
    }
}

/**
 * Déprotége tous les champs de type input, textarea, select, button
 * @param {Node} [zone=document] - La zone dans laquelle les champs doivent être protégés.
 * Par défaut, il s'agit du document entier.
 */
export function deprotegerLesChamps(zone = document) {
    for (const input of zone.querySelectorAll('input, textarea, select, button')) {
        input.disabled = false;
    }
}

/**
 * Efface le contenu de la balise dont l'id est passé en paramètre
 * @param {string} inputId attribut id de la balise input
 */
export function effacer(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        // s'agit-il d'une balise input ?
        if (input instanceof HTMLInputElement) {
            const type = input.type.toLowerCase();
            if (type === 'checkbox') {
                input.checked = false;
            } else if (type === 'number' || type === 'text') {
                input.value = '';
            }
        } else if (input instanceof HTMLSelectElement) {
            while (input.options.length > 0) {
                input.remove(0);
            }

        } else if (input.tagName === 'IMG') {
            input.src = '';
        } else {
            input.innerHTML = '';
        }
    } else {
        console.error(`L'élément ${inputId} n'existe pas`);
    }
}

/**
 * Efface les messages d'erreur sous chaque champ de saisie et dans la zone d'affichage des messages 'msg'
 */
export function effacerLesErreurs() {
    for (const div of document.getElementsByClassName('messageErreur')) {
        div.innerText = '';
    }
    const msg = document.getElementById('msg');
    if (msg !== null) {
        effacer('msg');
    }
}

/**
 * Encadre le champ avec une bordure rouge et change la couleur du texte en rouge
 * @param {Node} input - L'élément d'entrée à signaler en erreur.
 */
export function signalerErreur(input) {
    input.style.borderColor = 'red';
    input.style.color = 'red';
    input.focus();
}

/**
 * Remet la bordure et la couleur du texte par défaut
 * @param {Node} input - L'élément d'entrée à ne plus signaler en erreur.
 */
export function effacerErreur(input) {
    input.style.borderColor = '';
    input.style.color = '';
    input.focus();
}

// ------------------------------------------------------------
// fonctions diverses de conversion et mise en forme
// ------------------------------------------------------------

/**
 *  Arrondit la valeur passée en argument avec la précision demandée
 * @param {int} valeur
 * @param {int} precision
 * @returns {number}
 */
export function arrondir(valeur, precision = 0) {
    const tmp = 10 ** precision;
    return Math.round(valeur * tmp) / tmp;
}

/**
 * Conversion d'une chaine de format jj/mm/aaaa au format aaaa-mm-jj
 * @param {string} date au format jj/mm/aaaa
 * @return {string} Chaîne au aaaa-mm-jj
 */

export function encoderDate(date) {
    // la solution ci-dessous pose un problème si le format d'entrée est j/m/aaaa
    // return date.substring(6) + '-' + date.substring(3, 6) + '-' + date.substring(0, 2);
    // il faut plutôt découper la chaine et inverser les parties 1 et 3 en ajoutant éventuellement un 0 sur j et m
    // pour éviter l'usage d'une structure conditionnelle, on ajoute toujours un 0 au début
    // et on ne conserve que les deux derniers caractères en appelant la méthode slice(-2)
    const lesElements = date.split('/');
    return lesElements[2] + '-' + '0'.concat(lesElements[1]).slice(-2) + '0'.concat(lesElements[0]).slice(-2);
}

/**
 * Conversion d'une chaine de format aaaa-mm-jj  au format jj/mm/aaaa
 * @param {string} date au format aaaa-mm-jj
 * @return {string} Chaîne au jj/mm/aaaa
 */

export function decoderDate(date) {
    // return date.substring(8) + '/' + date.substring(5, 7) + '/' + date.substring(0, 4);
    return date.split('-').reverse().join('/');
}

/**
 * Retourne l'âge en fonction de la date de naissance passée en paramètre
 * @param {string} dateNaissance au format jj/mm/aaaa
 * @returns {number}
 */
export function getAge(dateNaissance) {
    // Séparer la date en jour, mois et année
    const dateParts = dateNaissance.split('/');
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Les mois dans JavaScript commencent à 0 (janvier est 0)
    const year = parseInt(dateParts[2], 10);

    const birthDate = new Date(year, month, day);
    const currentDate = new Date();

    // Comparer les mois et jours
    const hasBirthdayOccurred = (
        currentDate.getMonth() > birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate())
    );

    // Calculer l'âge en fonction de la comparaison
    return currentDate.getFullYear() - birthDate.getFullYear() - (hasBirthdayOccurred ? 0 : 1);
}

/**
 * Supprime les espaces superflus au début, à la fin et à l'intérieur de la valeur
 * @param {string} valeur
 * @returns {string} valeur sans espace superflu au début, à la fin et à l'intérieur
 */
export function supprimerEspace(valeur) {
    return valeur.trim().replace(/ {2,}/g, ' ');
}

/**
 * Remplace 2 espaces consécutifs ou plus par un seul
 * @param {string} valeur
 * @returns {string} valeur sans espace superflu à l'intérieur de la chaine
 */
export function supprimerDoubleEspace(valeur) {
    return valeur.replace(/ {2,}/g, ' ');
}

/**
 *   Enlève les accents
 *   en normalisant la chaine dans le jeu de caractère unicode, la lettre et son accent sont décomposés en deux codes
 *   tous les accents sont codés entre 0300 et 036f, il suffit donc de les remplacer par une chaîne vide
 *   https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
 */
export const enleverAccent = (valeur) => valeur.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/**
 * Retourne la chaine passée en paramètre avec la première lettre de chaque mot en majuscule
 * @param {string} nom
 * @return {string} avec la première lettre de chaque mot en majuscule
 */
export function ucWord(nom) {
    const lesMots = nom.trim().toLowerCase().split(/[\s]+/);
    for (let i = 0; i < lesMots.length; i += 1) {
        const lesSousMots = lesMots[i].split('-');
        for (let j = 0; j < lesSousMots.length; j += 1) {
            lesSousMots[j] = lesSousMots[j].charAt(0).toUpperCase() + lesSousMots[j].slice(1);
        }
        lesMots[i] = lesSousMots.join('-');
    }
    return lesMots.join(' ');
}

/**
 * retourne le nombre de décimales composant un nombre
 * @param {number} x nombre à analyser
 * @returns {number}
 */
function nbDecimale(x) {
    // Convertir le nombre en chaîne de caractères
    const nombreEnChaine = x.toString();

    // Rechercher l'indice du séparateur décimal (virgule ou point)
    const indiceSeparateur = nombreEnChaine.indexOf('.') === -1 ? nombreEnChaine.indexOf(',') : nombreEnChaine.indexOf('.');

    if (indiceSeparateur === -1) {
        // Le nombre est un nombre entier, il n'y a pas de décimales
        return 0;
    } else {
        // Le nombre possède des décimales, il faut retourner le nombre de chiffres après le séparateur
        return nombreEnChaine.length - indiceSeparateur - 1;
    }
}

/**
 * Retourne la valeur passée en paramètre dans le format demandé
 * @param {number} valeur nombre à formater
 * @param {string} format par défaut €
 * @param {number} decimale à définir uniquement si le format est ''
 * @param {string} separateur à définir uniquement si le format est ''
 * @returns {string}
 */

export function formater(valeur, {format = '€', decimale = 2, separateur = '.'} = {}) {
    let resultat;
    if (format === '€') {
        resultat = valeur.toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'});
    } else if (format === '%') {
        // recherche du nombre de décimales pour le pourcentage en fonction de la valeur initale
        const decimal = Math.max(nbDecimale(valeur) - 2, 0);
        resultat = valeur.toLocaleString('fr-FR', {
            style: 'percent',
            minimumFractionDigits: decimal,
            maximumFractionDigits: decimal
        });
    } else if (format.toLowerCase() === '') {
        resultat = valeur.toLocaleString('fr-FR', {minimumFractionDigits: decimale, maximumFractionDigits: decimale});
    }
    // recherche du séparateur courant
    // Obtenir la langue par défaut du navigateur
    const langue = navigator.language;

    // récupérer le séparateur décimal par défaut du navigateur
    const separateurDecimal = langue.includes('fr') ? ',' : '.';

    if (separateur !== separateurDecimal) {
        // la variable resultat est de type Number si le format est différent de % ou €
        resultat = resultat.toString().replace(separateurDecimal, separateur);
    }
    return resultat;
}

/**
 * Retourne le numéro de téléphone passé en paramètre dans le format demandé
 *
 * @param {string} telephone un numéro de téléphone à mettre en forme
 * @param {string} separateur  le séparateur à utiliser entre les groupes de chiffres
 * @returns {string}
 */
export function miseEnFormeTelephone(telephone, separateur = '.') {
    // return telephone.substring(0, 2) + separateur + telephone.substring(2, 4) + separateur + telephone.substring(4, 6) + separateur + telephone.substring(6, 8) + separateur + telephone.substring(8);
    // Supprimer d'éventuels caractères non numériques du numéro
    const numero = telephone.replace(/\D/g, '');

    // Créer un tableau pour stocker les paires de chiffres
    const paires = [];

    // Diviser le numéro en paires de chiffres
    for (let i = 0; i < numero.length; i += 2) {
        paires.push(numero.slice(i, i + 2));
    }

    // Joindre les paires avec le séparateur souhaité (par exemple, '-')
    return paires.join(separateur);
}

/**
 *  Convertit un nombre exprimé en octet dans une autre unité (Ko, Mo ou Go)
 *  @param {number} nb nombre représentant un nombre d'octets
 *  @param {string} unite unité souhaitée : Ko Mo ou Go
 *  @return {string}  nombre exprimé dans l'unité avec une mise en forme par groupe de 3 chiffres
 */
export function conversionOctet(nb, unite = 'o') {
    let diviseur = 1;
    if (unite === 'Ko') {
        diviseur = 1024;
    } else if (unite === 'Mo') {
        diviseur = 1024 * 1024;
    } else if (unite === 'Go') {
        diviseur = 1024 * 1024 * 1024;
    }
    let str = Math.round(nb / diviseur).toString();
    let result = str.slice(-3);
    str = str.substring(0, str.length - 3);  // sans les trois derniers
    while (str.length > 3) {
        const elt = str.slice(-3);
        result = elt.concat(' ', result);
        str = str.substring(0, str.length - 3);
    }
    result = str.concat(result, ' ', unite);
    return result;
}

/**
 * Gestion de l'ouverture fermeture d'un conteneur
 * @param {Node} corps le conteneur à ouvrir/fermer
 * @param {Node} baliseI la balise i dont la classe doit être modifiée
 */
export function onOff(corps, baliseI) {
    if (corps.style.display === 'none') {
        corps.style.display = 'block';
        baliseI.classList.remove('bi-arrow-bar-down');
        baliseI.classList.add('bi-arrow-bar-up');
    } else {
        corps.style.display = 'none';
        baliseI.classList.remove('bi-arrow-bar-up');
        baliseI.classList.add('bi-arrow-bar-down');
    }
}

/**
 * Compare 2 chaînes sans tenir compte des accents et de la casse
 * @param {string} str1 chaîne à comparer
 * @param {string} str2 chaîne à comparer
 * @returns {boolean} true si les 2 chaînes sont identiques
 */
export function comparer(str1, str2) {
    const sansAccentsStr1 = str1.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const sansAccentsStr2 = str2.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return sansAccentsStr1.toLowerCase() === sansAccentsStr2.toLowerCase();
}

// ------------------------------------------------------------
// fonctions sur les champs de saisie
// ------------------------------------------------------------
/**
 * Retourne la valeur d'un champ de saisie
 * @param {string} inputId attribut id de la balise input
 * @returns {string | boolean | number | null} valeur saisie
 */
export function read(inputId) {
    let valeur;
    const input = document.getElementById(inputId);
    if (input) {
        // s'agit-il d'une balise input ?
        if (input instanceof HTMLInputElement) {
            // Récupération type de l'input : text, checkbox, radio, number
            const type = input.type.toLowerCase();
            if (type === 'checkbox' || type === 'radio') {
                valeur = input.checked ? 1 : 0;
            } else if (type === 'number') {
                // Vérifier si la valeur est un entier ou un nombre à virgule
                const value = input.value;
                if (Number.isInteger(value)) {
                    valeur = parseInt(value);
                } else {
                    valeur = parseFloat(value);
                }
            } else {
                valeur = input.value.trim();
                // détermination du type de la valeur
                if (valeur === '') {
                    valeur = null;
                } else if (!isNaN(valeur)) {
                    if (Number.isInteger(valeur)) {
                        valeur = parseInt(valeur);
                    } else {
                        valeur = parseFloat(valeur);
                    }
                }
            }
        } else if (input instanceof HTMLTextAreaElement) {
            valeur = input.value;
        } else if (input instanceof HTMLSelectElement) {
            valeur = input.value;
            if (!isNaN(valeur)) {
                if (Number.isInteger(valeur)) {
                    valeur = parseInt(valeur);
                } else {
                    valeur = parseFloat(valeur);
                }
            }
        } else {
            valeur = input.innerText;
        }
    } else {
        console.error(`L'élément ${inputId} n'existe pas`);
    }
    return valeur;
}

/**
 * Ecrit la valeur dans la balise identifiée par id
 * @param {string} inputId attribut id de la balise input
 * @param {string| boolean| number} valeur valeur à écrire dans la balise
 * @param {string | null} format - Le format de la valeur (facultatif) '€' ou '%'.
 */
export function write(inputId, valeur, format = null) {
    const input = document.getElementById(inputId);
    if (input) {
        // s'agit-il d'une balise input ?
        if (input instanceof HTMLInputElement) {
            const type = input.type.toLowerCase();
            if (type === 'checkbox' || type === 'radio') {
                input.checked = valeur;
            } else {
                if (format) {
                    if (format === '€') {
                        input.value = valeur.toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                        }).replace(',', '.');
                    } else if (format === '%') {
                        input.value = valeur.toLocaleString('fr-FR', {style: 'percent'});
                    } else {
                        input.value = valeur;
                    }
                } else {
                    input.value = valeur;
                }
            }
        } else if (input instanceof HTMLTextAreaElement) {
            input.value = valeur;
        } else if (input instanceof HTMLSelectElement) {
            input.value = valeur;
        } else if (input.tagName === 'DIV') {
            const p = document.createElement('p');
            p.innerHTML = valeur;
            input.appendChild(p);
        } else if (input.tagName === 'SPAN') {
            input.innerHTML = valeur;
        } else if (input.tagName === 'IMG') {
            input.src = valeur;
        } else {
            input.innerText = valeur;
        }
    } else {
        console.error(`L'élément ${inputId} n'existe pas`);
    }
}

/**
 * Génère un objet de type HTMLTableElement représentant une balise <table>
 * @param {object} option  contient les paramètres nécessaires :
 *     data : tableau d'éléments à convertir en tableau HTML
 *     id : [facultatif] valeur qui sera attribuée à l'attribut id de la balise table afin de pouvoir l'identifier
 *     columns: [facultatif] tableau contenant les colonnes à afficher lorsque toutes les colonnes ne doivent pas être affichées
 *     Exemple : ['nom', 'prenom', 'age']
 *     widths: [facultatif] tableau contenant les largeurs des colonnes
 *     Exemple :  {nom : '40 %', prenom : '40%', age : '20%'}
 *     headers : (facultatif] objet contenant les entêtes à utiliser (dans le cas ou le nom des propriétés du tableau ne convient pas)
 *     Exemple : {nom : 'Nom', prenom : 'Prénom', age : 'Âge'}
 *     headStyle : [facultatif] objet contenant les styles à appliquer aux entêtes
 *     Exemple : {nom : 'text-align: left', prenom : 'text-align: left', age : 'text-align: right'}
 *     bodyStyle : [facultatif] objet contenant les styles à appliquer au corps du tableau
 *     Exemple : {nom : 'text-align: left', prenom : 'text-align: left', age : 'text-align: right'}
 *     class : [facultatif] objet contenant les classes à appliquer aux entêtes et au corps du tableau
 *     Exemple : {nom : 'text-left', prenom : 'text-left', age : 'text-right'}
 * @returns {HTMLTableElement}
 */
export function creerTable(option) {
    // Récupération des propriétés de l'objet options
    const lesElements = option.data || [];
    const lesColonnes = option.columns || [];
    const lesLargeurs = option.widths || [];
    const lesEntetes = option.headers || [];
    const headStyle = option.headStyle || {};
    const bodyStyle = option.bodyStyle || {};
    const lesClasses = option.class || {};
    const id = option.id || '';
    const style = option.style || '';

    // création d'une balise table
    const table = document.createElement('table');
    table.id = id;
    table.style.cssText = style;
    // ajout d'une ligne d'entête
    const thead = table.createTHead();
    const tr = thead.insertRow();

    // création de la ligne d'entête
    // si le tableau lesColonnes est vide, on parcourt les clés du tableau lesElements
    // la valeur de la clé est utilisée comme entête sauf si une valeur est précisée dans l'objet lesEntetes
    if (lesColonnes.length === 0) {
        for (const colonne in lesElements[0]) {
            // Ajout d'une cellule d'entête avec style de l'en-tête
            const th = document.createElement('th');
            th.innerHTML = lesEntetes[colonne] || colonne;
            th.style.cssText = headStyle[colonne] || ''; // Application du style de l'en-tête si disponible
            if (lesClasses[colonne]) {
                th.classList.add(lesClasses[colonne]);
            }
            if (lesLargeurs[colonne]) {
                th.style.width = lesLargeurs[colonne];
            }
            tr.appendChild(th);
        }
    } else {
        for (const colonne of lesColonnes) {
            // Ajout d'une cellule d'entête avec style de l'en-tête
            const th = document.createElement('th');
            th.innerHTML = lesEntetes[colonne] || colonne;
            th.style.cssText = headStyle[colonne] || ''; // Application du style de l'en-tête si disponible
            if (lesClasses[colonne]) {
                th.classList.add(lesClasses[colonne]);
            }
            if (lesLargeurs[colonne]) {
                th.style.width = lesLargeurs[colonne];
            }
            tr.appendChild(th);
        }
    }
    // Remplissage du tableau avec les données
    const tbody = table.createTBody();
    // Ajout des lignes de valeurs dans la table
    for (const ligne of lesElements) {
        const tr = tbody.insertRow();

        // Si le tableau lesColonnes est vide, on génère des lignes comprenant toutes les valeurs du tableau
        // Sinon on génère des lignes comprenant les valeurs des colonnes spécifiées
        if (lesColonnes.length === 0) {
            for (const cle in ligne) {
                // Ajout d'une cellule avec style du corps
                const cellule = tr.insertCell();
                cellule.innerHTML = ligne[cle];
                cellule.style.cssText = bodyStyle[cle] || ''; // Application du style du corps si disponible
                if (lesClasses[cle]) {
                    cellule.classList.add(lesClasses[cle]);
                }
            }
        } else {
            for (const colonne of lesColonnes) {
                // Ajout d'une cellule avec style du corps
                const cellule = tr.insertCell();
                cellule.innerHTML = ligne[colonne];
                cellule.style.cssText = bodyStyle[colonne] || ''; // Application du style du corps si disponible
                if (lesClasses[colonne]) {
                    cellule.classList.add(lesClasses[colonne]);
                }
            }
        }
    }
    return table;
}

/**
 * crée un tableau HTML sans entête à partir d'un tableau d'éléments
 * @param {array} lesElements tableau d'éléments à convertir en tableau HTML
 */
export function creerTr(lesElements) {
    // création d'une balise table
    const table = document.createElement('table');
    // Remplissage du tableau avec les données
    // Ajout des lignes de valeurs dans la table
    for (const ligne of lesElements) {
        const tr = table.insertRow();
        for (const cle in ligne) {
            // Ajout d'une cellule
            tr.insertCell().innerText = ligne[cle];
        }
    }
    return table;
}

/**
 * Mélange un tableau d'éléments
 * Principe : on prend le dernier élément et on le permute avec un autre élément choisi aléatoirement
 * @param {Array} lesElements
 */
export function melanger(lesElements) {
    for (let i = lesElements.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [lesElements[i], lesElements[j]] = [lesElements[j], lesElements[i]];
    }
}

/**
 * Met en attente l'exécution du programme pendant le nombre de millisecondes passé en paramètre
 * @param {int} ms nombre de millisecondes
 * @returns {Promise<unknown>}
 */
export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* -------------------------------------------------------------------------------------------------------------
* Fonction de calcul portant sur le temps et la distance
 */

/**
 * Convertit en temps hh:mm:sss en nombre de secondes
 * @param {string} temps
 * @return {number}
 */
export function getNbSeconde(temps) {
    let heure = Number(temps.substring(0, 2));
    let seconde = Number(temps.substring(6, 8));
    let minute = Number(temps.substring(3, 5));
    return heure * 3600 + minute * 60 + seconde;
}

/**
 * Retourne la vitesse en km/h
 * @param {int} nbSeconde
 * @param {int} distance en km
 * @return {number}
 */
export function getVitesse(nbSeconde, distance) {
    // vitesse = 3600 * d / nbSeconde
    return 3600 * (distance) / nbSeconde;
}

/**
 * Retourne l'allure au km en mm:ss
 * formule de l'allure : Math.floor(3600 / vitesse)
 * cependant on veut l'exprimer en minutes et en secondes
 * @param {Number} nbSeconde
 * @param {int}distance
 * @return {string}
 */
export function getAllureEnMnSe(nbSeconde, distance) {
    // décomposition
    let tKm = Math.floor(nbSeconde / distance);
    let mn = Math.floor(tKm / 60);
    let se = tKm - mn * 60;
    let seT = '0' + se;
    return mn.toString() + ':' + seT.slice(-2);
}

/**
 * déterminer l'année de référence pour une saison spécifique (l'année scolaire ou universitaire qui commence en septembre par exemple).
 * @param {number} mois
 * @returns {number|number}
 */
export function getSaisonCourante(mois = 9) {

    // Obtenir le mois actuel (en chiffres, par exemple 3 pour mars)
    let moisCourant = new Date().getMonth() + 1;

    // Obtenir l'année actuelle (en chiffres, par exemple 2023)
    let annee = new Date().getFullYear();

    // Utiliser l'opérateur ternaire pour vérifier si nous sommes dans la deuxième moitié de l'année
    // Si c'est le cas, alors l'année de référence sera l'année actuelle + 1, sinon elle sera l'année actuelle
    annee = (moisCourant >= mois) ? annee + 1 : annee;

    // Retourner l'année de référence
    return annee;
}

/**
 * déterminer l'année de référence pour une saison spécifique (l'année scolaire ou universitaire qui commence en septembre par exemple).
 * @returns {number|number}
 * @param {Date} date
 * @param {int} mois
 */
export function getSaison(date, mois = 9) {
    // Obtenir le mois
    let moisCourant = date.getMonth() + 1;

    // Utiliser l'opérateur ternaire pour vérifier si nous sommes dans la deuxième moitié de l'année
    // Si c'est le cas, alors l'année de référence sera l'année + 1, sinon elle sera l'année
    return (moisCourant >= mois) ? date.getFullYear() + 1 : date.getFullYear();
}

/**
 * retourne la date courante dans le format aaaa-mm-jj
 * @returns {string}
 */

export function getDateCourante() {
    const date = new Date();
    return date.toISOString().split('T')[0];
}

/**
 * retourne la date courante dans le format jj/mm/aaaa
 * @param dateIso
 * @returns {string}
 */
export function convertirDateIsoEnDateFr(dateIso) {
    return dateIso.split('-').reverse().join('/');
}

/**
 * Convertit une date au format jj/mm/aaaa en une date au format aaaa-mm-jj
 * @param dateFr
 * @returns {string}
 */
export function convertirDateFrEnDateIso(dateFr) {
    return dateFr.split('/').reverse().join('-');
}

/**
 * Convertit une date et une heure au format ISO en une date et une heure au format français
 * @param dateHeureIso
 * @returns {string}
 */
export function convertirDateHeureIsoEnDateHeureFr(dateHeureIso) {
    // Séparer la date et l'heure
    const [datePart, timePart] = dateHeureIso.split('T');

    // Formater la date
    const [year, month, day] = datePart.split('-');
    const formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;

    // Formater l'heure
    const [hours, minutes, seconds] = timePart.split(':');
    const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;

    // Retourner la date et l'heure formatées
    return `${formattedDate} à ${formattedTime}`;
}


/**
 * retourne le message d'erreur associé à la réponse de l'API
 * @param reponse
 * @returns {string}
 */
export function getErrorAPI(reponse) {
    if (reponse === "Not Found") return "Le point d'accès appelé n'existe pas";
    if (reponse === "Bad credentials") return "Vos paramètres d'authentification sont incorrects";
    if (reponse === "Requires authentication") return "Votre demande nécessite une authentification";
    if (reponse === "Repository creation failed.") return "La création du référentiel a échoué";
    if (reponse === "name already exists on this account") return "Ce référentiel existe déjà";
    if (reponse === "Body should be a JSON object") return "Votre demande ne comporte pas les paramètres attendus";
    return "Echec de la demande";
}

/**
 * Remplace $.ajax(...) par un appel fetch moderne avec async/await.
 * @param {Object} options - options de la requête
 * @param {string} options.url - URL cible
 * @param {string} [options.method='GET'] - Méthode HTTP (GET, POST)
 * @param {Object|FormData} [options.data] - Données à envoyer
 * @param {function} [options.success] - Fonction callback en cas de succès
 * @param {function} [options.error] - Fonction callback en cas d’échec
 */
export async function ajax(options) {
    const {
        url,
        method = 'GET',
        data,
        success = () => {},
        error = () => {}
    } = options;

    let fetchOptions = {
        method
    };

    // Construction du body et headers selon la méthode et la nature des données
    if (method.toUpperCase() === 'POST') {
        if (data instanceof FormData) {
            fetchOptions.body = data;
        } else if (data && typeof data === 'object') {
            fetchOptions.headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
            fetchOptions.body = new URLSearchParams(data);
        }
    } else if (method.toUpperCase() === 'GET' && data && typeof data === 'object') {
        const params = new URLSearchParams(data).toString();
        options.url += (url.includes('?') ? '&' : '?') + params;
    }

    try {
        const response = await fetch(url, fetchOptions);
        if (!response.ok) throw response;
        const json = await response.json();
        success(json);
    } catch (reponse) {
        let texte;
        try {
            texte = await reponse.text();
        } catch (e) {
            texte = 'Erreur inconnue';
        }
        error(reponse, texte);
    }
}

/**
 * Envoie une requête POST avec fetch et FormData
 * @param {string} url - L’URL du script à appeler
 * @param {object} data - Un objet contenant les paires clé/valeur à envoyer
 * @returns {Promise<object>} - Réponse JSON parsée
 */
export async function postData(url, data = {}) {
    const formData = new FormData();
    for (const key in data) {
        formData.append(key, data[key]);
    }

    const response = await fetch(url, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
    }

    return await response.json();
}

