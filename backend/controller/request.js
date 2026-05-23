const requestschema = require('../schema/request');
const fetchrequest = async (req, res) => {
    try {
        const findallrequest = await requestschema.find({ receiverId: req.body.id });
        if (findallrequest.length == 0) {
            return res.status(200).json({
                message: `no request found for this profileId: ${req.body.id} `
            })
        }
        return res.status(200).json({
            content: findallrequest
        })
    } catch (error) {
        return res.status(500).json({
            message: `${error}`
        })
    }

}
module.exports = fetchrequest