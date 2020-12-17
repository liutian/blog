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

function start() {
  // 打开摄像头
  navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream) => {
    selfVideoEle.srcObject = localStream = stream;
    // 创建socket通信
    socket = createSocket();
    inviteBtnEle.disabled = false;
  }).catch(e => {
    console.dir(e);
    alert('getUserMedia error' + e)
  });
}

function invite() {
  // 1 A端创建peer
  peer = createPeer();
  // 2 A端将本地摄像头数据流加入peer中
  localStream.getTracks().forEach((track) => {
    peer.addTrack(track, localStream);
  });
  // 3 A端创建offer
  peer.createOffer().then((offer) => {
    // 4 A端基于offer设置本地信息，此时peer自动开始触发icecandidate事件
    peer.setLocalDescription(offer).then(() => {
      // 5 A端将offer发送到B端
      push({
        room: 'user_' + otherNicknameEle.value,
        pushData: {
          type: 'offer',
          data: offer,
          nickname: selfNicknameEle.value
        }
      })
    }).catch(e => alert('setLocalDescription error'));
  }).catch(e => alert('createOffer error'));
}

function createSocket() {
  const userid = selfNicknameEle.value;
  const uuid = 'uuid_' + userid;
  const _socket = io.connect(window.demoConfig.pushServer + '/demo?uuid=' + uuid + '&userid=' + userid, {
    path: '/push/socket.io/',
    transports: ['polling']
  });

  _socket.on('connect', () => {
    _socket.on('push', (pushEvent) => {
      if (!localStream) {
        alert('localStream is null');
        return;
      }

      if (!peer) {
        // B端被动创建peer
        otherNicknameEle.value = pushEvent.pushData.nickname;
        peer = createPeer();
        localStream.getTracks().forEach((track) => {
          peer.addTrack(track, localStream);
        });
      }

      // 6 B端接收到offer
      if (pushEvent.pushData.type === 'offer') {
        // 7 B端基于接收的offer设置远端信息
        peer.setRemoteDescription(pushEvent.pushData.data).then(() => {
          // 8 B端创建对应 answer
          peer.createAnswer().then(answer => {
            // 9 B端基于 answer 设置本地信息，此时peer自动开始触发icecandidate事件
            peer.setLocalDescription(answer).then(() => {
              // 10 B端将answer发送到A端
              push({
                room: 'user_' + pushEvent.pushData.nickname,
                pushData: {
                  type: 'answer',
                  data: answer,
                  nickname: selfNicknameEle.value
                }
              })
            }).catch(e => alert('setLocalDescription error'));
          }).catch(e => alert('createAnswer error'));
        }).catch(e => alert('setRemoteDescription error'));
      } else if (pushEvent.pushData.type === 'answer') {
        // 11 A端接收B端的answer
        peer.setRemoteDescription(pushEvent.pushData.data);
      } else if (pushEvent.pushData.type === 'icecandidate') {
        // A B端同时接收彼此Candidate信息
        peer.addIceCandidate(pushEvent.pushData.data);
      }
    });
  });
  return _socket;
}

function createPeer() {
  const _peer = new RTCPeerConnection();

  _peer.addEventListener('icecandidate', (e) => {
    if (!e.candidate) {
      return;
    }

    // A B端同时发送自己Candidate信息
    push({
      room: 'user_' + otherNicknameEle.value,
      pushData: {
        type: 'icecandidate',
        data: e.candidate,
        nickname: selfNicknameEle.value
      }
    })
  });

  // A B端在成功建立P2P通信之后数据流会自动进行传输，此时彼此要将流数据转接到video上
  _peer.addEventListener('track', (e) => {
    otherVideoEle.srcObject = e.streams[0];
  });

  return _peer;
}

function push(data) {
  return fetch(pushServer + '/push-logic/api/auth/push', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      authorization: window.demoConfig.pushServerAuth
    },
    body: JSON.stringify(data)
  }).then(response => response.json());
}
