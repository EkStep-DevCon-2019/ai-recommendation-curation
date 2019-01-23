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
          credits: 0,
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleFilters = this.handleFilters.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
      componentDidMount(){

         this.getCreditsCurrentState();
      }
    
    handleInputChange = (event) => {
        this.setState({
            input: event.target.value,
        })
    }
    
    handleSearch = () => {
        this.setState({
          query: this.state.input,
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

    getCreditsCurrentState=()=>{
        API.get(`userDetails`)
        .then(res => {
          this.setState({ credits:res.data[0].credits});
        })
    }

    updateCreditsCurrentState=(value)=>{
        let addCredits = Number(this.state.credits)+Number(value)
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
                <Navbar credits={this.state.credits} />
                <div style={{marginTop: '30px'}}>
                    <Search handleInputChange={this.handleInputChange} handleSearch={this.handleSearch} handleFilters={this.handleFilters} />
                    {(this.state.query=='')?'':<Cards query={this.state.query} filters={this.state.filters} handleSubmit={this.handleSubmit}/>}
                    <Graph />
                </div>
            </div>
        );
    }
}

export default App;
