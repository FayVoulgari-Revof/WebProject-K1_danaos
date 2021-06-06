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


const password = document.getElementById("password");
const confirm_password = document.getElementById("passwordRepeat");
// Συνάρτηση που ελέγχει εάν οι κωδικοί που καταχώρησε ο χρήστης στη φόρμα ταιριάζουν (Επιβεβαίωση κωδικού)
function validatePassword() {
  if (password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    confirm_password.setCustomValidity('');
  }
}

password.onchange = validatePassword; // καλεί την σύναρτηση validatePassword() 
confirm_password.onkeyup = validatePassword;

const form = document.getElementById('form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  //Με selectors βρίσκουμε τα inputs και παίρνουμε τις τιμές τους.Ελέγχουμε αν είναι valid και
  // κάνουμε το POST request για να στείλουμε τα περιεχόμενα των inputs στον server ώστε αφού γίνουν οι κατάλληλοι έλεγχοι
  // να καταχωρηθεί εγγραφή του χρήστη
  let email = document.getElementById('email')
  let password = document.getElementById('password');
  let confirm_password = document.getElementById('passwordRepeat');
  let name = document.getElementById('fname');
  let lastname = document.getElementById('lname');
  let phone = document.getElementById('phone');

  let data = {
    name: name.value,
    lastname: lastname.value,
    email: email.value,
    phone: phone.value,
    password: password.value
  }
  if (phone.validity.valid && email.validity.valid && lastname.validity.valid && name.validity.valid && password.validity.valid && confirm_password.validity.valid) {

    fetch('/signup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((res) => {
      res.json().then((data) => {
        if (data.status == 'error') {
          alert('Ουπς, κάτι πήγε λάθος...');

          return false
        }
        else if (data.status == 'emailExists') {
          alert('Υπάρχει ήδη χρήστης με αυτή την διεύθυνση email');

          return false
        } else {

          fetch('/confirmation', { //Κάνω ένα νέο Post request στην περίπτωση που ολοκληρωθεί η εγγραφή επιτυχώς ώστε να σταλεί το email cofirmation
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email.value })
          }).then((res) => {
            res.json().then((data) => {
              window.location = '/waitingVer'
            })
          })
        }
        //Σε περίπτωση κάποιου σφάλματος από error ή σε περίπτωση που το email υπάρχει ήδη τυπώνουμε το κατάλληλο μήνυμα 

      })
    });

  }
});

const closebutton = document.getElementById('closebutton');
closebutton.addEventListener('click', closeNav);


//Κουμπιά για εμφάνιση ή απόκρυψη κωδικού 
const hidebuttonsRepeat = document.getElementById('hideRepeat');


hidebuttonsRepeat.addEventListener('click', () => {
  var x = document.getElementById('passwordRepeat');
  if (x.type === 'password') {
    x.type = 'text';
  } else {
    x.type = 'password';
  }

})

const hidebuttons = document.getElementById('hidePass');


hidebuttons.addEventListener('click', () => {
  var x = document.getElementById('password');
  if (x.type === 'password') {
    x.type = 'text';
  } else {
    x.type = 'password';
  }

})