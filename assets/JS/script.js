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
    let minutesDiff = moment().diff(trainStart, "minutes");
    minutesAway = parseInt(frequency)-(minutesDiff % parseInt(frequency));
    nextArrival=moment().add(minutesAway,'m');
    console.log(nextArrival.format("hh:mm A"))
    
    let train = {
        Tnumber:counter,
        name:trainName,
        destination:destination,
        frequency:frequency,
        nextArrival: nextArrival.format("hh:mm A"),
        minutesAway:minutesAway
    }

    database.ref("/trains").push(train);

    alert("Employee successfully added");
    // console.log(trainName,destination,frequency);
    // console.log(`Start time is ${trainStart}`)
})