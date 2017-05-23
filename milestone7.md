# Team Member Contributions #

### Ashley ###
I worked on getting the login functionality set up. I created a login page and sign up page with password verification. I connected our project to the Firebase database so users can create accounts. Currently, the login, sign up, and sign out functionalities of our app are complete. 

### Michael ###
For Monday, I worked on loading sample location data for the heatmap. I used personal data that was previously tracked around campus. In addition, I added UI buttons on the map (Center the Map) and Boostrap buttons on top of the map interface. 
For Wednesday, I realized that our original plan of creating button overlays through Google Maps APIs would not work; as such, I plan to added a navigation menu overlayed on top of the map. I have begun this process by including a navigation bar with our planned features. The navigation menu works both on desktop and mobile and is meant to be unobtrusive.

### Scott ###
I worked on making the map overlay become static so that it will zoom with the rest of the map. This implementation could prove to unfit if the user zooms in/out of the map, as the whole overlay is re-rendered every single time there is a change in zoom level. I also worked on completing the SVG of the Ferret. It's mostly complete, but needs to be integrated into the project still.

### Tina ###
I worked on getting the avatar customization page set up. Mostly, I was trying to set up the inventory space and the tabs that the user can click on to navigate between inventory categories (ex: Hats, Tops, Shoes).

# Screenshot #
![screenshot](/images/milestones/milestone7_avatarpage.png)

The implementation of the avatar customization page has been started. Users will be able to navigate through "categories" to select certain kinds of items (ex: hats, tops, shoes).

![screenshot](/images/milestones/milestone7_loginpage.PNG)

The implementation of the login page is complete. The user can login if they have created an account before. It also displays an error message for invalid passwords.

![screenshot](/images/milestones/milestone7_signuppage.PNG)

The implementation of the sign up page is complete. The user can create an account with their email and password. The passwords must match in order for the user to be able to create an account. Otherwise, an error message will be displayed.

![screenshot](/public/images/FerretAvatar.png)

This is the current design of the Ferret Avatar. Users will be able to customize their ferret, once they collect items from exploring their world.
