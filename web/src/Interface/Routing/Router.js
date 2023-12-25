import Route from './Route';
import Request from './Request';

class Router 
{
    /**
     * @param {HTMLElement} stage 
     */
    constructor(stage = null) 
    {
        this.stage  = stage;
        this.routes = [];
    }

    /**
     * @param {HTMLElement} stage 
     */
    setStage(stage) 
    {
        this.stage = stage;
    }

    listenToChanges()
    {
        window.addEventListener('hashchange', this.hashChanged.bind(this));
        this.hashChanged();
    }

    hashChanged(evt = null) 
    {
        var request = Request.createFromGlobals();
        var route   = this.getMatchingRoute(request);
        var element;
        
        if (route) {
            this.clearStage();
            element = this.call(route, request);
            this.stageIt(element);
        } else if (this.notFoundCallback) {
            this.clearStage();
            element = this.notFoundCallback(route, request);
            this.stageIt(element);
        }
    }

    clearStage() 
    {
        this.stage.querySelectorAll(':scope > *').forEach((e) => 
        {
            e.remove();
        });
    }

    /**
     * @param {HTMLElement} element 
     */
    stageIt(element) 
    {
        this.stage.append(element);
    }

    /**
     * @param {Route} route 
     * @param {Request} request 
     * 
     * @return {HTMLElement}
     */
    call(route, request) 
    {
        return route.callIt(request);
    }

    /**
     * @param {Request} request 
     * 
     * @return {Route}
     */
    getMatchingRoute(request) 
    {
        for (var route of this.routes) {
            if (route.doesItMatcheRequest(request)) {
                return route;
            }
        }

        return null;
    }

    /**
     * @param {RegExp} pattern 
     * @param {callable} callback
     * 
     * @return this
     */
    addRouter(pattern, callback) 
    {
        this.routes.push(new Route(pattern, callback));
        return this;
    }
}

export default Router;
