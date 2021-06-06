
//Βάζουμε πορτοκαλί χρώμα στο όνομα της εκάστοτε σελίδας στο navbar, ώστε να φαίνεται σε ποιά σελίδα βρισκόμαστε
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("colorUserList").style.color = "#FF6700";
});

const toggleButton = document.getElementById('toggleButton');
const navlist = document.getElementById('navilist');
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
const closebutton = document.getElementById('closebutton');
closebutton.addEventListener('click', closeNav);

//Επιλογή κουμπιού για επιστροφή στην κορυφή:
const mybutton = document.getElementById("topBtn");

// Όταν ο χρήστης κάνει scroll down 300px απο την κορυφή , το κουμπί εμφανίζεται
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// Όταν ο χρήστης πατάει πάνω στο κουμπί επιστρέφει στην κορυφή

topBtn.addEventListener('click', () => {
  document.body.scrollTop = 0; //Safari
  document.documentElement.scrollTop = 0; // Chrome, Firefox and Opera
});
