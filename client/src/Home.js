import React, { Component } from 'react'
import { dateFormat } from './config';
import moment from 'moment';
import DataService from './dataService';
import Flight from './components/Flight';
import Navigation from './components/Navigation';

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
        let { data, toPrice, backPrice, destination, bestPrice, limitPrice, startDate } = this.state;
        if (data.outboundFlights) {
            outboundFlights = data.outboundFlights.map((outbound, index) => {
                if (outbound.price.amount > Number(this.state.limitPrice)) {
                    return null;
                }
                return <Flight key={index} flight={outbound} name="toPrice" handleChange={this.handleChange}></Flight>
            });
            returnFlights = data.returnFlights.map((ret, index) => {
                if (ret.price.amount > Number(this.state.limitPrice)) {
                    return null;
                }
                return <Flight key={index} flight={ret} name="backPrice" handleChange={this.handleChange}></Flight>
            });
        }

        return (
            <div>
                <Navigation
                    destination={destination}
                    startDate={startDate} 
                    limitPrice={limitPrice} 
                    bestPrice={bestPrice} 
                    toPrice={toPrice} 
                    backPrice={backPrice} 
                    handleChange={this.handleChange} 
                    handleSubmit={this.handleSubmit}></Navigation>
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