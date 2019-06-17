


$(document).ready(function() {

	//Firebase link

    var firebaseConfig = {
        apiKey: "AIzaSyAEX6V-QXzkpd7a9Nn3vyx8-InIBxXCut0",
        authDomain: "train-schedule-98141.firebaseapp.com",
        databaseURL: "https://train-schedule-98141.firebaseio.com",
        projectId: "train-schedule-98141",
        storageBucket: "train-schedule-98141.appspot.com",
        messagingSenderId: "588855060703",
        appId: "1:588855060703:web:980c02db47a6e3e4"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
	var database = firebase.database();

	//collect input from the submit button and store it in specific variables
	$(".submitInput").on("click", function (event) {

			var nameInput = $("#nameInput").val().trim();
             console.log("name"+nameInput);
			var numberInput = $("#numberInput").val().trim();
             console.log("num"+numberInput);
			var destinationInput = $("#destInput").val().trim();

			var timeInput = $("#timeInput").val().trim();

			var frequencyInput = $("#freqInput").val().trim();

		
					//use the collected input and store it to firebase db
					database.ref().push({
						Train_Name: nameInput,
						Train_number: numberInput,
						destination: destinationInput,
						time: timeInput,
						frequency: frequencyInput,
					});


			//console.log(database);

			$("input").val("");

	});

	database.ref().on("child_added", function (childSnapshot) {
		// console.log(childSnapshot.val());

		var name = childSnapshot.val().Train_Name;
		var number = childSnapshot.val().Train_number;
		var destination = childSnapshot.val().	destination;
		var time = childSnapshot.val().time;
		var frequency = childSnapshot.val().frequency;

		// console.log(name, number, destination, time, frequency);

		//time formatting
		
		var frequency = parseInt(frequency);
		var currentTime = moment();

		//console.log("Current time: " + moment().format("HHmm"));

		
	
		
		var dateConvert = moment(childSnapshot.val().time, "HHmm").subtract(1, "years");

		//console.log("DATE CONVERTED: " + dateConvert);

		var trainTime = moment(dateConvert).format("HHmm");

		//console.log("Train time : " + trainTime);

		//difference bw the times
		var timeConvert = moment(trainTime, "HHmm").subtract(1, "years");
		var timeDifference = moment().diff(moment(timeConvert), "minutes");

		//console.log("Difference in time: " + timeDifference);

		//remainder
		var timeRemaining = timeDifference % frequency;

		//console.log("Time remaining: " + timeRemaining);

		//time until next train
		var timeAway = frequency - timeRemaining;

		//console.log("Minutes until next train: " + timeAway);

		//next train arrival
		var nextArrival = moment().add(timeAway, "minutes");


		//console.log("Arrival time: " + moment(nextArrival).format("HHmmA"));

		var arrivalDisplay = moment(nextArrival).format("HH:mmA");

	//append data to table
	$("#boardText").append(
		"<tr><td id='nameDisplay'>" + childSnapshot.val().Train_Name+ 
		"<td id='numberDisplay'>" + childSnapshot.val().Train_number + 
		"<td id='destinationDisplay'>" + childSnapshot.val().destination + 
		"<td id='frequencyDisplay'>" + childSnapshot.val().frequency +
		"<td id='arrivalDisplay'>" + arrivalDisplay + 
		"<td id='awayDisplay'>" + timeAway + " minutes until arrival" + "</td></tr>");

		// console.log(arrivalDisplay);
		// console.log(timeAway);
	});

	//reset functionality
	$(".resetInput").on("click", function(event){
    	location.reload();
	});

	//auto refresh per 1 minute passed
	//updates the train data upon refresh
	setInterval("window.location.reload()", 600000);
});