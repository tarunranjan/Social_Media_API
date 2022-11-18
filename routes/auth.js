const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json("wrong password")

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
});


router.post('/api/authentication' , (req, res) => {
    // app.use(bodyParser.json());
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
        username: req.query.username,
        password: req.query.password,
  }

  const token = jwt.sign(data, jwtSecretKey);
  

  res.send(token);

  const decoded = jwt.verify(token, config.get('8k3Yv1C2ubrcoUIKZHowwDNn37UAnZb5ue53ySNEERrjuGaktQnodPL3XpX0uCZmftlPQGcGkaxydHWherjfhqK+t6kdEF4Kc+1SAE8+5MUxKvoTRZcerHuxSKviB+w/GQTGv2g1QgpzTWXsVMlXPY3Kmxl6IaRN/FQu6xl7FBv3niTUF2OmF5lZG5WdSsALi3x+AlWXWOCptgMw3/soG2syR1D82oyiVwlM+Sq+x8WMmIPecbKjCDfZhxKLERGJLTWY0BRS9SB3uiRPiGiscAHSYBLisM0zWlO7unzvCxouqg8r8uR/AvT8NGmn1Odrrn0jHdQfv0mQYY7frEofBw=='));  
    var userId = decoded.id  
    console.log(decoded)  
    res.send(decoded)
});   

router.get("/api/validateToken", (req, res) => {
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
  
    try {
        const token = req.header(tokenHeaderKey);
  
        const verified = jwt.verify(token, jwtSecretKey);
        if(verified){
            return res.send("Successfully Verified");
        }else{
            return res.status(401).send(error);
        }
    } catch (error) {
        return res.status(401).send(error);
    }
});


module.exports = router;