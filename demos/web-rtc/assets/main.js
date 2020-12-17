const $ = document.querySelector.bind(document);
HTMLElement.prototype.click = function (callback) {
  this.addEventListener('click', callback);
}

const startBtnEle = $('#start-btn');
const inviteBtnEle = $('#invite-btn');
const selfVideoEle = $('#self-video');
const otherVideoEle = $('#other-video');
const selfNicknameEle = $('#self-nickname');
const otherNicknameEle = $('#other-nickname');

let socket, localStream, peer;

init();

////////////////////////////////////////////////////////////////////////////////

function init() {
  startBtnEle.click(start);
  inviteBtnEle.click(invite);
}

async function start() {
  // 打开摄像头
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  selfVideoEle.srcObject = localStream = stream;
  // 创建socket通信
  socket = createSocket();
  inviteBtnEle.disabled = false;
}

async function invite() {
  // 1 A端创建peer
  peer = createPeer('邀请端');
  // 2 A端将本地摄像头数据流加入peer中
  localStream.getTracks().forEach((track) => {
    peer.addTrack(track, localStream);
  });
  // 3 A端创建offer
  const offer = await peer.createOffer();

  // 4 A端基于offer设置本地信息，此时peer自动开始触发icecandidate事件
  await peer.setLocalDescription(offer);
        
  // 5 A端将offer发送到B端
  const pushMsg = {
    room: 'user_' + otherNicknameEle.value,
    pushData: {
      type: 'offer',
      data: offer,
      nickname: selfNicknameEle.value
    }
  }
  pushFn(pushMsg);
  console.log('[邀请端] 推送 offer:' , pushMsg);
}

// 创建信令协商通道，基于socket.io实现
function createSocket() {
  const userid = selfNicknameEle.value;
  const uuid = 'uuid_' + userid;
  const serverUrl = `${window.demoConfig.pushServer}/${window.demoConfig.pushNamespace}`;
  const _socket = io.connect(`${serverUrl}?uuid=${uuid}&userid=${userid}`, {
    path: '/push/socket.io/',
    transports: ['polling']
  });

  _socket.on('connect', () => {
    _socket.on('push', onPush);
  });

  return _socket;
}

async function onPush(pushEvent){
  if (!localStream) {
    alert('localStream is null');
    return;
  }

  if (!peer) {
    // B端被动创建peer
    otherNicknameEle.value = pushEvent.pushData.nickname;
    peer = createPeer('被邀请端');
    localStream.getTracks().forEach((track) => {
      peer.addTrack(track, localStream);
    });
  }

  // 6 B端接收到offer
  if (pushEvent.pushData.type === 'offer') {
    console.log('[被邀请端] 接收 offer:', pushEvent.pushData.data);
    // 7 B端基于接收的offer设置远端信息
    await peer.setRemoteDescription(pushEvent.pushData.data);
    // 8 B端创建对应 answer
    const answer = await peer.createAnswer();
    // 9 B端基于 answer 设置本地信息，此时peer自动开始触发icecandidate事件
    await peer.setLocalDescription(answer);
    // 10 B端将answer发送到A端
    const pushMsg = {
      room: 'user_' + pushEvent.pushData.nickname,
      pushData: {
        type: 'answer',
        data: answer,
        nickname: selfNicknameEle.value
      }
    };
    pushFn(pushMsg);
    console.log('[被邀请端] 推送 anser:', pushMsg);
  } else if (pushEvent.pushData.type === 'answer') {
    // 11 A端接收B端的answer
    peer.setRemoteDescription(pushEvent.pushData.data);
    console.log('[邀请端] 接收 answer:', pushEvent.pushData.data);
  } else if (pushEvent.pushData.type === 'icecandidate') {
    // A B端同时接收彼此Candidate信息
    peer.addIceCandidate(pushEvent.pushData.data);
    console.log('[双端] 接收 候选通道:', pushEvent.pushData.data);
  }
}

function createPeer(logType) {
  const _peer = new RTCPeerConnection();

  _peer.addEventListener('icecandidate', (e) => {
    if (!e.candidate) {
      return;
    }

    // A B端同时发送自己Candidate信息
    const pushMsg = {
      room: 'user_' + otherNicknameEle.value,
      pushData: {
        type: 'icecandidate',
        data: e.candidate,
        nickname: selfNicknameEle.value
      }
    };
    pushFn(pushMsg);
    console.log(`[${logType}] 推送 候选通道 :`, pushMsg);
  });

  // A B端在成功建立P2P通信之后数据流会自动进行传输，此时彼此要将流数据转接到video上
  _peer.addEventListener('track', (e) => {
    otherVideoEle.srcObject = e.streams[0];
  });

  return _peer;
}

async function pushFn(data) {
  const response = await fetch(window.demoConfig.pushServer + '/push-logic/api/auth/push', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      authorization: window.demoConfig.pushServerAuth
    },
    body: JSON.stringify(data)
  });
  return response.json();
}
