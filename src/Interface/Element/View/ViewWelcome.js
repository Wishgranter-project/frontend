import BaseView from './BaseView';

/**
 * The welcome screen.
 */
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
