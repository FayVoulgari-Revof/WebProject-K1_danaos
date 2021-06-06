

//Βάζουμε πορτοκαλί χρώμα στο όνομα της εκάστοτε σελίδας στο navbar, ώστε να φαίνεται σε ποιά σελίδα βρισκόμαστε
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("colorAbout").style.color = "#FF6700";
});

// Στο εξωτερικό αρχείο photos.js περιέχεται ένας πίνακας πινάκων δύο στοιχείων,
// το πρώτο από τα οποία είναι μια περιγραφή της εκάστοτε φωτογραφίας
// και το δεύτερο ένα σχετικό URL μιας φωτογραφίας.

import { photos } from "/main_website/js-files/photos.js"

const closebutton = document.getElementById('closebutton');
closebutton.addEventListener('click', closeNav);
//Ελέγχουμε αν ο χρήστης είναι authenticated ώστε να φορτώσουμε το σωστό navbar

const toggleButton = document.getElementById('toggleButton')
const navlist = document.getElementById('navilist')
//Προβολή του mobile menu myNav όταν πατιέται το toggleButton
toggleButton.addEventListener('click', () => {
  document.getElementById("myNav").style.width = "100%";
});


//Απόκρυψη του mobile menu myNav όταν γίνεται click στο toggleButton ενώ το menu είναι ήδη ανοιχτό
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

//Αν προβάλουμε το navbar του mobile menu και κάνουμε resize την οθόνη ώστε να ξεπεράσει τα 950px τότε αυτόματα κλείνει το mobile-navbar και εμφανίζεται το κανονικό.
window.addEventListener("resize", function () {
  if (window.matchMedia("(min-width: 950px)").matches) {
    if (document.getElementById("myNav").style.width == "100%") {
      closeNav();
    }
  }
})


// Όταν φορτώνει η εφαρμογή, η επιλεγμένη μικρογραφία είναι η 1η στον πίνακα thumbs.
// Κάθε μικρογραφία μπορεί να κλικαριστεί. Όταν γίνεται αυτό θα εκτελείται η συνάρτηση imgActivate() 
// Η συνάρτηση, που καλείται όταν γίνει κλικ σε μια από τις εικόνες του πίνακα thumbs, έχει σαν όρισμα ένα event object.
// Η συνάρτηση:
// - εμφανίζει στην περιοχή panel-main τη μικρογραφία που μόλις πατήθηκε
// - φροντίζει ώστε μόνο η μικρογραφία που μόλις πατήθηκε να έχει διαφάνεια 50%

function imgActivate(e) {
  //Βαζω την καινούργια φωτογραφία στο panel main χρησιμοποιώντας το target
  var node = document.querySelector(".panel-main");
  var temp = e.target.getAttribute('src');
  node.innerHTML = '';
  var elem = document.createElement("img");
  elem.setAttribute("src", `${temp}`);
  elem.setAttribute("alt", "Oops! Something Went Wrong");
  elem.id = "selected";
  //βρίσκω από την αρχική λίστα την περιγραφή της φωτογραφίας που επιλέχθηκε
  for (let i = 0; i < photos.length; i++) {
    if (temp == photos[i][1]) {
      var tooltip = photos[i][0];
      break;
    }
  }
  elem.setAttribute("title", `${tooltip}`);
  node.appendChild(elem);
  //κανω την νέα φωτογραφία active και κανω inactive την προηγούμενη
  var tempnode = document.querySelector(".activeThumb");
  tempnode.removeAttribute("class");
  e.target.className = "activeThumb";
  //προσθέτω την περιγραφή της νέας φωτογραφίας 
  var perigrafi = document.querySelector(".perigrafi");
  perigrafi.innerHTML = '';
  perigrafi.innerHTML = tooltip;



}

// Επιστρέφει τον πίνακα arr με τυχαία διάταξη στοιχείων
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}


function getImgIn(imgs) {
  //βάζω σε τυχαία σειρά τις φωτογραφίες
  shuffleArray(imgs);
  //βάζω όλες τις φωτογραφίες στο div μικρογραφίες και θέτω την πρώτη active
  for (let i = 0; i < imgs.length; i++) {
    var elem = document.createElement("img");
    var temp = imgs[i][1];
    elem.setAttribute("src", `${temp}`);
    elem.setAttribute("alt", "Oops! Something Went Wrong");
    elem.setAttribute("title", `${imgs[i][0]}`); //Μεσω του attribute title εμφανίζω πληροφορίες για την ενεργή φωτογραφία 
    if (i == 0) {
      elem.className = "activeThumb";
    }
    document.querySelector(".mikrografies").appendChild(elem);
  }
  //βάζω την πρώτη φωτογραφία στο panel main καθώς και την περιγραφή της
  var elem = document.createElement("img");
  var temp = imgs[0][1];
  elem.setAttribute("src", `${temp}`);
  elem.setAttribute("alt", "Oops! Something Went Wrong");
  elem.id = "selected";
  elem.setAttribute("title", `${imgs[0][0]}`);
  document.querySelector(".panel-main").appendChild(elem);
  var perigrafi = document.querySelector(".perigrafi");
  perigrafi.innerHTML = "";
  perigrafi.innerHTML = imgs[0][0];
}

