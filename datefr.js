/**
 * Classe permettant de gérer des dates
 *
 * @Author : Guy Verghote
 * @Version : 2023.1
 * @date : 30/07/2023
 */

class DateFr {

    // -----------------------------------
    // méthode statiques(à portée classe)
    // -----------------------------------

    /**
     *
     * @param {number} annee
     * @return {boolean} true si l'année est bissextile
     */

    static estBissextile(annee) {
        return (annee % 4 === 0 && annee % 100 !== 0) || annee % 400 === 0;
    }

    /**
     *
     * @param {number} annee
     * @param {number} mois
     * @return {number} nombre de jours dans un mois d'une année
     */
    static joursDansMois(mois, annee) {
        if (mois === 2) {
            return DateFr.estBissextile(annee) ? 29 : 28;
        }
        if (mois === 4 || mois === 6 || mois === 9 || mois === 11) {
            return 30;
        }
        return 31;
    }

    /**
     *
     * @param {number} annee
     * @return {number} nombre de jours dans une année
     */
    static joursDansAnnee(annee) {
        return DateFr.estBissextile(annee) ? 366 : 365;
    }

    /**
     *
     * @param {number} annee
     * @param {number} mois
     * @param {number} jour
     * @return {number} nombre de jours écoulés depuis le premier janvier de l'année
     */
    static quantieme(jour, mois, annee) {
        let total = jour;
        let i = 1;
        while (i !== mois) {
            total += DateFr.joursDansMois(i, annee);
            i++;
        }
        return total;
    }

    /**
     *
     * @param {number} a1 année de départ
     * @param {number} a2 année d'arrivée
     * @return {number} Différence en jour jours entre 2 années
     */
    static joursEntre2Annees(a1, a2) {
        let annee = a1;
        let nbJour = 0;
        while (annee !== a2) {
            nbJour += DateFr.joursDansAnnee(annee);
            annee++;
        }
        return nbJour;
    }

    /**
     * @param {DateFr} dateDebut
     * @param {DateFr} dateFin
     * @return {number} Nombre de jours entre les deuxs dates
     */

    static joursEntre2Dates(dateDebut, dateFin) {
        return dateFin.nbJour - dateDebut.nbJour;
    }

    /**
     *
     * @param {number} jour
     * @param {number} mois
     * @param {number} annee
     * @return {boolean} true si les paramètres forment une date valide
     */

    static estValide(jour, mois, annee) {
        return (mois >= 1 && mois <= 12 && jour >= 1 && jour <= DateFr.joursDansMois(mois, annee) && annee >= 1900);
    }

    /**
     * retourne le mois en lettre et sa particule de ou d'
     *
     * @param {number} mois
     * @return  {object} avec deux propriétés particule et libelle
     */

    static getLeMois(mois) {
        const lesMois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        const result = {particule: 'de ', libelle: lesMois[mois - 1]};
        if (mois === 4 || mois === 8 || mois === 10) {
            result.particule = 'd\'';
        }
        return result;
    }

    /**
     * @param {number} annee
     * @param {number} numSemaine
     * @return {DateFr} date correspondant au premier jour de la semaine passée en paramètre
     */

    static getDebutSemaine(annee, numSemaine) {
        // on se place sur le 4 janvier qui est forcément dans la semaine 1
        let uneDate = new DateFr(4, 1, annee);

        // On détermine le lundi de la première semaine
        // si le 4/01 est un lundi(1) 0, mardi(2) - 1, ... Dimanche(7) -6 soit 1 - n° du jour
        uneDate = uneDate.ajouterJour(1 - uneDate.getJourSemaine());

        // on calcule le décalage en ajoutant 7 * numsemaine
        return uneDate.ajouterJour((numSemaine - 1) * 7);
    }

    // ----------------------------------------------------------
    // méthodes statiques retournant un objet DateFr
    // ----------------------------------------------------------


    /**
     * Génération d'un objet date à partir d'une date au format Mysql aaaa-mm-jj
     *
     * @param {string} dateMysql chaine au format aaaa-mm-jj
     * @return {DateFr} Objet DateFr correspondant à la chaîne passée en paramètre
     */

    static getFromDateMysql(dateMysql) {
        const lesElements = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/.exec(dateMysql);
        const jour = parseInt(lesElements[3], 10);
        const mois = parseInt(lesElements[2], 10);
        const annee = parseInt(lesElements[1], 10);
        if (DateFr.estValide(jour, mois, annee)) {
            return new DateFr(jour, mois, annee);
        } else {
            return new DateFr(1, 1, 1900);
        }
    }

