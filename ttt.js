$(document).ready(function() {
  var playerIcon;
  var computerIcon;

  /* scoreArray will be used to determine if a player has won.
     It represents [row1, row2, row3, col1, col2, col3, diag1, diag2].
     When an X is played in a square, its row and column (and diagonal if applicable) will change +1, 
     and if an O is played, they will change -1. 
     When any of these elements == 3 or -3, the game is won. */
  var scoreArray = [0, 0, 0, 0, 0, 0, 0, 0];
  var availableMoves = ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"];

  var computerWins = 0;
  var playerWins = 0;
  var ties = 0;

  startNewGame();

  $("input[name='XorO']").change(function() {
    startNewGame();
  });

  function startNewGame() {
    // Clear board
    $(".box").html("");

    // Display updated scoreboard
    updateScores();

    scoreArray = [0, 0, 0, 0, 0, 0, 0, 0];
    availableMoves = ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"];

    // Assign playerIcon and computerIcon to 'x' or 'o'
    playerIcon = $('input[name=XorO]:checked').val();
    if (playerIcon == 'x') {
      computerIcon = 'o';
    } else {
      computerIcon = 'x';
    }

    // If computer is 'x', computer takes a turn first
    if (computerIcon == 'x') {
      var computerMove = computerTurn();
      doTurn(computerMove, computerIcon);
    }
  }

  function updateScores() {
    $("#wins").text(playerWins);
    $("#losses").text(computerWins);
    $("#draws").text(ties);
  }

  $(".box").on("click", function() {
    var id = $(this).attr('id');
    var index = availableMoves.indexOf(id);
    // Perform move if this square is not filled (is available)
    if (index != -1) {
      doTurn(id, playerIcon);
      if (gameOver()) {
        startNewGame();
      } else {
        var computerMove = computerTurn();
        doTurn(computerMove, computerIcon);
      }
      if (gameOver()) {
        startNewGame();
      }
    }
  })

  function computerTurn() {
    var minimaxResults = minimax(computerIcon, availableMoves, scoreArray);
    var id = minimaxResults[1];
    return id;
  }

  function doTurn(boxID, icon) {
    displayIcon("#" + boxID, icon);
    scoreArray = updateScoreArray(boxID, icon, scoreArray);
    var index = availableMoves.indexOf(boxID);
    availableMoves.splice(index, 1);
  }

  function gameOver() {
    var winner = won(scoreArray);
    if (winner == playerIcon) {
      playerWins += 1;
      alert("You won!");
      return true;
    } else if (winner == computerIcon) {
      computerWins += 1;
      alert("Computer won!");
      return true;
    }
    if (availableMoves.length == 0) {
      ties += 1;
      alert("Tied Game.");
      return true;
    }
    return false;
  }

  function won(array) {
    /* Returns 'x', 'o', or null */
    if (array.indexOf(3) != -1) {
      return 'x';
    } else if (array.indexOf(-3) != -1) {
      return 'o';
    } else {
      return null;
    }
  }

  function minimaxScore(scoreArray) {
    var winner = won(scoreArray);
    if (winner == computerIcon) {
      return 1;
    } else if (winner == playerIcon) {
      return -1;
    } else { // no one won
      return 0;
    }
  }

  function minimax(player, availableMoves, scoreArray) {
    /* Returns an array of [minimum/maximum score, location to move to get that score] */

    // Make copies
    var availMoves = availableMoves.slice();
    var scoreArr = scoreArray.slice();

    // Get all possibilities for next turn
    var scores = [];
    for (var i in availMoves) {
      var newAvailMoves = availMoves.slice(0, i).concat(availMoves.slice(+i + 1));
      var newScoreArr = updateScoreArray(availMoves[i], player, scoreArr);

      // Base case - game is over (either it's a draw or someone won)
      if (newAvailMoves.length == 0 || won(newScoreArr)) {
        scores.push(minimaxScore(newScoreArr));
      }
      // Recursive case - run minimax on new states
      else {
        // Switch players
        if (player == 'x') {
          var newPlayer = 'o';
        } else if (player == 'o') {
          var newPlayer = 'x';
        }

        var recursion = minimax(newPlayer, newAvailMoves, newScoreArr);
        scores.push(recursion[0]);
      }
    }
    // Return max score if computer's turn, 
    // min score otherwise,
    // along with which box to move in to get that score
    if (player == computerIcon) {
      var returnScore = Math.max.apply(Math, scores);
    } else {
      var returnScore = Math.min.apply(Math, scores);
    }
    var index = scores.indexOf(returnScore);
    var returnMove = availMoves[index];
    return [returnScore, returnMove];
  }

  function displayIcon(boxSelector, icon) {
    if (icon == 'x') {
      $(boxSelector).html("<img src='icons/x_icon.png' alt='x'>");
    } else if (icon == 'o') {
      $(boxSelector).html("<img src='icons/o_icon.png' alt='o'>");
    }
  }

  function updateScoreArray(id, icon, scoreArray) {
    var scoreArr = scoreArray.slice();
    if (icon == 'x') {
      var increment = 1;
    } else if (icon == 'o') {
      var increment = -1;
    }
    // Update rows
    if (id[0] == 'a') {
      scoreArr[0] += increment;
    } else if (id[0] == 'b') {
      scoreArr[1] += increment;
    } else if (id[0] == 'c') {
      scoreArr[2] += increment;
    }
    // Update columns
    if (id[1] == '1') {
      scoreArr[3] += increment;
    } else if (id[1] == '2') {
      scoreArr[4] += increment;
    } else if (id[1] == '3') {
      scoreArr[5] += increment;
    }
    // Update diagonals
    if (id == "a1" || id == "b2" || id == "c3") {
      scoreArr[6] += increment;
    }
    if (id == "a3" || id == "b2" || id == "c1") {
      scoreArr[7] += increment;
    }
    return scoreArr;
  }

  $(".box").hover(function() {
      if (availableMoves.indexOf($(this).attr('id')) != -1) {
        if (playerIcon == 'x') {
           $(this).html("<img src='icons/x_icon_dark.png' alt='x'>");
        } else if (playerIcon == 'o') {
           $(this).html("<img src='icons/o_icon_dark.png' alt='x'>");
        }
        
      }
    },
    function() {
      if (availableMoves.indexOf($(this).attr('id')) != -1) {
        $(this).html("");
      }
    });

});