import CustomElement from '../CustomElement';
import FloatMenu from './FloatMenu/FloatMenu';

/**
 * Abstract class, describes an element with a contextual menu.
 */
class ContextualElement extends CustomElement 
{
    // static elementName = 'contextual-element';

    __construct() 
    {
        // something something.
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

    /**
     * Opens the context menu.
     *
     * Before rendering the menu, invites the parent elements to alter it.
     *
     * @param {Event} contextMenuEvent 
     */
    openContextMenu(contextMenuEvent) 
    {
        this.actions = this.getContextActions();
        this.fireEvent('context-menu:actions:invite-alter', {actions: this.actions});
        var menu = FloatMenu.instantiate(this.actions);
        this.append(menu);
        menu.open(contextMenuEvent, contextMenuEvent.clientX, contextMenuEvent.clientY);
    }
}

// ContextualElement.register();

export default ContextualElement;
