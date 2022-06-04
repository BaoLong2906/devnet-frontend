import CGVPrintTicketCSS from "./CGVPrintTicketCSS.css";
import CGVNavHeader from "../../../components/CGVcomponents/CGVNavHeader";
import { Button, Form } from 'react-bootstrap';
import { useRef, useState, useEffect } from "react";
import { Redirect, Route, useHistory, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux"; 
import CGVTicket from "../../../components/CGVcomponents/CGVTicket";

let CGVPrintTicket = (listseat, masuatchieu) => {

  let listSeatPickedState = useSelector(state => state.seatReducer.ListSeatPicked);
  

  return(
    <>
    <CGVNavHeader/>
    <div className="wrap-item">
      {listSeatPickedState.map(seat => {
        return (
          <>
            <br/>
            <CGVTicket maSuatChieu={localStorage.getItem('MaSuatChieu')}  maSlot={seat}/>
            <br/>
          </>
        );
      })}

    </div>
    </>
  )
}

export default CGVPrintTicket;