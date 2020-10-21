const { FlexLayout, QMainWindow, QLabel, QMovie, QWidget, QLineEdit, QPushButton } = require('@nodegui/nodegui');
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

function createSearchContainer (onSearch) {
    const searchContainer = new QWidget();
    searchContainer.setObjectName('searchContainer');
    searchContainer.setLayout(new FlexLayout());

    const searchInput = new QLineEdit();
    searchInput.setObjectName('searchInput');

    const searchButton = new QPushButton();
    searchButton.setObjectName('searchButton');
    searchButton.setText('🔍');

    searchButton.addEventListener('clicked', () => {
        onSearch(searchInput.text());
    });

    searchContainer.layout.addWidget(searchInput);
    searchContainer.layout.addWidget(searchButton);

    searchContainer.setStyleSheet(`
        #searchContainer {
            flex-direction: 'row';
            padding: 10px;
            align-items: 'center';
        }
        
        #searchInput {
            flex: 1;
            height: 40px;
        }
        
        #searchButton {
            margin-left: 5px;
            width: 50px;
            height: 35px;
        }
        `);

        return searchContainer;
}

const main = async() => {
    const win = new QMainWindow();
    win.setWindowTitle('Gif Search');
    
    const center = new QWidget();
    center.setLayout( new FlexLayout());

    let container = new QWidget();
    const searchContainer = createSearchContainer(async searchText => {
        try {
            //Cria um novo container com uma lista  de novos Gifs
            const listOfGifs = await searchGifs(searchText);
            const newGifContainer = await getGifViews(listOfGifs);

            //Remove os containers existentes da janela
            center.layout.removeWidget(container);
            container.close();

            //Adiciona novos containers de Gifs na Janela
            center.layout.addWidget(newGifContainer);
            container = newGifContainer;
        }
        catch (err) {
            console.error('Algo de errado não está certo', err);
        }
    });

    center.layout.addWidget(searchContainer);

    win.setCentralWidget(center);
    win.show();

    global.win = win;

};

main().catch(console.error);
