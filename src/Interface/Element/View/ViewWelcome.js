import BaseView from './BaseView';

/**
 * The welcome screen.
 */
class ViewWelcome extends BaseView
{
    static elementName = 'view-welcome';

    /**
     * @inheritdoc
     */
    __construct(hashRequest, api)
    {
        super.__construct();
        this.api = api;
    }

    render()
    {
        super.render();
        this.classList.add('view-welcome');

        this.createAndAttach('h2', null, 'Wellcome back');

        this.$refs.grid = this.createAndAttach('div', {class: 'grid'});

        this.api.manageUser().collection.artists.fetch().then((response) => 
        {
            for (var artist in response.data) {
                this.$refs.grid.createAndAttach('div', {class: 'col-2'}, 
                    this.create('a', {href: `#user:${this.api.defaultUserId}/search?artist=${artist}`, 'data-tabbed-router-title': artist, target: '_blank', class: 'btn'}, [
                        artist,
                        this.create('span', {class: 'badge'}, response.data[artist]),
                    ]),
                );
            }
        });
    }
}

ViewWelcome.register();

export default ViewWelcome;
