class ReflexAgent {
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