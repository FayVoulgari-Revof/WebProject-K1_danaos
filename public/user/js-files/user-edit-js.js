
//Βάζουμε πορτοκαλί χρώμα στο όνομα της εκάστοτε σελίδας στο navbar, ώστε να φαίνεται σε ποιά σελίδα βρισκόμαστε
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("colorEdit").style.color = "#FF6700";
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




const closebutton = document.getElementById('closebutton');
closebutton.addEventListener('click', closeNav);


//Έλεγχος validity
const password = document.getElementById("passwordnew");
const confirm_password = document.getElementById("passwordRepeat");
function validatePassword() {
  if (password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    confirm_password.setCustomValidity('');
  }
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;




//Παίρνουμε τα δεδομένα που έδωσε στο input ο χρήστης και κάνουμε ένα fetch για να τα στείλουμε στον server και να κάνει τα κατάλληλα update
const editButton = document.getElementById('editProfile');
editButton.addEventListener('click', async (event) => {
  event.preventDefault();

  let email = document.getElementById('newEmail')
  let phone = document.getElementById('newPhone');
  let password = document.getElementById('insertPass');

  let data = {
    email: email.value,
    phone: phone.value,
    password: password.value
  }
  if (phone.validity.valid && email.validity.valid && password.validity.valid) {
    fetch('/changePersonalData', {
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
        } else if (data.status == 'wrongPassword') {
          alert('Ο κωδικός που εισάγατε είναι λάθος');

          return false

        }
        else if (data.status == "success") {//Success σημαίνει ότι έχει αλλαχτεί το email
          alert('Επιτυχής αλλαγή στοιχείων');
          
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

        } else {
          alert('Επιτυχής αλλαγή στοιχείων');
          email.value= "";
          phone.value= "";
          password.value= "";

        }

        
     
      })
    });
  } else if (!phone.validity.valid) {
    alert('Το τηλέφωνο που εισάγατε είναι λάθος')

  } else if (!email.validity.valid) {
    alert('Το email που εισάγατε είναι λάθος')

  } else if (!password.validity.valid) {
    alert('Ο κωδικός που εισάγατε είναι λάθος')

  } password

});


//Παίρνουμε τους κωδικούς (παλιό και νέο) που έδωσε στο input ο χρήστης και κάνουμε ένα fetch για να τα στείλουμε στον server 
//να ελέγξει εάν ο παλιος κωδικός είναι σωστός και να κάνει τα κατάλληλα update
const changePassButton = document.getElementById('changePass');
changePassButton.addEventListener('click', async (event) => {
  event.preventDefault();

  let passwordnew = document.getElementById('passwordnew')
  let passwordRepeat = document.getElementById('passwordRepeat');
  let password = document.getElementById('password');

  let data = {
    passwordRepeat: passwordRepeat.value,
    passwordnew: passwordnew.value,
    password: password.value
  }
  if (passwordnew.validity.valid && passwordRepeat.validity.valid && password.validity.valid) {
    fetch('/changePassword', {
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
        } else if (data.status == 'wrongPassword') {
          alert('Ο κωδικός που εισάγατε είναι λάθος');

          return false

        }
        else {
          alert('Επιτυχής αλλαγή κωδικού');
          passwordnew.value = "";
          passwordRepeat.value = "";
          password.value = "";


        }


      })
    });
  } else {
    alert("Οι κωδικοί δεν ταιριάζουν")
  }

});


//Κουμπί για εμφάνιση ή απόκρυψη κωδικού
const hidebuttonsRepeat = document.getElementById('newPass');


hidebuttonsRepeat.addEventListener('click', () => {
  var x = document.getElementById('passwordnew');
  if (x.type === 'password') {
    x.type = 'text';
  } else {
    x.type = 'password';
  }

})

const hidebuttons = document.getElementById('newPassRpt');


hidebuttons.addEventListener('click', () => {
  var x = document.getElementById('passwordRepeat');
  if (x.type === 'password') {
    x.type = 'text';
  } else {
    x.type = 'password';
  }

})