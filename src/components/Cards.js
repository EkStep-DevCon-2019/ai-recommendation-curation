import React from 'react';
import { Card, Button, Image, Header, Rating, Dimmer, Loader, Segment } from 'semantic-ui-react';

class Cards extends React.Component {
  constructor(props) {
    super(props);
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
        <Header style={{paddingTop: '20px', paddingLeft: '40px'}}>  
          Recommended:
        </Header>
        {(this.props.tags.length==0)? <Dimmer active inverted style={{marginTop: '80px' }}>
            <Loader size='massive'>Loading Search Results</Loader>
          </Dimmer> :
        <Card.Group style={{marginTop: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
          {this.props.tags.map((x, i) =>
            <Card key={i}>
              <Card.Content>
                <Card.Header>{x.name}</Card.Header>
                {/* <Card.Meta>Friends of Elliot</Card.Meta> */}
                {/* <Image src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmusVyHLSxuIdiEyhcIKOM5qJ_VsMnMwx3VTwcf6j2QV5YGrpzMg' style={{width: '100%'}}/> */}
                <Image src={x.Previewurl} alt="Image not available" style={{width: '100%', height: 200}} />
                <Card.Description>
                  Steve wants to add you to the group <strong>best friends</strong>
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Rating icon='star' maxRating={5} onRate={(e,{rating}) => this.handleRate(e,{rating},x.id)} />
              </Card.Content>
            </Card>
          )}
        </Card.Group>}
        <br />
        <Button primary floated='right' onClick={this.props.handleSubmit}> Submit </Button>
        <br /> 
      </div>
    );
  }
}

export default Cards;
