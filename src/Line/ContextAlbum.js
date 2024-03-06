import ContextBase from './ContextBase';

class ContextAlbum extends ContextBase 
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

export default ContextAlbum;
