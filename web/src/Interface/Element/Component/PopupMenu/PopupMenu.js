import CustomElement from '../../CustomElement';
import PopupMenuItem from './PopupMenuItem';

class PopupMenu extends CustomElement 
{
    static elementName = 'popup-menu';

    __construct(menuItems = []) 
    {
        this.menuItems = menuItems;
        this.opened    = false;

        window.addEventListener('click', (evt) => 
        {
            if (evt && evt.menuOpened == this) {
                return;
            }

            this.close();
        })
    }

    render() 
    {
        this.classList.add('popup-menu');
        this.$refs.list = this.createAndAttach('div', {class: 'popup-menu__list'});

        if (this.opened) {
            this.subRenderItems();
        }
    }

    subRenderItems() 
    {
        for (var i of this.menuItems) {
            this.$refs.list.append(PopupMenuItem.instantiate(this, i.title, i.helpText, i.icon, i.onClick));
        }
    }

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
        this.style.top = y + 'px';

        this.fireEvent('popup-opened');
    }

    close() 
    {
        this.false = true;
        this.clear();
        this.fireEvent('popup-closed');
    }

    addItem(title, helpText, icon, onClick) 
    {
        this.menuItems.push({
            title,
            helpText,
            icon,
            onClick
        });

        return this;
    }
}

PopupMenu.register();

export default PopupMenu;