import React, { Component } from 'react'
import moment from 'moment';

class Flight extends Component {
    render() {
        let { flight, name, handleChange } = this.props;
        return (
            <div>
                <label>
                    <input type="radio" value={flight.price.amount} onChange={handleChange} name={name} />
                    {moment(flight.departureDates[0]).format('DD MMMM YYYY (dddd) - HH:mm') + ' - ' + flight.price.amount}
                </label>
            </div>
        )
    }
}

export default Flight