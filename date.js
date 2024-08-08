"use strict";
/*
 * ajout de méthodes sur la classe Date
 *
 * @Author : Guy Verghote
 * @Version : 2024.1
 * @date : 05/047/2024
 *
 */

/**
 * Génération d'un objet Date à partir d'une date au format jj/mm/aaaa
 *
 * @param {string} dateFr Chaine au format 'jj/mm/aaaa'
 * @return {Date}
 */
Date.getFromDateFr = function (dateFr) {
    const lesElements = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(dateFr);
    const jour = parseInt(lesElements[1], 10);
    const mois = parseInt(lesElements[2], 10);
    const annee = parseInt(lesElements[3], 10);
    return new Date(jour, mois - 1, annee);
};


/**
 * méthode retournant un objet Date augmenté de nb jours
 *
 * @param {number} nb  nombre de jours à ajouter
 * @return Date
 */
Date.prototype.ajouterJour = function (nb) {
    const res = new Date(this);
    res.setDate(res.getDate() + nb);
    return res;
};

/**
 * méthode retournant un objet Date diminué de nb jours
 *
 * @param {number} nb  nombre de jours à ajouter
 * @return Date
 */
Date.prototype.retirerJour = function (nb) {
    const res = new Date(this);
    res.setDate(res.getDate() - nb);
    return res;
};

/**
 * méthode retournant un objet Date augmenté de nb mois
 *
 * @param {number} nb nombre de mois à ajouter
 * Plafonnement au dernier jour du mois cible
 * @return Date
 */
Date.prototype.ajouterMois = function (nb) {
    const res = new Date(this);
    // sauvegarde du jour de la date actuelle
    const jour = res.getDate();
    // modification du mois : le jour peut avoir changé
    res.setMonth(res.getMonth() + nb);
    // si le jour a changé cela signifie que le mois sur lequel on devait arriver contient moins de jours
    // le système s'est dont placé sur le mois suivant, il faut retirer les jours pour revenir sur le dernier jour du mois attendu
    if (jour !== res.getDate()) {
        res.ajouterJour(-res.getDate());
    }
    return res;
};

/**
 * méthode retournant un objet Date diminué de nb mois
 *
 * @param {number} nb nombre de mois à retirer
 * Plafonnement au dernier jour du mois cible
 * @return Date
 */
Date.prototype.retirerMois = function (nb) {
    const res = new Date(this);
    // sauvegarde du jour de la date actuelle
    const jour = res.getDate();
    // modification du mois : le jour peut avoir changé
    res.setMonth(res.getMonth() - nb);
    // si le jour a changé cela signifie que le mois sur lequel on devait arriver contient moins de jour
    // le système s'est dont placé sur le mois suivant, il faut retirer les jours pour revenir sur le dernier jour du mois attendu
    if (jour !== res.getDate()) {
        res.ajouterJour(-res.getDate());
    }
    return res;
};

/**
 * méthode retournant un objet Date augmenté de nb années
 *
 * @param {number} nb nombre d'années à ajouter
 * @return Date
 */
Date.prototype.ajouterAnnee = function (nb) {
    const res = new Date(this);
    const jour = res.getDate();
    res.setFullYear(res.getFullYear() + nb);
    if (jour !== res.getDate()) {
        res.ajouterJour(-res.getDate());
    }
    return res;
};

/**
 * méthode retournant un objet Date diminué de nb années
 *
 * @param {number} nb nombre d'années à retirer
 * @return Date
 */
Date.prototype.retirerAnnee = function (nb) {
    const res = new Date(this);
    const jour = res.getDate();
    res.setFullYear(res.getFullYear() - nb);
    if (jour !== res.getDate()) {
        res.ajouterJour(-res.getDate());
    }
    return res;
};

// retire la partie horaire de l'objet date
Date.prototype.delTime = function () {
    this.setHours(0);
    this.setMilliseconds(0);
    this.setMinutes(0);
    this.setSeconds(0);
};

/**
 * retourne le nombre de jours entre la date actuelle et la date passée en paramètre
 *
 * @param {Date} uneDate
 * @return {number} number écart en jours avec la date passée en paramètre
 */

Date.prototype.ecartEnJours = function (uneDate) {
    const dateA = new Date(this.valueOf());
    const dateB = new Date(uneDate.valueOf());
    dateA.delTime();
    dateB.delTime();
    const diff = dateA.getTime() - dateB.getTime();
    return Math.round(diff / (1000 * 60 * 60 * 24));
};