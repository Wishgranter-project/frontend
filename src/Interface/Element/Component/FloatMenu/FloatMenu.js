import CustomElement from '../../CustomElement';
import FloatMenuItem from './FloatMenuItem';

/**
 * A floating menu.
 *
 * @class
 */
class FloatMenu extends CustomElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'float-menu';

    /**
     * Constructor.
     *
     * @param {Object} menuActions
     * Object describing the menu items.
     */
    __construct(menuActions = {})
    {
        super.__construct();
        this.menuActions = menuActions;
        this.opened      = false;

        this.addEventListener('float-menu-item:selected', this.close.bind(this));
        window.document.addEventListener('float-menu:opened', this.closeAndRemove.bind(this));
        window.document.addEventListener('click', this.closeAndRemove.bind(this));
    }

    /**
     * @inheritdoc
     */
    render()
    {
        this.classList.add('float-menu');
        this.$refs.list = this.createAndAttach('div', {class: 'float-menu__list'});

        if (this.opened) {
            this.subRenderItems();
        }
    }

    /**
     * Renders the menu items.
     *
     * @protected
     */
    subRenderItems()
    {
        for (var p in this.menuActions) {
            var i = this.menuActions[p];
            this.$refs.list.append(FloatMenuItem.instantiate(i.title, i.helpText, i.icon, i.onClick));
        }
    }

    /**
     * Closes and remove the menu from the DOM.
     *
     * @param {Event} evt
     * The event to close it.
     */
    closeAndRemove(evt)
    {
        if (e.detail.menu && e.detail.menu == this) {
            return;
        }

        this.close()
            .remove();
    }

    /**
     * Open the menu.
     *
     * @param {Event} evt
     * The event that opened the menu.
     * @param {Integer} originX
     * Where to display it.
     * @param {Integer} originY
     * Where to display it.
     *
     * @returns {FloatMenu}
     * Itself.
     */
    open(evt, originX = 0, originY = 0)
    {
        evt.menuOpened = this;

        this.opened = true;

        this.refresh();
        var x, y, thisWidth, thisHeight;

        thisWidth  = this.$refs.list.offsetWidth;
        thisHeight = this.$refs.list.offsetHeight;

        x = originX + thisWidth > window.innerWidth
            ? window.innerWidth - thisWidth
            : originX;
        
        y = originY + thisHeight > window.innerHeight
            ? window.innerHeight - thisHeight
            : originY;
        
        this.style.left = x + 'px';
        this.style.top  = y + 'px';

        this.fireEvent('float-menu:opened', { menu: this });

        return this;
    }

    /**
     * Closes the menu.
     *
     * @returns {FloatMenu}
     * Itself.
     */
    close()
    {
        this.opened = true;
        this.clear();
        this.fireEvent('float-menu:closed');
        return this;
    }

    /**
     * Adds an item to the menu.
     *
     * @param {String} id
     * The id of the menu item.
     * @param {String} title
     * Human readable label.
     * @param {String} helpText
     * Human readable text.
     * @param {String} icon
     * Icon to go with the label.
     * @param {Function} onClick
     * Callback.
     *
     * @returns {FloatMenu}
     * Itself.
     */
    addMenuItem(id, title, helpText, icon, onClick)
    {
        this.menuItems[id] = {
            title,
            helpText,
            icon,
            onClick
        };

        return this;
    }
}

FloatMenu.register();

export default FloatMenu;
