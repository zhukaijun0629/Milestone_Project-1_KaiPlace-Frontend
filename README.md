# Milestone_Project-1_KaiPlace-Frontend

KAIPLACE ([kaiplace.web.app](https://kaiplace.web.app))  –  A Photo Sharing Social Networking Service (Web/IOS/Android) 

Front-end (deployed on Firebase Hosting): React, CSS 

Back-end (deployed on Heroku):  NodeJS, Express 

Database: MongoDB, Mongoose   

Image Storage: Amazon S3, AWS-SDK 

• Implemented React SPA front-end and NodeJS/Express back-end with RESTful API to provide smooth social 
networking service for customers. 

• Designed schema models for the business logic of Customer-Oriented Networking system to support all the 
functionalities and connected to MongoDB database using Mongoose.   

• Managed user authentication and authorization: Encoded user password and compared hashed password 
using bcryptjs; Authorized user with JWT stored in browser local storage which would expire in certain period. 

• Facilitated photo uploading experience by auto-filling required fields, such as date taken and location, by 
extracting EXIF metadata and then fetching Google Reverse Geocoding API and Bing Time Zone API. On 
server-side, utilized the extracted data to further organize the photos based on time and location.  

• Reduced image size using imagemin and stored images to Amazon S3 with the help of AWS-SDK. 
