
//Βάζουμε πορτοκαλί χρώμα στο όνομα της εκάστοτε σελίδας στο navbar, ώστε να φαίνεται σε ποιά σελίδα βρισκόμαστε
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("colorSignIn").style.color = "#FF6700";
});

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


const form = document.getElementById('form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  //Με selectors βρίσκουμε τα inputs και παίρνουμε τις τιμές τους.Ελέγχουμε αν είναι valid και
  // κάνουμε το POST request για να κάνουμε την συνδεση του χρήστη
  let email = document.getElementById('email')
  let password = document.getElementById('password');

  let data = {
    email: email.value,
    password: password.value
  }
  if (email.validity.valid && password.validity.valid) {

    fetch('/signin', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((res) => {
      res.json().then((data) => {
        if (data.status == 'wrongEmail') { //Ανάλογα με την τιμή του status κάνουμε alert το κατάλληλο μήνυμα
          alert('Το email που εισάγατε  είναι λάθος');

          return false
        } else if (data.status == 'wrongPassword') {
          alert('Ο κωδικός που εισάγατε είναι λάθος');

          return false
        } else if (data.status == 'notactivated') {

          window.location = '/waitingVer' //Αν ο χρήστης δεν έχει ενεργοποιήσει ακόμα τον λογαριασμό του κάνουμε ανακατεύθυνση στη σελίδα αναμονής waitingVer

        } else {
          window.location = '/'

        }
        //Σε περίπτωση κάποιου σφάλματος από error ή σε περίπτωση που το email ή ο κωδικός είναι λάθος τυπώνουμε το κατάλληλο μήνυμα 
      })
    });

  }
});

//Λειτουργικότητα κουμπιού εξόδου απο mobile navbar
const closebutton = document.getElementById('closebutton');
closebutton.addEventListener('click', closeNav);

const hidebuttons = document.getElementById('hide');

hidebuttons.addEventListener('click', () => {
  var x = document.getElementById('password');
  if (x.type === 'password') {
    x.type = 'text';
  } else {
    x.type = 'password';
  }

})


//Επιλέγουμε τον σύνδεσμο ξέχασα τον κωδικό μου και κάνουμε ένα post request ώστε να στείλουμε το email του χρήστη στον server
const remindPass = document.querySelector('.final a');
remindPass.addEventListener('click', async (event) => {
  event.preventDefault();
  let email = document.getElementById('email')
  let data = {
    email: email.value
  }
  if (email.validity.valid) {

    fetch('/remindPass', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((res) => {
      res.json().then((data) => {
        if (data.status == 'success') {

          alert('Σας έχουμε αποστείλει τον καινούργιο σας κωδικό στο email')

        } else if (data.status == 'NoEntries') {


          alert('Δεν υπάρχει εγγεγραμένος χρήστης με αυτό το email')


        } else {

          alert('Κάτι πήγε λάθος παρακαλώ προσπαθήστε ξανά')

        }

      })
    });

  } else {
    alert('Παρακαλώ εισάγετε σωστά το email')
  }

})

