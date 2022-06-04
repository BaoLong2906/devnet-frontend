import { Container, Row, Col, Image } from 'react-bootstrap';
import NavHeader from "../components/NavHeader";
import logoGenki from "../images/logoGenki.svg";
import SigninAPI from '../api/SigninAPI';
import React, { useState } from 'react';
import { Redirect, Route, useHistory } from "react-router";



const h1Style = {
  textAlign: 'center', 
  marginTop: '11%', 
  fontSize: '24px',
  fontWeight: '300', 
  letterSpacing: '-0,5px'
};

const divStyle = {
  width: '308px', 
  height: '228.6px', 
  borderRadius: '6px',
  backgroundColor: '#f6f8fa', 
  border: '1px solid #d8dee4'
};

const labelSytle = {
  display: 'block',
  textAlign: 'left',
  marginLeft: '10%',
  marginBottom: '7px', 
  fontWeight: '400px', 
  marginTop: '16px'
};

const inputFieldSytle = {
  display: 'block',
  width: '80%',
  border: '1px solid #d0d7de',
  borderRadius: '6px',
  backgroundColor: 'white',
  marginLeft: '10%',
  fontSize: '14px',
};

const inputButtonSytle = {
  display: 'block',
  width: '80%',
  marginLeft: '10%',
  marginTop: '20px',
  fontSize: '14px',
  fontWeight: '500',
  color: 'white',
  backgroundColor: '#2da44e',
  border: '2px solid black',
  borderRadius: '6px',
};

const aStyle = {
  marginLeft: '10%',
  color: "#0969da",
  fontSize: '12px',
  textDecoration: 'none'
};

const pStyle = {
  display: 'block',
  width: '100%',
  textAlign: 'center',
  marginTop: '25px',
  fontSize: '12px',
};

function SignInPage(props) {

  const [emailState, setEmailState] = useState('');
  const [passwordState, setPasswordState] = useState('');
  const history = useHistory();

  if (localStorage.getItem('accessToken') != null) {
    return <Redirect to="/" />;
  }
  
  let changeInputValueEmail = (event) => {
    setEmailState(event.target.value);  
  }

  let changeInputValuePassword = (event) => {
    setPasswordState(event.target.value);
  }

  let handleSubmitForm = (e) => {
    //console.log(emailState);

    if (emailState === '' || passwordState === '') {
      alert("You have entered null!");
      return;
    }

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if( !re.test(emailState.toLowerCase()) ) {
      alert("You have entered an invalid email address!");
      return;
    }

    SigninAPI.requestAuthWithEmailAndPassword(emailState, passwordState, function(workState) {
      
      if (workState === "done") {
        history.push('/');
      }
    });
    
  };


  return (
    <>
      <NavHeader/>
      <div>
        <Container>
          <Row>
            <Col>
              {/* <Image src={logoEarth} rounded /> */}
              {/* <image src={logoEarth} /> */}
              <Image src={logoGenki} fluid />
            </Col>
            <Col>
              <Container>
                <Row>
                  <Col>
                    <h1 style={h1Style}>Sign in to Genki Dama</h1>
                  </Col>
                </Row>
                <Row>
                  <Col></Col>
                  <Col>
                    <div style={divStyle}>
                      {/* <form action="http://localhost:3000/login" method='post' onSubmit={handleSubmitForm}> */}
                        <label for='login_field' style={labelSytle}>
                          Email address
                        </label>
                        <input type='text' name='login' id='login-field' autoFocus='autofocus' style={inputFieldSytle}
                        onChange={changeInputValueEmail}/>
                        <label for='password' style={labelSytle}>
                          Password
                        </label>
                        <input type='password' name='login' id='password' autoFocus='autofocus' style={inputFieldSytle}
                        onChange={changeInputValuePassword}/>
                        {/* <input type='submit' name='commit' value='Sign in' style={inputButtonSytle}/> */}
                        <button name='commit' style={inputButtonSytle} onClick={handleSubmitForm}>Sign in</button>
                        <a href='' style={aStyle}>Forgot password?</a>
                      {/* </form> */}
                    </div>
                  </Col>
                  <Col></Col>
                </Row>
                <Row>
                  <Col>
                    <p style={pStyle}>New to Genki Dama? <a href='/sign-up' style={{textDecoration: 'none', color: "#0969da"}}>Create an account.</a></p>
                      
                    
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default SignInPage;