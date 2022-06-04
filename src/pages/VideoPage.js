import { Container, Row, Col, Image, Tab, Tabs, Button } from 'react-bootstrap';
import React, { useState, useEffect, useRef } from 'react';
import UserAPI from '../api/UserAPI';
import { useHistory, useParams } from 'react-router';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import NavHeader from '../components/NavHeader';
import VideoApi from '../api/VideoApi';
import LoadingScreen from '../components/LoadingScreen';

import ReactPlayer from "react-player";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import PlayerControls from '../components/PlayerControls';
import screenfull from 'screenfull';

import VideosList from '../components/VideosList';

import {REACT_APP_API_URL} from '../api/axiosClient';
import CompareLikeVsDisLike from '../components/CompareLikeVsDislike';

const useStyles = makeStyles({
  playerWrapper: {
    width: "100%",
    position: "relative",
  },
});

const format = (seconds) => {
  if (isNaN(seconds)) {
    return "00:00";
  }

  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");

  if (hh) {
    return `${hh}:${mm.toString.padStart(2, "0")}:${ss}`;
  }

  return `${mm}:${ss}`;
}

let count = 0;

function VideoPage(props) {

  return (
    <>
      <NavHeader/>

      {/* <video id="videoplayer" width="650" controls muted="muted" autoPlay>
        <course src="http://localhost:8000/video" type="video/mp4"/>
      </video> */}

      <VideoMainBody {...props}/>
      
    </>
  );
}