    /**
     * Génération d'un objet DateFr à partir d'une date au format jj/mm/aaaa
     * quel que soit le séparateur :: / - . et le format j ou jj m ou mm
     *
     * @param {string} dateFr Chaine au format 'jj/mm/aaaa'
     * @return {DateFr}
     */
    static getFromDateFr(dateFr) {
        const lesElements = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/.exec(dateFr);
        const jour = parseInt(lesElements[1], 10);
        const mois = parseInt(lesElements[2], 10);
        const annee = parseInt(lesElements[3], 10);
        if (DateFr.estValide(jour, mois, annee)) {
            return new DateFr(jour, mois, annee);
        } else {
            return new DateFr(1, 1, 1900);
        }
    }

    /**
     * Génération d'un objet DateFr à partir d'un autre objet DateFr
     * correspond à la notion de constructeur par copie
     *
     * @param {DateFr} uneDate
     * @return {DateFr}
     */
    static getFromObject(uneDate) {
        return new DateFr(uneDate.getJour(), uneDate.getMois(), uneDate.getAnnee());
    }

    /**
     *
     * @param {number} annee
     * @return {DateFr} objet DateFr représentant le dimanche de Pâques
     */
    static getPaques(annee) {
        let paques;
        const var1 = annee % 19 + 1;
        let var2 = (annee / 100) + 1;
        var2 = Math.floor(var2); // problème, car le nombre n'est pas arrondi
        let var3 = ((3 * var2) / 4) - 12;
        var3 = Math.floor(var3);
        let var4 = (((8 * var2) + 5) / 25) - 5;
        var4 = Math.floor(var4);
        let var5 = ((5 * annee) / 4) - var3 - 10;
        var5 = Math.floor(var5);
        let var6 = (11 * var1 + 20 + var4 - var3) % 30;
        var6 = Math.floor(var6);
        if ((var6 === 25 && var1 > 11) || (var6 === 24)) {
            var6 = var6 + 1;
        }
        let var7 = 44 - var6;
        if (var7 < 21) {
            var7 = var7 + 30;
        }
        var7 = var7 + 7;
        var7 = var7 - (var5 + var7) % 7;
        if (var7 <= 31) {
            paques = new DateFr(var7, 3, annee);
        } else {
            paques = new DateFr(var7 - 31, 4, annee);
        }
        return (paques);
    }

    /**
     * Retourne les jours fériés de l'année
     *
     * @param {number} annee
     * @return {array} Tableau numérique contenant les jours féries de l'année sous la forme d'objet à deux propriétés : date et libelle
     */

    static getLesJoursFeries(annee) {
        // paques [22 mars - 25 avril]
        // ascension [30 avril - 2 juin]
        // Pentecôte [11 mai - 13 juin]

        const lesJoursFeries = [];
        const paques = DateFr.getPaques(annee);
        const premierMai = new DateFr(1, 5, annee);
        const huitMai = new DateFr(8, 5, annee);
        const lundiPaques = paques.ajouterJour(1);
        const ascension = paques.ajouterJour(39);
        const pentecote = paques.ajouterJour(50);

        let jour = {date: new DateFr(1, 1, annee), libelle: 'Jour de l\'an'};
        lesJoursFeries.push(jour);

        jour = {date: paques, libelle: 'Pâques'};
        lesJoursFeries.push(jour);

        jour = {date: lundiPaques, libelle: 'Lundi de Pâques'};
        lesJoursFeries.push(jour);

        if (ascension.estPlusPetite(premierMai)) {
            jour = {date: ascension, libelle: 'Jeudi de l\'Ascension'};
            lesJoursFeries.push(jour);
            jour = {date: premierMai, libelle: 'Fête du travail'};
            lesJoursFeries.push(jour);
            jour = {date: huitMai, libelle: 'Armistice 1945'};
            lesJoursFeries.push(jour);
        } else if (ascension.estPlusPetite(huitMai)) {
            jour = {date: premierMai, libelle: 'Fête du travail'};
            lesJoursFeries.push(jour);
            jour = {date: ascension, libelle: 'Jeudi de l\'Ascension'};
            lesJoursFeries.push(jour);
            jour = {date: huitMai, libelle: 'Armistice 1945'};
            lesJoursFeries.push(jour);
        } else {
            jour = {date: premierMai, libelle: 'Fête du travail'};
            lesJoursFeries.push(jour);
            jour = {date: huitMai, libelle: 'Armistice 1945'};
            lesJoursFeries.push(jour);
            jour = {date: ascension, libelle: 'Jeudi de l\'Ascension'};
            lesJoursFeries.push(jour);
        }

        jour = {date: pentecote, libelle: 'Lundi de Pentecôte'};
        lesJoursFeries.push(jour);
        jour = {date: new DateFr(14, 7, annee), libelle: 'Fête Nationale'};
        lesJoursFeries.push(jour);
        jour = {date: new DateFr(15, 8, annee), libelle: 'Assomption'};
        lesJoursFeries.push(jour);
        jour = {date: new DateFr(1, 11, annee), libelle: 'Toussaint'};
        lesJoursFeries.push(jour);
        jour = {date: new DateFr(11, 11, annee), libelle: 'Armistice 1918'};
        lesJoursFeries.push(jour);
        jour = {date: new DateFr(25, 12, annee), libelle: 'Noël'};
        lesJoursFeries.push(jour);
        return lesJoursFeries;
    }

