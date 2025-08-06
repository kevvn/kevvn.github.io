# kevvn.github.io

This repository hosts a small demo for experimenting with WebRTC connections.

## WebRTC demo

1. Open `index.html` in two browsers.
2. Click **Start Camera** on both to enable video and audio.
3. On one browser click **Create Offer** and copy the generated text.
4. Paste the offer into the other browser's **Offer** field and click **Create Answer**.
5. Copy the answer back to the first browser's **Answer** field and click **Apply Answer**.

After the exchange finishes a peer-to-peer connection will be established and the remote video will be displayed.
