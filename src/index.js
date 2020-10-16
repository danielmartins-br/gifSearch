const { QMainWindow, QLabel, QMovie } = require('@nodegui/nodegui');
const axios = require('axios').default;

//Funcao que recebe uma url e faz o axios baixar o gif dela como um buffer
async function getMovie(url) {
    const {data} = await axios.get(url, {responseType: 'arraybuffer' });
    
    const movie = new QMovie();
    movie.loadFromData(data);
    movie.start();
    return movie;
}

const main = async () => {
    const win = new QMainWindow();
    win.setWindowTitle('Gif Search');

    const label = new QLabel();
    const gifMovie = await getMovie ('https://media1.tenor.com/images/f06d8694e2363f98237de3c1a8c46b3a/tenor.gif');
    label.setMovie(gifMovie);

    win.setCentralWidget(label);
    win.show();
    global.win = win;
};

main().catch(console.error);