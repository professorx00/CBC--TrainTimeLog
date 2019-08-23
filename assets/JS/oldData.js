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
var database = firebase.database();

// $("#logout").on("click",e=>{
//     console.log("logging out")
//     firebase.auth().signOut();
// })

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser);
    }
    else {
        console.log("not logged in")
    }

});

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
    trainName = docTrainInput.val().trim();
    trainStart = moment(docTrainHour.val() + docTrainMinutes.val(), 'HHmm').format("X");
    // console.log(trainStart)
    destination = docDestInput.val().trim();
    frequency = DocFreqInput.val().trim();
    // create JSON Object that has all the data needed to be stored in database
    let train = {
        name: trainName,
        destination: destination,
        frequency: frequency,
        trainStart: trainStart
    };

    //push object to database in train table
    database.ref("/trains").child(trainName).set(train);

    // alert("Train successfully added");
    $('#myModal').modal();
    $('#myModal').modal('show');
    $("#close").on("click", e => {
        $('#myModal').modal('hide');
    })
    //resets form
    docForm[0].reset();
})


//on child change update table
database.ref('/trains').on("child_added", function (childSnapshot) {

    //Set variables for table insertion
    let dbTrainName = childSnapshot.val().name;
    trains.push(dbTrainName);
    let dbDestination = childSnapshot.val().destination;
    let dbTrainStart = childSnapshot.val().trainStart;
    let dbFrequency = childSnapshot.val().frequency;
    // Sets the format of train Start so I can pass in Train Start for calculations in ISO format
    addNewRow(dbTrainStart, dbFrequency, dbTrainName, dbDestination);

    //Interval to update the arrival times 
    setInterval(() => {
        currentName = dbTrainName;
        //Loops through the Current Trains
        for (let t = 0; t < trains.length; t++) {
            //Checks if Train is the one I am currently on
            if (trains[t] == currentName) {
                let tidName = trains[t].replace(/[^a-zA-Z0-9]/g, '');

                trainCaluationMinutes(dbTrainStart, dbFrequency);
                // console.log(`the ${tidName} is ${minutesAway} and will Arrive ${nextArrival}`)
                $(`#${tidName}NextArrival`).text(nextArrival);
                $(`#${tidName}MinutesAway`).text(minutesAway);
            }
        }

    }, 2000);

});

// Updates current time at the top of the page
setInterval(() => {
    let time = moment().format("MM/DD/YYYY hh:mm:ss A")
    $("#time").text(time)
}, 1000)

function addNewRow(dbTrainStart, dbFrequency, dbTrainName, dbDestination) {
    let prettyTrainStart = moment.unix(dbTrainStart).format("hh:mm A");
    trainCaluationMinutes(dbTrainStart, dbFrequency);
    //Removes Extract the Space, Commas, Special Characters
    let idName = dbTrainName.replace(/[^a-zA-Z0-9]/g, '');
    // Adds Remove Button
    let btn = $("<button>").text('R')
        .addClass("btn btn-info removeBtn")
        .attr("data-train", `${dbTrainName}`)
        .on("click", e => {
            //function for click event
            e.preventDefault();
            //grabs Train Information
            targetTrain = $(e.target).attr("data-train");
            //Remove Special Characters
            TRName = targetTrain.replace(/[^a-zA-Z0-9]/g, '');
            //remove from Database
            database.ref("/trains").child(targetTrain).remove();
            //remove Row
            $(`#${TRName}Row`).remove();
            //Removes from train array
            Tindex = trains.indexOf(targetTrain);
            if (Tindex > -1) {
                trains.splice(Tindex, 1);
            }
        });
    let updateBtn = $("<button>").text('U')
        .addClass("btn btn-info UpdateBtn")
        .attr("data-train", `${dbTrainName}`)
        .on("click", e => {
            //function for click event
            e.preventDefault();
            $("#updateTrainBtn").attr("data-train", `${dbTrainName}`)
            //grabs Train Information
            targetTrain = $(e.target).attr("data-train");
            //Remove Special Characters
            console.log(targetTrain)
            TRName = targetTrain.replace(/[^a-zA-Z0-9]/g, '');
            updateModal(targetTrain);
            //changes Train name in train array
            Tindex = trains.indexOf(targetTrain);
            if (Tindex > -1) {
                // console.log(trains[Tindex])
            }
        });
    //create the table row with a id of Train
    let NewRow = $("<tr>").append($("<td>").text(dbTrainName).attr("id", `${idName}Name`), 
    $("<td>").text(dbDestination).attr("id", `${idName}Dest`), 
    $("<td>").text(prettyTrainStart), 
    $("<td>").text(dbFrequency).attr("id", `${idName}freq`), 
    $("<td>").text(nextArrival).attr("id", `${idName}NextArrival`), 
    $("<td>").text(minutesAway).attr("id", `${idName}MinutesAway`), 
    $("<td>").append(btn), $("<td>").append(updateBtn)).attr("id", `${idName}Row`);
    //Append to body
    $("#Tbody").append(NewRow);
}

//Calculates the minutes Away and Arrival Time
function trainCaluationMinutes(dbTrainStart, dbFrequency) {
    let minutesDiff = moment().diff(moment(dbTrainStart, "X"), "minutes");
    if (moment() < moment(dbTrainStart, "X")) {
        minutesAway = (minutesDiff * -1) + 1;
        nextArrival = moment().add(minutesAway, 'm').format("hh:mm A");
    }
    else {
        minutesAway = parseInt(dbFrequency) - (minutesDiff % parseInt(dbFrequency));
        nextArrival = moment().add(minutesAway, 'm').format("hh:mm A");
    }
}
function updateModal(train) {
    let oldName;
    let oldDest;
    let oldFreq;
    let startTime;
    firebase.database().ref('/trains/').once('value').then(function (snapshot) {
        oldName = snapshot.val()[train]['name'];
        oldDest = snapshot.val()[train]['destination'];
        oldFreq = snapshot.val()[train]['frequency'];
        startTime = snapshot.val()[train]['trainStart'];
        docUpdateName.attr("value", oldName)
        docUpdateDest.attr("value", oldDest)
        docUpdateFreq.attr("value", oldFreq)
        console.log(startTime);
    });

    $('#updateModal').modal();
    $('#updaModal').modal('show');
    $("#updateTrainBtn").on("click", e => {
        e.preventDefault()
        console.log(e)
        let nameRoot = `/trains/${train}`;
        let newName = docUpdateName.val().trim();
        let newFreq = docUpdateFreq.val().trim();
        let newDest = docUpdateDest.val().trim()

        // //grabs Train Information
        targetTrain = $(e.target).attr("data-train");
        //Remove Special Characters
        TRName = targetTrain.replace(/[^a-zA-Z0-9]/g, '');
        //remove from Database
        database.ref("/trains").child(targetTrain).remove();
        //remove Row
        $(`#${TRName}Row`).remove();
        //Removes from train array
        Tindex = trains.indexOf(targetTrain);
        if (Tindex > -1) {
            trains.splice(Tindex, 1, newName);
        }

        var update = {
            name: newName,
            frequency: newFreq,
            destination: newDest,
            trainStart: startTime
        };

        database.ref(`/trains/${newName}`).set(update)


        $('#updateModal').modal('hide')

    })
    $("#updateClose").on("click", e => {
        $('#updateModal').modal('hide');
    })
}