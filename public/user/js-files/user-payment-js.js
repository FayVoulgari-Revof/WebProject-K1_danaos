
//Βάζουμε πορτοκαλί χρώμα στο όνομα της εκάστοτε σελίδας στο navbar, ώστε να φαίνεται σε ποιά σελίδα βρισκόμαστε
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("colorSub").style.color = "#FF6700";
  });
  
  var today = new Date().toISOString().split('T')[0];//Δεν επιτρέπουμε να ορίζεται ως αρχή της συνδομής ημερομηνία νωρίτερα απο την ημέρα αγοράς
document.getElementById("startSub").setAttribute('min', today);
document.getElementById("startSub").value= today;

  const toggleButton=document.getElementById('toggleButton') 
          const navlist=document.getElementById('navilist')
          //Προβολή του mobile menu myNav όταν πατιέται το toggleButton
          toggleButton.addEventListener('click', () => {
              document.getElementById("myNav").style.width = "100%";
          });
          //Απόκρυψη του mobile menu myNav όταν γίνεται click στο toggleButton ενώ το menu είναι ήδη ανοιχτό
          function closeNav() {
            document.getElementById("myNav").style.width = "0%";
          }
          //Αν προβάλουμε το navbar του mobile menu και κάνουμε resize την οθόνη ώστε να ξεπεράσει τα 950px τότε αυτόματα κλείνει το mobile-navbar και εμφανίζεται το κανονικό.
          window.addEventListener("resize", function() {
          if (window.matchMedia("(min-width: 950px)").matches) {
            if( document.getElementById("myNav").style.width=="100%"){
              closeNav() ;
           }
         } 
      })
      
  
  
  
  const closebutton=document.getElementById('closebutton');
  closebutton.addEventListener('click',closeNav);
    

  //Paypal
  let totalValue=document.querySelector('#price strong').innerHTML;
  console.log(totalValue);
  totalValue=parseInt(totalValue.replace(/[€]/g, ""));
  console.log(totalValue)
    
  paypal.Buttons({
      style: {
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          label: 'paypal',
          
      },
      createOrder: function(data, actions) {
          return actions.order.create({
              purchase_units: [{
                  amount: {
                      value: totalValue
                  }
              }]
          });
      },
      onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
          
            let date=document.getElementById('startSub').value; // Η ημερομηνία που επέλεξε ο χρήστης για έναρξη της συνδρομής
            let id=  document.querySelector('.syndromi').innerHTML ;//Εδώ παίρνω το όνομα της συνδρομής
            let code=  document.querySelector('.syndromi').id ;//Εδώ παίρνω το code_syndromis της συνδρομής
        
            
            fetch('/addSyndromi',{
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({date: date,
                                    id: id,
                                  code: code})
              }).then((res) => { res.json().then((data)=>{
                 if(data.status=='error'){
                  alert('Oups κατι πήγε λάθος'); 
                  
                  return false
                }else{
                  alert('Transaction completed by ' + details.payer.name.given_name + '!');
                  window.location = '/'
            
                }
              })});
            
              
          });
      }
  }).render('#paypal-button-container');
  