function VideoMainBody(props) {

  const classes = useStyles();
  const [state, setState] = useState({
    playing: true,
    muted: false,
    volume: 0.5,
    playbackRate: 1.0,
    played: 0,
    seeking: false
  });

  const [timeDisplayFormat, setTimeDisplayFormat] = useState('normal');

  const [bookmarks, setBookmarks] = useState([]);

  const {playing, muted, volume, playbackRate, played, seeking} = state;

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const controlsRef = useRef(null);

  
  let myParams = useParams();

  let [ isLoading, setIsLoading ] = useState(true);
  let [ videosInforDataState, setVideosInforDataState ] = useState('');
  let [ title , setTitle] = useState('');

  useEffect(() => {
    getAllVideoInforByCourseId();
    console.log(videosInforDataState.videosinfor);
  }, [isLoading, title, bookmarks])

  let getAllVideoInforByCourseId = () => {
    VideoApi.requestFindAllVideoInforInCourseByCourseId(myParams.courseid, function (result) {
      setTitle(result.videosinfor[0].coursename);
      setVideosInforDataState(result);
      setIsLoading(false);
    });
  }

  let handlePlayPause = () => {
    setState({
      ...state,
      playing: !state.playing
    });
  }

  let handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  }

  let handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  }

  let handleMute = () => {
    setState({...state, muted: !state.muted});
  }

  let handleVolumeChange = (e, newValue) => {
    setState({
      ...state, 
      volume: parseFloat(newValue/100),
      muted: newValue===0 ? true : false, });
  }

  let handleVolumeSeekUp = (e, newValue) => {
    setState({
      ...state, 
      volume: parseFloat(newValue/100),
      muted: newValue===0 ? true : false, });
  }

  let handlePlaybackRateChange = (rate) => {
    setState({
      ...state,
      playbackRate: rate
    });
  }

  let toggleFullScreen = () => {
    screenfull.toggle(playerContainerRef.current);
  }

  let handleProgess = (changeState) => {
    console.log(changeState);

    if (count > 2) {
      controlsRef.current.style.visibility = "hidden";
      count = 0;
    }

    if (controlsRef.current.style.visibility == "visible") {
      count += 1;
    }

    if (!state.seeking) {
      setState({
        ...state,
        ...changeState
      });
    }
  }

  let handleSeekChangle = (e, newValue) => {
    setState({
      ...state,
      played: parseFloat(newValue / 100)
    });
  }

  let handleSeekMouseDown = (e) => {
    setState({
      ...state,
      seeking: true
    });
  }

  let handleSeekMouseUp = (e, newValue) => {
    setState({
      ...state,
      seeking: false
    });
    playerRef.current.seekTo(newValue / 100);
  }

  let handleChangeDisplayFormat = () => {

    setTimeDisplayFormat(
      timeDisplayFormat==="normal" ? 'remaining': 'normal'
    );
  }

  let currentTime = playerRef.current ? playerRef.current.getCurrentTime() : "00:00";
  
  let duration = playerRef.current ? playerRef.current.getDuration() : "00:00";

  let elapsedTime = timeDisplayFormat === "normal" ? format(currentTime) : `${format(duration - currentTime)}`;

  let totalDuration = format(duration);

  let addBookmark = () => {
    const canvas = canvasRef.current;
    canvas.width = 160;
    canvas.height = 90;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(playerRef.current.getInternalPlayer(), 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL();
    canvas.width = 0;
    canvas.height = 0;

    setBookmarks([...bookmarks, {time: currentTime, display: elapsedTime, image: imageUrl}]);
  }

  let handleMouseMove = () => {
    controlsRef.current.style.visibility = "visible";
    count = 0;
  }

  return (
    <>
      <Container style={{marginTop: '20px'}}>
        <Row>
          <Col>
            <span style={TitleCourseNameSytle}>Course <span>- {title}</span></span>
          </Col>
        </Row>

        <Row style={{marginTop: '20px'}}>
          <Col>
            
            {/* <video style={{borderRadius: '15px', border: '2px solid black'}} id="videoplayer" width="850px" controls autoPlay src={"http://localhost:7000/video/"+myParams.courseid+"/"+myParams.videoid}></video> */}
            <div 
              ref={playerContainerRef} 
              className={classes.playerWrapper}
              onMouseMove={handleMouseMove}
              //style={{borderRadius: '15px', border: '2px solid black'}}
            >
              <ReactPlayer
                ref={playerRef}
                width={"100%"}
                height="100%"
                url={REACT_APP_API_URL+"/video/"+myParams.courseid+"/"+myParams.videoid}
                muted={muted}
                playing={playing}
                volume={volume}
                playbackRate={playbackRate}
                onProgress={handleProgess}
                config={{
                  file: {
                    attributes: {
                      crossorigin: "annonymous",
                    }
                  },
                }}

                style={{borderRadius: '15px', border: '3px solid black'}}
              />
              {/* <video style={{borderRadius: '15px', border: '2px solid black'}} id="videoplayer" width="850px" controls autoPlay src={"http://localhost:7000/video/"+myParams.courseid+"/"+myParams.videoid}></video> */}


              <PlayerControls
                ref={controlsRef}
                onPlayPause={handlePlayPause}
                onFastForward={handleFastForward}
                onVolumeChange={handleVolumeChange}
                onVolumeSeekUp={handleVolumeSeekUp}
                onRewind={handleRewind}
                onMute={handleMute}
                playing={playing}
                muted={muted}
                volume={volume}
                played={played}
                playbackRate={playbackRate}
                onPlaybackRateChange={handlePlaybackRateChange}
                onToggleFullScreen={toggleFullScreen}
                onSeek={handleSeekChangle}
                onSeekMouseDown={handleSeekMouseDown}
                onSeekMouseUp={handleSeekMouseUp}
                elapsedTime={elapsedTime}
                totalDuration={totalDuration}
                onChangeDisplayFormat = {handleChangeDisplayFormat}
                onBookmark={addBookmark}
              />
            </div>

          </Col>
          <Col xs={4} style={{border: '2px solid black', borderRadius: '15px', height: '490px'}}>
            <SideShow {...props} courseid={myParams.courseid} videoid={myParams.videoid} isLoading={isLoading} videosInforData={videosInforDataState}/>
          </Col>
        </Row>
      </Container>
                
      {!videosInforDataState ? (<></>) : (<>
      <div style={{marginLeft: '4.2%', marginRight: '60%'}}>
      <CompareLikeVsDisLike 
        bgcolor={"#6a1b9a"}
        
        userid={videosInforDataState.videosinfor[0].userid}
        videoid={myParams.videoid}
      />  
      </div>
      </>)}    

    </>
  );
}

