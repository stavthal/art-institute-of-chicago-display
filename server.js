import express from 'express';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const server = express();



server.set('view engine', 'ejs');

server.use(bodyParser.urlencoded({extended: true}));
server.use(express.static("public"));



const fetchData = (url , res , page) => {

     /*using node-fetch to fetch the data from the Art Institute of Chicago API 
    and render the page while also passing the data to the page to render */

    fetch(url)
    .then(res => res.json())
    .then(data => res.render( page, {data: data }))
    .catch(error => res.send('ERROR'));
};




server.get("/", (req,res) => {
    
   
    const URL = 'https://api.artic.edu/api/v1/artworks?page=1';

    fetchData(URL , res , "home"); //including the res here so we can do things like res.render 
    
});


server.get("/artworks/page=:page_id", (req,res) => {

    const URL = `https://api.artic.edu/api/v1/artworks?page=${req.params.page_id}`;

    fetchData(URL , res , "home");
  
});



server.get("/artworks/:id", (req,res) => {
    const URL = `https://api.artic.edu/api/v1/artworks/${req.params.id}`;

    fetchData(URL, res , "resource");
});



server.get("/about", (req,res) => {
    res.render('about');
});

server.get("/404", (req,res) => {
    res.send("404");
})

//error route (/* anything else than the routes mentioned above)
server.get("/*", (req,res) => {
    res.redirect('/404');
})


const PORT = process.env.PORT || 3000; //Sets the port to the current port of the hosting provider or simply to localhost:3000

server.listen(PORT, () => {
    console.log('Server running on %d ...' , PORT);
});