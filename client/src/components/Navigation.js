import React, { Component } from 'react'
import moment from 'moment';
import { destinations, dates } from '../config';

class Navigation extends Component {
    render() {
        let { destination, startDate, limitPrice, bestPrice, toPrice, backPrice, handleChange, handleSubmit } = this.props;
        return (
            <form onSubmit={handleSubmit} style={{ border: '1px solid grey', width: '24%', height: '165px', marginLeft: '38%' }}>
                <label>
                    <span style={{ marginRight: '15px' }}>Travel to:</span>
                    <select value={destination} onChange={handleChange} style={{ marginRight: '15px' }} name="destination">
                        {
                            Object.entries(destinations).map((item, index) => {
                                return <option key={index} value={item[1]}>{item[0]}</option>
                            })
                        }
                    </select>
                </label>
                <br></br>
                <label>
                    <span style={{ marginRight: '15px' }}>From date:</span>
                    <select value={startDate} onChange={handleChange} style={{ marginRight: '15px' }} name="startDate">
                        {
                            Object.entries(dates).map((item, index) => {
                                return <option key={index} value={item[1]}>{item[0]}</option>
                            })
                        }
                    </select>
                </label>
                <br></br>
                <span style={{ marginRight: '15px' }}>Price up to:</span>
                <input value={limitPrice} onChange={handleChange} name="limitPrice" />
                <br />
                <span style={{ marginRight: '15px' }}>Best price:
                        {bestPrice.from ?
                        ` ${moment(bestPrice.from).format('DD MMM')} - ${moment(bestPrice.to).format('DD MMM')} -> ${Number(bestPrice.price).toFixed(2)}`
                        : null}
                </span>
                <br />
                <input type="submit" value="Go" />
                <br />
                <span style={{ marginRight: '15px' }}>Total Price: {(Number(toPrice) + Number(backPrice)).toFixed(2)}</span>
            </form>
        )
    }
}

export default Navigation
