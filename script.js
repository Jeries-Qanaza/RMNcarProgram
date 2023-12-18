var date = new Date();
var dayOfWeek = date.getDay();
var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var currentDay = dayNames[dayOfWeek];
var formattedDate = date.toLocaleDateString('en-GB');


//Booking anme / booking place ...
//finisg all about the strat button

let isCarOccupied = false;

let booking = {
  name:"",
  place:"",
  date:"",
  day:"",
  start:"",
  end:-1
}

document.addEventListener('DOMContentLoaded', function () {
  const startTimeButton = document.getElementById('startTimeButton');
  const stopTimeButton = document.getElementById('stopTimeButton');
  const submitButton = document.getElementById('submitBtn');
  const busyDiv = document.getElementById('busyNote');
  
  startTimeButton.addEventListener('click', function () { startTime(); });//add event listener

  stopTimeButton.addEventListener('click', function () { stopTime(); });//add event listener
  
  submitButton.addEventListener('click', function(){ submitFunc(); });//add event listener

  // Function to update the button status based on car occupancy
  function updateButtonStatus() {
    console.log("in update btn func");
    fetch('/car-status')
      .then(response => response.json())
      .then(data => {
        console.log("is car now busy : "+data.isOccupied);
        if (data.isOccupied) {
          console.log("now it is");
          busyUI(true);
        } else {
          busyUI(false);
        }
      })
      .catch(error => {
        console.error('Error fetching car status:', error);
      });
  }

  // Function to send a POST request to update isCarOccupied
  

  // Call the updateButtonStatus function initially to set the button status on page load

  // Optionally, you can set up a timer to periodically update the status
  setInterval(updateButtonStatus, 5000);

 

  // Rest of your existing code...



  let startTimeCounting;

  function startTime() 
  {
    if (document.getElementById("placeInp").value == "")
    {
      alert("Place data error!");
      document.getElementById("placeInp").style.background = "red";
    }
    else
    {
      console.log("Start:"); //print all data
      console.log(booking); //print all data
      get_user_input();
      startTimeCounting=date.toLocaleTimeString();
      document.getElementById('placeInp').style.background = 'linear-gradient(to right, white, lightblue)';
      document.getElementById('startTimeButton').style.display = 'none';
      document.getElementById('stopTimeButton').style.display = 'inline';
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
  localStorage.removeItem('startTimeStamp');
  fillForm();
  //sendUpdateToServer(); // Send a POST request to update isCarOccupied to false


  document.getElementById('form').style.display = 'block';
  document.getElementById('startTimeButton').style.display = 'none';
  document.getElementById('stopTimeButton').style.display = 'none';
  document.getElementById('submitBtn').style.display = 'block';
}


// Function to update the form with the values of a car object
function fillForm()
{
  document.getElementById("formName").value = booking.name
  document.getElementById("formPlace").value = booking.place;
  document.getElementById("formDate").value = booking.date;
  document.getElementById("formDay").value = booking.day;
  document.getElementById("formStartTime").value = booking.start;
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
  console.log("I have submitted");

  isCarOccupied = false;
  sendUpdateToServer()
}
  
});
