import CustomElement from '../../CustomElement';

class PopupMenuItem extends CustomElement 
{
    static elementName = 'popup-menuitem';

    __construct(parentMenu, title, helpText, icon, onClick) 
    {
        this.parentMenu = parentMenu;
        this.title      = title;
        this.helpText   = helpText;
        this.icon       = icon;
        this.onClick    = onClick;
    }
    
    render() 
    {
        this.classList.add('popup-menu__item');
        this.$refs.body = this.createAndAttach('div', {title: this.helpText}, this.title);
        this.addEventListener('click', this.onClick);
        this.addEventListener('click', (evt) => 
        {
            evt.stopPropagation();
            this.parentMenu.close();
        });
    }
}

PopupMenuItem.register();

export default PopupMenuItem;