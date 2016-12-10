// Initialize Firebase
var config = {
    apiKey: "AIzaSyCICumjmJWEeFOlY39Zh-8zzHFY-xta8nY",
    authDomain: "rps-multiplayer-40946.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-40946.firebaseio.com",
    storageBucket: "rps-multiplayer-40946.appspot.com",
};

firebase.initializeApp(config);

var db = firebase.database();

//Player object constructor
function playerObj(name, score, choice){
    this.name = name,
    this.score = score,
    this.choice = choice
}

//Tracking Variables
var thisUser;
var userName; 
var clickImg;

var p1Assigned;
var p2Assigned;

var p1Choice;
var p2Choice;

var p1Score;
var p2Score;

//Adds players to the database and to the screen.  Argument should be either "player1" or "player2".
function assignPlayer(player){
    var dbPlayer = new playerObj(userName, 0, "");
    db.ref(player).set(dbPlayer);
    $("#" + player).text(userName);
    thisUser = player;
    clickImg = ".img-" + thisUser;
};

function win(player, scoreVar, div){
    scoreVar++;
    db.ref(player).update({score: scoreVar});
    db.ref("player1").update({choice: ""});
    db.ref("player1").update({choice: ""});
    // win animation
};

db.ref().on("value", function(snapshot){

    //These test if player1 and player2 have been asigned.
    p1Assigned = snapshot.val().player1;
    p2Assigned = snapshot.val().player2;

    //Sets proper player names and the score onscreen.
    if (p1Assigned){
        var p1Name = snapshot.val().player1.name;
        p1Score = snapshot.val().player1.score;
        $("#player1").text(p1Name)
    };
    if (p2Assigned){
        var p2Name = snapshot.val().player2.name;
        p2Score = snapshot.val().player2.score;
        $("#player2").text(p2Name)
    };
    if (p1Assigned && p2Assigned){$("#scoreDisplay").text(p1Score + " - " + p2Score)}

    //Listens for user R/P/S choices
    p1Choice = snapshot.val().player1.choice;
    p2Choice = snapshot.val().player2.choice;
})

// Adds a user, then replaces the input box on that user's screen with a score box. 
$(".btn").on("click", function(){

    //Grabs the user's inputted name.
    userName = $("input").val();

    //Creates the Score Box title line.
    var scoreBanner = $("<h4>").attr({
        id: 'scoreBanner',
        class: 'text-center'
    });
    scoreBanner.text("Score: ");

    //Creates the actual score display.
    scoreDisplay = $("<h1>").attr({
        id: "scoreDisplay",
        class: "text-center"
    });
    scoreDisplay.text("0 - 0");

    //Appends the score readout to the screen.
    $("#scoreBox").empty();
    $("#scoreBox").append(scoreBanner);
    $("#scoreBox").append(scoreDisplay);

    //Determine which player the current user should play as.
    console.log("p1Assigned: " + p1Assigned);
    console.log("p2Assigned: " + p2Assigned);

    if (!p1Assigned){assignPlayer("player1")}
    else if (!p2Assigned){assignPlayer("player2")}
    else {
        //Unavailable message
        console.log("Seat's taken")
    }

    return false;
});

//Detects R/P/S selection, limiting selection to only the user's side
// 
$(clickImg).on("click", function(){
    var userChoice = $(this).attr("id");
    console.log(clickImg);
    db.ref(thisUser).update({choice: userChoice})
});

// if (thisUser === "player1" && p1Choice && p2Choice){
//     if (p1Choice === p2Choice){
//         //tie animation 
//     }
//     else if (p1Choice === "rock" && p2Choice === "scissors"){
//         win("player1", p1Score);
//     }
//      else if (p1Choice === "paper" && p2Choice === "rock"){
//         win("player1", p1Score);
//     }
//      else if (p1Choice === "scissors" && p2Choice === "paper"){
//         win("player1", p1Score);
//     }
//     else {win("player2", p2Score)};
// }