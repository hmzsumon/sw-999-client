// config/socketUrl.ts
let socketUrl = '';

if (process.env.NODE_ENV === 'development') {
	socketUrl = 'http://localhost:8000'; // local socket server
} else {
	socketUrl = 'https://spain-win99-9184ebe694ed.herokuapp.com'; // deployed socket server
}

export default socketUrl;
