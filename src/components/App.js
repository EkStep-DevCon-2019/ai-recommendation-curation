import React from 'react';
import Navbar from './Navbar';
import Search from './Search';
import Cards from './Cards';
import Graph from './Graph';
import API from '../utils/Api'
import SessionIdGenerator from '../../src/utils/SessionIdGenerator'


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
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleFilters = this.handleFilters.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

    componentDidMount(){
        // this.getCreditsCurrentState();
        console.log('props from login',this.props.location.state)

    this.setState({
        coins:this.props.location.state.coinsGiven
    })
    }
    
    handleInputChange = (event) => {
        this.setState({
            input: event.target.value,
        })
    }
    
    handleSearch = () => {
        API.get(`queryResponse`).then(res => {
            this.setState({
              tags: res.data.splice(0,3),  //For rendering only three cards
              query: this.state.input,
            })
            console.log('response query=>', res.data)
          })
    }

    handleFilters = (event, {value}) => {
        this.setState({
            filters: value,
        })
    }

    handleSubmit = () => {
      console.log('Submitted')
      console.log("the sessionIdgenrator method is ",SessionIdGenerator.getTimestamp(),"the uuid id is",SessionIdGenerator.getUuid());
      let keys = Object.keys(localStorage);
      let values = [];
      keys.forEach((x) => {
          let c=localStorage.getItem(x);
          values.push({'cardID':x,'Rating':c})
      })
      console.log('Feedback', values)
      this.setState({
        query: '',
        feedback: values,    
      })
      localStorage.clear();
      this.updateCreditsCurrentState(keys.length)
    }

    // getCreditsCurrentState=()=>{
    //     API.get(`loginDetails`)
    //     .then(res => {
    //         console.log("the response from the login apis",res.data[0].result.Visitor.coinsGiven)
    //       this.setState({ credits:res.data[0].result.Visitor.coinsGiven});
    //     })
    // }

    updateCreditsCurrentState=(value)=>{
        let addCredits = Number(this.state.coins)+Number(value)
        API.patch(`userDetails/1`,{"credits": addCredits})
        .then(res=>{
            this.setState({
                credits: res.data.credits
            })
        })
    }

    render() {
        return (
            <div>
                <Navbar credits={this.state.coins} />
                <div style={{marginTop: '30px'}}>
                    <Search handleInputChange={this.handleInputChange} handleSearch={this.handleSearch} handleFilters={this.handleFilters} />
                    {(this.state.query=='')?'':<Cards query={this.state.query} tags={this.state.tags} filters={this.state.filters} handleSubmit={this.handleSubmit}/>}
                    <Graph />
                </div>
            </div>
        );
    }
}

export default App;
