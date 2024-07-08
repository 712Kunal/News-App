
import conf from "./config";

let search_but = document.getElementsByTagName('input')[0];
search_but.addEventListener('click', () => {
    search_but.style.outlineColor = 'rgb(0, 255, 255)';
    search_but.style.boxShadow = '-3px -3px 15px rgb(0, 255, 255)';
    search_but.style.transition = 'boxShadow 0.1s ease';
})

const navToggle=document.querySelector("#nav-toggle");
const navLink=document.querySelector("#nav-links");

navToggle.addEventListener('click',()=>{
    navLink.classList.toggle('load-nav');
})

let search_button = document.getElementsByTagName('button')[0];
search_button.addEventListener('mouseover', () => {
    search_button.style.boxShadow = '0px 0px 20px #0077b6';
    search_button.style.cursor = 'pointer';
})
search_button.addEventListener('mouseout', () => {
    search_button.style.boxShadow = '';
    search_button.style.cursor = '';
})

//add your api key over here
const API_KEY = conf.API_TOKEN ;  
const url = "https://newsapi.org/v2/everything?q=";

// on loading the window of our website the fetchNews call back function will be called
window.addEventListener('load', () => fetchNews("India"));

async function fetchNews(querry) {
    const response = await fetch(`${url}${querry}&apiKey=${API_KEY}`);
    const data = await response.json();
    console.log(data);
    bindData(data.articles);
}

function bindData(articles) {
    const cardContainer = document.getElementById('cards-container');
    const newscardTemplate = document.getElementById('template-news-card');

    cardContainer.innerHTML = '';

    articles.forEach((article) => {

        if (!article.urlToImage) {
            return;
        }

        const cardClone = newscardTemplate.content.cloneNode(true);
        // If true is passed, it means that all descendants (children, grandchildren, etc.) of the template are also cloned.
        // If false or nothing is passed, only the template itself is cloned without its descendants.

        fillDataInCard(cardClone, article);

        cardContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsimg = cardClone.querySelector('#news-img');
    const newstitle = cardClone.querySelector('#news-title');
    const newssource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-description');

    newsimg.src = article.urlToImage;
    newstitle.innerHTML = article.title;
    newssource.innerHTML = article.source;
    newsDesc.innerHTML = article.description;

    //setting the date
    const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
        timeZone: "Asia/Jakarta"
    });

    newssource.innerHTML = `${article.source.name} • ${date}`;

    // open the news on click
    cardClone.firstElementChild.addEventListener('click', () => {
        window.open(article.url, "_blank");
    }); 
}

let curSelectedNav = null;
function onNavitemClick(id) {
    fetchNews(id);

    if (searchText.value) {
        searchText.value = '';
    }
    let navItem = document.getElementById(`nav-click-${id}`);
    if (curSelectedNav !== null) {
        curSelectedNav.classList.remove("active");
    }
    curSelectedNav = navItem;

    if (curSelectedNav && navToggle) {
        navLink.classList.toggle('load-nav');
    }

    console.log(curSelectedNav);
    curSelectedNav.classList.add('active');
}

window.onNavitemClick = onNavitemClick;

const searchbut = document.getElementById('search-button');
const searchText = document.getElementById('newsToBeSearched');

searchText.addEventListener('keypress', (key_object) => {
    
    if (key_object.key == "Enter") {
        const querry = searchText.value;
        const sectionToScrollTo = document.getElementById("cards-container");
        sectionToScrollTo.scrollIntoView({ behavior: "smooth" });  //Go to that section when clicked "Enter"
        fetchNews(querry);

        if (searchText.value && navToggle) {
            navLink.classList.toggle('load-nav');
        }
    }
})

searchbut.addEventListener('click', () => {
    const querry = searchText.value;

    if (!querry) {          // if user doesnt enter any text and hit the serach button
        return;
    }
    fetchNews(querry);

    if (curSelectedNav !== null) {
        curSelectedNav.classList.remove('active');
    }

});

