## About AirSfRentals:

- This is my AirSfRentals is a website clone that is inspired from AirBnB. SfRentals can be used for online vacation rentals, online marketplace for lodging and other activities as well. In the website you can do the following: sign up, login, login as demouser, create, edit and delete spots as well as create and delete reviews.

- Live Link: https://sam-airsf.onrender.com

* This project is built with the following technologies that I used:
    - Sequelize
    - Javascript
    - React
    - Redux
    - Express
    - NodeJS
    - HTML5 / CSS

* Database: PostgreSQL
* Hosting:
    - Render

## Demo user:
- here is a demo user in the login dropdown menu without sign by, all you have to do is to click on "Demo user" button and it will login as a Demo.

- My Logo is an apartment house since I was inspired from airBnB logo was for rental places, I decided to choose like an small rental house. Currently, in the website I added some special features such as when a user adds a review it will show as a review card box and if the user wants to delete a review they can just press the trash can to delete it. In the future I plan to add in the CRUD for bookings as well.

* Setup locally on machine
    - Step 1: First download, Ubuntu 20.04 terminal to setup: (include link here), also in microsoft store as well.
    - Step 2: After Ubuntu terminal is finished downloading, Open it, copy and run this command: git clone git@github.com:sfazli96/API-project.git
    - Step 3: Then on local machine, after cloning cd into the project, run npm install in backend directory first then in another terminal run npm install in frontend directories. Using Visual Studio Code helps as well.
    - Step 4: After the packages finished installing, then run npm start in both directories frontend and backend.
    - Step 5: Go to the browser and type in localhost:3000/ and you should see the website or it will pop up after the npm start which starts the server.

## Home Page
- You can access to login, sign up in the modal on top right. There is demo button included in the login modal to test out the website.
![HTML5](assets/html5.svg)


## User Authentication
- As you sign up with a new user, the user can create an account with the following: username, email address, and password.
- New users can also use the demo user to login and try out the website.
- Existing users who logged into their account can check their listing, edit, create a review and delete the listing per there choice.
- Users can log out account anytime still see the listing whether logged in or out.