function SideShow(props) {

  const [key, setKey] = useState('VideosInCourse');
  let [re_render, set_re_render] = useState(false);
  
  return (
    <>
      <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-3"
    >
      <Tab eventKey="VideosInCourse" title="Videos in course">
        <ContentForVideosInCourse {...props} style={{overflowY: 'scroll', maxHeight: '400px'}}/>
      </Tab>
      <Tab eventKey="Comments" title="Comments" style={{overflowY: 'scroll', maxHeight: '400px'}}>
        {/* <Content /> */}
        <ContentForComments {...props} set_re_render={set_re_render} re_render={re_render}/>
      </Tab>
      <Tab eventKey="Aboutthisvideo" title="About this video">
        {/* <Content /> */}
        <ContentForAboutThisVideo {...props} style={{overflowY: 'scroll'}}/>
      </Tab>
    </Tabs>
    </>
  );
}

function ContentForVideosInCourse(props) {

  let content = props.isLoading ? (<LoadingScreen/>) : (<VideosList {...props} videosInforData={props.videosInforData}/>);


  return (
    <>
    {content}
    </>
  );
}

function ContentForComments(props) {
  
  let myParams = useParams();
  let history = useHistory();

  let [isLoading, setIsLoading] = useState(true);
  let [videoCommentsDataState, setVideoCommentsDataState] = useState('');
  let [viewModeState, setViewModeState] = useState('');
  let [videoIdState, setVideoIdState] = useState('');

  let [re_render, set_re_render] = useState(false);

  console.log('hello videoid param on url: ' + myParams.videoid);

  console.log('hello videoid state: ' + videoIdState);

  //setVideoIdState(videoIdState);
  let a = myParams.videoid;

  useEffect(() => {
    
    //setVideoId(myParams.videoid);
    if (myParams.videoid != videoIdState) {
      set_re_render(!re_render);
      setVideoIdState(myParams.videoid);
    }
    //setVideoIdState(a);
    checkViewMode();
    getAllCommentInVideoByVideoId();
  }, [videoIdState, re_render]);

  // hàm lấy về các comment của video này dựa trên videoid.
  let getAllCommentInVideoByVideoId = () => {
    VideoApi.requestFindAllCommentInVideoByVideoId(myParams.videoid, function(result) {
      //console.log('VideoComments: ' + JSON.stringify(result.videocomments));
      console.log("hi: " + JSON.stringify(result));
      if (result.videocomments === 'dont exist any video comment with that videoid like that') {
        setVideoCommentsDataState('');
      } else {
        setVideoCommentsDataState(result.videocomments);
      }
      setIsLoading(false);
      //setVideoIdState(myParams.videoid);

      //history.go(0);
    });
  }

  let checkViewMode = () => {
    if (localStorage.getItem('username')) {
      setViewModeState('owner');
    } else {
      setViewModeState('guest');
    }
  }

  //let content = props.isLoading ? (<LoadingScreen/>) : (<CommentList {...props} videosInforData={props.videosInforData}/>);
  let content = isLoading ? (<LoadingScreen/>) : (<CommentList {...props} 
    videosInforData={props.videosInforData}
    videoCommentsData={videoCommentsDataState} 
    viewMode={viewModeState} 
    // set_re_render={set_re_render} 
    // re_render={re_render}
    />);

  
  if (myParams.videoid != videoIdState) {
    //set_re_render(!re_render);
    setVideoIdState(myParams.videoid);
    return;
  }
  
  if (videoCommentsDataState) {
    return (
      <>
        {content}
      </>
    );
  }
  
  return (
    <>
      {content} <br/>
      chưa có comment nào.
    </>
  );

}

