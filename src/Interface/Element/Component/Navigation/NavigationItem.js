import CustomElement from '../../CustomElement';

class NavigationItem extends CustomElement 
{
    static elementName = 'navigation-item';

    __construct(label, icon, href)
    {
        this.label = label;
        this.icon  = icon;
        this.href  = href;
    }

    render()
    {
        this.classList.add('app-navigation__item');

        var attrs = {
            title: this.label
        };

        if (this.href) {
            attrs.href = this.href;
        }

        this.$refs.a = this.createAndAttach('a', attrs);

        var icon = this.icon
            ? this.create('span', {class: 'fa ' + this.icon})
            : null;

        var label = this.create('span', {class: 'label ellipsis'}, this.label);

        this.$refs.a.attach([icon, label]);
    }
}

NavigationItem.register();

export default NavigationItem;
