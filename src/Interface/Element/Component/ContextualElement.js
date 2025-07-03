import CustomElement from '../CustomElement';
import FloatMenu from './FloatMenu/FloatMenu';

/**
 * Describes an element that makes use of a contextual menu.
 *
 * @abstract
 */
class ContextualElement extends CustomElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'contextual-element';

    /**
     * @inheritdoc
     */
    render()
    {
        this.$refs.footer = this.createAndAttach('div', {class: 'playlist-item__footer'});       

        this.addEventListener('contextmenu', (evt) => 
        {
            evt.preventDefault();
            this.openContextMenu(evt);
        });
    }

    /**
     * Returns the actions available by default.
     *
     * @returns {Object}
     * Object describing the default options for the context menu.
     */
    getDefaultContextActions()
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
     * Returns the actions available.
     *
     * @returns {Object}
     * Object describing the options for the context menu.
     */
    getContextActions()
    {
        var actions = this.getDefaultContextActions();
        this.fireEvent('context-menu:actions:invite-alter', {actions});
        return actions;
    }

    /**
     * Opens the context menu.
     *
     * Before rendering the menu, invites the parent elements to alter it.
     *
     * @param {Event} contextMenuEvent
     * The context menu event.
     */
    openContextMenu(contextMenuEvent)
    {
        this.actions = this.getContextActions();
        var menu = FloatMenu.instantiate(this.actions);
        this.append(menu);
        menu.open(contextMenuEvent, contextMenuEvent.clientX, contextMenuEvent.clientY);
    }
}

// ContextualElement.register();

export default ContextualElement;
