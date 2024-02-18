import CustomElement from '../CustomElement';

class DiscographyItem extends CustomElement 
{
    static elementName = 'discography-item';

    __construct(album) 
    {
        this.album = album;
    }

    render()
    {
        var rootElement = 'span';
        var attrs = {
            title: this.album.title
        };

        if (!this.album.single) {
            rootElement = 'a';
            attrs.href = `#discover:album?artist=${this.album.artist}&title=${this.album.title}`;
        }

        this.createAndAttach(rootElement, attrs, [
            this.$refs.card = this.create('span', {class: 'card'}, [
                this.create('img', {src: this.album.thumbnail || 'dist/img/missing-cover-art.webp' }),
                this.$refs.title = this.create('h4', null, [this.album.title])
            ])
        ]);

        if (!this.album.single) {
            return;
        }

        this.$refs.title.createAndAttach('span', {class: 'fa fa-hand-pointer-o'});

        this.addEventListener('click', () => 
        {
            this.fireEvent('queue:item-selected', {
                item: {
                    title: this.album.title,
                    artist: this.album.artist
                }
            });
        });
    }

}

DiscographyItem.register();

export default DiscographyItem;
