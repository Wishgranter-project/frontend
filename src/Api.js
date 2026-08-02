import WishgranterApi from 'wishgranter-sdk';

class Api extends WishgranterApi
{
    setDefaultUserId(userId)
    {
        this.defaultUserId = userId;
        return this;
    }

    manageUser(userId = null)
    {
        userId = userId || this.defaultUserId;
        return super.manageUser(userId);
    }
}

export default Api;
