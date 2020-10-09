class Controller {
    
    constructor(settings) {
        this.settings = {
            'stepTime': $('#time_between_actions').val(),
            'envSelector': '#render',
            'currentTimeSelector': '#currentTime',
            'currentActionSelector': '#currentAction',
            env: {
                cols: 10,
                rows: 10,
                performanceMeasure:'',
                perceptionType: 'position'
                
            },
            agentClass: 'ReflexAgent',
            timeSteps: 10,
            advanceManually: false
        }
        

        this.settings = $.extend({}, this.settings, settings || {});
        
    }
    
    step() {
        if(this.env.getTime() >= parseInt(this.settings.timeSteps)) {
            this.stop();
            return;
        }
        
        $(this.settings.envSelector).html(this.env.render());
        $(this.settings.currentTimeSelector).html(this.env.getTime());
        $('#current_agent_x').html(this.env.getAgentX());
        $('#current_agent_y').html(this.env.getAgentY());
        $('#performance').html(this.env.measurePerformance());
        if(this.agent.debug) {
            $('#reasoning').html(this.agent.getDebugInfo());
        }
        
        var perception = this.env.getPerception();
        var action = this.agent.getAction(perception);
        
        $(this.settings.currentActionSelector).html(action);
        
        this.env.executeAction(action);
        
    }
    
    start() {
        this.env = new Environment(this.settings.env);
        this.agent = eval(`new ${this.settings.agentClass}()`);
        if(!this.settings.advanceManually) {
            this.playMethod = setInterval( () => this.step(), this.settings.stepTime);    
        }
        
    }
    
    stop() {
        clearInterval(this.playMethod);
    }
}
