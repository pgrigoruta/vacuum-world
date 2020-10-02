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