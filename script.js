var date = new Date();
var dayOfWeek = date.getDay();
var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var currentDay = dayNames[dayOfWeek];
var formattedDate = date.toLocaleDateString('en-GB');

let isCarOccupied = false;

let booking = {
  userId:"",
  name:"",
  place:"",
  date:"",
  day:"",
  start:"",
  end:-1
}

let booking_info = booking;

document.addEventListener('DOMContentLoaded', async function () {
  resetBooking();
  booking.userId = localStorage.getItem('userId');

  const startTimeButton = document.getElementById('startTimeButton');
  const stopTimeButton = document.getElementById('stopTimeButton');
  const submitButton = document.getElementById('submitBtn');
  const busyDiv = document.getElementById('busyNote');
  
  const rmnlogo = document.getElementById('rmnlogo');
  rmnlogo.style.animationPlayState = 'paused';

  startTimeButton.addEventListener('click', function () { startTime(); });//add event listener

  stopTimeButton.addEventListener('click', function () { stopTime(); });//add event listener
  
  submitButton.addEventListener('click', function () { submitFunc(); });//add event listener
  
  setInterval(updateButtonStatus, 5000);
  
  function updateButtonStatus() {
    const loadingIcon = document.getElementById('loadingIcon');
    loadingIcon.style.display = 'block'; // Show loading icon
  
    return new Promise((resolve, reject) => {
      fetch('/car-status')
        .then(response => response.json())
        .then(data => {
          booking_info = data.booking_server_data;
          if (data.isOccupied) {
            busyUI(true);
          } else {
            busyUI(false);
          }
          loadingIcon.style.display = 'none'; // Hide loading icon
          resolve(); // Resolve the promise when the data is fetched
        })
        .catch(error => {
          console.error('Error fetching car status:', error);
          loadingIcon.style.display = 'none'; // Hide loading icon on error
          reject(error); // Reject the promise if an error occurs
        });
    });
  }

    await updateButtonStatus();

    // Function to send a POST request to update isCarOccupied
    if (booking.userId != null)
    {
      document.getElementById('startTimeButton').style.display = 'none';
      document.getElementById('stopTimeButton').style.display = 'block';
      //busyUI(true);
      document.getElementById("namesMenu").value = booking_info.name;///// I STOOPED HERE
      document.getElementById("placeInp").value=booking_info.place;
    }


  let startTimeCounting;

  function startTime() 
  {
   
    if (booking.userId === null) { //if no user id in storage, create one and save it to storage
      booking.userId = generateUserId();
      localStorage.setItem('userId', booking.userId);
    }

    if (document.getElementById("placeInp").value == "")
    {
      alert("Place data error!");
      document.getElementById("placeInp").style.background = "red";
    }
    else
    {
      get_user_input();
      startTimeCounting = date.toLocaleTimeString();
      document.getElementById('placeInp').style.background = 'linear-gradient(to right, white, lightblue)';
      document.getElementById('startTimeButton').style.display = 'none';
      document.getElementById('stopTimeButton').style.display = 'inline';
      rmnlogo.style.animationPlayState = 'running';
      isCarOccupied = true;
      sendUpdateToServer(); // Send a POST request to update isCarOccupied to false
    }
  }
  
  function sendUpdateToServer()
  {
    console.log("Sending update to server...");
    fetch('/update-car-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isCarOccupied, booking}),
    })
      .then(response => response.text())
      .then(message => {
        console.log(message);
      })
      .catch(error => {
        console.error('Error updating car status:', error);
      });
  }

  function stopTime()
  {
    isCarOccupied = false; //update value

      let date = new Date();
      booking.end = date.toLocaleTimeString();
      // Remove the stored start time from localStorage
  
      fillForm();
      //sendUpdateToServer(); // Send a POST request to update isCarOccupied to false
    
      document.getElementById('form').style.display = 'block';
      document.getElementById('startTimeButton').style.display = 'none';
      document.getElementById('stopTimeButton').style.display = 'block';
      document.getElementById('submitBtn').style.display = 'block';
      rmnlogo.style.animationPlayState = 'paused';

  }

  // Function to update the form with the values of a car object
  function fillForm()
  {
    document.getElementById("formName").value = booking_info.name
    document.getElementById("formPlace").value = booking_info.place;
    document.getElementById("formDate").value = booking_info.date;
    document.getElementById("formDay").value = booking_info.day;
    document.getElementById("formStartTime").value = booking_info.start;
    document.getElementById("formEndTime").value = booking.end;
  }

  // Function to get all user data from HTML
  function get_user_input()
  {
    let date = new Date();
    booking.name = document.getElementById("namesMenu").value;
    booking.place = document.getElementById("placeInp").value;
    booking.date = date.toLocaleDateString('en-GB');
    booking.day = currentDay;
    booking.start = date.toLocaleTimeString();
  }

  function busyUI(doDisable)
  {
    if (doDisable)
    {
      startTimeButton.style.display = 'none';
      busyDiv.style.display = 'block';
      busyDiv.innerHTML = "Car is busy with: "+booking_info.name;
    }
    else
    {
      startTimeButton.style.display = 'block';
      //startTimeButton.style.background = ''; // Reset background color
      busyDiv.style.display = 'none';
      }
    document.getElementById("namesMenu").disabled = doDisable;
    document.getElementById("placeInp").disabled = doDisable;
  }

  function submitFunc()
  {
    isCarOccupied = false;
    localStorage.removeItem('userId'); 
    resetBooking();
    sendUpdateToServer()
  }
    
  function generateUserId()
  {
    let rnd = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return  rnd
  }
  
  function resetBooking() {
    booking.userId = "";
    booking.name = "";
    booking.place = "";
    booking.date = "";
    booking.day = "";
    booking.start = "";
    booking.end = -1;
  }

});
