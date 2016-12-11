// ==================================================================================================//
// **************************************************************************************************//

// 1.  INITIALIZE FIREBASE

    var config = {
      apiKey: "AIzaSyACMOyBf9gDjAvAciDS8dcybIC9rf_bd_c",
      authDomain: "rps-project-c99fb.firebaseapp.com",
      databaseURL: "https://rps-project-c99fb.firebaseio.com",
      storageBucket: "rps-project-c99fb.appspot.com",
      messagingSenderId: "954884480615"
  };
  firebase.initializeApp(config);

  //create a variabe to reference the database

    var database = firebase.database();
// ======================================================================================================//
// ******************************************************************************************************//

// 2. CREATE INITIAL VARIABLES
// ----------------------------------------------------------------------------
// a. Create a  variable to indicate the maximum number of players.

var NUM_PLAYERS = 2; 

// ----------------------------------------------------------------------------
// b Create a  variable to indicate the location of the game

var GAME_LOCATION = 'https://rps-project-c99fb.firebaseio.com'


// ----------------------------------------------------------------------------
// c. Create a variable for a location under loc_game under where the list of players will be stored.

var PLAYERS_LOCATION = "list_of_players";

// -----------------------------------------------------------------------------
// d. Create a variable for location under loc_game where players' data will be stored.

var PLAYER_DATA_LOCATION = "players_info";

// -----------------------------------------------------------------------------
// e. Create a variable for location under loc_game where players' scores will be stored.

var PLAYER_SCORES_LOCATION = "players_scores";

// ======================================================================================================//
// ******************************************************************************************************//
// 3. FUNCTIONS ASSIGNING THE SAME DATA TO UNIQUE PLAYERS 

//----------------------------------------------------------------------------------------------------
// Create function to return persistent userId. This will be used to assign the same player data if they refresh

function getMyUserId() {

  return prompt ('Username?', 'Guest');


}

// ======================================================================================================//
// ******************************************************************************************************//
// 4. FUNCTIONS AND VARIABLES CALLED WHEN A PLAYER PRESSES ANY OF RPS

// --------------------------------------------------------------------------------------------
// a. Function (setRPS) called when a player presses R (Rock), P (Paper), or S (Scissors). It takes a player number, user ID, and either rock, paper, or scissors to set the player's choice

function setRPS(myPlayerNumber, myUserId, myRPS) {
  // i. Create playerDataRef set to the Firebase location of the input player
  var playerDataRef = database.ref().child(PLAYER_DATA_LOCATION).child(myPlayerNumber); 

  // ii. Writw script to change game state to 'picked' and set R, P, or S.
  playerDataRef.push({userId: myUserId, state: 'picked', rps: myRPS});
}
// -----------------------------------------------------------------------------------------------------------------

// ======================================================================================================//
// ******************************************************************************************************//
// 5. SWITCH FUNCTION SET TO DETERMINE WHEN GAME IS WON
// a. ----------------------------------------------------------------------------------------------------
// didYouWin is called after both players have made their selections. It takes your choice and your opponent's choice as arguments.

function didYouWin(yourRPS, opponentRPS) {
  // a. Run traditional R, P, S logic and return whether you won, lost, or had a draw.

  switch(yourRPS) {
    case 'R':
    switch(opponentRPS) {
      case 'R':
      return 'draw';
       case 'P':
       return 'lose';
       case 'S':
       return 'win';
    }
    break;
    case 'P':
     switch(opponentRPS) {
      case 'R':
      return 'win';
      case 'P':
      return 'draw'
      case 'S':
      return 'lose';
     }
     break;
     case 'S':
     switch(opponentRPS) {
      case 'R':
      return 'lose';
      case 'P':
      return 'win';
      case 'S':
      return 'draw';
     }
     break;
  }
}
// ======================================================================================================//
// ******************************************************************************************************//
// 6. FUNCTION CALLED AFTER PLAYER ASSIGNMENT IS COMPLETED

