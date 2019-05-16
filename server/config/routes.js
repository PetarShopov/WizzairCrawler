var axios = require('axios');

const getData = async (formData) => {
	try {
		return await axios.post('https://be.wizzair.com/9.10.1/Api/search/timetable', formData, {
			headers: {
				'Content-Type': 'application/json'
			}
		}
		)
	} catch (error) {
		return error
	}
}

module.exports = (app) => {
	app.post('/wizzair', async (req, res) => {
		var data = req.body
		var promises = data.map((item) => {
			return getData(JSON.stringify(item))
		})
		var outboundFlights = [];
		var returnFlights = [];
		Promise.all(promises).then(function (values) {
			values.forEach((value) => {
				outboundFlights = outboundFlights.concat(value.data.outboundFlights)
				returnFlights = returnFlights.concat(value.data.returnFlights)
			})
			return res.status(200).json({ outboundFlights, returnFlights })
		})
			.catch((error) => {
				return res.status(200).json({ error })
			});
	})
}
