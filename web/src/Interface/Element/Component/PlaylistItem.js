import CustomElement from '../CustomElement';

class PlaylistItem extends CustomElement 
{
    static elementName = 'playlist-item';

    __construct(item = {}) 
    {
        this.item = item;

        if (!this.item.artist) {
            this.item.artist = [];
        } else {
            this.item.artist = Array.isArray(this.item.artist)
                ? this.item.artist
                : [this.item.artist];
        }

        if (!this.item.soundtrack) {
            this.item.soundtrack = [];
        } else {
            this.item.soundtrack = Array.isArray(this.item.soundtrack)
                ? this.item.soundtrack
                : [this.item.soundtrack];
        }
    }

    render() 
    {
        this.innerHTML = ``;
        this.classList.add('playlist-item');

        this.$refs.body = this.createAndAttach('div', {class: 'playlist-item__body'});
        this.$refs.action = this.createAndAttach('div', {class: 'playlist-item__actions'});
    
        if (this.item.title) {
            this.$refs.title = this.$refs.body.createAndAttach('span', {class: 'playlist-item__title'}, [ this.item.title ]);
        }

        for (var artist of this.item.artist) {
            this.$refs.body.createAndAttach('span', {class: 'playlist-item__artist playlist-item__info'}, [ 
                this.create('a', {href: `#search?artist=${artist}` }, artist), 
                ' ',
                this.create('a', {href: `#discover:releases?artist=${artist}`}, [this.createAndAttach('span', {class: 'fa fa-search'}) ])
            ]);
        }

        for (var soundtrack of this.item.soundtrack) {
            this.$refs.body.createAndAttach('span', {class: 'playlist-item__soundtrack playlist-item__info'}, [ 
                this.create('a', {href: `#search?soundtrack=${soundtrack}` }, soundtrack)
            ]);
        }

        if (this.item.uuid) {
            this.$refs.editButton = this.$refs.action.createAndAttach('a', {href: `#item:${this.item.uuid}/edit`, title: 'Edit'}, 
                this.createAndAttach('span', {class: 'fa fa-pencil'})
            );
        }

        this.$refs.title.addEventListener('click', () => 
        {
            this.dispatchEvent(new CustomEvent('item-selected', {
                bubbles: true,
                detail: {
                    item: this.item
                }
            }));
        });
    }
}

PlaylistItem.register();

export default PlaylistItem;