//--------------------------------------------------------------------------------------------------------
// a. playGame is called to start the initial game and games after "Play Again" has been pressed by both players. If the game is full, an alert pops up saying you can't join.
function playGame(myPlayerNumber, myUserId) {
  if (myPlayerNumber === null) {
    alert('Game is full.  Can\'t join. :-(');
  }
  //-----------------------------------------------------------------------------------------------------------
  // b. If there's a spot, join the game and reset the HTML elements.
  else {
    $("#status").empty();
    $("#scoreboard").empty();
    $("#players-list").empty();
    $("#status").css("display", "block");
    $("#players").html("<ul id='players-list'"+ "style='list-style-type:none'></ul>");

    //---------------------------------------------------------------------------------------------------------
    // c. Create Firebase data references for your specific player data, all of the player data, and all of the score data. Disconnecting deletes
    var playerDataRef = database.ref().child(PLAYER_DATA_LOCATION).child(myPlayerNumber);
    var allPlayersDataRef = database.ref().child(PLAYER_DATA_LOCATION);
    var playerScoresRef = database.ref().child(PLAYER_SCORES_LOCATION);

    //-------------------------------------------------------------------------------------------------------------
    // d. The opponent player number is set to the opposite of your player number.

    var opponentPlayerNumber = myPlayerNumber === 0 ? 1 : 0;

    //-------------------------------------------------------------------------------------------------------------

    // e. Check if the the player name is new. If it is, add and set their win/loss record to 0, 0. If it's not new, do nothing and use the stored win/loss record.
    
    playerScoresRef.on('value', function(snapshot) {
      if (snapshot.val() === null) {
        playerScoresRef.child(myUserId).set([0, 0]);
      } else if (!(myUserId in snapshot.val())) {
        playerScoresRef.child(myUserId).set([0, 0]);
      }
    });
    //-----------------------------------------------------------------------------------------------------------
    // f. Remove your player data when you disconnect. There are currently issues with disconnecting after picking but before the opponent has picked.

    playerDataRef.onDisconnect().remove();

    //-----------------------------------------------------------------------------------------------------------
    // g. Set your player data to your user ID, the game state to start, and no selection yet for rock, paper, or scissors.
    playerDataRef.push({userId: myUserId, state: 'start', rps: 'none'});

    //--------------------------------------------------------------------------------------------------------

    // h. Change the text in the status element to a waiting message while waiting for a second player to join.
    $("#status").html("Waiting for second player...");

    //--------------------------------------------------------------------------------------------------------

    // i. Every time a value is changed in the player data, this function is run with a snapshot of the player data.
    allPlayersDataRef.on('value', function(snapshot) {

      //--------------------------------------------------------------------------------------------------------
      // j. Check if both players are in the game by checking their game states.
      if (snapshot.val().length === 2 && snapshot.val()[0].state === 'start' && snapshot.val()[1].state === 'picked' ) {
        // i. Create the R, P, S buttons. 
        //var letters = ["R", "P", "S"];
        //for (var i = 0; i < letters.length; i++) {
        // ii. Inside the loop, Create a variable named "letterBtn" equal to $("<button>");
        //var letterBtn = $("<button>");
        // iii. Then give each "letterBtn" the following classes: "letter-button" "letter" "letter-button-color".
        //letterBtn.addClass("letter-button letter letter-button-color pl1_btn");
        // iv. Then give each "letterBtn" a data-attribute called "data-letter".
        //letterBtn.attr("data-letter", letters[i]);
        // v. Then give each "letterBtns" a text equal to "letters[i]".
        //letterBtn.text(letters[i]);
        // vi. Finally, append each "letterBtn" to the "#buttons" div (provided).
        //$("#buttons_one").append(letterBtn);
      //}
      //--------------------------------------------
      // k. On Click button
      //$(".letter").on("click", function(myPlayerNumber, myUserId) {
       // var myUserId = $("#first-player-input").val().trim();
       // var pick = ($(this).data("letter"));
       // $("#first-player-name").html("Player Name " + ": " + myUserId);
       // $("#first-player-choice").html("Player Choice " + ": " + pick);
       // $("#status").html("Player Name " + ": " + myUserId);
        //$("#status").html("Player Choice " + ": " + pick);
     // });

     // Create the rock, paper, scissors buttons. Hide the kids, this is ugly.
             $("#status").html("<input type='button' value='Rock' " + "class='btn-primary btn-lg'" + "onclick='setRPS(" + myPlayerNumber + ", \"" + myUserId + "\", \"rock\")'/>" + "<input type='button' value='Paper'" + "class='btn-lg'" + "onclick='setRPS(" + myPlayerNumber + ", \"" + myUserId + "\", \"paper\")'/><input type='button' value='Scissors'" + "class='btn-primary btn-lg'"+ "onclick='setRPS(" + myPlayerNumber + ", \"" + myUserId + "\", \"scissors\")'/>");
    };
  });

  //------------------------------------------------------------------------------------
  // m. Take snapshot of player scores when a value changes. Values will change after every game unless it's a draw.
    playerScoresRef.on('value', function(snapshot) {
      //---------------------------------------------------------------------------------------------------
      // i. Empty the scoreboard before repopulating.
        $("#scoreboard").empty();
        // ----------------------------------------------------------------------
        // ii. Loop through the player scores snapshot and append a new list item for each player with their wins and losses. This also checks to find your name so it can be highlighted.
        snapshot.forEach(function(childSnapshot) {
          if(childSnapshot.val().name === myUserId) {
             $("#scoreboard").append("<li class='your-score'>" + childSnapshot.val().name + ": " + childSnapshot.val()[0]  + " wins, " + childSnapshot.val()[1] + " losses</li>");
          }  else {
            $("#scoreboard").append("<li>" + childSnapshot.val().name + ": " + childSnapshot.val()[0]  + " wins, " + childSnapshot.val()[1] + " losses</li>");
          }
        });
      });
    //--------------------------------------------------------------------------------------------------------------
    // m. Run the following function each time a child of the current player data changes.
    allPlayersDataRef.on('child_changed', function(childSnapshot, prevChildName) {
      //------------------------------------------------------------------------------------------------------------
      // n. Run the following function the first time current player data changes.
      allPlayersDataRef.once('value', function(nameSnapshot) {
        //-------------------------------------------------------------------------------------------------------
        // o. Set your player information. Set opponent player information. This is done using the snapshot in the function in .once().
        var y = nameSnapshot.val();
        var opponentPlayerNumber = myPlayerNumber === 0 ? 1 : 0;
        var yourRPS = nameSnapshot.val()[myPlayerNumber].rps;
        var opponentRPS = nameSnapshot.val()[opponentPlayerNumber].rps;

        //------------------------------------------------------------------------------------------------

        // p. Check if you have picked and the opponent hasn't. If you've picked, change status text to a waiting message.

        if(yourRPS !== 'none' && opponentRPS === 'none' && nameSnapshot.val()[myPlayerNumber].state === 'picked')  {
          $("#status").css("display", "block");
          $("#status").html("Waiting for second player to pick...");
        }
        //--------------------------------------------------------------------------------------------------
        // q. Check if both players have picked.
        if(y[0].rps !== 'none' && y[1].rps !== 'none') {
          //--------------------------------------------------------------------------------------------
          // r. Turn off function that draws the rock, paper, scissors buttons.
            allPlayersDataRef.off('value', function(snapshot) {
              if (snapshot.val().length === 2) {
                // -------------------------------------------------------------------------------------------
                // s. Clear the status text. Clear the players list. Display your pick and your opponent's pick.
                $("#status").empty();
                $("#status").append("<input type='button' value='Rock'" + "class='btn-primary'" + "onclick='setRPS(" + myPlayerNumber + ", \"" + myUserId + "\", \"rock\")'/>" + "<input type='button' value='Paper' " + "class='btn-lg'" + "onclick='setRPS(" + myPlayerNumber + ", \"" + myUserId +
                    "\", \"paper\")'/>" + "<input type='button' value='Scissors' " + "class='btn-primary btn-lg'" + "onclick='setRPS(" + myPlayerNumber + ", \"" + myUserId + "\", \"scissors\")'/>");
              }
            });
            //------------------------------------------------------------------------------------
            $("#status").empty();
            $("#players").html("<ul id='players-list' style='list-style-type:none'></ul>");
            $("#players-list").append("<li>You picked: " + yourRPS + "</li>");
            $("#players-list").append("<li>" + nameSnapshot.val()[opponentPlayerNumber].userId + " picked: " + opponentRPS + "</li>");

            //-------------------------------------------------------------------------------------------------
            // t. Call didYouWin() to check if you won or lost.
            $("#players-list").append("<li>You " + didYouWin(yourRPS, opponentRPS) + "!");

            //--------------------------------------------------------------------------------------------------

            // u. Empty the scoreboard to prepare to repopulate it with updated scores.
            $("#scoreboard").empty();

            //---------------------------------------------------------------------------------------------------

            // v. The first time the player scores change, repopulate the scoreboard.
            playerScoresRef.once('value', function(snapshot) {
               // w. Loop through the player scores snapshot using forEach() and append list items to the score board. Again, check to find and highlight your score.
               snapshot.forEach(function(childSnapshot) {
                if(childSnapshot.val().name === myUserId) {
                  $("#scoreboard").append("<li class='your-score'>" + childSnapshot.val().name + ": " + childSnapshot.val()[0]  + " wins, " + childSnapshot.val()[1] + " losses</li>");
                } else {
                  $("#scoreboard").append("<li>" + childSnapshot.val().name + ": " + childSnapshot.val()[0]  + " wins, " +
                        childSnapshot.val()[1] + " losses</li>");
                }

               });
            });

            //-----------------------------------------------------------------------------------------------------

            // x. Initialize variables for your wins and losses. These will be used to increment the persistent player scores data.
            var currentWins,
                currentLosses;

                //--------------------------------------------------------------------------------------------
                // y. Check if you've picked.
                if (nameSnapshot.val()[myPlayerNumber].state === 'picked') {
                  // i. Run this function when your score has changed. This happens after a game completes.
                  playerScoresRef.child(myUserId).on('value', function(snapshot) {
                    currentWins = snapshot.val()[0];
                    currentLosses = snapshot.val()[1];
                  });
                  //---------------------------------------------------------------------------------------------
                  // ii. Check if you won and increment the wins. If you lost, increment the losses. Draws are not recorded.
                  if(didYouWin(yourRPS, opponentRPS) === 'win') {
                    playerScoresRef.child(myUserId).set([currentWins + 1, currentLosses]);
                  } else if (didYouWin(yourRPS, opponentRPS) === 'lose') {
                      playerScoresRef.child(myUserId).set([currentWins, currentLosses + 1]);
                  }
                }
                //----------------------------------------------------------------------------------------
                // z. Display a new button to allow you to to play again.
                $("#players-list").append("<input type='button' value='Play Again' " + "class='btn-primary btn-lg' onclick='playGame(" + myPlayerNumber + ", \"" + myUserId + "\")'/>");

                //-------------------------------------------------------------------------------

                // Set game state to finished and set rock, paper, or scissors.
                playerDataRef.set({userId: myUserId, state: 'finished', rps: yourRPS});
        }
      });
    });
  }
}
//==============================================================================================================
//**************************************************************************************************************
//. 7 Use transaction() to assign a player number, then call playGame()

