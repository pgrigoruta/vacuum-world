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
        this.donePositions = [];
        this.backtrackingMoves = [];
        this.mode = 'exploring';
        this.debug = true;
        this.backtrackingTo = null;
        
        this.lastX = 0;
        this.lastY = 0;
        this.lastAction = '';
        
    }
    
    getAction(perception) {
        
        if(perception.type == 'bump') {
            if(!perception.bump) {
                switch(this.lastAction) {
                    case 'UP':
                        perception.x = this.lastX -1;
                        perception.y = this.lastY;
                        break;
                    case 'DOWN':
                        perception.x = this.lastX +1;
                        perception.y = this.lastY;
                        break;
                    case 'LEFT':
                        perception.x = this.lastX;
                        perception.y = this.lastY - 1;
                        break;
                    case 'RIGHT':
                        perception.x = this.lastX;
                        perception.y = this.lastY + 1;
                        break;
                    default:
                        perception.x = this.lastX;
                        perception.y = this.lastY;
                }
            }
            else {
                perception.x = this.lastX;
                perception.y = this.lastY;
            }
            
        }
        
        if(!this.donePositions.length) {
            var positionKey = perception.x+'-'+perception.y;
            if(!this.donePositions.includes(positionKey)) {
                this.donePositions.push(positionKey);
            }
        }
        
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
            
            while(this.unexploredMoves.length) {
                var nextMoveKey = this.unexploredMoves.pop();
                var tmp = nextMoveKey.split('-');
                var nextX = tmp[0];
                var nextY = tmp[1];
                var nextAction = tmp[2];
                
                var nextPosition = this.getNextPositionBasedOnAction(nextX,nextY,nextAction);
                if(!this.donePositions.includes(nextPosition[0]+'-'+nextPosition[1])) {
                    break;
                }
            }
            
            
            if(this.nextMoveStartsAtCurrentPosition(perception,nextX,nextY)) {
                this.doneMoves.push(nextMoveKey);
                this.donePositions.push(nextPosition[0]+'-'+nextPosition[1]);
                return nextAction;
            }
            else {
                this.mode = 'backtracking';
                this.backtrackingMoves = [];
                //Put back possible move as I cannot do it right now, will need to backtrack to the position
                this.unexploredMoves.push(nextMoveKey);
                
                var nextAction = this.getMoveThatBrinsgMeClosestToNextPosition(perception, nextX, nextY);
                
                return nextAction;
            }
        }
        else {
            //backtracking
            var nextMoveKey = this.unexploredMoves.pop();
            this.backtrackingTo = nextMoveKey;
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
    
    getNextPositionBasedOnAction(x,y,action) {
        switch(action) {
            case 'LEFT':
                y--;
                break;
            case 'RIGHT':
                y++;
                break;
            case 'UP':
                x--;
                break;
            case 'DOWN':
                x++;
                break;
            default:
        }
        return [x,y];
    }
    
    getMoveThatBrinsgMeClosestToNextPosition(perception, nextX, nextY) {
        var selectedAction = '';
        
        if(perception.x > parseInt(nextX)) {
            selectedAction = 'UP';
        }
        else if(perception.y < parseInt(nextY)) {
            selectedAction = 'RIGHT';
        }
        else if(perception.x < parseInt(nextX)) {
            selectedAction = 'DOWN';
        }
        else if(perception.y > parseInt(nextY)) {
            selectedAction = 'LEFT';
        }
        
        
        
        
        var actionKey = perception.x+'-'+perception.y+'-'+selectedAction;
        
        if(this.backtrackingMoves.includes(actionKey)) {
            selectedAction = this.possibleDirections[Math.floor(Math.random() * this.possibleDirections.length)];
            actionKey = perception.x+'-'+perception.y+'-'+selectedAction;
            
        }
        this.backtrackingMoves.push(actionKey);
        return selectedAction;

       
    }
    
    getDebugInfo() {
        var str = "Current mode: "+this.mode+"<br/>";
        str+="Not explored actions: "+this.unexploredMoves.join(',')+"<br/>";
        str+="Done moves: "+this.doneMoves.join(',')+"<br/>";
        if(this.backtrackingTo) str+="Backtracking to: "+this.backtrackingTo;
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