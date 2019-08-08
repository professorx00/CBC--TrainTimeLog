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

const userLogin = $("#loginForm");
const emailInput = $("#email");
const passInput = $("#password");
const btnLogIn = $("#btnSubmit");
const btnCreate = $("#createNew");
const btnLogOut = $("#logout");
const forgotPass = $("#forgotPass");
const error = $("#error");

btnLogIn.on("click", e => {
  error.addClass("hide")
  e.preventDefault();

  console.log("Signing in User")

  const email = emailInput.val().trim();
  const password = passInput.val().trim();
  const auth = firebase.auth()
  const promise = auth.signInWithEmailAndPassword(email, password);
  promise.catch(e => {
    error.text(e.message);
    error.removeClass("hide");
  });

});

btnCreate.on("click", e => {
  e.preventDefault();

  console.log("creating User")
  //TODO: Check 4 valid email address and Password
  const email = emailInput.val().trim();
  const password = passInput.val().trim();
  const auth = firebase.auth()
  const promise = auth.createUserWithEmailAndPassword(email, password);
  promise.catch(e => {
    error.text(e.message);
    error.removeClass("hide");
  });
});

btnLogOut.on("click", e => {
  console.log("Signing Out User")
  firebase.auth().signOut();
});

forgotPass.on("click", e => {
  e.preventDefault();
  console.log("forgot Pass")
  userLogin.addClass("hide");
  $("#title").text("Reset Your Password");
  $("#passwordRest").removeClass("hide");
  $("#passSend").on("click", e => {
    let resetemail = $("#emailPass").val().trim();
    let resetPromise = firebase.auth().sendPasswordResetEmail(resetemail)
    resetPromise.catch(e => {
      console.log(e)
      console.log(e.code)
      if (e.code == "auth/user-not-found") {
        error.text("Please enter valid email address")
      }
      else{
        console.log(e.message)
      }
    }).then(()=>{
        error.text("Please check your email for the reset password email.")
        error.removeClass("hide")
        $("#passwordRest").addClass("hide");
        userLogin.removeClass("hide")
    });
  })
})

function StayLogIn(){
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(function() {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return firebase.auth().signInWithEmailAndPassword(email, password);
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}

firebase.auth().onAuthStateChanged(firebaseUser => {
  
  if (firebaseUser) {
    btnLogOut.removeClass("hide");
    btnLogIn.addClass("hide");
    btnCreate.addClass("hide")
    error.addClass("hide");
    StayLogIn();
    window.location.href ="./trains.html"
  }
  else {
    btnLogOut.addClass("hide");
    btnLogIn.removeClass("hide");
    btnCreate.removeClass("hide");
    error.addClass("hide");
    console.log("Logged Out");
  }
});