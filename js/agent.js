class ReflexRandomizedAgent {
    getAction(perception) {
        var directions = ['LEFT','RIGHT','UP','DOWN']
        
        if(perception.isDirty) {
            return 'SUCK';
        }
        else {
            return directions[Math.floor(Math.random() * directions.length)];
        }
    }
    
}

class AgentWithState {
    constructor() {
        this.possibleDirections = ['LEFT','RIGHT','UP','DOWN'];
        this.unexploredMoves = [];
        this.doneMoves = [];
        this.mode = 'exploring';
        this.reasoning = '';
        this.lastX = 0;
        this.lastY = 0;
        this.lastAction = '';
        this.debug = true;
        
    }
    
    getAction(perception) {
        var action = this.deduceAction(perception);
        
        this.lastAction = action;
        this.lastX = perception.x;
        this.lastY = perception.y;
        
        return action;
    }

    deduceAction(perception) {
        if(perception.isDirty) {
            return 'SUCK';
        }
        
        console.log(this.mode);
        
        if(this.mode == 'exploring') {
            //add possible moves to the unexplored array, if they were not already done.
            for(var i=0;i<this.possibleDirections.length;i++) {
                var directionKey = perception.x+'-'+perception.y+'-'+this.possibleDirections[i];
                if(!this.doneMoves.includes(directionKey)) {
                    this.unexploredMoves.push(directionKey);
                }
            }
            
            //No unexplored moves, do nothing
            if(!this.unexploredMoves.length) {
                return 'NOOP';
            }
            var nextMoveKey = this.unexploredMoves.pop();
            var tmp = nextMoveKey.split('-');
            var nextX = tmp[0];
            var nextY = tmp[1];
            var nextAction = tmp[2];
            
            if(this.nextMoveStartsAtCurrentPosition(perception,nextX,nextY)) {
                this.doneMoves.push(nextMoveKey);
                return nextAction;
            }
            else {
                this.mode = 'backtracking';
                //Put back possible move as I cannot do it right now, will need to backtrack to the position
                this.unexploredMoves.push(nextMoveKey);
                
                var nextAction = this.getMoveThatBrinsgMeClosestToNextPosition(perception, nextX, nextY);
                
                return nextAction;
            }
        }
        else {
            //backtracking
            var nextMoveKey = this.unexploredMoves.pop();
            var tmp = nextMoveKey.split('-');
            var nextX = tmp[0];
            var nextY = tmp[1];
            var nextAction = tmp[2];

            //I managed to get back, do the move
            if(this.nextMoveStartsAtCurrentPosition(perception,nextX,nextY)) {
                this.mode = 'exploring';
                
                this.doneMoves.push(nextMoveKey);
                return nextAction;
            }
            
            //Keep backtracking
            var action = this.getMoveThatBrinsgMeClosestToNextPosition(perception,nextX,nextY);
            this.unexploredMoves.push(nextMoveKey);
            return action;
        }
    }
    
    nextMoveStartsAtCurrentPosition(perception, nextX, nextY) {
        return perception.x == nextX && perception.y == nextY;
    }
    
    getMoveThatBrinsgMeClosestToNextPosition(perception, nextX, nextY, excludedActions = []) {
        var selectedAction = '';
        
        if(perception.x < nextX && !excludedActions.includes('LEFT')) {
            selectedAction = 'LEFT';
        }
        if(perception.y < nextY  && !excludedActions.includes('UP')) {
            selectedAction = 'UP';
        }
        if(perception.x > nextX  && !excludedActions.includes('RIGHT')) {
            selectedAction = 'RIGHT';
        }
        if(perception.y > nextY  && !excludedActions.includes('DOWN')) {
            selectedAction = 'DOWN';
        }
        
        if(selectedAction == this.lastAction && perception.x == this.lastX && perception.y == this.lastY) {
            //Last action did not work, so just choose a next best
            excludedActions.push(selectedAction);
            return this.getMoveThatBrinsgMeClosestToNextPosition(perception,nextX,nextY,excludedActions);
        }
        else {
            return selectedAction;
        }

       
    }
    
    getDebugInfo() {
        var str = "Current mode: "+this.mode+"<br/>";
        str+="Not explored actions: "+this.unexploredMoves.join(',')+"<br/>";
        str+="Done moves: "+this.doneMoves.join(',')+"<br/>";
        return str;
    }
    
}

class RationalTwoSquaresSimple {
    getAction(perception) {
        if(perception.isDirty) {
            return 'SUCK';
        }
        if(perception.y == 0) {
            return 'RIGHT';
        }
        else {
            return 'LEFT';
        }
    }
}

class RationalTwoSquaresSimpleWithState {

    constructor() {
        this.leftSquareVisited = false;
        this.rightSquareVisited = false;
    }
    
    getAction(perception) {
        
        if(perception.y == 0) {
            this.leftSquareVisited = true;
        }
        else {
            this.rightSquareVisited = true;
        }
        
        if(perception.isDirty) {
            return 'SUCK';
        }
        if(perception.y == 0 && !this.rightSquareVisited) {
            return 'RIGHT';
        }
        else if(!this.leftSquareVisited){
            return 'LEFT';
        }
        else {
            return 'NOOP';
        }
    }

    
}