    /**
     * Constructeur d'un objet date ou d'une chaine de caractères au format aaaa-mm-jj ou jj/mm/aaaa
     * La surcharge du constructeur n'est pas possible.
     * Pour obtenir le même résultat, il faut utiliser ...arg en paramètre pour récupérer tous les paramètres dans un tableau args
     * @param {number} jour
     * @param {number} mois
     * @param {number} annee
     */

    /**
     * Constructeur d'un objet date
     * en argument, on peut passer une chaine au format jj/mm/aaaa ou aaaa-mm-jj, ou les trois éléments jour, mois, année
     * @param args :
     */
    constructor(...args) {
        let annee = 1900, mois = 1, jour = 1;
        const nb = args.length;
        if (nb === 0) {
            const now = new Date();
            annee = now.getFullYear();
            mois = now.getMonth() + 1;
            jour = now.getDate();
        } else if (nb === 1 && typeof args[0] === 'string') {
            // quel est le format de la chaîne ?
            const valeur = args[0];
            const lesElements = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(valeur);
            if (lesElements) {
                jour = parseInt(lesElements[1], 10);
                mois = parseInt(lesElements[2], 10);
                annee = parseInt(lesElements[3], 10);
            } else {
                const lesElements = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(valeur);
                if (lesElements) {
                    jour = parseInt(lesElements[3], 10);
                    mois = parseInt(lesElements[2], 10);
                    annee = parseInt(lesElements[1], 10);
                }
            }
        } else if (nb === 3 && args.every(x => typeof x === 'number')) {
            jour = args[0];
            mois = args[1];
            annee = args[2];
        }
        if (DateFr.estValide(jour, mois, annee)) {
            this.nbJour = DateFr.joursEntre2Annees(1900, annee) + DateFr.quantieme(jour, mois, annee);
        } else {
            throw new Error('La création d\'un objet DateFr a échoué, vérifier les arguments passés au constructeur');
        }
    }

    /*
     *
     * @return {array} tableau contenant l'année le mois et le jour de l'objet DateFr
     */
    getLesElements() {
        const lesElements = {};
        lesElements.annee = 1900;
        lesElements.mois = 1;
        let nbJour = this.nbJour;
        while (nbJour > DateFr.joursDansAnnee(lesElements.annee)) {
            nbJour -= DateFr.joursDansAnnee(lesElements.annee);
            lesElements.annee++;
        }
        while (nbJour > DateFr.joursDansMois(lesElements.mois, lesElements.annee)) {
            nbJour -= DateFr.joursDansMois(lesElements.mois, lesElements.annee);
            lesElements.mois++;
        }
        lesElements.jour = nbJour;
        return lesElements;
    }

    // -----------------------------------
    // Méthodes sur les objets
    // -----------------------------------

    /**
     *
     * @return {number} nombre de jours écoulés depuis le 01/01/1900
     */
    getNbJour() {
        return this.nbJour;
    }

    /**
     *
     * @return {number} jour en chiffre
     */
    getJour() {
        const lesElements = this.getLesElements();
        return lesElements.jour;
    }

    /**
     *
     * @return {string} jour en lettre
     */
    getJourEnLettre() {
        const lesJours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
        return lesJours[this.getJourSemaine() - 1];
    }

