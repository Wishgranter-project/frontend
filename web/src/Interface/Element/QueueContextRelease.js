import QueueContextBase from './QueueContextBase';

class QueueContextRelease extends QueueContextBase 
{
    constructor(initialBatch, api) 
    {
        super(initialBatch, api);
        this.noMore = true;
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
