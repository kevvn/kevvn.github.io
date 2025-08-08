import React, { useState } from 'https://esm.sh/react@18';
import ReactDOM from 'https://esm.sh/react-dom@18';

function App() {
  const [pc, setPc] = useState(null);
  const [localSDP, setLocalSDP] = useState('');
  const [remoteSDP, setRemoteSDP] = useState('');
  const [channel, setChannel] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isChannelOpen, setIsChannelOpen] = useState(false);

  const start = () => {
    const newPc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    const dc = newPc.createDataChannel('data');
    dc.onmessage = (event) => {
      setMessages((prev) => [...prev, `Remote: ${event.data}`]);
    };
    dc.onopen = () => setIsChannelOpen(true);
    dc.onclose = () => setIsChannelOpen(false);
    setChannel(dc);
    newPc.ondatachannel = (event) => {
      const c = event.channel;
      c.onmessage = (ev) => {
        setMessages((prev) => [...prev, `Remote: ${ev.data}`]);
      };
      c.onopen = () => setIsChannelOpen(true);
      c.onclose = () => setIsChannelOpen(false);
      setChannel(c);
    };
    newPc.onicecandidate = (event) => {
      if (!event.candidate) {
        setLocalSDP(JSON.stringify(newPc.localDescription));
      }
    };
    setPc(newPc);
  };

  const sendMessage = () => {
    if (channel && channel.readyState === 'open' && message) {
      channel.send(message);
      setMessages((prev) => [...prev, `Local: ${message}`]);
      setMessage('');
    }
  };

  const createOffer = async () => {
    if (!pc) return;
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
  };

  const createAnswer = async () => {
    if (!pc) return;
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
  };

  const setRemote = async () => {
    if (!pc || !remoteSDP) return;
    const desc = new RTCSessionDescription(JSON.parse(remoteSDP));
    await pc.setRemoteDescription(desc);
  };

  return (
    React.createElement('div', null,
      React.createElement('div', null,
        React.createElement('button', { onClick: start }, 'Start'),
        React.createElement('button', { onClick: createOffer, disabled: !pc }, 'Create Offer'),
        React.createElement('button', { onClick: createAnswer, disabled: !pc }, 'Create Answer'),
        React.createElement('button', { onClick: setRemote, disabled: !pc }, 'Set Remote')
      ),
      React.createElement('div', null,
        React.createElement('textarea', {
          value: localSDP,
          readOnly: true,
          rows: 6,
          cols: 50,
          placeholder: 'Local SDP will appear here',
        }),
        React.createElement('textarea', {
          value: remoteSDP,
          onChange: (e) => setRemoteSDP(e.target.value),
          rows: 6,
          cols: 50,
          placeholder: 'Paste remote SDP here',
        })
      ),
      React.createElement('div', null,
        React.createElement('textarea', {
          value: messages.join('\n'),
          readOnly: true,
          rows: 6,
          cols: 50,
          placeholder: 'Messages will appear here',
        })
      ),
      React.createElement('div', null,
        React.createElement('input', {
          value: message,
          onChange: (e) => setMessage(e.target.value),
          placeholder: 'Type JSON message',
          style: { width: '80%', marginRight: '10px' },
        }),
        React.createElement('button', { onClick: sendMessage, disabled: !channel || !isChannelOpen }, 'Send')
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(App)
);
