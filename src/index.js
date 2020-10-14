const { QMainWindow, QLabel } = require('@nodegui/nodegui');

const win = new QMainWindow();
win.setWindowTitle('Meme Search');

const label = new QLabel();
label.setText('Hello Mundo');

win.setCentralWidget(label);
win.show();

global.win = win;