# Regroupement de l'ensemble des composants Javascript et JQuery utilisés dans les projets  

Tous les projets Web ont recours à des composants côté client, par exemple bootstrap ou jquery.
Ces composants étant régulièrement mis à jour, il faut mettre à jour leur nouvelle référence dans tous les projets.

Ce référentiel contient l'ensemble des composants utilisés dans nos projets Web.
Il centralise donc tous les composants afin de n'avoir à gérer la mise à jour des composants qu'au niveau de ce référentiel.
Tous les projets faisant référence à ce référentiel seront ainsi automatiquement mis à jour.

Pour rendre accessible les fichiers de ce référentiel dans un projet, le service GitHub Pages a été utilisé.
Ainsi, les fichiers de ce référentiel sont accessibles à l'adresse suivante : https://verghote.github.io/composants/
ou en utilisant le CDN suivant : https://cdn.jsdelivr.net/gh/verghote/composants/

## Chargement des composants dans un projet

* bootstrap
  *  echo file_get_contents('https://cdn.jsdelivr.net/gh/verghote/composant/bootstrap.html');
* jQuery
  *  echo file_get_contents('https://cdn.jsdelivr.net/gh/verghote/composant/jquery.html');
* DataTables
  *  $head .= file_get_contents('https://cdn.jsdelivr.net/gh/verghote/composant/datatables.html');
* tablesorter
    *  $head .= file_get_contents('https://cdn.jsdelivr.net/gh/verghote/composant/tablesorter.html');
* autocomplete2 (auto complétion sans jQuery)
    *  $head .= file_get_contents('https://cdn.jsdelivr.net/gh/verghote/composant/autocomplete2.html');
* autocomplete (auto complétion avec jQuery)
    *  $head .= file_get_contents('https://cdn.jsdelivr.net/gh/verghote/composant/autocomplete.html');
* CkEditor (version 4 standard)
    *  $head .= file_get_contents('https://cdn.jsdelivr.net/gh/verghote/composant/ckeditor.html');
* CkEditor (version 5 standard)
    * $head .= file_get_contents('https://cdn.jsdelivr.net/gh/verghote/composant/ckeditor5.html');
* CkEditor (version 4 personnalisée)
    * $head .= "<script src='https://cdn.jsdelivr.net/gh/verghote/composant/ckeditor/ckeditor.js'></script>";
* dompurify
    * $head .= file_get_contents('https://cdn.jsdelivr.net/gh/verghote/composant/dompurify.html');
* module ES6 (ECMAScript 2015) fonction.js 
    * import {afficherErreur, afficherSucces} from "https://cdn.jsdelivr.net/gh/verghote/composant/fonction.js";
