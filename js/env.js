class Environment {
    constructor(settings) {
        this.settings = {
            'cols': 10,
            'rows': 10,
            'dirtySquares': 'random',
            'blockedSquares': 'random',
            'agentPosition': [0,0],
            'time': 0,
            'performanceMeasure': 'numcleansquares',
            'perceptionType': 'position'
        }
        this.lastActionBumped = false;

        this.settings = $.extend({}, this.settings, settings || {});
    
        if(this.settings.dirtySquares == 'random') {
            this.settings.dirtySquares = [];
            for(var i=0;i<this.settings.rows;i++) {
                for(var j=0;j<this.settings.cols;j++) {
                    var chance = Math.floor(Math.random() * 4) + 1;
                    if(chance == 1) {
                        this.settings.dirtySquares.push([i,j]);
                    }
                }
            }
        }

        if(this.settings.blockedSquares == 'random') {
            this.settings.blockedSquares = [];
            for(var i=0;i<this.settings.rows;i++) {
                for(var j=0;j<this.settings.cols;j++) {
                    var chance = Math.floor(Math.random() * 10) + 1;
                    if(chance == 1 && !this.isSquareDirty(i,j) && !this.isSquareWithAgent(i,j)) {
                        this.settings.blockedSquares.push([i,j]);
                    }
                }
            }
        }
        
        this.performance = 0;
        this.lastAction = '';
        
    }
    
    render() {
        var html = '';
        
        html+="<table>";
        
        for(var i=0;i<this.settings.rows;i++) {
            html+="<tr>";
            for(var j=0;j<this.settings.cols;j++) {
                var classes = '';

               
                if(this.isSquareDirty(i,j)){
                    classes+="dirty ";
                }
                if(this.isSquareBlocked(i,j)){
                    classes+="blocked ";
                }
                
                var occupant = '&nbsp;';
                if(this.settings.agentPosition[0] == i && this.settings.agentPosition[1] == j) {
                    occupant = 'A';
                }
                
                html+="<td class='"+classes+"'>"+occupant+"</td>";
            }
            html+="</tr>";
        } 
        
        html+="</table>";
        
        this.settings.time++;
        
        return html;
    }
    

    measurePerformance() {
        return eval(`this.performance_${this.settings.performanceMeasure}()`);
    }
    
    performance_numcleansquares() {
        this.performance+= (this.settings.rows*this.settings.cols)-this.settings.dirtySquares.length-this.settings.blockedSquares.length;
        return this.performance;
    }
    performance_numcleansquaresmovepenalize() {
        this.performance+= (this.settings.rows*this.settings.cols)-this.settings.dirtySquares.length-this.settings.blockedSquares.length;
        if(['LEFT','RIGHT','UP','DOWN'].includes(this.lastAction)) {
            this.performance--;
        }
        return this.performance;
    }
    performance_timetillclean() {
        if(this.settings.dirtySquares.length > 0) {
            this.performance++;
            return this.performance;
        }
        else {
            return this.performance;
        }
    }
    
    getTime() {
        return this.settings.time;
    }
    
    isSquareDirty(i,j) {
        var filtered = $(this.settings.dirtySquares).filter(function(){
            return i==this[0] && j==this[1];
        });
        return filtered.length > 0;
    }
    isSquareBlocked(i,j) {
        var filtered = $(this.settings.blockedSquares).filter(function(){
            return i==this[0] && j==this[1];
        });
        return filtered.length > 0;
    }
    isSquareWithAgent(i,j) {
        return this.getAgentX() == i && this.getAgentY() == j;
    }
    
    getAgentX() {
        return this.settings.agentPosition[0];
    }

    getAgentY() {
        return this.settings.agentPosition[1];
    }

    executeAction(action) {
        this.lastActionBumped = false;
        
        switch (action) {
            case 'SUCK':
                for(var i=0;i<this.settings.dirtySquares.length;i++) {
                    var currentDirtySquare = this.settings.dirtySquares[i];
                    if(currentDirtySquare[0] == this.settings.agentPosition[0] && currentDirtySquare[1] == this.settings.agentPosition[1]) {
                        this.settings.dirtySquares.splice(i, 1);
                    }
                }
                break;
            case 'LEFT':
                if(this.settings.agentPosition[1] > 0 && !this.isSquareBlocked(this.getAgentX(),this.getAgentY()-1)) {
                    this.settings.agentPosition[1]-=1;
                }
                else {
                    this.lastActionBumped = true;
                }
                break;
            case 'RIGHT':
                if(this.settings.agentPosition[1] < this.settings.cols - 1 && !this.isSquareBlocked(this.getAgentX(),this.getAgentY()+1)) {
                    this.settings.agentPosition[1]+=1;
                }
                else {
                    this.lastActionBumped = true;
                }
                break;
            case 'UP':
                if(this.settings.agentPosition[0] > 0 && !this.isSquareBlocked(this.getAgentX() -1 ,this.getAgentY())) {
                    this.settings.agentPosition[0]-=1;
                }
                else {
                    this.lastActionBumped = true;
                }
                break;
            case 'DOWN':
                if(this.settings.agentPosition[0] < this.settings.rows - 1 && !this.isSquareBlocked(this.getAgentX() + 1,this.getAgentY())) {
                    this.settings.agentPosition[0]+=1;
                }
                else {
                    this.lastActionBumped = true;
                }
                break;
            case 'NOOP':
                break;
        }
        this.lastAction = action;
    }

    getPerception() {
        var perception = {}
        perception.isDirty = this.isSquareDirty(this.settings.agentPosition[0],this.settings.agentPosition[1]);
        perception.type = this.settings.perceptionType;
        
        if(this.settings.perceptionType == 'position') {
            perception.x = this.settings.agentPosition[0];
            perception.y = this.settings.agentPosition[1];    
        }
        else {
            perception.bump = this.lastActionBumped;
        }
        
        
        return perception;
    }
    
}