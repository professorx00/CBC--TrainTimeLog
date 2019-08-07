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




// On click Event of Button

docAddTrain.on("click",(event)=>{
    
    event.preventDefault()//prevent refresh
    //grab variables from form
    trainName = docTrainInput.val().trim();
    trainStart = moment(docTrainHour.val() + docTrainMinutes.val(), 'HHmm').toDate();
    destination = docDestInput.val().trim();
    frequency = DocFreqInput.val().trim();
    // create JSON Object that has all the data needed to be stored in database
    let train = {
        Tnumber:counter,
        name:trainName,
        destination:destination,
        frequency:frequency,
        trainStart:moment(trainStart).format("hh:mm A")
    }
    //push object to database in train table
    database.ref("/trains").push(train);
    //alert User 
    //TODO: change to a module from bootstrap
    alert("Train successfully added");
})

//on child change update table
database.ref('/trains').on("child_added", function(childSnapshot) {

    // Set Minutes Away and Next Arrival On Child Add
    let minutesDiff = moment().diff(trainStart, "minutes");
    minutesAway = parseInt(childSnapshot.val().frequency)-(minutesDiff % parseInt(childSnapshot.val().frequency));
    nextArrival=moment().add(minutesAway,'m').format("hh:mm A");
    
    //Set variables for table insertion
    let dbTrainName = childSnapshot.val().name;
    let dbDestination = childSnapshot.val().destination;
    let dbTrainStart = childSnapshot.val().trainStart;
    let dbFrequency = childSnapshot.val().frequency;
    let dbNextArrival = nextArrival;
    let dbMinutesAway = minutesAway;
    
    //create the table
    let NewRow = $("<tr>").append(
        $("<td>").text(dbTrainName),
        $("<td>").text(dbDestination),
        $("<td>").text(dbTrainStart),
        $("<td>").text(dbFrequency),
        $("<td>").text(dbNextArrival),
        $("<td>").text(dbMinutesAway)
    );
    //Append to body
    $("#Tbody").append(NewRow)


});