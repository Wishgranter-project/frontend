import CustomElement from '../../CustomElement';

class FloatMenuItem extends CustomElement
{
    /**
     * @inheritdoc
     */
    static elementName = 'float-menu-item';

    /**
     * Constructor.
     *
     * @param {String} title
     * Human readable label.
     * @param {String} helpText
     * Human readable text.
     * @param {String} icon
     * Icon to go with the label.
     * @param {Function} onClick
     * Callback.
     */
    __construct(title, helpText, icon, onClick)
    {
        super.__construct();
        this.title      = title;
        this.helpText   = helpText;
        this.icon       = icon;
        this.onClick    = onClick;
    }
    
    /**
     * @inheritdoc
     */
    render()
    {
        this.classList.add('float-menu__item');
        this.$refs.body = this.createAndAttach('div', {title: this.helpText}, this.title);
        this.addEventListener('click', (evt) => 
        {
            evt.stopPropagation();
            this.onClick(evt);
            this.fireEvent('float-menu-item:selected');
        });

        this.addEventListener('mousedown', (evt) =>
        {
            evt.stopPropagation();
        });

        this.addEventListener('mouseup', (evt) =>
        {
            evt.stopPropagation();
        });
    }
}

FloatMenuItem.register();

export default FloatMenuItem;
