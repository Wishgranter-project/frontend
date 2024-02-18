class Objects 
{
    static isA(subject, whatItIs) 
    {
        var proto = subject.__proto__;

        while (proto) {
            if (
                (typeof whatItIs == 'string'   && proto.name == whatItIs) ||
                (typeof whatItIs == 'function' && proto.name == whatItIs.name)
            ) {
                return true;
            }

            proto = proto.__proto__;
        }

        return false;
    }
}

module.exports = Objects;
