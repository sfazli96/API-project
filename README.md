# About AirSfRentals:
- This is my AirSfRentals is a website clone that is inspired from AirBnB. SfRentals can be used for online vacation rentals, online marketplace for lodging and other activities as well. In the website you can do the following: sign up, login, login as a demo user, create, edit and delete spots as well as create and delete reviews.

## Live Link:
https://sam-airsf.onrender.com

* This project is built with the following technologies that I used:
    - Sequelize
    - Javascript
    - React
    - Redux
    - Express
    - NodeJS
    - HTML5 / CSS
    - Database: PostgreSQL

* Hosting:
    - Render

## Demo user:
- Here on this website is a demo user in the login dropdown menu without sign by, all you have to do is to click on "Demo user" button and it will login as a Demo.

- My Logo is an apartment house since I was inspired from airBnB logo was for rental places, I decided to choose like an small rental house. Currently, in the website I added some special features such as when a user adds a review it will show as a review card box and if the user wants to delete a review they can just press the trash can to delete it. In the future I plan to add in the CRUD for bookings as well.

* Setup locally on machine
    - Step 1: First download, Ubuntu 20.04 terminal to setup: https://www.microsoft.com/store/productId/9MTTCL66CPXJ
    - Step 2: After Ubuntu terminal is finished downloading, Open it, copy and run this command: ```git clone git@github.com:sfazli96/API-project.git```
    - Step 3: Then on your local machine, after cloning copy and paste command in Ubuntu: ```cd API-project``` after that then run: ```run npm install``` in backend directory first. Then in another terminal ```run npm install``` in frontend directory. Use Visual Studio Code as it helps a lot of this setup, other editors are fine as well.
    - Step 4: After the packages finished installing, then run ```npm start``` in both directories frontend and backend.
    Note: If ```npm start``` does not work in backend folder, try to run the command ```npm run start:development``` and in frontend folder as well if the problem persists of ```npm start``` not working.
    - Step 5: Go to the browser and type in ```https:localhost:3000/``` and you should see the website or it will pop up after the npm start which starts the server.

## Home Page
- You can access to login, sign up in the modal on top right. There is demo button included in the login modal to test out the website.

![Home page](assets/home-page.PNG)

## Sign up Modal
- Here you can see that you can sign up with the required information email, username, first and last name then password.
![sign-up](assets/sign-up.PNG)


## Login Modal
- Here you can see the Login modal where you can sign in as your existing user or as demo user:

![login-up](assets/login.PNG)

## Create Spot listing Modal
- This is where the user can create a spot listing that has the correct credentials to fill in. Also the user must include a valid image link as well.
![create-spot](assets/add-spot.PNG)
![create-spot](assets/add-spot-2.PNG)

## Listing Page
- Here you can see the listing that the user created with the address, price, city, state, country, etc including the image link as well.


## Review Comments and Card
- Here the user can create a review and see what they rated the specific place from 1-5 star. They can also delete their review from their own choice.


## My Reviews Page
- Here the user can see all the reviews that they created. They can remove there reviews or go to the spot where they made the review.



## User Authentication
- As you sign up with a new user, the user can create an account with the following: username, email address, and password.
- New users can also use the demo user to login and try out the website.
- Existing users who logged into their account can check their listing, edit, create a review and delete the listing per there choice.
- Users can log out account anytime still see the listing whether logged in or out.
