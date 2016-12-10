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

//1. Initial Variables
//============================
//Create a  variable to indicate the maximum number of players.
//-------------------------------------------------
var num_plys = 2; 
// For this game set the number of players to 2. Any player that wants to join will be stopped.

//-------------------------------------------------

//Create a variable for location under where the list of players will be stored.
var loc_plys = "list_of_players";
var loc_plys_dat = "players_info";

//Create variables to store scores
var loc_plys_scr = "player_scores";
// ================================================

// 2. Create function to return persistent username. This will be used to assign the same player data if they refresh
//-----------------------------------------
function getPlyName () {
  return prompt ("plyName?", "fstPly");
}
//------------------------------------------

//=============================================
// 3. Call a function which takes a player number, user name and player choice when the player presses any of Rock, Paper and Scissors

function startGame(thisPlyNum, thisPlyName, thisGame) {
  // Create firebase  ref for the input player
  var plyDatRef = new database().ref().child(loc_plys_dat).child(thisPlyName);

  // set data in the database to reflect player's choice

  plyDatRef.set({plyName:thisPlyName, state: 'thisChoice', game: thisGame});
}

//=================================================================
//4. Use switch statement to set the RPS Game: Ref: http://www.w3schools.com/js/js_switch.asp

//----------------------------------------------------------------

//winLogic() is called after both players have made their selections. It takes your choice and your opponent's choice as arguments.
function winLogic(fstPlyGame, scdPlyGame) {
  switch (fstPlyGame) {
    case 'rock':
    switch(scdPlyGame) {
      case 'rock':
      return 'ties';
      case 'paper':
      return 'losses';
      case 'scissors':
      return 'wins';
    }
    break;
    case 'paper':
    switch(scdPlyGame) {
      case 'rock':
      return 'wins';
      case 'paper':
      return 'ties';
      case 'scissors':
      return 'losses';
    }
    break;
    case 'scissors':
    switch(scdPlyGame) {
      case 'rock':
      return 'losses';
      case 'paper':
      return 'wins';
      case 'scissors':
      return 'ties';
    }
  }
} 
// ==========================================================


});
