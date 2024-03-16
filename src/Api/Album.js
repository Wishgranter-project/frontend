import Base from './Base';

class Album extends Base
{
    constructor(httpClient, artist, title) 
    {
        super(httpClient);
        this.artist = artist;
        this.title = title;
    }

    read() 
    {
        return this.apiCall('get', 'api/v1/discover/album', null, {artist: this.artist, title: this.title})
    }

    fetchItems() 
    {
        return this.read().then((response) =>
        {
            var album = response.data;
            var items = [];

            for (var t of album.tracks) {
                items.push({
                    title: t,
                    artist: this.artist,
                    album: this.title
                });
            }

            return items;
        });
    }
}

export default Album;
