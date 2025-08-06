const startBtn = document.getElementById('startBtn');
const createOfferBtn = document.getElementById('createOfferBtn');
const createAnswerBtn = document.getElementById('createAnswerBtn');
const applyAnswerBtn = document.getElementById('applyAnswerBtn');
const offerField = document.getElementById('offer');
const answerField = document.getElementById('answer');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

let pc; // RTCPeerConnection
let localStream;

async function initPeerConnection() {
  pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  });

  pc.onicecandidate = (event) => {
    if (event.candidate) return;
    const desc = pc.localDescription;
    if (!desc) return;
    if (desc.type === 'offer') {
      offerField.value = JSON.stringify(desc);
    } else if (desc.type === 'answer') {
      answerField.value = JSON.stringify(desc);
    }
  };

  pc.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
  };

  if (localStream) {
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
  }
}

startBtn.onclick = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = localStream;
  createOfferBtn.disabled = false;
};

createOfferBtn.onclick = async () => {
  await initPeerConnection();
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  // icecandidate handler will set the textarea
};

createAnswerBtn.onclick = async () => {
  await initPeerConnection();
  const offer = JSON.parse(offerField.value);
  await pc.setRemoteDescription(offer);
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  // icecandidate handler will set the textarea
};

applyAnswerBtn.onclick = async () => {
  const answer = JSON.parse(answerField.value);
  await pc.setRemoteDescription(answer);
};
