import CustomElement from '../../CustomElement';

class FloatMenuItem extends CustomElement 
{
    static elementName = 'float-menu-item';

    __construct(title, helpText, icon, onClick) 
    {
        this.title      = title;
        this.helpText   = helpText;
        this.icon       = icon;
        this.onClick    = onClick;
    }
    
    render() 
    {
        this.classList.add('float-menu__item');
        this.$refs.body = this.createAndAttach('div', {title: this.helpText}, this.title);
        this.addEventListener('click', (evt) => 
        {
            evt.stopPropagation();
            this.onClick();
            this.fireEvent('float-menu-item:selected');
        });
    }
}

FloatMenuItem.register();

export default FloatMenuItem;