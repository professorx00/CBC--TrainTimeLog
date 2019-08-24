var firebaseConfig = {
    apiKey: "AIzaSyA77eFLbhqDysttRaxEYoLoDBr92TaxW-A",
    authDomain: "traintimelogger.firebaseapp.com",
    databaseURL: "https://traintimelogger.firebaseio.com",
    projectId: "traintimelogger",
    storageBucket: "traintimelogger.appspot.com",
    messagingSenderId: "158876298270",
    appId: "1:158876298270:web:2baf482592a7ccfd"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var trainData = firebase.database();

//document Variables:
docTrainInput = $("#inputTrainName");
docDestInput = $("#inputDest");
DocFreqInput = $("#inputFreq");
docTrainHour = $("#TrainHour");
docTrainMinutes = $("#TrainMinutes");
docAddTrain = $("#AddTrainBtn");
docForm = $("#Formie");
docTBody = $("#Tbody");
docUpdateName = $("#updateName");
docUpdateDest = $("#updateDestination");
docUpdateFreq = $("#updateFrequency");

//Global Variables
let trainName;
let trainStart;
let destination;
let frequency;
let nextArrival;
let minutesAway;
let trains = []

$("#logOut").on("click", e => {
    firebase.auth().signOut();
    window.location.href = "./index.html"
})

// On click Event of Button

docAddTrain.on("click", (event) => {

    event.preventDefault(); //prevent refresh
    //grab variables from form
    // Grabs user input
    let trainName = $("#inputTrainName").val().trim();
    let destination = $("#inputDest").val().trim();
    let frequency = $("#inputFreq").val().trim();
    let firstTrain = $("#firstTrain").val().trim()
    let key = trainName.replace(/[^a-zA-Z0-9]/g, '');
    trains.push(key)

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        update: true
    };
    console.log(newTrain)
    //push object to database in train table
    trainData.ref("trains").child(key).set(newTrain);
    // trainData.ref().push(newTrain);
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);

    // alert("Train successfully added");
    $('#myModal').modal();
    $('#myModal').modal('show');
    $("#close").on("click", e => {
        $('#myModal').modal('hide');
    })
    //resets form
    docForm[0].reset();
})

trainData.ref("/trains").on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    let tName = childSnapshot.val().name;
    let tDestination = childSnapshot.val().destination;
    let tFrequency = childSnapshot.val().frequency;
    let tFirstTrain = childSnapshot.val().firstTrain;
    console.log(childSnapshot.val())
    let timeArr = tFirstTrain.split(":");
    let trainTime = moment()
      .hours(timeArr[0])
      .minutes(timeArr[1]);
    let maxMoment = moment.max(moment(), trainTime);
    let tMinutes;
    let tArrival;
  
    // If the first train is later than the current time, sent arrival to the first train time
    if (maxMoment === trainTime) {
      tArrival = trainTime.format("hh:mm A");
      tMinutes = trainTime.diff(moment(), "minutes");
    } else {
      // Calculate the minutes until arrival using hardcore math
      // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
      // and find the modulus between the difference and the frequency.
      var differenceTimes = moment().diff(trainTime, "minutes");
      console.log(differenceTimes)
      var tRemainder = differenceTimes % tFrequency;
      tMinutes = tFrequency - tRemainder;
      // To calculate the arrival time, add the tMinutes to the current time
      tArrival = moment()
        .add(tMinutes, "m")
        .format("hh:mm A");
    }
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);
  
    // Add each train's data into the table
    let table = $("#train-table");
    let newRow = $("<tr>");
    newRow
        .append($("<td>").text(tName))
        .append($("<td>").text(tDestination))
        .append($("<td>").text(tFrequency))
        .append($("<td>").text(tArrival))
        .append($("<td>").text(tMinutes))
        .append($("<td>").append("<button>").text("R"))
        .append($("<td>").append("<button>").text("U"))
    table.append(newRow)
  });
//on child change update table
// database.ref('/trains').on("child_added", function (childSnapshot) {


//     // Updates current time at the top of the page
//     setInterval(() => {
//         let time = moment().format("MM/DD/YYYY hh:mm:ss A")
//         $("#time").text(time)
//     }, 1000)

//     function addNewRow(dbTrainStart, dbFrequency, dbTrainName, dbDestination) {

//         //create the table row with a id of Train
//         let NewRow = $("<tr>").append($("<td>").text(dbTrainName).attr("id", `${idName}Name`),
//             $("<td>").text(dbDestination).attr("id", `${idName}Dest`),
//             $("<td>").text(prettyTrainStart),
//             $("<td>").text(dbFrequency).attr("id", `${idName}freq`),
//             $("<td>").text(nextArrival).attr("id", `${idName}NextArrival`),
//             $("<td>").text(minutesAway).attr("id", `${idName}MinutesAway`),
//             $("<td>").append(btn), $("<td>").append(updateBtn)).attr("id", `${idName}Row`);
//         //Append to body
//         $("#Tbody").append(NewRow);
//     }

//     //Calculates the minutes Away and Arrival Time
//     function trainCaluationMinutes(dbTrainStart, dbFrequency) {
//         let ttime = moment(dbTrainStart, "X");
//         let difference = moment().diff(ttime, "minutes")
//         let remainder = difference % dbFrequency;
//         minutesAway = dbFrequency - remainder
//         nextArrival = moment().add(minutesAway, "m").format("hh:mm A");
//     }
    // function updateModal(train) {
    //     //sets the old information to the forms
    //     let startTime;//ONLY THING I AM NOT LETTING USER UPDATE
    //     firebase.database().ref('/trains/').once('value').then(function (snapshot) {
    //         let oldName = snapshot.val()[train]['name'];
    //         let oldDest = snapshot.val()[train]['destination'];
    //         let oldFreq = snapshot.val()[train]['frequency'];
    //         startTime = snapshot.val()[train]['trainStart'];
    //         docUpdateName.attr("value", oldName)
    //         docUpdateDest.attr("value", oldDest)
    //         docUpdateFreq.attr("value", oldFreq)
    //     });

    //     $('#updateModal').modal();
    //     $('#updaModal').modal('show');
    //     $("#updateTrainBtn").on("click", e => {
    //         e.preventDefault()
    //         let newName = docUpdateName.val().trim();
    //         let newFreq = docUpdateFreq.val().trim();
    //         let newDest = docUpdateDest.val().trim()

    //         targetTrain = $(e.target).attr("data-train");
    //         //Remove Special Characters
    //         TRName = targetTrain.replace(/[^a-zA-Z0-9]/g, '');
    //         //remove from Database
    //         database.ref("/trains").child(targetTrain).remove();
    //         //remove Row
    //         $(`#${TRName}Row`).remove();
    //         //Removes from train array
    //         Tindex = trains.indexOf(targetTrain);
    //         if (Tindex > -1) {
    //             trains.splice(Tindex, 1, newName);
    //         }
    //         //sets object to create new train in database
    //         var update = {
    //             name: newName,
    //             frequency: newFreq,
    //             destination: newDest,
    //             trainStart: startTime
    //         };

    //         database.ref(`/trains/${newName}`).set(update)


    //         $('#updateModal').modal('hide')
    //         clearInterval();
    //     })
    //     $("#updateClose").on("click", e => {
    //         $('#updateModal').modal('hide');
    //     })
    // }