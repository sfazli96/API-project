# About AirSfRentals:
- AirSfRentals is an online vacation rental platform inspired by AirBnB. This platform allows users to sign up, login, and create, edit, and delete vacation rental listings, as well as create and delete reviews. The live link to the website is: https://sam-airsf.onrender.com.

## Technologies used:
    - Sequelize
    - Javascript
    - React
    - Redux
    - Express
    - NodeJS
    - HTML5 / CSS
    - Database: PostgreSQL
    - Hosting: Render

## Demo user:
- A demo user is available in the login dropdown menu without the need to sign up. Simply click on the "Demo User" button and it will log you in as the Demo User.

- My Logo is an apartment house since I was inspired from airBnB logo was for rental places, I decided to choose like an small rental house. Currently, in the website I added some special features such as when a user adds a review it will show as a review card box and if the user wants to delete a review they can just press the trash can to delete it. In the future I plan to add in the CRUD for bookings as well.

## Features
* A user-friendly interface with a custom logo representing an apartment house
* The ability to add reviews which will appear as review cards on the website
* A demo user option to test the platform without having to sign up
* User authentication allowing new users to sign up with a username, email address, and password
* Existing users can log into their account to check their listings, create reviews, edit listings, and delete listings
* Listings include information such as the address, price, city, state, country, etc.
* The ability to see all reviews created by a user in one place

# Setup locally on machine
Follow these steps to set up AirSfRentals on your local machine:

1. Download and install Ubuntu 20.04 terminal: https://www.microsoft.com/store/productId/9MTTCL66CPXJ

2. Open the terminal and run the following command: ```git clone git@github.com:sfazli96/API-project.git``` or ```git clone https://github.com/sfazli96/API-project.git```

3. Change directory to the API-project folder by running cd API-project
4. Run ```npm install``` in the backend directory, then run ```npm install``` in the frontend directory.

5. After the packages have finished installing, run ```npm start``` in both the frontend and backend directories. Note: if ```npm start``` does not work in the backend folder, try running the command ```npm run start:development``` in the backend folder and in the frontend folder as well if the problem persists with npm start not working.
6. Open your browser and type in https://localhost:3000/ and you should see the website.

# Pages

## Home Page
- Home Page: Access the login and sign up modal from the top right corner.

![Home page](assets/home-page.PNG)

## Sign up Modal
- Sign Up Modal: Fill in the required information such as email, username, first and last name, and password to sign up.
![sign-up](assets/sign-up.PNG)


## Login Modal
- Login Modal: Log in as an existing user or as a demo user.

![login-up](assets/login.PNG)

## Create Spot listing Modal
- Create Spot Listing Modal: Fill in the necessary information to create a new spot listing, including a valid image link.
![create-spot](assets/add-spot.PNG)
![create-spot](assets/add-spot-2.PNG)

## Listing Page
- Listing Page: View the listing with information such as the address, price, city, state, country, etc.


## Review Comments and Card
- Review Comments and Card: Create a review and rate the specific place from 1 to 5 stars. You can also delete your review.


## My Reviews Page
- My Reviews Page: See all the reviews you have created and delete them if desired.



## User Authentication
- New users can sign up with a username, email address, and password.
- Existing users can log into their account to check their listings, create reviews, edit listings, and delete listings.
- Users can log out of their account at any time they want.

## Future Plans

In the future, I plan to add CRUD functionality for bookings.
