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
                
            },
            agentClass: 'ReflexAgent'
        }
        

        this.settings = $.extend({}, this.settings, settings || {});
        
    }
    
    step() {
        this.env.measurePerformance();
        $(this.settings.envSelector).html(this.env.render());
        $(this.settings.currentTimeSelector).html(this.env.getTime());
        $('#current_agent_x').html(this.env.getAgentX());
        $('#current_agent_y').html(this.env.getAgentY());
        
        
        var perception = this.env.getPerception();
        var action = this.agent.getAction(perception);
        
        $(this.settings.currentActionSelector).html(action);
        
        this.env.executeAction(action);
        
    }
    
    start() {
        this.env = new Environment(this.settings.env);
        this.agent = eval(`new ${this.settings.agentClass}()`);
        this.playMethod = setInterval( () => this.step(), this.settings.stepTime);
    }
    
    stop() {
        clearInterval(this.playMethod);
    }
}
