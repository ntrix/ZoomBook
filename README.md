# Zoom Book
## Zoom and Facebook Video chat

Deploy: Heroku

This is the main app, both parts of Backend and Frontend on one server.
These parts can also be used/deployed separately. 

## Backend only part:

https://github.com/ntrix/ZoomBookBE

## Frontend only part:

https://github.com/ntrix/ZoomBookFE

## Technologies:

Frontend: Javascript, React, SASS, ..
Backend: Nodejs, Express js, MongoDB, Mongoose, ..
Others: Docker, Postman, Git, Github, Heroku, ..

# Backend

## API swagger

https://app.swaggerhub.com/apis/ntrix/ZoomBook/1.0.0#/

## Database MongoDB

Schema: 
Diagramm: app.diagrams.net

# Deploy

## Heroku

https://zoombook.herokuapp.com/

# Frontend UI UX

## API & Story book:

1. Users must log in to see anything except the log in page.
2. Users can log in using real facebook details (optional, disabled).
3. Users can send friend requests to others.
4. A user can accept the friend request to become friends or decline.
5. Users can create posts and/or can choose upload/post images.
6. Users can like/react posts.
7. Users can choose from 7 types of reactions (like, wow, love ..)
8. Users can comment on posts.
9. Posts display the post content, author, comments and reactions (likes).
10. The Posts index page is shown like the real Facebook’s “Timeline” feature: all the recent posts from the current user and his/her friends'.
11. Users can create Profile without photos: default avatar and cover picture (wallpaper) reserved.
12. The User homepage contains profile information, avatar and posts.
13. The Contacts sidebar lists friends.
14. Any User listed in Contacts sidebar can be clicked to open a (private) chat window.
15. The Users sidebar lists random users and buttons for sending friend requests.
16. Users can edit/ update Profile with their own photos: upload avatar and cover picture (wallpaper) possible.
17. Optional: warning email/notification and/or temporarily disabled ip/account for 24h by 3x/4x wrong passwords.

## WIP:

these functions are considered as an extern module using 3rd party API and vuejs (vue from another project)

18. Users can create a video conference room and share screen.
19. Notifications broadcast to all/invited friends.
20. Users can join the created video conference room via posted linked on the timeline post of their friends.
