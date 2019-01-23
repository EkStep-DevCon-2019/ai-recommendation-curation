import React from "react";
import {
  Container,
  Button,
  Form,
  Grid,
  Header,
  Image,
  Segment,
  Icon,
  Divider
} from "semantic-ui-react";
import QrReader from "react-qr-scanner";
import axios from 'axios';
import "../css/style.css";
import API from '../utils/Api'
import SessionIdGenerator from "../utils/SessionIdGenerator";

class Login extends React.Component {
  constructor(props) {
    super(props);
    // userService.logout();
    this.state = {
      submitted: false,
      loading: false,
      error: "",
      delay: 100,
      userid: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleScan = this.handleScan.bind(this);
  }

  handleChange(e) {
    console.log(e);
    console.log(e.target);

    this.setState({ userid : e.target.value });
  }
  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });

    const userid  = this.state.userid;
    console.log("the user id is",userid)   // request param need to send 

    if (!userid) {
      return;
    }

    this.setState({ loading: true });

    API.get(`loginDetails`)
      .then(res => {
        sessionStorage.setItem("userObject",res.data);
        sessionStorage.setItem("userName",res.data[0].result.Visitor.name);
        sessionStorage.setItem("coins",res.data[0].result.Visitor.coinsGiven);
        sessionStorage.setItem("os-id",res.data[0].result.Visitor.osid);
        sessionStorage.setItem("code",res.data[0].result.Visitor.code);
        this.props.history.push('/home');
      })
      .catch(error => {
        console.log(error)
        return;
    });

  }
  handleScan(data) {
    if (data) {
      this.setState({
        userid: data
      });
      this.handleChange({
        target: { name: "userid", value: this.state.userid }
      });
      console.log(data);
    }
    // else{
    //   this.setState({
    //     userid: 'visitor1'
    //   });
    //   this.handleChange({
    //     target: { name: "userid", value: this.state.userid }
    //   });
    // }
  }
  handleError(err) {
    console.error(err);
  }

  onSignIn(response) {
    console.log(response);
    sessionStorage.setItem("userid", response.profileObj.name);
    sessionStorage.setItem("userProfileImage", response.profileObj.imageUrl);
    this.setState({
      redirect: true
    });
  }

  onFailure(response) {
    console.log("Login Failed");
    this.setState({
      redirect: false
    });
  }

  render() {
    // const { userid, submitted, loading, error } = this.state;
    const previewStyle = {
      width: '100%',
      margin: 'auto'
    };

    return (
      <Container fluid>
        <Segment style={{ minHeight: "100vh" }} padded="very">
          <Grid verticalAlign="middle">
            <Grid.Row columns={2}>
              <Grid.Column>
                <Image
                  src="./images/buzzinga.png"
                  size="large"
                  className="m-b"
                  centered
                />
              </Grid.Column>
              <Grid.Column>
                <Segment raised size="large" padded>
                  <Header as="h2" textAlign="center">
                    <Icon name="qrcode" /> Scan QR Code
                  </Header>
                  <QrReader
                    delay={this.state.delay}
                    style={previewStyle}
                    onError={this.handleError}
                    onScan={this.handleScan}
                  />
                  <Divider horizontal>Or</Divider>
                  <Header as="h3" textAlign='center'>Enter QR Code</Header>

                  <Form
                    name="loginForm"
                    onSubmit={this.handleSubmit}
                    size="large"
                  >
                    <Form.Input
                      fluid
                      icon="user"
                      iconPosition="left"
                      placeholder="User Id"
                      name="userid"
                      defaultValue={this.state.userid}
                      onChange={this.handleChange}
                    />
                    <Button color="black" fluid size="large">
                      Login
                    </Button>
                  </Form>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Container>
    );
  }
}

export default Login;
