// javascript for front end will exist here
// To show my video

const socket  = io('/');                                        //import socket in script.js

const videoGrid = document.getElementById('video-grid');       // Get the video in video grid here in videogrod

const myVideo = document.createElement('video');               // video element to play the video stream in, ie create an html element of type 'video'
myVideo.muted = true;

const peers = {}



var peer = new Peer (undefined, {
    path:'/peerjs',
    host: '/',
    port:'443'
});                                                        // create a new peer connections




let myVideoStream                                              //global variable
                           
navigator.mediaDevices.getUserMedia({
    video: true,                                               // want to access the video
    audio: true
}).then(stream =>{                                             //when user agrees to give access to the camera and the audio then create the function stream
     myVideoStream = stream;                                   //Stream is the result of the getusermeadia function ie the video and will be stored in the global variable myVideoStream
     addVideoStream( myVideo, stream);                         // Add the element myVideo created of video type in the addVideoStream() function for playing it
     

    peer.on('call', call => {
  
    call.answer(stream)                                          // Answer the call with an A/V stream.
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {     
        addVideoStream(video, userVideoStream)                  // Show stream in some video/canvas element.
        
    }) 

  }) 

    socket.on('user-connected', userId =>{                        //recieving user's video which we are calling stream and passing it to the socket
        connecToNewUser(userId, stream);
    })

    let text = $("input");
    // when press enter send message
    $('html').keydown(function (e) {
      if (e.which == 13 && text.val().length !== 0) {
        socket.emit('message', text.val());
        text.val('')
      }
    });
    socket.on("createMessage", message => {
      $(".messages").append(`<li class="message"><b>user</b><br/>${message}</li>`);
      
    })
    scrollToBottom();
 
})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);                      // after declaring ROOM_ID in room.ejs now this can be passed while joining the room with only this socket.emit('join-room', ROOM_ID);  
})                                             
  
socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

const connecToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })

    call.on('close', () => {
      video.remove()
    })
  
    peers[userId] = call
  
}



const addVideoStream = (video, stream) => {                                   // take in a video object (object of video type) and stream
    video.srcObject = stream;                                                 // load all the data for this specific stream then
    video.addEventListener('loadedmetadata', () =>{                          // To play the stored video
        video.play();
    })
    videoGrid.append(video);                                                    //append the video element
}


