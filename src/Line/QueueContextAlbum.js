import QueueContextBase from './QueueContextBase';

class QueueContextAlbum extends QueueContextBase 
{
    constructor(api, noMore = false) 
    {
        super(api, noMore);
    }

    static id() 
    {
        return 'album';
    }

    async fetchMore(queue) 
    {
        return new Promise((success, fail) =>
        {
            return success({ data: [] });
        });
    }
}

export default QueueContextAlbum;
