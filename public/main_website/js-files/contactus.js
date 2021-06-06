

//Βάζουμε πορτοκαλί χρώμα στο όνομα της εκάστοτε σελίδας στο navbar, ώστε να φαίνεται σε ποιά σελίδα βρισκόμαστε
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("colorContactus").style.color = "#FF6700";
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
});



const contactForm = document.querySelector('.cform');

contactForm.addEventListener('submit', (async (e) => {
  e.preventDefault(); //Για να μην κάνει refresh

  let name1 = document.getElementById("name");
  let email = document.getElementById("email");
  let message = document.getElementById("message");

  let formData = {
    username: name1.value,
    email: email.value,
    message: message.value
  }



  fetch('/sendemail', { //Προωθεί στον server τα στοιχεία που καταχώρησε ο χρήστης για να αποστείλει το email
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  }).then((res) => {
    res.json().then((data) => {

      if (data.status == 'success') {
        alert('To email στάλθηκε. Θα επικοινωνήσουμε σύντομα μαζί σας!');
        document.getElementById("name").value = "";
        email = document.getElementById("email").value = "";
        document.getElementById("message").value = "";


      }
      else {
        alert('Ουπς, κάτι πήγε λάθος...');
      }

    })
  });


}));
const closebutton = document.getElementById('closebutton');
closebutton.addEventListener('click', closeNav);