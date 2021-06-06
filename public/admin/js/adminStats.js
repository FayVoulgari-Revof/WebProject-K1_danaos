
//Βάζουμε πορτοκαλί χρώμα στο όνομα της εκάστοτε σελίδας στο navbar, ώστε να φαίνεται σε ποιά σελίδα βρισκόμαστε
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("colorStats").style.color = "#FF6700";

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


  //Φέρνουμε τα δεδομένα που χρειαζόμαστε για το chart js
  fetch('/adminstats', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }).then((res) => {
    res.json().then((data) => { //Βάζουμε τα data σε πίνακες ώστε να μπορέσουμε να τα φορτώσουμε στο chart js

      let month = [];
      let count = [];
      for (let i = 0; i < data.data.length; i++) {
        month.push(data.data[i][0])
        count.push(parseInt(data.data[i][1]))

      }


      //Αρχικοποίηση διαγράμματος 'Νέες συνδρομές ανά μήνα'
      let mychart = document.getElementById('fistChart').getContext('2d');
      let popChart = new Chart(mychart, {
        type: 'bar',
        data: {
          labels: month,
          datasets: [{
            data: count,
            backgroundColor: '#FF6700'
            ,
            borderColor: 'rgba(255, 99, 132, 1)'
          }]

        },

        options: {
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              barPercentage: 0.4
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          },
          title: {
            display: true,
            text: 'Νέες συνδρομές ανά μήνα',
            fontSize: 20,
            fontColor: '#333'

          },
          legend: {
            display: false
          },

        }
      });

      //Βάζουμε τα data σε πίνακες ώστε να μπορέσουμε να τα φορτώσουμε στο chart js
      let eggrafes = [];
      let counteggrafes = [];
      for (let i = 0; i < data.eggrafes.length; i++) {
        eggrafes.push(data.eggrafes[i][0])
        counteggrafes.push(parseInt(data.eggrafes[i][1]))

      }


      //Αρχικοποίηση διαγράμματος 'Νέες εγγραφές ανά μήνα'
      let mychart1 = document.getElementById('secondChart').getContext('2d');

      let popChart1 = new Chart(mychart1, {
        type: 'bar',
        data: {
          labels: eggrafes,
          datasets: [{
            data: counteggrafes,
            backgroundColor: '#FF6700'
            ,
            borderColor: 'rgba(51, 3, 0, 1)'
          }]

        },

        options: {
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              barPercentage: 0.4
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          },
          title: {
            display: true,
            text: 'Νέες εγγραφές ανά μήνα',
            fontSize: 20,
            fontColor: '#333'


          },
          legend: {
            display: false
          },

        }
      });








    })
  });





});