    /**
     *
     * @return {number} mois en chiffre
     */
    getMois() {
        return this.getLesElements().mois;
    }

    /**
     *
     * @return {string} mois en lettre
     */
    getMoisEnLettre() {
        const lesMois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        return lesMois[this.getMois() - 1];
    }

    /**
     *
     * @return {number} année de la date
     */
    getAnnee() {
        return this.getLesElements().annee;
    }

    /**
     *
     * @return {number} numéro du jour dans la semaine (lundi = 1, mardi = 2....)
     */
    getJourSemaine() {
        return (this.nbJour - 1) % 7 + 1;
    }

    /**
     *
     * @return {number} nombre de jours écoulés depuis le premier janvier de l'année
     */
    getQuantieme() {
        return DateFr.quantieme(this.getJour(), this.getMois(), this.getAnnee());
    }

    /**
     *
     * @return {number} le nombre de jours dans le mois
     */
    getNbJoursMois() {
        return DateFr.joursDansMois(this.getMois(), this.getAnnee());
    }

    /**
     *
     * @return {number} numéro de la semaine numérotation française Iso
     */
    getNumeroSemaine() {
        // Il faut trouver le point de départ pour la semaine 1.
        // Ce point de départ n'est pas forcément dans la même année : on peut être dans la 53 semaine de l'année n - 1
        // On peut aussi être dans la première semaine de l'année n + 1
        // Pour régler ce problème deux petits décalages suffisent sans que cela change le résultat
        // On sait que le jeudi de la semaine est forcément dans la bonne année de référence
        // On se place donc sur le jeudi
        const jeudi = this.ajouterJour(4 - this.getJourSemaine());
        // le 4 janvier de cette année fait forcément partie de la semaine 1
        const le4janvier = new DateFr(4, 1, jeudi.getAnnee());
        // on se place sur le lundi
        const lundi = le4janvier.ajouterJour(1 - le4janvier.getJourSemaine());
        let nbSemaine = 0;
        let numjour = lundi.nbJour;
        while (numjour <= jeudi.nbJour) {
            numjour += 7;
            nbSemaine++;
        }
        return nbSemaine;
    }

    /**
     * méthode retournant un objet DateFr augmenté de nb jours
     *
     * @param {number} nb nombre de jours à ajouter
     * @return DateFr
     */
    ajouterJour(nb) {
        const res = DateFr.getFromObject(this);
        res.nbJour += nb;
        return res;
    }

    /**
     * méthode retournant un objet DateFr diminué de nb jours
     *
     * @param {number} nb nombre de jours à retirer
     * @return DateFr
     */
    retirerJour(nb) {
        const res = DateFr.getFromObject(this);
        res.nbJour = res.nbJour - nb > 0 ? res.nbJour - nb : 0;
        return res;
    }

    /**
     * méthode retournant un objet DateFr augmenté de nb mois
     * Plafonnement au dernier jour du mois cible
     *
     * @param {number} nb nombre de mois à ajouter
     * @return DateFr
     *
     */
    ajouterMois(nb) {
        const lesElements = this.getLesElements();
        let jour = lesElements.jour;
        let mois = lesElements.mois;
        let annee = lesElements.annee;
        for (let i = 1; i <= nb; i++) {
            mois++;
            if (mois > 12) {
                mois = 1;
                annee++;
            }
        }
        if (jour > DateFr.joursDansMois(mois, annee)) {
            // jour -= DateFr.joursDansMois(mois, annee);
            // mois++;
            jour = DateFr.joursDansMois(mois, annee);
        }
        return new DateFr(jour, mois, annee);
    }

    /**
     * méthode retournant un objet DateFr augmenté de nb mois
     *
     * @param {number} nb nombre de mois à retirer
     * Plafonnement au dernier jour du mois cible
     * @return DateFr
     */
    retirerMois(nb) {
        const lesElements = this.getLesElements();
        let jour = lesElements.jour;
        let mois = lesElements.mois;
        let annee = lesElements.annee;
        for (let i = 1; i <= nb; i++) {
            mois--;
            if (mois < 1) {
                mois = 12;
                annee--;
                if (annee < 1900) {
                    return new DateFr(1, 1, 1900);
                }
            }

        }
        if (jour > DateFr.joursDansMois(mois, annee)) {
            jour = DateFr.joursDansMois(mois, annee);
        }
        return new DateFr(jour, mois, annee);
    }

