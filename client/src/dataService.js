import moment from 'moment';
import { dateFormat } from './config';

class DataService {
    static getFlights(startDate, destination) {
        let data = [];
        let fromDeparture = startDate;
        let toDeparture = moment(startDate).add(1, 'M').format(dateFormat);
        let fromArrival = startDate;
        let toArrival = moment(startDate).add(1, 'M').format(dateFormat);
        for (let i = 0; i < 3; i++) {
            data.push(
                {
                    "flightList": [{
                        "departureStation": "SOF",
                        "arrivalStation": destination,
                        "from": fromDeparture,
                        "to": toDeparture
                    },
                    {
                        "departureStation": destination,
                        "arrivalStation": "SOF",
                        "from": fromArrival,
                        "to": toArrival
                    }],
                    "priceType": "wdc",
                    "adultCount": 2
                }
            )
            fromDeparture = moment(fromDeparture).add(1, 'M').format(dateFormat);
            toDeparture = moment(toDeparture).add(1, 'M').format(dateFormat);
            fromArrival = moment(fromArrival).add(1, 'M').format(dateFormat);
            toArrival = moment(toArrival).add(1, 'M').format(dateFormat);

        }
        var options = {
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        }
        return fetch(
            `http://localhost:5000/wizzair`,
            options)
            .then(res => res.json())
            .then(res => {
                let toData = {};
                let backData = {};
                let bestPrice = {
                    from: '',
                    to: '',
                    price: 1000
                };
                res.outboundFlights.forEach((item) => {
                    toData[moment(item.departureDates[0]).format(dateFormat)] = item.price.amount
                });
                res.returnFlights.forEach((item) => {
                    backData[moment(item.departureDates[0]).format(dateFormat)] = item.price.amount
                });
                let toDates = Object.keys(toData)
                for (let i = 0; i < toDates.length; i++) {
                    let currentDate = toDates[i];
                    for (let j = 3; j < 8; j++) {
                        let nextDate = moment(currentDate).add(j, 'days').format(dateFormat)
                        let backPrice = backData[nextDate];
                        if (backPrice) {
                            let sum = Number(toData[currentDate]) + Number(backPrice);
                            if (sum < bestPrice.price) {
                                bestPrice.price = sum;
                                bestPrice.from = currentDate;
                                bestPrice.to = nextDate;
                            }
                        }
                    }

                }
                return {
                    data: res,
                    toData,
                    backData,
                    bestPrice
                }
            })
    }
}

export default DataService