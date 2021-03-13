const axios = require('axios');

const error = (message) => ({
    statusCode: 500,
    body: message
});

exports.handler = async (event, context, callback) => {

    const postcode = event.queryStringParameters.postcode;

    if (!postcode) {
        return error("Postcode querystring is required")
    }

    try {
        const url = `https://api.postcodes.io/postcodes/${postcode}`;
        const postcodeResponse = await axios.get(url);
        console.log(postcodeResponse)
        if (!postcodeResponse) {
            return error("No postcode found")
        };

        const lat = postcodeResponse.data.result.longitude;
        const lng = postcodeResponse.data.result.latitude;
        const darkSkyUrl = `https://api.darksky.net/forecast/974a40e018d8059da8e3413757266944/${lat},${lng}`;

        const darkSkyResponse = await axios.get(darkSkyUrl);

        if (!postcodeResponse) {
            return error(`Can not find a match ${darkSkyUrl}`)
        };

        const temperature = darkSkyResponse.data.currently.temperature;
        const summary = darkSkyResponse.data.currently.summary;

        return {
            body: `It's ${summary} with a temperature ${temperature} `,
            headers: {
                'Access-Control-Allow-Origin': "*"
            },
            statusCode: 200,
        };
    } catch (err) {
        console.log(err);
        return {
            body: 'No Postcode Found',
            statusCode: 500,
        };
    }
}