# TODO

This project is a platform where user can maintain his TO-DO List. User can create any number of lists, items & sub-items. User is allowed to undo every operation performed on the list or list of lists. Moreover, a user can make new friends and their friends can also CRUD on his/her TO-DO Lists. 

## Links
  1.)APP URL : realtime-todo.opsaini.com \
	2.)API URL : todo-api.opsaini.com \
	3.)Documentation REST Endpoints : http://documentations.opsaini.com/rest-endpoints <br/>
	4.)Documentation Socket Endpoints : http://documentations.opsaini.com/socket-endpoints <br/>
	5.)Github (Backend) URL : https://github.com/o-p-s/todo-backend <br/>
	6.)Github (Frontend) URL : https://github.com/o-p-s/realtime-todo 

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Description
The project has been built using <br/>
		Frontend Technologies - HTML5, CSS3, JS, Bootstrap and Angular <br/>
		Backend Technologies - NodeJS, ExpressJS and Socket.IO <br/>
		Databases - MongoDB and Redis 

## Features
1) User management System - <br/>
    a) Signup - User is be able to sign up on the platform providing all details like FirstName, LastName, Email and Mobile number. Country
		   code for mobile number (like 91 for India) & Country Name is also stored. <br/>
    b) Login - user is be able to login using the credentials provided at signup. <br/>
  =>c) Sign Up Verification - User receives an email to verify his/her account. However permessions are kept loose, so any unverified user
       can also login. <br/>
    d) Forgot password - User is able to recover password using a link on email. Used Nodemailer to send emails. <br/><br/>

2) To do list management (single user) - <br/>
    a) Once user logs into the system, he can create a ToDo List. <br/>
    b) User is able to create, a new empty list, by clicking on a (pencil) symbol on the empty list. <br/>	
    c) User is able to add, delete and edit items to the list. <br/>
		d) User is able to add sub-todo-items, as child of any item node. <br/>
		e) User is able to mark an item as "done" or "open" using a switch. <br/>
		f) User is able to see his old ToDo Lists, once logged in. <br/>
		g) User is able to perform CRUD operations on any list and list of lists(ToDo). <br/><br/>
    
3) Friend List - <br/>
		a) User is also be able to send/cancel/accept/decline friend requests, to the users on the system. Once requests are accepted, the friend 
       is added in user's friend list. Friends can be removed also. Friends are be Notified, in real time using notifications. <br/><br/>
       
4) All Users List -<br/>
		a) All the Registered users in the system appear over here. <br/><br/>
    
5) All Requests List -<br/>
  	a) All sent/received requests appear over here.<br/><br/>
    
6) To do List management (multi-user) - <br/>
		a) Friends are be able to create, edit, delete, update the list of the users in their friend's list on clicking viewLists button.<br/>
		b) On every action, all friends are notified, in real time, of what specific change is done by which friend. Also the list should is in 
       sync with all friends, at any time, i.e. all actions are reflected in real time. <br/>
		c) Any friend is able to undo, any number of actions, done in past. Each undo action, removes the last change, done by any user. 
		   So, history of all actions are persisted in database​, so as, not to lose any actions done in past. <br/>
		d) Undo action can happen by a button present on each list as well as on ToDo header, as well as, through keyboard commands, which are 
       "ctrl+z" for windows. <br/>
		e) Users can observe changes made to their/friend's lists in realtime. <br/><br/>
    
7) Error Views and messages - <br/>
		a) Each major error response (like 404 or 500) is handled with a different page. Also, all kind of errors, exceptions and messages are 
       handled properly on frontend. The user is notified all the time on frontend about what is happening in the system. <br/><br/>
       
8) Rate limiting - <br/>
		a) APIs have pagination or rate limiting to avoid send huge chunks of messages as API response.
