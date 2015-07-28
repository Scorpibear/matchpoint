function Player(name){
	   this.name = name;
	   this.goals = 0;
	   this.points = 60;
}
angular.module("matchpoint", [])
    .controller("MatchPointCtrl", ['$scope', function($scope) {
        $scope.stage = "start";
        $scope.start = function(options) {
	           $scope.player1 = new Player("Лена");
            if(options.players == 2) {
                $scope.player2 = new Player("Ваня");
            } else if (options.players == 1) {
	               $scope.player2 = new Player("компьютер");
	           } 
	           $scope.options = options;
	           $scope.options.goalsToWin = 2;
	           $scope.stage = "select";
        };
        $scope.startGame = function() {         
	           $scope.ballPosition = 0; 
            $scope.$apply(); //to accept names change and ball position
	           $scope.startNewTurnRound();
	       };
	       $scope.startNewTurnRound = function() {
	           $scope.stage = 'game';
	           $scope.currentPlayer = $scope.player1;
	           $scope.anotherPlayer = $scope.player2;
	           $scope.turnData = {};
        };
        $scope.startTurn = function() {
	           $scope.turnValue = ($scope.currentPlayer.points == 0) ? 0 : '';
	           if($scope.ballPosition == 3 || $scope.ballPosition == -3) {
		              $scope.ballPosition = 0;
		          }
	           $scope.stage = 'turn';
	           $scope.$apply();
        };
        $scope.turnMade = function() {
	           if($scope.turnValidated()){
	               $scope.stage = 'game';
	               if($scope.turnData.p1 != undefined) {
		                  $scope.turnData.p2 = $scope.extractTurnValue($scope.player2);
		                  $scope.finalizeTurn();
			             } else { 
			                 $scope.turnData.p1 = $scope.extractTurnValue($scope.player1);
				                if($scope.options.players == 2) {
		                      $scope.currentPlayer = $scope.player2;
		                      $scope.anotherPlayer = $scope.player1;
		                  } else {
			                     $scope.turnValue = $scope.getComputerTurn($scope.ballPosition, $scope.player2.points);
			                     $scope.turnData.p2 = $scope.extractTurnValue($scope.player2);
		                      $scope.finalizeTurn();
		                  }
	               }
	           }
        };
        $scope.getComputerTurn = function(position, pointsLeft, myGoals) {
	           var s1 = {getTurnValue: function(){ return Math.min(Math.round(Math.random()*3)+1*Math.abs((position+1)*(position+1)), pointsLeft); }};
	           
	           var strategy = s1;
	           return strategy.getTurnValue();
	           
        };
        $scope.turnValidated = function() {
	           $scope.turnValue = +$scope.turnValue;
	           var adjustTurnValue = function(recommendedValue) {
	               $scope.turnValue =  recommendedValue;
		              $scope.$apply();
		              return false;
	           };
	           if(!angular.isNumber($scope.turnValue)) {
		              return adjustTurnValue(Math.min(1, $scope.currentPlayer.points));
		          } else if(($scope.turnValue <= 0) && $scope.currentPlayer.points > 0) {
			             return adjustTurnValue(1);
			         } else if($scope.turnValue < 0) {
				            return adjustTurnValue(0);
				        } else if($scope.turnValue > $scope.currentPlayer.points) {
		              return adjustTurnValue($scope.currentPlayer.points);
		          } else if ($scope.turnValue != Math.round($scope.turnValue)) {
		              return adjustTurnValue(Math.round($scope.turnValue));
		          }
		          return true;
        };
        $scope.extractTurnValue = function(player) {
	           $scope.turnValue = Math.max(0, $scope.turnValue);
	           player.points -= +$scope.turnValue;
	           return $scope.turnValue;
        };
        $scope.finalizeTurn = function() {
	           var diff = $scope.turnData.p1-$scope.turnData.p2;
	           if((diff == 0) && ($scope.turnData.p1 == 0)) {
		              $scope.gameOver();
		              return;
		          }
		          if(diff>0) {
		              $scope.p1wonTurn(); 
		          }
		          if(diff<0) {
			             $scope.p2wonTurn();
			         }
			         if($scope.stage!='gameOver')
			             $scope.startNewTurnRound();        
        };
        $scope.gameOver = function() {
	          $scope.winner = null;
	          var diff = $scope.player1.goals - $scope.player2.goals;
	          if(diff>0) {
		             $scope.winner = $scope.player1;  
	          } else if (diff<0) {
		             $scope.winner = $scope.player2;
	          }
	          $scope.stage = 'gameOver';
        };
        $scope.p1wonTurn = function() {
	           $scope.ballPosition++;
	           if($scope.ballPosition == 3) {
		              $scope.goal($scope.player1);
		          }
        };
        $scope.p2wonTurn = function() {
	           $scope.ballPosition--;
	           if($scope.ballPosition == -3) {
		              $scope.goal($scope.player2);
		          }
        };
	 
        $scope.goal = function(player) {
	           player.goals++;
	           if(player.goals == $scope.options.goalsToWin) {
		              $scope.gameOver(player);
		          }
        };
        
    }]);