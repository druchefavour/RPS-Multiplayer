$(document).ready(function() {

//===========================
//var ref = new Firebase("https://rps-project-c99fb.firebaseio.com")
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

var database = firebase.database().ref();

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

var loc_game = 'https://rps-project-c99fb.firebaseio.com'

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
  var plyDatRef = new firebase(loc_game).child(loc_plys_dat).child(thisPlyName);

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
//5. Write scripts to start game and repeat game. Use playGame()

//-----------------------------------------------------------
// Disallow additional player when max. number of players take seats
function playGame(thisPlyNum, thisPlyName) {
  if (thisPlyNum === null) {
    alert('All seat taken. Try again later:-(');
  }

  // Allow new player to join game if there is a spot and reset HTML
  else {
    $("#position").empty();
    $("#score-board").empty();
    $("#list-of-players").empty();
    $("#position").css("display", "block");
    $("#player-names").html("<ul id='list-of-players'"+
          "style='list-style-type:circle'></ul>");

    //----------------------------------------------------
    // Enter and store data in firebase (1) first player info (2) All player info (3) All the scores 

    var plyDatRef = new firebase(loc_game).child(loc_plys_dat).child(thisPlyNum);
    var allPlyDatRef = new firebase(loc_game).child(loc_plys_dat);
    var plyScrRef = new firebase(loc_game).child(loc_plys_scr);


    //----------------------------------------------------------

    // Set the second player number to the opposite of thisvplayer number.
    
    var scdPlyNum = thisPlyNum === 0 ? 1 : 0;

    // Check if the the player name is new. If it is, add and set their win/loss record to 0, 0. If it's not new, do nothing and use the stored win/loss record.

    plyScrRef.on('value', function(snapshot) {
      if (snapshot.val() === null) {
        plyScrRef.child(thisPlyName).set([0, 0]);
      } else if (!(thisPlyName in snapshot.val())) {
        plyScrRef.child(thisPlyName).set([0, 0]);
      }
    });
    //------------------------------------------------------------

    //Clear data when player disconnects (use removeOnDisconnect() syntax)
    plyDtRef.removeOnDisconnect();

    //------------------------------------------------------------
    // 6. STATIC CASE: GETTING READY TO PLAY THE GAME
    // Set player data to first players username and get ready for the game to start. This is before any selection is made.

    plyDatRef.set({plyName: thisPlyName, state: 'start', game: 'none'});

    // Change the text in the position div: signify that first player is waiting for the second player to join the game.

    $("#position").html("Hold till second player joins...");

    //--------------------------------------------
    // Write a script that captures every change in the player data.

    allPlyDatRef.on('value', function(snapshot) {
    // Check if both players are in the game by checking their game states.
    if (snapshot.val().length === 2 &&
      snapshot.val()[0].state === 'start' &&
      snapshot.val()[1].state === 'start' ) {

      // Write script to create buttons to press (initiating game)
    $("#position").html("<input type='button' value='ROCK' " + "id='button_rock'" + "onclick='startGame(" + thisPlyNum + ", \"" + thisPlyName + "\", \"rock\")'/>" + "<input type='button' value='PAPER' id='button_paper' onclick='startGame(" + thisPlyNum + ", \"" + thisPlyName + "\", \"paper\")'/>" + "<input type='button'" + "value='SCISSORS' id='button_scissors' onclick='startGame(" + thisPlyNum + ", \"" + thisPlyName + "\", \"scissors\")'/>");
        }
    });

    //------------------------------------------------------------

    // Take snapshot of player scores when a value changes. Values will change after every game unless it's a draw.

    plyScrRef.on('value', function(snapshot) {
      // Empty the scoreboard before repopulating.
      $("#score-board").empty();
      //Write a logic to loop through the player scores snapshot and append a new list item for each player with their wins and losses. 

      snapshot.forEach(function(childSnapshot) {
        if(childSnapshot.name() === thisPlyName) {
          $("#score-board").append("<li class='this-player-score'>" + childSnapshot.name() + ": " + childSnapshot.val()[0]  + " wins, " + childSnapshot.val()[1] + " losses</li>");
        } else {
          $("#scoreboard").append("<li>" + childSnapshot.name() + ": " + childSnapshot.val()[0]  + " wins, " + childSnapshot.val()[1] + " losses</li>");
        }
      });
    });
    //------------------------------------------------------------

    // This function will be activated each time a child of the current player data changes.
    allPlyDatRef.on('child_changed', function(childSnapshot, prevChildName) {
      // (a) This the first time current player data changes.
      allPlayersDataRef.once('value', function(nameSnapshot) {

        // Set first and second players' information. Use the snapshot in the function in .once().
        var setPlyinfo = nameSnapshot.val();
        var scdPlyNum = thisPlyNum === 0 ? 1 : 0;
        var fstPlyGame = nameSnapshot.val()[thisPlyNum].game;
        var scdPlyGame = nameSnapshot.val()[scdPlyNum].game;
        //---------------------------------------------------
        // Check if first player has picked and the second player has not picked. If so, write a waiting message.

        if(fstPlyGame !== 'none' && scdPlyGame === 'none' &&
        nameSnapshot.val()[thisPlyNum].state === 'thisChoice')  {
          $("#position").css("display", "block");
        $("#position").html("Waiting for second player to choose...");
        }

        // Check if both players have picked.
        if(setPlyinfo[0].game !== 'none' && setPlyinfo[1].game !== 'none') {
          // Turn off function that draws the rock, paper, scissors buttons.
            allPlyDatRef.off('value', function(snapshot) {
              if (snapshot.val().length === 2) {
                // Clear the status text. Clear the players list. Display your pick and your opponent's pick.
                $("#position").empty();
                $("#position").append("<input type='button' " + "value='ROCK' id='button_rock' onclick='startGame(" + thisPlyNum + ", \"" + thisPlyName + "\", \"rock\")'/><input type='button' value='PAPER' " + "id='button_paper' onclick='startGame(" + thisPlyNum + ", \"" + thisPlyName + "\", \"paper\")'/><input type='button' value='SCISSORS' " + "id='button_scissors' onclick='startGame(" + thisPlyNum + ", \"" + thisPlyName + "\", \"scissors\")'/>");
              }
            });
            //-------------------------------------------------
            $("#position").empty();
            $("#player-names").html("<ul id='list-of-players' style='list-style-type:circle'></ul>");
            $("#list-of-players").append("<li>First Player chose: " + fstPlyGame + "</li>");
            $("#list-of-players").append("<li>" + nameSnapshot.val()[scdPlyNum].plyName +  " chose: " + scdPlyGame + "</li>");
            //-------------------------------------------------

            // Call winLogic() to check if first player won or lost.
            $("#list-of-players").append("<li>First Player " + winLogic(fstPlyGame, scdPlyGame) + "!");

            //-------------------------------------------------

            // Empty the scoreboard to prepare to repopulate it with updated scores.
            $("#score-board").empty();

            //The first time the player scores change, repopulate the scoreboard.
            plyScrRef.once('value', function(snapshot) {
              // Loop through the player scores snapshot using forEach() and append list items to the score board. 
              snapshot.forEach(function(childSnapshot) {
                 if(childSnapshot.name() === thisPlyName) {
                  $("#score-board").append("<li class='this-player-score'>" + childSnapshot.name() + ": " + childSnapshot.val()[0]  + " wins, " + childSnapshot.val()[1] + " losses</li>");
                 } else {
                   $("#score-board").append("<li>" + childSnapshot.name() + ": " + childSnapshot.val()[0]  + " wins, " + childSnapshot.val()[1] + " losses</li>");
                 }
              });
            });
              //-----------------------------------------------
              // Initialize variables for wins and losses. These will be used to increment the persistent player scores data.
              var currentWins,
              currentLosses;

              // Check when first player picks.
              if (nameSnapshot.val()[thisPlyNum].state === 'thisChoice') {
                // Run this function when your score has changed. This happens after a game completes.
                plyScrRef.child(thisPlyName).on('value', function(snapshot) {
                  currentWins = snapshot.val()[0];
                  currentLosses = snapshot.val()[1];
                });
                // Check if first player won and increment the wins. If first player lost, increment the losses. Ties are not recorded.
                if(winLogic(fstPlyGame, scdPlyGame) === 'win') {
                  plyScrRef.child(thisPlyName).set([currentWins + 1, currentLosses]);
                }  else if (winLogic(fstPlyGame, scdPlyNum) === 'lose') { 
                  playerScoresRef.child(myUserId).set([currentWins, currentLosses + 1]);
                }
              }
              //-----------------------------------------------

              // Display a new button to allow game to continue
              $("#list-of-players").append("<input type='button' value='Try Again' " + "id='button_restart' onclick='playGame(" + thisPlyNum + ", \"" + myUserId + "\")'/>");

              // Set game state to finished and set rock, paper, or scissors.

              plyDatRef.set({plyName: thisPlyName, state: 'finished', game: fstPlyGame});
            };
        });          
      });
    };  
    }
    //---------------------------------------------------
    // _Use transaction() to assign a player number, then call playGame().
    function assPlyNumAndPlayGame() {
      var thisPlyName = getPlyName();
      var plyDtRef = database.child(loc_plys);

      plyDtRef.transaction(function(playerList) {
        var i;
        // _Initialize playerList if we need to._
        if (playerList === null) {
          playerList = {};
        }
        var joinedGame = false;
        for(i = 0; i < num_plys; i++) {
          if (playerList[i] === thisPlyName) {
            alert("Already in the game.");
            return; // _Already in the game. Abort transaction._
          } else if (!(i in playerList) && !joinedGame) {
            // _Open spot. Join game
            playerList[i] = thisPlyName;
            // _Don't return playerList until after the loop, in case we find out we're already assigned a spot.
            joinedGame = true;
            break;
          }
        }
        if (joinedGame) {
          return playerList;
        }
        // Couldn't join.  Abort transaction by returning nothing.
         }, function (success, transactionResultSnapshot) {
          // Transaction has completed.  See if we're in the game.
          var thisPlyNum = null,
          resultPlayerList = transactionResultSnapshot.val();
          for(var i = 0; i < num_plys; i++) {
            if (resultPlayerList[i] === thisPlyName) {
              // I got into the game.
              thisPlyNum = i;
              break;
            }
          }
          //-----------------------------------------------------
          plyDtRef.child(thisPlyNum).removeOnDisconnect();
          playGame(thisPlyNum, thisPlyName);
  });
}
//=========================================================
assPlyNumAndPlayGame()
});
