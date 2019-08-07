var firebaseConfig = {
    apiKey: "AIzaSyA77eFLbhqDysttRaxEYoLoDBr92TaxW-A",
    authDomain: "traintimelogger.firebaseapp.com",
    databaseURL: "https://traintimelogger.firebaseio.com",
    projectId: "traintimelogger",
    // storageBucket: "traintimelogger.appspot.com",
    messagingSenderId: "158876298270",
    appId: "1:158876298270:web:2baf482592a7ccfd"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();




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
let TodaysDate;
let counter = '0';



// On click Event of Button

docAddTrain.on("click",(event)=>{

    event.preventDefault()
    trainName = docTrainInput.val().trim();
    trainStart = moment(docTrainHour.val() + docTrainMinutes.val(), 'HHmm').toDate();
    destination = docDestInput.val().trim();
    frequency = DocFreqInput.val().trim();
    
    console.log(trainStart)

    let train = {
        Tnumber:counter,
        name:trainName,
        destination:destination,
        frequency:frequency,
        trainStart:trainStart
    }
    
    database.ref("/trains").push(train);
    
    alert("Employee successfully added");
    // console.log(trainName,destination,frequency);
    // console.log(`Start time is ${trainStart}`)
})

database.ref('/trains').on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
    let minutesDiff = moment().diff(childSnapshot.val().trainStart, "minutes");
    
    console.log("minute difference " + minutesDiff)
    console.log("train Start " + childSnapshot.val().trainStart)
    console.log("frequency "+ childSnapshot.val().frequency)

    minutesAway = parseInt(childSnapshot.val().frequency)-(minutesDiff % parseInt(childSnapshot.val().frequency));
    nextArrival=moment().add(minutesAway,'m').format("hh:mm A");
    
    console.log(minutesAway)
    let dbTrainName = childSnapshot.val().name;
    let dbTnumber = childSnapshot.val().Tnumber;
    let dbDestination = childSnapshot.val().destination;
    let dbTrainStart = childSnapshot.val().trainStart;
    let dbFrequency = childSnapshot.val().frequency;
    let dbNextArrival = nextArrival;
    let dbMinutesAway = minutesAway;

    console.log("number "+ dbTnumber)
    console.log("name "+ dbTrainName)
    console.log("Destination "+ dbDestination)
    console.log("Frequency "+ dbFrequency)
    console.log("Next Arrival "+ dbNextArrival)
    console.log("Minutes Away"+ dbMinutesAway)
    

    let NewRow = $("<tr>").append(
        $("<td>").text(dbTrainName),
        $("<td>").text(dbDestination),
        $("<td>").text(dbTrainStart),
        $("<td>").text(dbFrequency),
        $("<td>").text(dbNextArrival),
        $("<td>").text(dbMinutesAway)
    );

    $("#Tbody").append(NewRow)


});