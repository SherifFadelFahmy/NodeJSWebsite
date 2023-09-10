const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const multer = require('multer');
const XLSX = require('xlsx');
const urlencoded = require('body-parser/lib/types/urlencoded');
const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize('test', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
  });
  
const hehe = require('./models/people.js')(sequelize,DataTypes);

app = express();
const upload = multer();

const values = [97, 93, 89, 84, 80, 76, 73, 70, 67, 64];
const values2 = [95, 90, 85, 80, 75, 70, 65, 60, 56, 53];
const cutoff2200 = 220000000;
const cutoff1610 = 16100000;

function checkNumber(array, number) {
  for (let entry of array) {
if (number >= entry - 1 && number < entry) return true;
  }
  return false;
}

async function initializeDatabase() {
    try {
      await sequelize.authenticate();
      console.log('Connected to the database.');
  
      // Sync the models with the database (create tables if they don't exist)
      await sequelize.sync();
  
      console.log('Database synchronization complete.');
    } catch (error) {
      console.error('Database connection error:', error);
    }
  }

function processRows(data) {
  let result = '';
  let count=1;
  for (let row of data) {
count=count+1;
if (count>=15 && row[5]!='W'){
    //row[2] out of 100
    //row[5] final
    //row[10] pre final
    //row[15] 12th
    //row[18] 7th
    //row[22] is the name
    //row[30] is the ID
    //row[32] is the number
    if (Number(row[30]) >= cutoff2200) {
        if (Number(row[2])>=60 && Number(row[5])<16 && Number(row[5])>=14){
            let theid = row[30];
            let number = row[32];
            result+=`<p>Student number ${number} with ID ${theid} should pass, please change final to 16</p>`;
        }else if (Number(row[2])<60 && Number(row[2])>=58 && Number(row[5])>=16){
            let theid = row[30];
            let number = row[32];
            result+=`<p>Student number ${number} with ID ${theid} should pass, please add two marks to the grades out of 60</p>`;
        }else if ((60-Number(row[2]))>0 && (60-Number(row[2]))<=2 && (16-Number(row[5]))>0 && (16-Number(row[5]))<=2 ){
            let theid = row[30];
            let number = row[32];
            result+=`<p>Student number ${number} with ID ${theid} should pass, add ${60-row[2]} with at least ${16-row[5]} in the final</p></p>`;
        }
    } else if (Number(row[30]) >= cutoff1610 && Number(row[30]) < cutoff2200) {
        if (Number(row[2])>=60 && Number(row[5])<12 && Number(row[5])>=10){
            let theid = row[30];
            let number = row[32];
            result+=`<p>Student number ${number} with ID ${theid} should pass, please change final to 12</p>`;
        }else if (Number(row[2])<60 && Number(row[2])>=58 && Number(row[5])>=12){
            let theid = row[30];
            let number = row[32];
            result+=`<p>Student number ${number} with ID ${theid} should pass, please add two marks to the grades out of 60</p>`;
        }else if ((60-Number(row[2]))>0 && (60-Number(row[2]))<=2 && (12-Number(row[5]))>0 && (12-Number(row[5]))<=2 ){
            let theid = row[30];
            let number = row[32];
            result+=`<p>Student number ${number} with ID ${theid} should pass, add ${60-row[2]} with at least ${12-row[5]} in the final</p></p>`;
        }
    } else {
        if (Number(row[2])>=50 && Number(row[5])<12 && Number(row[5])>=10){
            let theid = row[30];
            let number = row[32];
            result+=`<p>Student number ${number} with ID ${theid} should pass, please change final to 12</p>`;
        }else if (Number(row[2])<50 && Number(row[2])>=48 && Number(row[5])>=12){
            let theid = row[30];
            let number = row[32];
            result+=`<p>Student number ${number} with ID ${theid} should pass, please add two marks to the grades out of 60</p>`;
        }else if ((50-Number(row[2]))>0 && (50-Number(row[2]))<=2 && (12-Number(row[5]))>0 && (12-Number(row[5]))<=2 ){
            let theid = row[30];
            let number = row[32];
            result+=`<p>Student number ${number} with ID ${theid} should pass, add ${50-row[2]} with at least ${12-row[5]} in the final</p></p>`;
        }
    }
  }
}

  return result;
}

