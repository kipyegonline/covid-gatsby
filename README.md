

### VISUALIZING THE NOVEL CORONA VIRUS PANDEMIC CASES WITH REACT AND D3 

> __ "Move fast and break things. Unless you are breaking stuff, you are not moving fast enough."__ -Mark Zuckerberg  

The project is available on netlify and [https://wwww.prhub.co.ke/covid19](https://wwww.prhub.co.ke/covid19)  


### Quick summary
   This is an interactive app that visualizes the reported cases of the novel corona virus disease on svg. The covid-19was first  reported by the WHO on 31st December,2019.The visualisation starts from January 22nd 2020.The charts use linear and date scales to visualize the covid-19 pandemic.  


   The application takes in JSON  data from a rest api and outputs them as visuals; bar charts,tables and line charts for purposes on conveying statistics to users in visuals they resonate with.

### Basic Usage
This is an interactive app that visualizes data on svg using charts. The data can be further refined by hovering over a specific svg element displayed i,e hover over a circle or rectanges will show  more information on tool tip.
The buttons and drop down select menus allows user to refine covi19 data based on the region they want to explore.More interactivity can be achived through the drop downs and the buttons besides the charts.  



   ## Architecture  


   1. The app uses React js, a javascript UI  libarary, to render the UI components containing the visuals and the extra information including the tool tips and the tables.  


   2. I used d3 js (data driven documensts), a data visualisation library,  to create the charts logic; inbuilt algorithms,calculating axis and scales and redux for the management of data within the app.  
   3.   Styled components provided the styling for the react components, css in js methodology.    

   ### REST API  


   I used the following apis and its associated endpoints to fetch the data using the browser fetch API.

   1. [wuhan corona virus](https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/timeseries)
   2. [Covid19 api](https://api.covid19api.com/)   


   ........

#### Data
The data is obtained from a REST API created by differentr developers. The data is provided and updated by  John Hopkins University school of public health.It is updated multiples time a day.  


#### Set Up 
The app can be initialized on package.json by running the scripts object.Webpack is used as the module bundler for the porject and babel for transpiling the javascript code.  
The code base is on the SRC folder, the js folder is where the react componmets and inline css are located.  


The app  module is bundled by webpack, App.js in src/js is the entry point of webpack and the dist folder is the build folder.
* npm installl
* npm start (dev server)
* npm run build (outputs build on dist folfder)
*  npm test

### dependencies
The project  dependencies include: react js,redux,react redux, reactDOM styled.
Webpack, eslint and babel are the dev dependencies for set up.


### TESTS
The tests can be  run on the terminal; npm test. All the test are available in one folder called tests inside the SRC folder.  

The units tests were managed by jest and enzyme to test the redux ,graph components and styled components. 
.........

### DEPLOYMENT

Run 'npm install" then "npm run build" on the terminal to generate the build project which will be a dist folder.
........
#####  Copyright and  License
MIT
### REPOSITORY
www.bitbucket.com/kipyegonline

### Contacts
Get in touch on Twitter @kipyegonline
Email: vince.kipyegon11@gmail.com
