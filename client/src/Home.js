import React, { Component } from 'react'
import { destinations, dates, dateFormat } from './config';
import moment from 'moment';
import DataService from './dataService';

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            toData: {},
            backData: {},
            bestPrice: {
                from: '',
                to: '',
                price: 1000
            },
            destination: 'LIS',
            startDate: moment("2019-07-01").format(dateFormat),
            limitPrice: 1000,
            toPrice: 0,
            backPrice: 0,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        this.setState({
            data: [],
            bestPrice: {
                from: '',
                to: '',
                price: 1000
            },
            limitPrice: 1000,
            toPrice: 0,
            backPrice: 0,
        })
        event.preventDefault();
        let { startDate, destination } = this.state;
        DataService.getFlights(startDate, destination).then((res) => {
            this.setState(res)
        });
    }

    render() {
        let outboundFlights, returnFlights;
        let { data, toPrice, backPrice, destination, bestPrice } = this.state;
        if (data.outboundFlights) {
            outboundFlights = data.outboundFlights.map((outbound, index) => {
                if (outbound.price.amount > Number(this.state.limitPrice)) {
                    return null;
                }
                return (<div key={index}>
                    <label>
                        <input type="radio" value={outbound.price.amount}
                            onChange={this.handleChange} name="toPrice" />
                        {moment(outbound.departureDates[0]).format('DD MMMM YYYY (dddd) - HH:mm') + ' - ' + outbound.price.amount}
                    </label>
                </div>)
            });
            returnFlights = data.returnFlights.map((ret, index) => {
                if (ret.price.amount > Number(this.state.limitPrice)) {
                    return null;
                }
                return (<div key={index}>
                    <label>
                        <input type="radio" value={ret.price.amount}
                            onChange={this.handleChange} name="backPrice" />
                        {moment(ret.departureDates[0]).format('DD MMMM YYYY (dddd) - HH:mm') + ' to ' + ret.price.amount}
                    </label>
                </div>)
            });
        }

        return (
            <div>
                <form onSubmit={this.handleSubmit} style={{ border: '1px solid grey', width: '24%', height: '165px', marginLeft: '38%' }}>
                    <label>
                        <span style={{ marginRight: '15px' }}>Travel to:</span>
                        <select value={this.state.destination} onChange={this.handleChange} style={{ marginRight: '15px' }} name="destination">
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
                        <select value={this.state.startDate} onChange={this.handleChange} style={{ marginRight: '15px' }} name="startDate">
                            {
                                Object.entries(dates).map((item, index) => {
                                    return <option key={index} value={item[1]}>{item[0]}</option>
                                })
                            }
                        </select>
                    </label>
                    <br></br>
                    <span style={{ marginRight: '15px' }}>Price up to:</span>
                    <input value={this.state.limitPrice} onChange={this.handleChange} name="limitPrice" />
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
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '49.5%' }}>
                        <h3>Outbound to: {outboundFlights ? destination : null}</h3>
                        {outboundFlights ? outboundFlights : 'Loading...'}
                    </div>
                    <div style={{ width: '49.5%' }}>
                        <h3>Return from: {returnFlights ? destination : null}</h3>
                        {returnFlights ? returnFlights : 'Loading...'}
                    </div>
                </div>
            </div>
        )
    }
}

export default Home