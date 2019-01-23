import React from 'react';
import { Card, Button, Image, Header, Rating } from 'semantic-ui-react';
import API from '../utils/Api'


class Cards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: ['Title1', 'Title2', 'Title3'],
    };
  }

  componentDidMount = () => {
    //Make fetch call to search api
    console.log('Search api');
    console.log('query in cards =>', this.props.query)
    console.log('filters in cards =>', this.props.filters)
  }

  handleRate = (e, { rating }, id) => {
    localStorage.setItem(id,rating)
    // console.log('CardID=>',id,"Rating=>", localStorage.getItem(id));
  }

  render() {
    return (
      <div style={{margin: '10px'}}>
        <Header textAlign="center" style={{paddingTop: '20px', paddingLeft: '40px'}}>
          Recommended:
        </Header>
        <Card.Group style={{marginTop: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
          {this.state.results.map((x, i) =>
            <Card key={i}>
                <Image src='https://react.semantic-ui.com/images/wireframe/image.png' style={{width: '100%'}}/>
              <Card.Content>
                <Card.Header>{x}</Card.Header>
                <Card.Meta>Friends of Elliot</Card.Meta>
                <Card.Description>
                  Steve wants to add you to the group <strong>best friends</strong>
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Rating maxRating={5} onRate={(e,{rating}) => this.handleRate(e,{rating},i)} />
              </Card.Content>
            </Card>
          )}
        </Card.Group>
        <br />
        <Button primary floated='right' onClick={this.props.handleSubmit}> Submit </Button>
        <br />
      </div>
    );
  }
}

export default Cards;
