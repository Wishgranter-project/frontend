import CustomElement from '../Element/CustomElement';
import ObjectsHelper from '../../Helper/Objects';

class Route 
{
    /**
     * @param {RegExp} pattern 
     * @param {callable} callback
     */
    constructor(patterns, callback) 
    {
        this.patterns    = Array.isArray(patterns)
            ? patterns
            : [patterns];

        this.callback    = callback;
    }

    /**
     * @param {Request} request 
     * 
     * @return {HTMLElement}
     */
    callIt(request) 
    {
        var pattern    = this.getMatchingPattern(request.path);
        var matches    = pattern.exec(request.path);
        var attributes = matches.groups;
        var element;

        request.attributes = attributes || {};

        if (typeof this.callback == 'string') {

            element = document.createElement(this.callback);

        } else if (ObjectsHelper.isA(this.callback, CustomElement)) {

            element = this.callback.instantiate.apply(this.callback, attributes ?? []);

        } else if (typeof this.callback == 'function') {

            element = this.callback.apply(this, [request]);

        }

        return element;
    }

    /**
     * @param {Request} request 
     * 
     * @return {bool}
     */
    doesItMatcheRequest(request) 
    {
        return this.getMatchingPattern(request.path)
            ? true
            : false;
    }

    getMatchingPattern(path) 
    {
        for (var pattern of this.patterns) {
            if (path.match(pattern)) {
                return pattern;
            }
        }

        return null;
    }
}

export default Route;