const scrollToBottom = () => {
    let d= $('.main__chat__window');
    d.scrollTop(d.prop("scrollHeight"));
}

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
  }
  
  const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }
  
  const setMuteButton = () => {
    const html = `
    <span class="iconify" data-icon="carbon:microphone-filled" data-inline="false"></span>
      <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
    <span class="iconify" data-icon="carbon:microphone-off-filled" data-inline="false"></span>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setStopVideo = () => {
    const html = `
    <span class="iconify" data-icon="bi:camera-video-fill" data-inline="false"></span>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <span class="iconify" data-icon="bi:camera-video-off-fill" data-inline="false"></span>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  

  const openForm = () => {
    document.getElementById("myForm").style.display = "block";
  }
  
  const closeForm = () => {
    document.getElementById("myForm").style.display = "none";
  }

  
 const shareScreen = () => {
      const socket = io.connect(window.location.origin);
      const localVideo = document.querySelector('.localVideo');
      const remoteVideos = document.querySelector('.remoteVideos');
      const peerConnections = {};
      var url_string =window.location.href
      var url = new URL(url_string);
      var de = url.searchParams.get("key");
      let room = de
      let getUserMediaAttempts = 5;
      let gettingUserMedia = false;
      let getdisplaymedia=true;
      /** @type {RTCConfiguration} */
      const config = {
        'iceServers': [{
          'urls': ['stun:stun.l.google.com:19302']
        }]
      };
      /** @type {MediaStreamConstraints} */
      const constraints = {
        audio: true,
        video: { facingMode: "user" }
      };
      socket.on('full', function(room) {
        alert('Room ' + room + ' is full');
      });
      socket.on('bye', function(id) {
        handleRemoteHangup(id);
      });
    
      if (room && !!room) {
        socket.emit('join', room);
      }
    
      window.onunload = window.onbeforeunload = function() {
        socket.close();
      };
    
      socket.on('ready', function (id) {
        if (!(localVideo instanceof HTMLVideoElement) || !localVideo.srcObject) {
          return;
        }
        const peerConnection = new RTCPeerConnection(config);
        peerConnections[id] = peerConnection;
        if (localVideo instanceof HTMLVideoElement) {
          peerConnection.addStream(localVideo.srcObject);
        }
        peerConnection.createOffer()
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(function () {
          socket.emit('offer', id, peerConnection.localDescription);
        });
        peerConnection.onaddstream = event => handleRemoteStreamAdded(event.stream, id);
        peerConnection.onicecandidate = function(event) {
          if (event.candidate) {
            socket.emit('candidate', id, event.candidate);
    
          }
        };
      });
    
      socket.on('offer', function(id, description) {
        const peerConnection = new RTCPeerConnection(config);
        peerConnections[id] = peerConnection;
        if (localVideo instanceof HTMLVideoElement) {
          peerConnection.addStream(localVideo.srcObject);
        }
        peerConnection.setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(function () {
          socket.emit('answer', id, peerConnection.localDescription);
        });
        peerConnection.onaddstream = event => handleRemoteStreamAdded(event.stream, id);
        peerConnection.onicecandidate = function(event) {
          if (event.candidate) {
            socket.emit('candidate', id, event.candidate);
          }
        };
      });
    
      socket.on('candidate', function(id, candidate) {
        peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate))
        .catch(e => console.error(e));
      });
    
      socket.on('answer', function(id, description) {
        peerConnections[id].setRemoteDescription(description);
      });
    
      function getUserMediaSuccess(stream) {
        gettingUserMedia = false;
        if (localVideo instanceof HTMLVideoElement) {
          !localVideo.srcObject && (localVideo.srcObject = stream);
        }
        socket.emit('ready');
      }
    
      function handleRemoteStreamAdded(stream, id) {
        const remoteVideo = document.createElement('video');
        remoteVideo.srcObject = stream;
        remoteVideo.setAttribute("id", id.replace(/[^a-zA-Z]+/g, "").toLowerCase());
        remoteVideo.setAttribute("playsinline", "true");
        remoteVideo.setAttribute("autoplay", "true");
        remoteVideos.appendChild(remoteVideo);
        if (remoteVideos.querySelectorAll("video").length === 1) {
          remoteVideos.setAttribute("class", "one remoteVideos");
        } else {
          remoteVideos.setAttribute("class", "remoteVideos");
        }
      }
    
      function getUserMediaError(error) {
        console.error(error);
    
        gettingUserMedia = false;
        (--getUserMediaAttempts > 0) && setTimeout(getUserMediaDevices, 1000);
      }
    
    function getUserMediaDevices() {
    var constraints = { audio: true, video: { width: 1280, height: 720 } }; 
    
    navigator.mediaDevices.getDisplayMedia(constraints)
    .then(function(mediaStream) {
      var video = document.querySelector('video');
      video.srcObject = mediaStream;
      video.onloadedmetadata = function(e) {
        video.play();
        getUserMediaSuccess(video.srcObject)  
      };
    })
    .catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.
    }
    
      function handleRemoteHangup(id) {
        peerConnections[id] && peerConnections[id].close();
        delete peerConnections[id];
        document.querySelector("#" + id.replace(/[^a-zA-Z]+/g, "").toLowerCase()).remove();
        if (remoteVideos.querySelectorAll("video").length === 1) {
          remoteVideos.setAttribute("class", "one remoteVideos");
        } else {
          remoteVideos.setAttribute("class", "remoteVideos");
        }
      }
    
      getUserMediaDevices();
    };
  

    