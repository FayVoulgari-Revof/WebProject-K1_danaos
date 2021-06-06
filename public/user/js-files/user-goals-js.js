
//Βάζουμε πορτοκαλί χρώμα στο όνομα της εκάστοτε σελίδας στο navbar, ώστε να φαίνεται σε ποιά σελίδα βρισκόμαστε
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("colorGoals").style.color = "#FF6700";
});


const closebutton = document.getElementById('closebutton');
closebutton.addEventListener('click', closeNav);
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


//Φόρτωση των ήδη καταχωρημένων workout του χρήστη στο ημερολόγιο 
document.addEventListener('DOMContentLoaded', function () {
  //Παίρνουμε όλα τα workouts από την βάση
  fetch('/getworkout', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }).then((res) => {
    res.json().then((data) => {
      //Τα κάνουμε Date objects και κάλουμε την συνάρητηση getTime για να μπορούμε να τα συγκρίνουμε με τα objects απο τα fullCallendar 
      var dates = [];
      for (let i = 0; i < data.length; i++) {
        let date = new Date(data[i].day.substring(0, data[i].day.lastIndexOf("T")));

        date.setHours(0, 0, 0, 0);
        dates.push(date.getTime());

      }

      var calendarEl = document.getElementById('calendar');
      var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'title',
          center: '',
          right: 'prev,next'
        },
        themeSystem: 'bootstrap',
        dayCellDidMount: function (arg) {
          //Αμα το date υπάρχει στην βάση το κάνουμε κόκκινο
          if (dates.includes(arg.date.getTime())) {

            arg.el.classList.toggle('marked');

          }



        },
        dateClick: async function (info) {
          //Όταν κάνουμε click κάνουμε toggle την κλάση και κάνουμε την ημερομηνία σε format YYYY-MM--DD και αναλόγως αν είναι marked η όχι μετα απο το toggle 
          //κάνουμε είτε insert είτε delete

          info.dayEl.classList.toggle("marked");
          let month = '' + (info.date.getMonth() + 1);
          let day = '' + info.date.getDate();
          let year = info.date.getFullYear();

          if (month.length < 2)
            month = '0' + month;
          if (day.length < 2)
            day = '0' + day;
          let d = [year, month, day].join('-'); //Το φέρνω στο σωστό format


          if (info.dayEl.classList.contains('marked')) {
            await fetch('/addWorkout', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ date: d })
            }).catch((err) => { console.log(err) });
          } else {
            await fetch('/RemoveWorkout', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ date: d })
            }).catch((err) => { console.log(err) })
          }


        }
      });
      calendar.render();

    })
  });


  //Κάνουμε ένα fetch στον server ώστε να πάρουμε όλες τις καταγραφές βάρους του χρήστη που έχουν γίνει τον τελευταίο μήνα
  fetch('/getVarosProgress', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }).then((res) => {
    res.json().then((data) => {

      let kila = []; //αφού πάρουμε τις καταγραφές αρχικοποιούμε δύο πίνακες όπου περνάμε τα data που έχουμε
      let days = []
      for (let i = 0; i < data.length; i++) {


        kila.push(data[i].kila)
        days.push(data[i].day.substring(0, data[i].day.lastIndexOf("T")))
      }


      //Αρχικοποιούμε ένα line chart με τις καταγραφές του βάρους του user
      let mychart = document.getElementById('myChart').getContext('2d');
      let popChart = new Chart(mychart, {
        type: 'line',
        data: {
          labels: days,
          datasets: [{
            data: kila,
            backgroundColor: [
              '#ff6361'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)'
            ]
          }]


        },
        options: {
          responsive: true,
          maintainAspectRatio: false, //Για responsiveness
          title: {
            display: true,
            text: 'Πρόοδος σωματικού βάρους',
            fontSize: 20,
          },

          legend: {
            display: false
          },

        }
      });


    })
  });


});



let bmi = document.getElementById('calculateBMI');
bmi.addEventListener('click', calcBMI);

//Συνάρτηση υπολογισμού BMI
function calcBMI() {
  var weight = document.dataform.kg.value;
  let height = document.dataform.cm.value;
  document.dataform.bmi.value = Math.round((weight * 10000) / (height * height) * 10) / 10;
  let bmi = Math.round((weight * 10000) / (height * height) * 10) / 10;

  //Τύπωμα κατάστασης βάρους
  if (bmi < 18.5) {
    document.getElementById("weight_status").innerHTML = "Κατάσταση βάρους: Ελλιποβαρής";
  }
  else if (18.5 < bmi && bmi < 24.9) {
    document.getElementById("weight_status").innerHTML = "Κατάσταση βάρους: Φυσιολογικός";
  }
  else if (24.9 <= bmi && bmi < 34.9) {
    document.getElementById("weight_status").innerHTML = "Κατάσταση βάρους: Υπέρβαρος";
  }
  else {
    document.getElementById("weight_status").innerHTML = "Κατάσταση βάρους: Παχύσαρκος ";
  }
}

// Κάνουμε ενα fetch στον server ώστε να καταχωρήσουμε το βάρος και το ύψος που εισήγαγε ο χρήστης.
const button = document.getElementById('ipsos');
button.addEventListener('click', async (e) => {
  e.preventDefault();
  let ipsos = document.getElementById('cm');
  let varos = document.getElementById('kg');

  let data = {
    ipsos: ipsos.value,
    varos: varos.value
  }

  if (ipsos.validity.valid && varos.validity.valid) {

    await fetch('/personalData', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });





  }

});

//Κάνω ένα fetch στον server ώστε να καταχωρηθούν οι στόχοι που εισήγαγε ο χρήστης 
const goalsButton = document.getElementById('goalsButton');
goalsButton.addEventListener('click', async (e) => {
  e.preventDefault();
  let workouts_goals = document.getElementById('workouts_goals');
  let kg_goals = document.getElementById('kg_goals');

  let data = {
    workouts_goals: workouts_goals.value,
    kg_goals: kg_goals.value
  }

  if (kg_goals.validity.valid && workouts_goals.validity.valid) {

    await fetch('/workouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });





  }

});