import { Container, Row, Col, Image } from 'react-bootstrap';
import NavHeader from "../components/NavHeader";
import logoGenki from "../images/logoGenki.svg";
import SigninAPI from '../api/SigninAPI';
import React, { useState } from 'react';
import { Redirect, Route, useHistory } from "react-router";

function SignUpPage(props) {

  if (localStorage.getItem('accessToken') != null) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <NavHeader/>
    </>
  );
}

export default SignUpPage;