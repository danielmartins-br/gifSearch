const { FlexLayout, QMainWindow, QLabel, QMovie, QWidget } = require('@nodegui/nodegui');
const axios = require('axios').default;
const  GIPHY_API_KEY = 'p77gARnazhGfm7vEfTRx8Spqvj2i2pOk';

async function getMovie(url){
    const {data} = await axios.get(url, {responseType: 'arraybuffer'});
    const movie = new QMovie();
    movie.loadFromData(data);
    movie.start();
    return movie;
}

async function searchGifs(searchTerm) {
    const url = 'https://api.giphy.com/v1/gifs/search';
    const res = await axios.get(url, {
        params: {
            api_key: GIPHY_API_KEY,
            limit: 18,
            q: searchTerm,
            lang: 'en',
            offset: 0,
            rating: 'g'
        }
    });

    return res.data.data;
}

async function  getGifViews (listOfGifs) {
    const container = new QWidget();
    container.setLayout(new FlexLayout());

    const promises = listOfGifs.map(async gif => {
        const {url, width} = gif.images.fixed_width_small;
        const movie = await getMovie(url);
        const gifView = new QLabel();
        gifView.setMovie(movie);
        gifView.setInlineStyle(`width: ${width}`);
        container.layout.addWidget(gifView);
    });

    await Promise.all(promises);

    container.setInlineStyle(`
        flex-direction: 'row';
        flex-wrap: 'wrap';
        justify-content: 'center';
        width: 430px;
        height: 350px;
    `);

    return container;
}

const main = async() => {
    const win = new QMainWindow();
    win.setWindowTitle('Gif Search');
    
    const center = new QWidget();
    center.setLayout( new FlexLayout());

    const listOfGifs = await searchGifs('never gonna give you up');

    const container = await getGifViews(listOfGifs);

    center.layout.addWidget(container);

    win.setCentralWidget(center);
    win.show();

    global.win = win;

};

main().catch(console.error);