    /**
     * méthode retournant un objet DateFr augmenté de nb années
     * Plafonnement au dernier jour du mois cible
     *
     * @param {number} nb nombre d'années à ajouter
     * @return DateFr
     */
    ajouterAnnee(nb) {
        const lesElements = this.getLesElements();
        let jour = lesElements.jour;
        const mois = lesElements.mois;
        const annee = lesElements.annee + nb;
        if (jour > DateFr.joursDansMois(mois, annee)) {
            jour = DateFr.joursDansMois(mois, annee);
        }
        return new DateFr(jour, mois, annee);
    }

    /**
     * méthode retournant un objet DateFr diminué de nb années
     * Plafonnement au dernier jour du mois cible
     * @param {number} nb nombre d'année à retirer
     * @return DateFr
     */
    retirerAnnee(nb) {
        const lesElements = this.getLesElements();
        let jour = lesElements.jour;
        const mois = lesElements.mois;
        const annee = lesElements.annee - nb;
        if (jour > DateFr.joursDansMois(mois, annee)) {
            jour = DateFr.joursDansMois(mois, annee);
        }
        return new DateFr(jour, mois, annee);
    }

    /**
     * @param {DateFr} uneDate
     * @return {boolean} true si les dates sont identiques
     */
    estEgale(uneDate) {
        return this.nbJour === uneDate.nbJour;
    }

    /**
     * @param {DateFr} uneDate
     * @return {boolean} true si la date est plus grande que uneDate
     */
    estPlusGrande(uneDate) {
        return this.nbJour > uneDate.nbJour;
    }

    /**
     *
     * @param {DateFr} uneDate
     * @return {boolean} si la date est plus grande que uneDate
     */
    estApres(uneDate) {
        return this.nbJour > uneDate.nbJour;
    }

    /**
     *
     * @param {DateFr} uneDate
     * @return {boolean} true si la date est plus petite que uneDate
     */
    estPlusPetite(uneDate) {
        return this.nbJour < uneDate.nbJour;
    }

    /**
     *
     * @param {DateFr} uneDate
     * @return true si la date est plus petite que uneDate
     */
    estAvant(uneDate) {
        return this.nbJour < uneDate.nbJour;
    }

    /**
     * retourne
     *
     * @param {DateFr} uneDate
     * @return {number} écart en jours avec la date passée en paramètre
     */

    ecartEnJours(uneDate) {
        return this.nbJour - uneDate.nbJour;
    }

    /**
     *
     * @return {boolean} true si la date correspond à un jour férié français
     */
    estFerie() {
        const lesElements = this.getLesElements();
        const annee = lesElements.annee;
        const mois = lesElements.mois;
        const jour = lesElements.jour;
        let resultat = false;
        if ((mois === 1 && jour === 1) || (mois === 5 && jour === 1) ||
            (mois === 5 && jour === 8) || (mois === 7 && jour === 14) ||
            (mois === 8 && jour === 15) || (mois === 11 && jour === 11) ||
            (mois === 11 && jour === 1) || (mois === 12 && jour === 25)) {
            resultat = true;
        } else {
            let var1, var2, var3, var4, var5, var6, var7;
            let paques;
            var1 = annee % 19 + 1;
            var2 = (annee / 100) + 1;
            var2 = Math.floor(var2); // problème car le nombre n'est pas arrondi
            var3 = ((3 * var2) / 4) - 12;
            var3 = Math.floor(var3);
            var4 = (((8 * var2) + 5) / 25) - 5;
            var4 = Math.floor(var4);
            var5 = ((5 * annee) / 4) - var3 - 10;
            var5 = Math.floor(var5);
            var6 = (11 * var1 + 20 + var4 - var3) % 30;
            var6 = Math.floor(var6);
            if ((var6 === 25 && var1 > 11) || (var6 === 24)) {
                var6 = var6 + 1;
            }
            var7 = 44 - var6;
            if (var7 < 21) {
                var7 = var7 + 30;
            }
            var7 = var7 + 7;
            var7 = var7 - (var5 + var7) % 7;
            if (var7 <= 31) {
                paques = new DateFr(var7, 3, annee);
            } else {
                paques = new DateFr(var7 - 31, 4, annee);
            }

            if (this.nbJour === paques.nbJour || this.nbJour === paques.nbJour + 1 || this.nbJour === paques.nbJour + 39 || this.nbJour === paques.nbJour + 50) {
                resultat = true;
            }
        }
        return resultat;
    }

