import ViewElement from './ViewElement';

class Welcome extends ViewElement 
{
    static elementName = 'view-welcome';

    render() 
    {
        var p = document.createElement('p');
        p.innerHTML = 'Welcome back';
        this.append(p);
    }
}

Welcome.register();

export default Welcome;
