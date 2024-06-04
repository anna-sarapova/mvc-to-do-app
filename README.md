## Start

## Lab-1:
### Run locally, but it requires a nginx image on Docker or locally
http-server

## Lab-2:
### Build the Docker image
docker build -t my-todo-app .

### Run the Docker container
docker run -d -p 8080:8080 my-todo-app

## Lab-3:
### Run the app in the kubernetes
kubectl apply -f kubernetes.yaml


## Story

Imagine, you're a frontend developer from Melbourne, Australia. You and your company Sleep2nigth Pty Ltd are working on a brand new product - To-not-do lists!

You've pitched the idea in the local startup accelerator, the jury has fallen in love with it and you've won first round of investitions. The only thing what's left - to build the app itself.

## Task

1. Copy [index.html](index.html), [style.css](style.css) and [app.js](app.js) to your repo;
2. Modify them to build an application for to-not-do list;
3. The app has to cover basic needs:
- to add to the list;
- to remove from the list;
- to mark as not done;
- see "not-done" and "to-not-do" lists separately (how?).

4. The app has to look attractive.

## Special conditions

You're not allowed to use any third-party library for JS, except utility functions such as `lodash` or `underscore`. `jquery` is not allowed.

## Setup
This is going to be a fully JavaScript app, which means everything will be handled
through JavaScript, and the HTML will only consist of a single root element in the body, beside the background animation.

## Implementation
To implement the MVC model, the app will have 3 classes: Model class, View class, and Controller class.
The app will be an instance of the controller. 

### Model class
It will store and modify data.  
In this todo application, that'll be the actual todos, and the methods that will add, edit, or delete them.

### View class
It will manage how the data will be displayed. It will manage it by rendering HTML in the DOM and CSS.

### Controller class
The controller connects the model and the view. It takes user input, such as clicking or typing, and handles callbacks for user interactions.

