class Environment {
    constructor(settings) {
        this.settings = {
            'cols': 10,
            'rows': 10,
            'dirtySquares': 'random',
            'agentPosition': [0,0],
            'time': 0
        }

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
        
    }
    
    render() {
        var html = '';
        
        html+="<table>";
        
        for(var i=0;i<this.settings.rows;i++) {
            html+="<tr>";
            for(var j=0;j<this.settings.cols;j++) {
                var classes = '';

                var filtered = $(this.settings.dirtySquares).filter(function(){
                    return i==this[0] && j==this[1];
                });
                if(filtered.length > 0){
                    classes+="dirty ";
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
    
    getTime() {
        return this.settings.time;
    }

    
}