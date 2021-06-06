
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("colorProgram").style.color = "#FF6700";//Βάζουμε πορτοκαλί χρώμα στο όνομα της εκάστοτε σελίδας στο navbar, ώστε να φαίνεται σε ποιά σελίδα βρισκόμαστε

 
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



  //Οταν φορτώνεται η σελίδα ελεγχουμε αν υπάρχουν checkboxes (αν υπάρχουν το length θα είναι μεγαλύτερο απο 0)
  //ελέγχουμε δηλαδή εάν ο χρήστης είναι συνδεδεμένος ή οχι.
  const checkboxes = document.querySelectorAll('input[type=checkbox]');

  if (checkboxes.length != 0) {
    //Άμα είμαστε  authenticated  ελέγχουμε όλα τα checkboxes και κάνουμε display μόνο τα τμήματα που είναι εγγεγραμένος ο χρήστης
    let checkedClasses = ["cross", "bodypump", "zumba", "pilates", "hipsabs", "trx", "kickKids", "kickPro"];


    var x;
    for (x = 0; x < checkedClasses.length; x++) {
      var checkBox = document.getElementById(`${checkedClasses[x]}`); //όλα τα checkboxes 
      var programChecked, i;
      programChecked = document.querySelectorAll(`.${checkedClasses[x]}`); //όλα τα <p>
      // Aν το checkbox είναι checked τότε εμφάνισε το αντίστοιχο πρόγραμμα
      if (checkBox.checked == true) {  


        for (i = 0; i < programChecked.length; i++) {

          programChecked[i].style.display = "block";
        }

      }
      else {

        for (i = 0; i < programChecked.length; i++) {
          programChecked[i].style.display = "none";
        }
      }

    }


  }



});



//Event listeners ώστε να διαγράφεται ή να εισάγεται στη βάση το πλάνο εκγύμνασης αναλόγως αν μετά το click το checkbox ειναι checked ή οχι
const checkboxes = document.querySelectorAll('input[type=checkbox]');
for (let i = 0; i < checkboxes.length; i++) {

  checkboxes[i].addEventListener('click', async (event) => {
    let checkedClasses = ["cross", "bodypump", "zumba", "pilates", "hipsabs", "trx", "kickKids", "kickPro"];

    if (event.target.checked == true) {   //αν μετά το click το checkbox ειναι checked κάνω addPlano
      await fetch('/addPlano', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plano: event.target.id })
      })
    } else {
      await fetch('/removePlano', {   //αν μετά το click το checkbox δεν ειναι checked κάνω removePlano
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plano: event.target.id })
      })
    }

    var x;
    for (x = 0; x < checkedClasses.length; x++) {
      var checkBox = document.getElementById(`${checkedClasses[x]}`);
      var programChecked, i;
      programChecked = document.querySelectorAll(`.${checkedClasses[x]}`);
      // Aν το checkbox είναι checked τότε εμφάνισε το αντίστοιχο πρόγραμμα
      if (checkBox.checked == true) {


        for (i = 0; i < programChecked.length; i++) {

          programChecked[i].style.display = "block";
        }

      }
      else {

        for (i = 0; i < programChecked.length; i++) {
          programChecked[i].style.display = "none";
        }
      }

    }

  });


}
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
