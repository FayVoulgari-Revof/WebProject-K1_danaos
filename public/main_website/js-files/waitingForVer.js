
const emailSender=document.querySelector('.basic a');

emailSender.addEventListener('click', async (event)=>{
event.preventDefault();
    fetch('/confirmation',{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: emailSender.id})
        }).then((res) => { res.json().then((data)=>{

         
          window.location='/waitingVer'
        })});
});