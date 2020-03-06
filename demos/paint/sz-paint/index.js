import Paint from './paint/Paint.js';
import ClipFrame from './clip-frame/ClipFrame.js';
import MousePoint from './mouse-point/MousePoint.js';
import ToolBar from './tool-bar/ToolBar.js';

MousePoint.__root_path = '/sz-paint/mouse-point';
ClipFrame.__root_path = '/sz-paint/clip-frame';
ToolBar.__root_path = '/sz-paint/tool-bar';
Paint.__root_path = '/sz-paint/paint';

window.customElements.define('sz-mouse-point', MousePoint);
window.customElements.define('sz-clip-frame', ClipFrame);
window.customElements.define('sz-tool-bar', ToolBar);
window.customElements.define('sz-paint', Paint);