function CommentList(props) {

  let [myComment, setMyComment] = useState('');
  
 


  let myParams = useParams();
  // console.log(myParams.videoid);
  let history = useHistory();

  let listCommentInVideo = (object) => {
    //console.log('okokokokok: ' + JSON.stringify(object));
    return Object.keys(object).map((obj, i) =>
      <div>
        <div style={{padding: 8}}>
          <CardCommentRow 
          userid={object[obj].userid}
          username={object[obj].username} 
          profileurl = {object[obj].profileurl}
          commentcontent={object[obj].commentcontent}
          videocommentid={object[obj].videocommentid}
          imagepath={object[obj].imagepath}
          createtime={object[obj].createtime}
          updatetime={object[obj].updatetime}
          handleClick={handleClick}/>
        </div>
      </div>
    );
  }

  let handleClick = () => {
    // still in contructing.
    //console.log(myComment);
    VideoApi.insertComment(localStorage.getItem('userid'), myParams.videoid, myComment, localStorage.getItem('accessToken'), function(result) {
      if (result.isSuccess === true) {
        
      }
      
    });
    //history.go(0);
    //console.log('okokok');
    //props.set_re_render(!props.re_render);

  }

  if (props.viewMode === 'owner') {
    return (
      <>
        <CKEditor
                    editor={ ClassicEditor }
                    data={"Hãy bình luận gì đó nhé"}
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
                        //console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        // console.log( { event, editor, data } );
                        setMyComment(data);
                    } }
                    onBlur={ ( event, editor ) => {
                        //console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        //console.log( 'Focus.', editor );
                    } }
        />
        <Button variant="primary" style={{marginTop: '10px'}} onClick={handleClick}>
          Post
        </Button>
        {listCommentInVideo(props.videoCommentsData)}
      </>
    );
  }

  return (
    <>
      {listCommentInVideo(props.videoCommentsData)}
    </>
  );

}

function CardCommentRow(props) {
  return (
    <>
      <Container style={{border: '2px solid black', borderRadius: '15px'}}>
        <Row style={{marginTop: '5px', marginBottom: '5px'}}>
          <Col xs={2}>
            <Image src={props.imagepath} style={{borderRadius: '100%', width: '50px', height: '50px'}}/>
          </Col>
          <Col>
            <div><strong><a href={"/profile/" + props.profileurl} style={{textDecoration: 'none'}} dangerouslySetInnerHTML={{__html: props.username}}></a></strong></div>
            <div><span style={{fontWeight: '500'}} dangerouslySetInnerHTML={{__html: props.commentcontent}}></span></div>
            {/* <div style={{marginTop: '10px', textAlign: 'right'}}><span style={{borderRadius: '20px', backgroundColor: 'yellow', padding: '6px', border: '2px solid black', fontWeight: '500'}} onClick={() => props.handleClick(props.courseid, props.videoid)}>Watch Now</span></div> */}
          </Col>
        </Row>
      </Container>
    </>
  );
}

function ContentForAboutThisVideo(props) {

  let myParams = useParams();
  
  if (props.videosInforData.videosinfor) {

    for (let i = 0; i < Object.keys(props.videosInforData.videosinfor).length; i++) {
      if ( JSON.stringify(props.videosInforData.videosinfor[i].videoid) === myParams.videoid ) {
        return (
          <>
            <Container>
              <Row>
                <Col>
                  <span style={{fontSize: '20px'}}>Author: <br/><span style={{fontWeight: '500'}}>{props.videosInforData.videosinfor[i].username}</span></span>
                </Col>
              </Row>
      
              <Row style={{marginTop: '10px'}}>
                <Col>
                  <span style={{fontSize: '20px'}}>Course name: <br/><span style={{fontWeight: '500'}}>{props.videosInforData.videosinfor[i].coursename}</span></span>
                </Col>
              </Row>
      
              <Row style={{marginTop: '10px'}}>
                <Col>
                  <span style={{fontSize: '20px'}}>Video name: <br/><span style={{fontWeight: '500'}}>{props.videosInforData.videosinfor[i].videoname}</span></span>
                </Col>
              </Row>
      
              <Row style={{marginTop: '10px'}}>
                <Col>
                <span style={{fontSize: '20px'}}>Descriptiton: <br/>
                  <span style={{fontWeight: '500'}} dangerouslySetInnerHTML={{__html: props.videosInforData.videosinfor[i].videodescription}}>

                  </span>
                </span>
                  {/* <span style={{fontSize: '20px'}}>Descriptiton: <br/> <span style={{fontWeight: '500'}}>{props.videosInforData.videosinfor[i].videodescription}</span></span> */}
                </Col>
              </Row>
            </Container>
          </>
        );
      }
    }
  } else {
    return (
      <>
        Lỗi đường truyền.
      </>
    );
  }
  
}



const TitleCourseNameSytle = {
  fontSize: '35px', 
  fontWeight: '800',
  fontFamily: 'Alliance No.1",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";'
}

export default VideoPage;