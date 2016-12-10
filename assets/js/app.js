$(document).ready(function() {

//===========================
// Initialize Firebase
var config = {
  apiKey: "AIzaSyACMOyBf9gDjAvAciDS8dcybIC9rf_bd_c",
  authDomain: "rps-project-c99fb.firebaseapp.com",
  databaseURL: "https://rps-project-c99fb.firebaseio.com",
  storageBucket: "rps-project-c99fb.appspot.com",
  messagingSenderId: "954884480615"
};

firebase.initializeApp(config);

//============================
// Create database variable

var database = firebase.database();

//============================
//Create a constructor for the players
//See object constructors: http://www.w3schools.com/js/js_object_definition.asp
function objPlayer(name, age, score, pick) {
  this.name = name,
  this.age = age,
  this.score = score,
  this.pick = pick
}

// Define variables
var thisPlayer;
var playerName;
var clickValue;
var firstPlayerAssigned;
var secondPlayerAssigned;
var firstPlayerChoice;
var secondPlayerChoice;
var firstPlayerScore;
var secondPlayerChoice;
//=============================
//Create function to add players to the database and to the scoreboard. Use the built in Java-Script constructor var x1 = new Object(); RPS to be played by 2 players
function addPlayer(player) {
  var dataBasePlayer = new objPlayer(playerName, "", 0, "");

  //set player into the database
  database.ref(player).set(dataBasePlayer); 
  $("#" + player).text(playerName);
  thisPlayer = player;
  clickValue = ".buttons-" + thisPlayer;
}
  
// Create function to animate score
function score(player, winVar, lossesVar, div){
  winVar++;
  lossVar++;
  database.ref(player).update({score: winVar});
  database.ref(player).update({score:lossVar});
  database.ref("firstPlayer").update({pick: ""});
  database.ref("secondPlayer").update({pick: ""});
};

//Variables
//=========================================
database.ref().on("value", function(snapshot){
  //These test if first annd second player has been assigned in the database
  firstPlayerAssigned = snapshot.val().firstPlayer;
  secondPlayerAssigned = snapshot.val().secondPlayer;

  // Sets proper player names and the score onscreen

  if (firstPlayerAssigned) {
    var firstPlayerName = snapshot.val().firstPlayer.name;
    firstPlayerScore = snapshot.val.firstPlayer.score;
    $("#firstPlayer").text(firstPlayerName)
  };
  if (secondPlayerAssigned) {
    var secondPlayerName = snapshot.val().secondPlayer.name;
    secondPlayerScore = snapshot.val().secondPlayer.score;
    $("#secondPlayer").text(secondPlayerName)
  };
  if (firstPlayerAssigned && secondPlayerAssigned){$("#scoreDisplay").text(firstPlayerScore + " - " + secondPlayerScore)}

    //Listens for user R/P/S choices
//  firstPlayerChoice = snapshot.val().firstPlayer.pick;
//  secondPlayerChoice = snapshot.val().secondPlayer.pick;

})

//===========================================
//Add a player, replace the input box on the players screen with a score board
$(".btn").on("click", function(){
  // Grab player's name
  playerName = $("#player-name").val().trim();
  //Creates the score board title line
  var scoreTitle = $("<h4>").attr({
    id: 'scoreTitle',
    class: 'text-center'
  });
  scoreTitle.text("Score: ");

  //Creates the actual score display
  scoreDisplay = $("<h2").attr({
    id: "scoreDisplay",
    class: 'text-center'
  });
  scoreDisplay:text("0 - 0");

  //Appends the score display to the screen
  $("#scoreBoard").empty();
  $("scoreBoard").append(scoreTitle);
  $("scoreBoard").append(scoreDisplay);

    database.ref().push({
      name: name,
      pick: playerChoice
    });
    return false;
  });
//============================================
//Detects RPS selection, limiting selection to only one player at a time

var letters = ["R", "P", "S"];

    // MAJOR TASK #1: DYNAMICALLY CREATE BUTTONS
    // ===========================================
    //Create a for-loop to iterate through the letters array.
    for (var i = 0; i < letters.length; i++) {
      // Inside the loop, Create a variable named "letterBtn" equal to $("<button>");
      var letterBtn = $("<button>");
      // Then give each "letterBtn" the following classes: "letter-button" "letter" "letter-button-color".
      letterBtn.addClass("letter-button letter letter-button-color");
      //Then give each "letterBtn" a data-attribute called "data-letter".
      letterBtn.attr("data-letter", letters[i]);
      //Then give each "letterBtns" a text equal to "letters[i]".
      letterBtn.text(letters[i]);
      //Finally, append each "letterBtn" to the "#buttons" div (provided).
      $("#buttons").append(letterBtn);


  $(".letter-button").on("click", function() {
    
      var playerChoice = ($(this).data("letter"));
      console.log(playerChoice);
      database.ref(thisPlayer).update({pick: playerChoice})
  });
}
})


      
     

      
        

        