    /*
    *  @return {string} nom du jour férié. "" si la date ne correspond pas à un jour férié
    */
    getNomJourFerie() {
        let nom = '';
        const lesElements = this.getLesElements();
        const annee = lesElements.annee;
        const mois = lesElements.mois;
        const jour = lesElements.jour;
        const paques = DateFr.getPaques(annee);

        if (mois === 1 && jour === 1) {
            nom = 'jour de l\'An';
        } else if (mois === 5 && jour === 1) {
            nom = 'Fête de Travail';
        } else if (mois === 5 && jour === 8) {
            nom = 'victoire 1945';
        } else if (mois === 7 && jour === 14) {
            nom = 'Fête Nationale';
        } else if (mois === 8 && jour === 15) {
            nom = 'Assomption';
        } else if (mois === 11 && jour === 1) {
            nom = 'Toussaint';
        } else if (mois === 11 && jour === 11) {
            nom = 'Armistice 1918';
        } else if (mois === 12 && jour === 25) {
            nom = 'Noël';
        }
        if (this.nbJour === paques.nbJour) {
            nom = 'Pâques';
        } else if (this.nbJour === paques.nbJour + 1) {
            nom = 'Lundi de Pâques';
        } else if (this.nbJour === paques.nbJour + 39) {

            nom = 'Ascencion';
        } else if (this.nbJour === paques.nbJour + 50) {
            nom = 'Lundi de Pentecôte';
        }
        return (nom);
    }

    /**
     *
     * @return {boolean} true si le jour est un jour ouvrable : du lundi au vendredi sauf jour férié
     */
    estJourOuvrable() {
        return !this.estFerie() && this.getJourSemaine() < 6;
    }

    /**
     *
     * @return {DateFr} jour ouvrable suivant : du lundi au vendredi sauf jour férié
     */

    getJourOuvrableSuivant() {
        const jourOuvrableSuivant = new DateFr();
        jourOuvrableSuivant.nbJour = this.nbJour + 1;
        while (!jourOuvrableSuivant.estJourOuvrable()) {
            jourOuvrableSuivant.nbJour += 1;
        }
        return jourOuvrableSuivant;
    }

    /**
     *
     * @return {DateFr} jour ouvrable précédent : du lundi au vendredi sauf jour férié
     */

    getJourOuvrablePrecedent() {
        const jourOuvrablePrecedent = new DateFr();
        jourOuvrablePrecedent.nbJour = this.nbJour - 1;
        while (!jourOuvrablePrecedent.estJourOuvrable()) {
            jourOuvrablePrecedent.nbJour -= 1;
        }
        return jourOuvrablePrecedent;
    }

    /**
     *
     * @param {string} separateur séparateur entre les éléments d'une date "/" par défaut
     * @return {string} date au format jj/mm/aaaa
     */
    toFormatCourt(separateur = '/') {
        const lesElements = this.getLesElements();
        return ('0' + lesElements.jour).slice(-2) + separateur + ('0' + lesElements.mois).slice(-2) + separateur + lesElements.annee;
    }

    /**
     *
     * @return {string} date au format au format jjjj jj mmmm aaaa en remplaçant jj par 1er lorsque j = 1j
     */
    toFormatLong() {
        const lesElements = this.getLesElements();
        let d = this.getJourEnLettre() + ' ';
        if (lesElements.jour === 1) {
            d += '1er';
        } else {
            d += ('0' + lesElements.jour).slice(-2);
        }
        d += ' ' + this.getMoisEnLettre() + ' ' + lesElements.annee;
        return d;
    }

    /**
     *
     * @return {string} date au format Mysql aaaa-mm-jj
     */
    toFormatMySQL() {
        const lesElements = this.getLesElements();
        return lesElements.annee + '-' + ('0' + lesElements.mois).slice(-2) + '-' + ('0' + lesElements.jour).slice(-2);
    }

    // conserver à titre de compatibilité des anciennes versions

    toMySQL() {
        const lesElements = this.getLesElements();
        return lesElements.annee + '-' + ('0' + lesElements.mois).slice(-2) + '-' + ('0' + lesElements.jour).slice(-2);
    }

    toFormatMysql() {
        const lesElements = this.getLesElements();
        return lesElements.annee + '-' + ('0' + lesElements.mois).slice(-2) + '-' + ('0' + lesElements.jour).slice(-2);
    }

}