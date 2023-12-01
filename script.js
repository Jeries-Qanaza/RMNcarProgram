var date = new Date();
var dayOfWeek = date.getDay();
var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var currentDay = dayNames[dayOfWeek];
var formattedDate = date.toLocaleDateString('en-GB');

let isCarOccupied = false;


document.addEventListener('DOMContentLoaded', function () {
  const startTimeButton = document.getElementById('startTimeButton');
  const stopTimeButton = document.getElementById('stopTimeButton');
  const busyDiv = document.getElementById('busyNote');

  // Function to update the button status based on car occupancy
  function updateButtonStatus() {
    fetch('/car-status')
      .then(response => response.json())
      .then(data => {
        if (data.isOccupied) {
          startTimeButton.style.display = 'none';
          busyDiv.style.display = 'block';
          document.getElementById("car").disabled = true;
          document.getElementById("placeInp").disabled = true;
        } else {
          startTimeButton.style.background = ''; // Reset background color
        }
      })
      .catch(error => {
        console.error('Error fetching car status:', error);
      });
  }

  // Function to send a POST request to update isCarOccupied
  function sendUpdateToServer(isOccupied) {
    fetch('/update-car-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isOccupied }),
    })
      .then(response => response.text())
      .then(message => {
        console.log(message);
      })
      .catch(error => {
        console.error('Error updating car status:', error);
      });
  }

  // Call the updateButtonStatus function initially to set the button status on page load
  updateButtonStatus();

  // Optionally, you can set up a timer to periodically update the status
  setInterval(updateButtonStatus, 5000);

  startTimeButton.addEventListener('click', function () {
    if (document.getElementById("placeInp").value == "") {
      alert("Place data error!");
      document.getElementById("placeInp").style.background = "red";
    } else {
      document.getElementById('placeInp').style.background = 'linear-gradient(to right, white, lightblue)';
      sendUpdateToServer(true); // Send a POST request to update isCarOccupied to true
      startTime();
    }
  });

  stopTimeButton.addEventListener('click', function () {
    sendUpdateToServer(false); // Send a POST request to update isCarOccupied to false
    stopTime();
  });

  // Rest of your existing code...
});


let startTimeCounting;
function startTime() {
  isCarOccupied = true;

  if (document.getElementById("placeInp").value == "")
  {
    alert("Place data error!");
    document.getElementById("placeInp").style.background = "red";
  }
  else
  {
    startTimeCounting=date.toLocaleTimeString();
    document.getElementById('placeInp').style.background = 'linear-gradient(to right, white, lightblue)';
    document.getElementById('startTimeButton').style.display = 'none';
    document.getElementById('stopTimeButton').style.display = 'inline';
  }
}

function stopTime()
{
  isCarOccupied = false;

  // Remove the stored start time from localStorage
  localStorage.removeItem('startTimeStamp');

  var dateElement = document.querySelector('#done #date');
  var dayElement = document.querySelector('#done #day');
  var startTimeElement = document.querySelector('#done #startTime');
  var endTimeElement = document.querySelector('#done #endTime');
  var doneNameElement = document.querySelector('#done #name');
  var placeElement = document.querySelector('#done #place');
  date = new Date();
  let sendDate = dateElement.textContent = formattedDate;
  let sendDay = dayElement.textContent = currentDay;
  let sendStartTime = startTimeElement.textContent=startTimeCounting;
  let sendEndTime = endTimeElement.textContent = date.toLocaleTimeString();
  let sendName = doneNameElement.textContent = document.getElementById('car').value;
  let sendPlace = placeElement.textContent = document.getElementById("placeInp").value;
  
  fillForm(sendName, sendDay, sendDate, sendPlace, sendStartTime, sendEndTime);

  document.getElementById('done').style.display = 'block';
  document.getElementById('startTimeButton').style.display = 'none';
  document.getElementById('stopTimeButton').style.display = 'none';
  document.getElementById('submitBtn').style.display = 'block';
}

function fillForm(sendName, sendDay, sendDate, sendPlace, sendStartTime, sendEndTime)
{
  document.getElementById("formDate").value = sendDate;
  document.getElementById("formDay").value = sendDay;
  document.getElementById("formStartTime").value = sendStartTime;
  document.getElementById("formEndTime").value = sendEndTime;
  document.getElementById("formName").value = sendName;
  document.getElementById("formPlace").value = sendPlace;
}


