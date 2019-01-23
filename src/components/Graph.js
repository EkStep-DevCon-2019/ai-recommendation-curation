import React from 'react';
import { Segment, Dimmer, Loader } from 'semantic-ui-react';
import API from '../utils/Api';
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graphdata: []
    };
  }

  getPerformance = () => {
    API.get(`data`)
      .then(res => {
        return (res.data)
      }).then(function (data) {
        let dataPoints = [];
        for (var i = 0; i < data.length; i++) {
          dataPoints.push({
            x: Number(moment.utc(Number(data[i].timestamp)).format('HH')),
            y: data[i].accuracy
          });
        }
        return (dataPoints)
      }).then((data) => {
        this.setState({
          graphdata: data
        })
      });
  }

  componentDidMount = () => {
    this.timer = setInterval(() => this.getPerformance(), 3000);
  }

  componentWillUnmount = () => {
    clearInterval(this.timer);
  }

  render() {
    return (
      <div style={{ marginTop: '30px' }}>
        <Segment style={{ margin: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
          <h3>
            Precision Graph:
          </h3>
          {(this.state.graphdata.length == 0) ? <Dimmer active inverted style={{marginTop: '80px' }}>
            <Loader size='massive'>Preparing Graph</Loader>
          </Dimmer> : <ResponsiveContainer width='80%' height={200}>
              <LineChart data={this.state.graphdata}>
                <XAxis dataKey="x" >
                  <Label value="Time" offset={0} position="insideBottom" />
                </XAxis>
                <YAxis label={{
                  value: 'Accuracy',
                  angle: -90,
                  position: 'insideLeft'
                }} />

                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="y" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>}
        </Segment>
      </div>
    );
  }
}

export default Graph;