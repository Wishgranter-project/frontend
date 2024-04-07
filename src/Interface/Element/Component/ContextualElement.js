import CustomElement from '../CustomElement';
import FloatMenu from './FloatMenu/FloatMenu';

class ContextualElement extends CustomElement 
{
    // static elementName = 'contextual-element';

    __construct() 
    {
        this.actions = this.getContextActions();
    }

    render() 
    {
        this.$refs.footer = this.createAndAttach('div', {class: 'playlist-item__footer'});       

        this.addEventListener('contextmenu', (evt) => 
        {
            evt.preventDefault();
            this.openContextMenu(evt);
        });
    }

    getContextActions() 
    {
        var actions = {
            helloWorld: {
                title: 'Hello world',
                helpText: 'says hello',
                icon: 'fa-plus',
                onClick: () => 
                {
                    alert('Hello World');
                }
            }
        }

        return actions;
    }

    openContextMenu(evt) 
    {
        var menu = FloatMenu.instantiate(this.actions);
        this.append(menu);
        menu.open(evt, evt.clientX, evt.clientY);
    }
}

// ContextualElement.register();

export default ContextualElement;
