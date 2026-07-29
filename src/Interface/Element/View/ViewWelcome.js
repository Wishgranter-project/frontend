import BaseView from './BaseView';

/**
 * The welcome screen.
 */
class ViewWelcome extends BaseView
{
    static elementName = 'view-welcome';

    render()
    {
        super.render();

        this.createAndAttach('p', null, 'Wellcome back');
    }
}

ViewWelcome.register();

export default ViewWelcome;
