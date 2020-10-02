class Controller {
    
    constructor(settings) {
        this.settings = {
            'stepTime': 1000,
            'envSelector': '#render',
            'currentTimeSelector': '#currentTime',
            env: {
                cols: 10,
                rows: 10
            }
        }

        this.settings = $.extend({}, this.settings, settings || {});
        
    }
    
    step() {
        $(this.settings.envSelector).html(this.env.render());
        $(this.settings.currentTimeSelector).html(this.env.getTime());
    }
    
    start() {
        this.env = new Environment(this.settings.env);
        this.playMethod = setInterval( () => this.step(), this.settings.stepTime);
    }
    
    stop() {
        clearInterval(this.playMethod);
    }
}
