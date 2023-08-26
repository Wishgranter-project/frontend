import CustomElement from '../CustomElement';

class PlaylistItem extends CustomElement 
{
    static elementName = 'playlist-item';

    __construct(item = {}) 
    {
        this.item = item;
    }

    render() 
    {
        this.innerHTML = ``;
        this.classList.add('playlist-item');
    
        if (this.item.title) {
            var title = this.createAndAttach('span', {class: 'title'}, [ this.item.title ]);
        }

        if (this.item.artist) {
            var artists = Array.isArray(this.item.artist) 
                ? this.item.artist
                : [this.item.artist];

            for (var artist of artists) {
                this.createAndAttach('span', {class: 'playlist-item__artist'}, [ 
                    this.create('a', {href: `#search?artist=${artist}` }, artist), 
                    ' ',
                    this.create('a', {href: `#discover:releases?artist=${artist}`}, [this.createAndAttach('span', {class: 'fa fa-search'}) ])
                ]);
            }            
        }

        if (this.item.soundtrack) {
            var featuredIn = Array.isArray(this.item.soundtrack) 
                ? this.item.soundtrack
                : [this.item.soundtrack];

            for (var featuring of featuredIn) {
                this.createAndAttach('span', {class: 'playlist-item__soundtrack'}, [ 
                    this.create('a', {href: `#search?soundtrack=${featuring}` }, featuring)
                ]);
            }
        }

        if (this.item.genre) {
            var genres = Array.isArray(this.item.genre) 
                ? this.item.genre
                : [this.item.genre];

            for (var genre of genres) {
                this.createAndAttach('span', {class: 'playlist-item__genre'}, [ 
                    this.create('a', {href: `#search?genre=${genre}` }, genre)
                ]);
            }
        }

        if (this.item.uuid) {
            this.createAndAttach('a', {href: `#item:${this.item.uuid}/edit`, title: 'Edit'}, 
                this.createAndAttach('span', {class: 'fa fa-pencil'})
            );
        }

        title.addEventListener('click', () => 
        {
            this.dispatchEvent(new CustomEvent('item-selected', {
                bubbles: true,
                detail: this.item
            }));
        });
    }
}

PlaylistItem.register();

export default PlaylistItem;
