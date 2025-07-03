import CustomElement from '../../CustomElement';
import PopupMenu from './PopupMenu';

class PopupButton extends CustomElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'popup-button';

    __construct(menuItems = [])
    {
        super.__construct();
        this.menuItems = menuItems;
        this.menu      = null;
    }

    /**
     * @inheritdoc
     */
    render()
    {
        this.classList.add('popup-button');

        var length = this.menuItems.length;
        var title = '';
        var cssClass;

        if (length == 1) {
            cssClass = 'fa ' + this.menuItems[0].icon;
            title = this.menuItems[0].title;
        } else {
            cssClass = 'fa fa-ellipsis-v';
        }

        this.$refs.button = this.createAndAttach('button', null, this.create('span', { title, class: cssClass }));

        this.addEventListenerOnce('click', 'click', this.onClick.bind(this));

        this.addEventListenerOnce('popup-closed', 'popup-closed', () => 
        {
            this.$refs.popupMenu.remove();
            this.$refs.popupMenu = null;
        })
    }

    onClick(evt)
    {
        var length = this.menuItems.length;

        if (length == 0) {
            return;
        }
        
        if (length == 1) {
            // call the only event listener
            this.menuItems[0].onClick(evt);
            return;
        }
        
        // Menu already opened
        if (this.$refs.popupMenu) {
            //evt.stopPropagation();
            return;
        }
        
        // open the menu
        this.$refs.popupMenu = this.attach(PopupMenu.instantiate(this.menuItems));
        this.$refs.popupMenu.open(evt, evt.clientX, evt.clientY);
    }

    addItem(title, helpText, icon, onClick)
    {
        this.menuItems.push({
            title,
            helpText,
            icon,
            onClick
        });

        this.refresh();

        return this;
    }
}

PopupButton.register();

export default PopupButton;