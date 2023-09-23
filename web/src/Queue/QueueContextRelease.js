import QueueContextBase from './QueueContextBase';

class QueueContextRelease extends QueueContextBase 
{
    constructor(api) 
    {
        super(api);
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