function assignPlayerNumberAndPlayGame() {
  var myUserId = getMyUserId();
  var playerListRef = database.ref().child(PLAYERS_LOCATION);
  var myPlayerNumber, alreadyInGame = false;

  playerListRef.transaction(function(playerList) {
    if (playerList === null) {
      playerList = [];
    }

    for (var i = 0; i < playerList.length; i++) {
      if (playerList[i] === myUserId) {
        // Already seated so abort transaction to not unnecessarily update playerList.
        alreadyInGame = true;
        myPlayerNumber = i; // Tell completion callback which seat we have.
        return;
      }
    }

    if (i < NUM_PLAYERS) {
      // Empty seat is available so grab it and attempt to commit modified playerList.
      playerList[i] = myUserId;  // Reserve our seat.
      myPlayerNumber = i; // Tell completion callback which seat we reserved.
      return playerList;
    }

    // Abort transaction and tell completion callback we failed to join.
    myPlayerNumber = null;
  }, function (error, committed) {
    // Transaction has completed.  Check if it succeeded or we were already in
    // the game and so it was aborted.
    if (committed || alreadyInGame) {
      playGame(myPlayerNumber, myUserId, !alreadyInGame);
    } else {
      alert('Game is full.  Can\'t join. :-(');
    }
  });
}
assignPlayerNumberAndPlayGame()

