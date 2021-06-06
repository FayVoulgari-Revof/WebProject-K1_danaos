
//Βάζουμε πορτοκαλί χρώμα στο όνομα της εκάστοτε σελίδας στο navbar, ώστε να φαίνεται σε ποιά σελίδα βρισκόμαστε
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("colorSub").style.color = "#FF6700";
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


const buttonlist = document.querySelectorAll('.buy-now');
for (let i = 0; i < buttonlist.length; i++) {

  buttonlist[i].addEventListener('click', async (event) => {
    let id = buttonlist[i].id;

    window.location = `/subPayment/${id}` //Αν γίνει click η αγορά πήγαινε στην σελίδα /subPayment κρατώντας το id του κουμπιού ώστε να ξέρουμε ποιά συδρομή πατήθηκε

  });
}

