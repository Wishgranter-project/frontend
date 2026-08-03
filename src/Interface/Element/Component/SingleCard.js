import AlbumCard from './AlbumCard';

/**
 * Represents an single in an artist's discography.
 *
 * @class
 */
class SingleCard extends AlbumCard
{
    /**
     * @inheritdoc
     */
    static elementName = 'single-card';

    /**
     * Constructor.
     *
     * @param {Object} album
     * Description of the album.
     */
    __construct(album)
    {
        super.__construct();
        this.album = album;
    }

    subrenderCore()
    {
        var attributes = {
            title: this.album.artist + ' - ' + this.album.title
        }

        this.createAndAttach('span', attributes, [
            this.subRenderThumbnail(),
            this.create('h4', null, [
                this.album.title,
                this.create('span', {class: 'fa fa-hand-pointer-o'})
            ])
        ]);
    }

    getItem()
    {
        return {
            artist: this.album.artist,
            title: this.album.title
        };
    }
}

SingleCard.register();

export default SingleCard;
