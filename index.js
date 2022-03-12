const bcrypt=require('bcrypt');
const express=require('express');
const  mongoose  = require('mongoose');
const app = express();
const User=require('./models/user');
app.set('view engine', 'ejs');
app.set("views","views");

app.use(express.json());

app.use(express.urlencoded({ extended: true}));

mongoose.connect('mongodb://localhost:27017/authdemo');

app.get('/',(req,res)=>{
    res.send("Hello");
})

app.get('/register',(req,res)=>{
    res.render('register')
})
app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/register',async (req,res)=>{
    const {username, password} = req.body;
    const hash=await bcrypt.hash(password,12);
    console.log(password);
    const user= new User({
        username:username,
        hash:hash
    })
    await user.save();
    res.redirect('/');
})

app.post('/login',async (req,res)=>{
    const {username,password} =req.body;
    const user= await User.findOne({username});
    let valid= await bcrypt.compare(password,user.hash);
    if(valid) {
        res.send("welcome");
    }else{
        res.send("Try again");
    }
})

app.get('/secret',(req,res)=>{
    res.send("secret");
})



app.listen(3000,()=>{
    console.log("Listening on port 3000");
})
