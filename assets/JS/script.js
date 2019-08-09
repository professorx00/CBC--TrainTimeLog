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

    event.preventDefault()//prevent refresh
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
    }
    //push object to database in train table
    database.ref("/trains").push(train);
    //alert User 
    //TODO: change to a module from bootstrap
    // alert("Train successfully added");

    $('#myModal').modal()
    $('#myModal').modal('show')
    console.log("Modal Work")
    $("#close").on("click", e => {
        console.log("close")
        $('#myModal').modal('hide');
    })
    docForm[0].reset();
})


//on child change update table
database.ref('/trains').on("child_added", function (childSnapshot) {

    //Set variables for table insertion
    let dbTrainName = childSnapshot.val().name;
    trains.push(dbTrainName)
    let dbDestination = childSnapshot.val().destination;
    let dbTrainStart = childSnapshot.val().trainStart;
    let dbFrequency = childSnapshot.val().frequency;

    let prettyTrainStart = moment.unix(dbTrainStart).format("hh:mm A");

    let minutesDiff = moment().diff(moment(dbTrainStart, "X"), "minutes");
    // console.log("minutesDiff is " + minutesDiff)
    minutesAway = parseInt(dbFrequency) - (minutesDiff % parseInt(dbFrequency));
    // console.log(minutesAway)
    nextArrival = moment().add(minutesAway, 'm').format("hh:mm A");

    let idName = dbTrainName.replace(/[^a-zA-Z0-9]/g, '');

    //create the table
    let NewRow = $("<tr>").append(
        $("<td>").text(dbTrainName),
        $("<td>").text(dbDestination),
        $("<td>").text(prettyTrainStart),
        $("<td>").text(dbFrequency),
        $("<td>").text(nextArrival).attr("id", `${idName}NextArrival`),
        $("<td>").text(minutesAway).attr("id", `${idName}MinutesAway`)
    );
    //Append to body
    $("#Tbody").append(NewRow)
    setInterval(() => {
        currentName = dbTrainName
        // console.log("Updating" + dbTrainName)
        for (let t = 0; t < trains.length; t++) {

            if (trains[t] == currentName) {
                let tidName = trains[t].replace(/[^a-zA-Z0-9]/g, '');

                let minutesDiff = moment().diff(moment(dbTrainStart, "X"), "minutes");
                minutesAway = parseInt(dbFrequency) - (minutesDiff % parseInt(dbFrequency));
                nextArrival = moment().add(minutesAway, 'm').format("hh:mm A");
                // console.log(`the ${tidName} is ${minutesAway} and will Arrive ${nextArrival}`)
                $(`#${tidName}NextArrival`).text(nextArrival);
                $(`#${tidName}MinutesAway`).text(minutesAway);
            }
        }

    }, 1000);

});

setInterval(() => {
    let time = moment().format("MM/DD/YYYY hh:mm:ss A")
    $("#time").text(time)
}, 1000)