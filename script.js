const Peer = window.Peer;

(async function main() {
  const localVideo = document.getElementById('js-local-stream');
  const createPeer = document.getElementById('js-create-peer');
  const joinTrigger = document.getElementById('js-join-trigger');
  const leaveTrigger = document.getElementById('js-leave-trigger');
  const remoteVideos = document.getElementById('js-remote-streams');
  const peer_Id = document.getElementById('js-peer-id');
  const roomId = document.getElementById('js-room-id');
  const roomMode = document.getElementById('js-room-mode');
  const localText = document.getElementById('js-local-text');
  const sendTrigger = document.getElementById('js-send-trigger');
  const messages = document.getElementById('js-messages');
  const meta = document.getElementById('js-meta');
  const sdkSrc = document.querySelector('script[src*=skyway]');

  const left_arrow = document.getElementById('left-arrow');
  const right_arrow = document.getElementById('right-arrow');

  meta.innerText = `
    UA: ${navigator.userAgent}
    SDK: ${sdkSrc ? sdkSrc.src : 'unknown'}
  `.trim();

  const getRoomModeByHash = () => (location.hash === '#sfu' ? 'sfu' : 'mesh');

  roomMode.textContent = getRoomModeByHash();
  window.addEventListener(
    'hashchange',
    () => (roomMode.textContent = getRoomModeByHash())
  );

  const localStream = await navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .catch(console.error);

  // Render local stream
  localVideo.muted = true;
  localVideo.srcObject = localStream;
  localVideo.playsInline = true;
  await localVideo.play().catch(console.error);


  createPeer.addEventListener('click', () => {

    //eslint-disable-next-line require-atomic-updates
    const peer = (window.peer = new Peer(peer_Id.value,{
      key: window.__SKYWAY_KEY__,
      debug: 3,
    }));

    peer.on('open',()=>{
      console.log(peer.id);
    });

    localVideo.setAttribute('class','stream'+peer_Id.value);
    peer.on('error', console.error);
  });


  // Register join handler
  joinTrigger.addEventListener('click', () => {
    // Note that you need to ensure the peer has connected to signaling server
    // before using methods of peer instance.

    if (!peer.open) {
      return;
    }


    const room = peer.joinRoom(roomId.value, {
      mode: getRoomModeByHash(),
      stream: localStream,
    });

    room.once('open', () => {
      messages.textContent += '=== You joined ===\n';
    });
    room.on('peerJoin', peerId => {
      messages.textContent += `=== ${peerId} joined ===\n`;
    });

    // Render remote stream for new peer join in the room
    room.on('stream', async stream => {
      const newVideo = document.createElement('video');
      newVideo.srcObject = stream;
      newVideo.playsInline = true;
      // mark peerId to find it later at peerLeave event
      newVideo.setAttribute('data-peer-id', stream.peerId);
      newVideo.setAttribute('class','local'+peer.id+'_stream'+stream.peerId);
      remoteVideos.append(newVideo);
      await newVideo.play().catch(console.error);
    });

    room.on('data', ({ data, src }) => {
      // Show a message sent to the room and who sent
      messages.textContent += `${src}: ${data}\n`;

      console.log(peer.id);

      switch (peer.id){
        case '1':
          if(data[0] == 2){
            if(data[1] == 3){
              left_arrow.className = "left_3";
            }else if(data[1] == 2){
              left_arrow.className = "left_2";
            }else{
              left_arrow.className = "a";
            }
          }else if(data[0] == 3){
            if(data[1] == 2){
              right_arrow.className="right_2";
            }else if(data[1] == 3){
              right_arrow.className="right_3";
            }else{
              right_arrow.className="a";
            }
          }
          break;
        case '2':
          if(data[0] == 3){
            if(data[1] == 3){
              left_arrow.className = "left_3";
            }else if(data[1] == 2){
              left_arrow.className = "left_2";
            }else{
              left_arrow.className = "a";
            }
          }else if(data[0] == 1){
            if(data[1] == 2){
              right_arrow.className="right_2";
            }else if(data[1] == 3){
              right_arrow.className="right_3";
            }else{
              right_arrow.className="a";
            }
          }
          break;
        case '3':
          if(data[0] == 1){
            if(data[1] == 3){
              left_arrow.className = "left_3";
            }else if(data[1] == 2){
              left_arrow.className = "left_2";
            }else{
              left_arrow.className = "a";
            }
          }else if(data[0] == 2){
            if(data[1] == 2){
              right_arrow.className="right_2";
            }else if(data[1] == 3){
              right_arrow.className="right_3";
            }else{
              right_arrow.className="a";
            }
          }
          break;
        default:
        }

        console.log(right_arrow.className);
        console.log(left_arrow.className);
      });

    // for closing room members
    room.on('peerLeave', peerId => {
      const remoteVideo = remoteVideos.querySelector(
        `[data-peer-id="${peerId}"]`
      );
      remoteVideo.srcObject.getTracks().forEach(track => track.stop());
      remoteVideo.srcObject = null;
      remoteVideo.remove();

      messages.textContent += `=== ${peerId} left ===\n`;
    });

    // for closing myself
    room.once('close', () => {
      sendTrigger.removeEventListener('click', onClickSend);
      messages.textContent += '== You left ===\n';
      Array.from(remoteVideos.children).forEach(remoteVideo => {
        remoteVideo.srcObject.getTracks().forEach(track => track.stop());
        remoteVideo.srcObject = null;
        remoteVideo.remove();
      });
    });

    sendTrigger.addEventListener('click', onClickSend);
    leaveTrigger.addEventListener('click', () => room.close(), { once: true });

    function onClickSend() {
      // Send message to all of the peers in the room via websocket
      room.send(localText.value);

      messages.textContent += `${peer.id}: ${localText.value}\n`;
      localText.value = '';
    }

    webgazer.setGazeListener(function(data, clock) {

      if(data == null){
        console.log('nothing');
        return;
      }

      if(xdot == null){
      }else{
        pxdot = xdot;
        pydot = ydot;
      }

      xdot = data.x;
      ydot = data.y;


      if(ydot > 550){
        if(xdot < 800 && xdot >= 500){
          if(state != 1){

            if(mode == 1){

            if(Date.now){
            var now_seconds = Date.now();
            }

            timestamp = now_seconds - base_seconds;

            state = 1;

            statesArr.push(state);
            timestampArr.push(timestamp);
            console.log(timestampArr,":",statesArr);

            gaze_pos[0] = peer.id;
            gaze_pos[1] = 1;

            room.send(gaze_pos);
            messages.textContent += `${peer.id}:"Looking1"\n`;

          }

          }
        }else{
          if(state != 0){

            if(mode == 1){

            if(Date.now){
            var now_seconds = Date.now();
            }

            timestamp = now_seconds - base_seconds;

            state = 0;

            statesArr.push(state);
            timestampArr.push(timestamp);
            console.log(timestampArr,":",statesArr);

            gaze_pos[0] = peer.id;
            gaze_pos[1] = 1;

            room.send(gaze_pos);
            messages.textContent += `${peer.id}:"Looking1"\n`;
          }
        }
      }
      }else if(ydot <= 550 && ydot > 50){
        if(xdot < 650 && xdot > 50){
          if(state != 2){
            if(mode == 1){

            if(Date.now){
            var now_seconds = Date.now();
            }

            timestamp = now_seconds - base_seconds;

            state = 2;

            statesArr.push(state);
            timestampArr.push(timestamp);
            console.log(timestampArr,":",statesArr);

            gaze_pos[0] = peer.id;
            gaze_pos[1] = 2;

            room.send(gaze_pos);
            messages.textContent += `${peer.id}: Looking2\n`;
          }
          }
        }else if(xdot >=650 && xdot < 1250){
          if(state != 3){

            if(mode == 1){
            if(Date.now){
            var now_seconds = Date.now();
            }

            timestamp = now_seconds - base_seconds;

            state = 3;

            statesArr.push(state);
            timestampArr.push(timestamp);
            console.log(timestampArr,":",statesArr);

            gaze_pos[0] = peer.id;
            gaze_pos[1] = 3;

            room.send(gaze_pos);
            messages.textContent += `${peer.id}: Looking3\n`;
          }
        }
        }else{
          if(state != 0){

            if(mode == 1){

            if(Date.now){
            var now_seconds = Date.now();
            }

            timestamp = now_seconds - base_seconds;

            state = 0;

            statesArr.push(state);
            timestampArr.push(timestamp);
            console.log(timestampArr,":",statesArr);

            gaze_pos[0] = peer.id;
            gaze_pos[1] = 1;

            room.send(gaze_pos);
            messages.textContent += `${peer.id}:"Looking1"\n`;
          }
        }
        }
      }else{
        if(state != 0){

          if(mode == 1){

          if(Date.now){
          var now_seconds = Date.now();
          }

          timestamp = now_seconds - base_seconds;

          state = 0;

          statesArr.push(state);
          timestampArr.push(timestamp);
          console.log(timestampArr,":",statesArr);

          gaze_pos[0] = peer.id;
          gaze_pos[1] = 1;

          room.send(gaze_pos);
          messages.textContent += `${peer.id}:"Looking1"\n`;
        }
      }
      }



        })
        .begin();
  });

})();