function gradeBoundaries(data) {
  let result = '';
  let count =1;
  for (let row of data) {
count=count+1;
if (count>=15){
    if (Number(row[30]) >= cutoff1610) {
    if (checkNumber(values, Number(row[2]))) {
        let theID = row[30];
        let number = row[32];
        result += `<p>Student number ${number} with ID ${theID} needs one grade up +1 or round up</p>`;
    }
    } else {
    if (checkNumber(values2, Number(row[2]))) {
        let theID = row[30];
        let number = row[32];
        result += `<p>Student number ${number} with ID ${theID} needs one grade up +1 or round up</p>`;
    }
    }
}
  }
  return result;
}


app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended: true}));


app.get('/',(req,res,next) =>{
    res.render('index.ejs',{pageTitle: "Sherif Fadel Fahmy"});
})

app.get('/books',(req,res,next) =>{
    res.render('books.ejs',{pageTitle: "Books"});
})

app.get('/publications',(req,res,next) =>{
    res.render('pub.ejs',{pageTitle: "Publications"});
})

app.get('/games',(req,res,next) =>{
    res.render('games.ejs',{pageTitle: "Games"});
})

app.get('/services',(req,res,next) =>{
    res.render('services.ejs',{pageTitle: "Services"});
})

app.get('/dogpa',(req,res,next) =>{
    res.render('dogpa.ejs',{pageTitle: "Calculate My GPA"});
})

app.get('/space',(req,res,next) =>{
    res.render('game.ejs',{pageTitle: "Space Game"});
})

app.get('/links',(req,res,next) =>{
    res.render('links.ejs',{pageTitle: "Important Links"});
})

app.get('/mygrades',(req,res,next) =>{
    res.render('mygrades.ejs',{pageTitle: "My Grades"});
})

app.get('/boundary',(req,res,next) =>{
    res.render('boundary.ejs',{pageTitle: "Upload File"});
})

app.post('/upload', upload.single('uploadedfile'), (req, res) => {
    if (req.file) {
        let workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        let sheetName = workbook.SheetNames[0];
        let worksheet = workbook.Sheets[sheetName];
        let data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        let processedData = processRows(data);
        let gradedData = gradeBoundaries(data);
        res.render('show.ejs',{pageTitle: 'The Results',processedData, gradedData});
    } else {
        res.send("<h1>No file was uploaded</h1>");
    }
  });

function getMyGrades(studentId,data,res){
    let result='';
    let found = false;
    for (let row of data){
        if (Number(row[0]==Number(studentId))){
            found=true;
            console.log("I found it!");
            result+='<p>';
            for (let grade of row){
                result+=grade+' ';
            }
            result+='</p>'
        }
    }
    if (!found){
        result+="<p>This ID was not in the grades file.</p>";
    }
    
    res.render('showme.ejs',{result, pageTitle: "Your grades are"});

}

app.post('/mygradesare',(req, res) => {
    const dataFrame = req.body;
    let workbook = XLSX.read('grades.xlsx', { type: 'file' });  
    let sheetName = workbook.SheetNames[0];
    let worksheet = workbook.Sheets[sheetName];
    let data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    getMyGrades(dataFrame.studentId,data,res);
  });

app.get('/test',(req,res,next) => {
    res.send(`<!DOCTYPE html>
    <html>
    <head>
        <title>Name Input Form</title>
    </head>
    <body>
        <h1>Enter Your Name</h1>
        <form action="/doitnow" method="POST">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
            <br><br>
            <input type="submit" value="Submit">
        </form>
    </body>
    </html>
    `)
})


app.post('/doitnow',(req,res,next) => {
    // Define the name you want to search for
    const targetName = req.body.name; // Replace with the name you're searching for
    //console.log(hehe);

    // Use the `findAll` method with the `where` option to search for the name
    const Op = Sequelize.Op;

    hehe.findAll({
    where: {
        first_name: {
        [Op.like]: `%`+targetName+`%`, // Assuming 'username' is the column where you want to search
        }
    },
    })
  .then((foundUsers) => {
    if (foundUsers.length === 0) {
      console.log('No users found with the name:', targetName);
    } else {
      result = 'Users found with the name:'+ targetName+'<br>';
      foundUsers.forEach((user) => {
        data = user.toJSON();
        for (const key of Object.keys(data)) {
            result = result +`${key} = ${data[key]}<br>`;
        }
     });
      res.send(result);
    }
  })
  .catch((error) => {
    console.error('Error searching for users:', error);
  });

})

app.use((req,res,next) => {
    res.status(404).render('404', {pageTitle:"Page Not Found"});
})

initializeDatabase();

app.listen(3000);