getImgIn(photos);

//όταν γίνεται click σε κάποια μικρογραφία καλώ την συνάρτηση imgActivate
const thumbs = document.querySelectorAll(".mikrografies img");
thumbs.forEach((thumb) => {
  thumb.addEventListener('click', imgActivate);
});

//Κουμπί Τυχαία Φώτο
const randbutton = document.getElementById("random");
randbutton.addEventListener("click", () => {
  //χρησιμοποιω την ίδια λογική για να βρώ εναν τυχαίο αριθμό απο 0-15

  var j = Math.floor(Math.random() * photos.length);
  //βάζω στο panel main αυτην την φωτογραφία καθώς και την κανω active
  var node = document.querySelector(".panel-main");
  node.innerHTML = "";
  var rndphoto = photos[j][1];
  var imgrand = document.createElement("img");
  imgrand.setAttribute("src", `${rndphoto}`);
  imgrand.setAttribute("alt", "Oops! Something Went Wrong");
  imgrand.id = "selected";
  imgrand.setAttribute("title", `${photos[j][0]}`);//Μέσω του attribute title εμφανίζω πληροφορίες για την ενεργή φωτογραφία 
  node.appendChild(imgrand);

  //κανω inactive την προηγουμενη φωτογραφια που ηταν active
  var tempp = document.querySelector(".activeThumb");
  tempp.removeAttribute("class");

  const thumbsrand = document.querySelectorAll(".mikrografies img");
  thumbsrand.forEach((thumb) => {
    if (rndphoto == thumb.getAttribute("src")) {
      thumb.className = "activeThumb";
    }

  });
  //βαζω την νεα περιγραφη
  var perigrafi = document.querySelector(".perigrafi");
  perigrafi.innerHTML = "";
  perigrafi.innerHTML = photos[j][0];
});

//Κουμπί Επόμενη Φώτο
const nextbutton = document.getElementById("next");
nextbutton.addEventListener("click", () => {
  //βρισκω τις  μικρογραφίες και ποια απο αυτες ειναι  active
  var thumbsnext = document.querySelectorAll(".mikrografies img");
  var current = document.querySelector(".activeThumb");
  //ελεγχο με ποια ταιριαζει 
  for (let i = 0; i < thumbsnext.length; i++) {
    if (thumbsnext[i].getAttribute("src") == current.getAttribute("src")) {
      if (i < thumbsnext.length - 1) {
        var next = i + 1;
      }
      else {
        next = 0;
      }
      //κανω inactive την τωρινή και θέτω active την επόμενη μικρογραφία
      current.removeAttribute("class");
      thumbsnext[next].className = "activeThumb"
      //αλλάζω την περιγραφή στην νέα
      var perigrafi = document.querySelector(".perigrafi");
      perigrafi.innerHTML = "";
      var src = thumbsnext[next].getAttribute("src");
      for (let i = 0; i < photos.length; i++) {
        if (photos[i][1] == src) {
          perigrafi.innerHTML = photos[i][0];
          var tooltip = photos[i][0];
        }
      }
      //προσθέτω την εικόνα στο panel main
      var node = document.querySelector(".panel-main");
      node.innerHTML = "";
      var imgnext = document.createElement("img");
      imgnext.setAttribute("src", `${src}`);
      imgnext.setAttribute("alt", "Oops! Something Went Wrong");
      imgnext.id = "selected";
      imgnext.setAttribute("title", `${tooltip}`);//Μεσω του attribute title εμφανίζω πληροφορίες για την ενεργή φωτογραφία 
      node.appendChild(imgnext);
      break;
    }

  }
});





//Κουμπί Προηγούμενη Φώτο
const prevbutton = document.getElementById("previous");
prevbutton.addEventListener("click", () => {
  //βρίσκω τiς μικρογαφιες και ποιά απο αυτές ειναι active

  var thumbsprev = document.querySelectorAll(".mikrografies img");
  var current = document.querySelector(".activeThumb");

  for (let i = 0; i < thumbsprev.length; i++) {
    if (thumbsprev[i].getAttribute("src") == current.getAttribute("src")) {
      if (i > 0) {
        var prev = i - 1;
      }
      else {
        prev = thumbsprev.length - 1;
      }
      //κανω inactive την τωρινή και θέτω active την προηγούμενη μικρογραφια

      current.removeAttribute("class");
      thumbsprev[prev].className = "activeThumb"
      //αλλάζω την περιγραφή στην νέα

      var perigrafi = document.querySelector(".perigrafi");
      perigrafi.innerHTML = "";
      var src = thumbsprev[prev].getAttribute("src");
      for (let i = 0; i < photos.length; i++) {
        if (photos[i][1] == src) {
          perigrafi.innerHTML = photos[i][0];
          var tooltip = photos[i][0];
        }
      }
      //προσθέτω την εικόνα στο panel main
      var node = document.querySelector(".panel-main");
      node.innerHTML = "";
      var imgprev = document.createElement("img");
      imgprev.setAttribute("src", `${src}`);
      imgprev.setAttribute("alt", "Oops! Something Went Wrong");
      imgprev.id = "selected";
      imgprev.setAttribute("title", `${tooltip}`);
      node.appendChild(imgprev);
      break;
    }

  }
});

