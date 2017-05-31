# Team Member Contributions #

### Ashley ###
For this milestone, I completed the Firebase functionality. We can now succesfully keep a record of what items the user has picked up and we can update it at any point. This record is unique per user, so it won't clutter the firebase with a lot of information, not errously display incorrect items. I also added a structure for items that the avatar is wearing. Therefore, now we can determine what items the user chose to put on the avatar by retrieving the user's avatar_items data.

Additionally, I also made the user able to add an item by clicking on a item marker in the map. If the user clicks on a marker, the item corresponding to that marker will get added on Firebase.

### Michael ###
For this milestone I changed the login and registration page styling to be lowercase by request. In addition, I updated the UI of the homepage; rather than having a navigation bar spanning the entire top portion of the page, a hamburger menu is present on the upper right for both desktop and mobile views. This allows more of the map to be visible and present. When the hamburger menu is clicked, a popup overlay covers the map with links to other pages of the website. I relocated the "help" button to be at the middle left of the screen for easier visibility. 

I made items "disappear" from the map upon selecting them. Once a user has collected an item, it will no longer be visible on the map. I made some slight updates to map.js to update the ferret marker's location if it does not load initially (hopefully solving some location issues). I also removed all of Google's default points of interest on the map, as another common request was to "de-clutter" the map of all the landmarks. 


### Scott ###
For this milestone, I begin integration with the backend end server. Our avatar functionality worked by itself locally, but it couldnt pull data and display it from a database. So I worked with ashley to be able to display account specific items and display the users desired avatars. I also update the map styling to remove excess roads and clutter so that map would look for rural versus urban.

### Tina ###
I changed the item markers from the default generic marker image to an image of a mystery present box. This was a UI feature requested from class feedback, so the marker images would match with the theme of the app more.

# Completed Features #
* **Location tracking:** The app visualizes where the user has visited by displaying points on a reverse heatmap. The green overlay represents areas not yet explored by the user, while the clear spots represent where the user has been while logged in to the app.
* **Avatar customization:** Users can select a hat, top, and shoes that they can use to dress up their personal ferret avatar. This customized ferret avatar also shows up at the user's current location on the map.
* **Full Map Experience:** The map interface now encompasses the entire screen, utilizing all of the screen real estate available to the user. Despite the map taking up the full screen, controls are still easy and intuitive for users to access.

![screenshot](/images/milestones/milestone14_home.png)
