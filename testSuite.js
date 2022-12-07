const utilsTest = require('./Utils/test');
const usersTest = require('./Components/Users/usersTest');
const entriesTest = require('./Components/Entries/entriesTest');
const authenticationTest = require('./MiddelWare/authTest');

usersTest();
utilsTest();
entriesTest();
authenticationTest();
