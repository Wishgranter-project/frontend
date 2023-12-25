import BaseView from './BaseView';

class ViewWelcome extends BaseView 
{
    static elementName = 'view-welcome';

    render() 
    {
        var p = document.createElement('p');
        p.innerHTML = 'Welcome back';
        this.append(p);
    }
}

ViewWelcome.register();

export default ViewWelcome;
