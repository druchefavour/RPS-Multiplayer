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

//Initial Variables
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

});
