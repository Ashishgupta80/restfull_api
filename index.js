import express from "express";
const app = express();

const port = 5000; //this is the port on which the backend will be served.

app.use(express.json()); //to parse the json payload of the body.
const router = express.Router();
app.use("/", router);

//this is just a local varible storing the total user and its the storage of all the user all the create, update, read and delete operations
//will be happing on this variable only

let users = [];

//function to validate the fields coming from put and post requests only.
function checkValidation(req, res, next) {
  //this is a router level middleware works only for the put and post methods to create and update a user
  const request = req.body; //storingg the body of the request in request variable.
  let { id, firstName, lastName, hobby } = req.body; //destructing the value

  //check if the id is coming through params this will happen in the case of update user.
  if (!id) {
    console.log("value in params::", req.params);
    if (req.params.id) {
      id = Number(req.params.id);
    }
  }

  const errors = []; //making a errors array to store all the fields error at and send at once.

  if (!id) {
    //if the value of the id is empty
    errors.push({
      errorFor: "id", //specifying the error is for which key.
      message: `The id field is required.`, //the error message for that key
    });
  } else if (id && typeof id != "number") {
    //if the id field is not a number
    errors.push({
      errorFor: "id", //specifying the error is for which key.
      message: `The id must be a number.`, //the error message for that key that the id must be a number
    });
  }
  if (!firstName) {
    //if the value of the firstName is empty
    errors.push({
      errorFor: "firstName", //specifying the error is for which key.
      message: `The firstName field is required.`, //the error message for that key
    });
  } else if (firstName && typeof firstName !== "string") {
    //if the type of the firstName is not a string
    errors.push({
      errorFor: "firstName", //specifying the error is for which key.
      message: `The firstName field must be a string.`, //the error message for that key
    });
  }
  if (!lastName) {
    //if the value of the lastName is empty
    errors.push({
      errorFor: "lastName", //specifying the error is for which key.
      message: `The lastName field is required.`, //the error message for that key
    });
  } else if (lastName && typeof lastName !== "string") {
    //if the type of the lastName is not a string
    errors.push({
      errorFor: "lastName", //specifying the error is for which key.
      message: `The lastName field must be a string.`, //the error message for that key
    });
  }
  if (!hobby) {
    //if the value of the id is empty
    errors.push({
      errorFor: "hobby", //specifying the error is for which key.
      message: `The hobby field is required.`, //the error message for that key
    });
  } else if (hobby && typeof hobby !== "string") {
    //if the type of the firstName is not a string
    errors.push({
      errorFor: "hobby", //specifying the error is for which key.
      message: `The hobby field must be a string.`, //the error message for that key
    });
  }

  if (errors.length > 0) res.status(400).send(errors);
  else next(); //move to the next middleware if there is no other middleware move to the api for the execution of the callback function.
}

//middleware function to check update req.body.id is with us or not inshort the user exist or not then only we cant move next to update the user.
function updateValidation(req, res, next) {
  const id = req.params.id; //storing the id of the user
  const foundUser = users.find((user) => user.id == id);
  if (!foundUser)
    return res.status(400).send({ message: "No such user is found" });
  else next();
}

//middleware to check if the user already exists for create user if it do exits while creation return error user already exits id should be
//unique
function alreadyExistsValidation(req, res, next) {
  const id = req.body.id;
  const foundUser = users.find((user) => user.id == id);
  if (!foundUser) {
    return next();
  }
  res.status(400).send({ message: "User id already exists" });
}

function checkUserExists(req, res, next) {
  const id = req.params.id;
  const foundUser = users.find((user) => user.id == id);
  if (foundUser) {
    return next();
  }
  res.status(404).send({ message: "User not found" });
}

//middleware that will work on all the router instances (check the IDE terminal for the output from the middleware)
router.use((req, res, next) => {
  //this is an application level middleware and will work for all the api instances of router
  console.log({
    method: req.method,
    url: req.url,
    "status code": res.statusCode,
  });
  next(); //move to the next middleware if there is no other middleware move to the api for the execution of the callback function.
});

//Fetch the list of all users
router.get("/", (req, res) => {
  res.status(200).send(users);
});

//Fetch the data of a specific user by id
router.get("/users/:id", updateValidation, (req, res) => {
  const id = req.params.id;
  const user = users.find((user) => user.id == id);
  res.status(200).send(user);
});

//Create a new user
router.post("/user", alreadyExistsValidation, checkValidation, (req, res) => {
  const { id, firstName, lastName, hobby } = req.body;
  const body = { id, firstName, lastName, hobby };
  users.push(body);
  res.status(201).send({ message: "Created a new user", data: users });
});

//Update details of a existing user
router.put("/user/:id", updateValidation, checkValidation, (req, res) => {
  const foundUser = users.find((user) => user.id == req.params.id);
  const { firstName, lastName, hobby } = req.body;
  if (foundUser) {
    foundUser.firstName = firstName;
    foundUser.lastName = lastName;
    foundUser.hobby = hobby;
  }
  res.status(200).send({ message: "User updated successfully" });
});

//Delete a user by id
router.delete("/user/:id", checkUserExists, (req, res) => {
  users = users.filter((user) => user.id != req.params.id);
  res.status(200).send({ message: `Deleted user with id ${req.params.id}` });
});

app.listen(5000, () => {
  console.log(`Server is running on port ${port}`);
});
