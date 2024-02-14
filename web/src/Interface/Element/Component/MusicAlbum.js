import CustomElement from '../CustomElement';

class MusicAlbum extends CustomElement 
{
    static elementName = 'music-album';

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
            attrs.href = `#discover:release?artist=${this.album.artist}&title=${this.album.title}`;
        }

        this.createAndAttach(rootElement, attrs, [
            this.create('span', {class: 'card'}, [
                this.create('img', {src: this.album.thumbnail || 'dist/img/missing-cover-art.webp' }),
                this.create('h4', null, [this.album.title])
            ])
        ]);

        if (!this.album.single) {
            return;
        }

        this.addEventListener('click', () => 
        {
            this.fireEvent('item-selected', {
                item: {
                    title: this.album.title,
                    artist: this.album.artist
                }
            });
        });
    }

}

MusicAlbum.register();

export default MusicAlbum;
