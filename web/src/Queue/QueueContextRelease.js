import QueueContextBase from './QueueContextBase';

class QueueContextRelease extends QueueContextBase 
{
    constructor(api) 
    {
        super(api);
        this.noMore = true;
    }

    static id() 
    {
        return 'release';
    }

    serialize() 
    {
        return {
            id: QueueContextRelease.id(),
            noMore: this.noMore
        };
    }

    static unserialize(api, obj) 
    {
        var context = new QueueContextRelease(api);
        return context;
    }

    async fetchMore(queue) 
    {
        return new Promise((success, fail) =>
        {
            return success({ data: [] });
        });
    }
}

export default QueueContextRelease;
