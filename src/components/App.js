import React from 'react';
import Navbar from './Navbar';
import Search from './Search';
import Cards from './Cards';
import Graph from './Graph';
import API from '../utils/Api'
import axios from 'axios';
import Message from './Message';
import SessionIdGenerator from '../../src/utils/SessionIdGenerator';
import { request } from 'http';
// import {machineId, machineIdSync} from 'node-machine-id';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            input: '',
            filters: [],
            feedback: [],
            coins: 0,
            tags: [],
            message: '',
            messageOpen: false,
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleFilters = this.handleFilters.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if(this.props.location.state == undefined)
        {
            this.props.history.push('/')
        }
        else {
            this.generateStartTelemetry(this.props.location.state);
            if (this.props.location.state.coinsGiven === undefined) {
                this.setState({ coins: 0 })
            }
            else {
                this.setState({ coins: this.props.location.state.coinsGiven })
            }
        }
    }

    generateStartTelemetry(visitorInfo) {
        const edata = { type: "bazar", mode: "play" };
        // const did = machineIdSync();
        const telemetry = {
            eid: "DC_START",
            did: '98912984-c4e9-5ceb-8000-03882a0485e4',
            ets: (new Date).getTime(),
            dimensions: {
                visitorId: visitorInfo.code,
                visitorName: visitorInfo.name,
                profileId: visitorInfo.osid,
                stallId: "STA7",
                stallName: "BAZAR",
                ideaId: "IDE21",
                ideaName: "Crowd Sourcing",
                edata: edata
            }
        }
        const event = JSON.stringify(telemetry);
        const request = {
            "events": [event]
        };

        console.log('telemetry request',request)

        axios.post(`http://52.172.188.118:3000/v1/telemetry`,request)
            .then(data =>{
                console.log("telemetry registered successfully",data);
            }).catch(err => {
                console.log("telemetry registration error", error);
            })
    }

    handleInputChange = (event) => {
        this.setState({
            input: event.target.value,
        })
    }

    handleSearch = () => {
        axios.get(`http://localhost:3000/queryResponse`).then(res => {
            this.setState({
                tags: res.data.splice(0, 3),  //For rendering only three cards
                query: this.state.input,
            })
            console.log('response query=>', res.data)
        })
        this.generateInteractTelemetry(this.props.location.state)
    }

    generateInteractTelemetry(visitorInfo) {
        const edata = { type: "bazar", mode: "play" };
        const telemetry = {
            "eid": "INTERACT",
            "ets": (new Date).getTime(),
            "ver": "3.0",
            "mid": '98912984-c4e9-5ceb-8000-03882a0485e4',
            "actor": {
              "id": visitorInfo.code,
              "type": 'visitor'
            },
            "context":{
              "channel": "devcon.appu",
              "env": 'devcon',
              "cdata": [{
                visitorId: visitorInfo.code,
                visitorName: visitorInfo.name,
                profileId: visitorInfo.osid,
                stallId: "STA7",
                stallName: "BAZAR",
                ideaId: "IDE21",
                ideaName: "Crowd Sourcing",
                edata: edata
            }],
            }
        }
        const event = JSON.stringify(telemetry);
        const request = {
            "events": [event]
        };

        axios.post(`http://52.172.188.118:3000/v1/telemetry`,request)
        .then(data => {
            console.log('interact telemetry registered successfully', data);
        }).catch(err => {
            console.log('interact telemetry registration error', err);
        })
    }

    handleFilters = (event, { value }) => {
        this.setState({
            filters: value,
        })
    }

    handleSubmit = () => {
        console.log('Submitted')
        console.log("the sessionIdgenrator method is ", SessionIdGenerator.getTimestamp(), "the uuid id is", SessionIdGenerator.getUuid());
        let keys = Object.keys(localStorage);
        let values = [];
        keys.forEach((x) => {
            let c = localStorage.getItem(x);
            values.push({ 'cardID': x, 'Rating': c })
        })
        console.log('Feedback', values)
        this.setState({
            query: '',
            feedback: values,
        })
        localStorage.clear();
        this.updateCoinsCurrentState(keys.length);
        this.generateInteractTelemetry(this.props.location.state);
    }

    // getCreditsCurrentState = () => {
    //     API.get(`loginDetails`)
    //     .then(res => {
    //         console.log("the response from the login apis",res.data[0].result.Visitor.coinsGiven)
    //       this.setState({ credits:res.data[0].result.Visitor.coinsGiven});
    //     })
    // }

    updateCoinsCurrentState = (value) => {
        let addCoins = Number(this.state.coins) + Number(value)
        console.log("in update coin current stage",addCoins);
        var config = {
            headers: {"Access-Control-Allow-Origin": "*"}
          };
        const request={                      //parameter need to be passed 
            "code":sessionStorage.getItem("userCode"),
            "roleCode": "TCH1",
            "stallCode": "STA6",
            "ideaCode":"IDE6"
        }      
     const updateReq= {
            "id": "open-saber.registry.update",
            "ver": "1.0",
            "ets": "11234",
            "params": {
              "did": "",
              "key": "",
              "msgid": ""
            },
            "request": {
              "Visitor": {
                "code": sessionStorage.getItem("userCode"),
                "coinsGiven": Number(addCoins)
              }
            }
          }
        axios.post(`http://104.211.78.0:8080/update`,{
            "id": "open-saber.registry.update",
            "ver": "1.0",
            "ets": "11234",
            "params": {
              "did": "",
              "key": "",
              "msgid": ""
            },
            "request": {
              "Visitor": {
                "code": sessionStorage.getItem("userCode"),
                "coinsGiven": addCoins
              }
            }
          })
            .then(res => {
                if(res.data.params.status==='SUCCESSFUL'){
                    API.get(`profile/read/${sessionStorage.getItem("userCode")}`)
                    .then(res=>{
                        this.setState({
                            coins: res.data.result.Visitor.coinsGiven,
                            message: 'Congratulations! Coins Successfully Credited',
                            messageOpen: true,
                        })
                    })
                }
                else{
                // login to be put if coin updation is unsuccessfull
                    this.setState({
                        message: 'No coins credited! Retry After Some Time',
                        messageOpen: true,
                    })
                }
            }).catch(err=>{
                this.setState({
                    message: 'No coins credited! Retry After Some Time',
                    messageOpen: true,
                })
            })
    }
    
    handleClose = () => this.setState({ messageOpen: false })

    render() {
        return (
            <div>
                <Navbar credits={this.state.coins} />
                <div style={{ marginTop: '30px' }}>
                    <Search handleInputChange={this.handleInputChange} handleSearch={this.handleSearch} handleFilters={this.handleFilters} />
                    {(this.state.query == '') ? '' : <Cards query={this.state.query} tags={this.state.tags} filters={this.state.filters} handleSubmit={this.handleSubmit} />}
                    {(this.state.messageOpen)?<Message message={this.state.message} messageOpen={this.state.messageOpen} handleClose={this.handleClose} />: ''}
                    <Graph />
                </div>
            </div>
        );
    }
}

export default App;
