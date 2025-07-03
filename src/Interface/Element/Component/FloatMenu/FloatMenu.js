import CustomElement from '../../CustomElement';
import FloatMenuItem from './FloatMenuItem';

class FloatMenu extends CustomElement 
{
    static elementName = 'float-menu';

    __construct(menuActions = {}) 
    {
        super.__construct();
        this.menuActions = menuActions;
        this.opened      = false;

        this.addEventListener('float-menu-item:selected', this.close.bind(this));
        window.document.addEventListener('float-menu:opened', this.closeAndRemove.bind(this));
        window.document.addEventListener('click', this.closeAndRemove.bind(this));
    }

    closeAndRemove(e) 
    {
        if (e.detail.menu && e.detail.menu == this) {
            return;
        }

        this.close()
            .remove();
    }

    render() 
    {
        this.classList.add('float-menu');
        this.$refs.list = this.createAndAttach('div', {class: 'float-menu__list'});

        if (this.opened) {
            this.subRenderItems();
        }
    }

    subRenderItems() 
    {
        for (var p in this.menuActions) {
            var i = this.menuActions[p];
            this.$refs.list.append(FloatMenuItem.instantiate(i.title, i.helpText, i.icon, i.onClick));
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
        this.style.top  = y + 'px';

        this.fireEvent('float-menu:opened', { menu: this });

        return this;
    }

    close() 
    {
        this.opened = true;
        this.clear();
        this.fireEvent('float-menu:closed');
        return this;
    }

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