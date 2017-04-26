# Team Member Contributions #

### Ashley ###
I worked on implementing the tracking feature of our map that updates the user's position every second. Currently, we need further discussion and testing to see if we need to update position more often in order to make a smoother transition effect. At the moment, the current tracking implementation will make it easy to store data for the heatmap. Additionaly, I changed the Marker icon to be a substitute ferret image which will later be changed with our design.


### Michael ###
I worked on ideas for setting up the map - at first I looked into doing a single overlay, but eventually found it wiser to do a tile overlay. One problem with the tile overlay is the presence of the tile boundaries and coordinates; in the future, I hope to be able to remove or hide this information. In addition, I worked on adding an "error" or "exploration" radius. This blue circle around your location helps alleviate the concerns over trespassing on private property or GPS inaccuracies. One thing that needs to be done is to scale the radius with zoom level; at the moment, it works fine with the initial setup but does not scale if the zoom level is changed. At first I used a geolocation-marker library to implement this function, but I found it simpler to simply draw and redraw a circle on the map around the user's location.


### Scott ###
I worked on setting up the map for our app and creating the "grass" overlay for our app that will scale along with map. It currently is limited to a specific zoom setting because if you zoom in, the overlay will remain at the same size. This could prove to be an issue if we allow users to zoom. In this event, I would replace the current implementation with a manually created overlay that would encompass a designated area.


### Tina ###
I started working on the "heatmap" of visited places. So far I tested that a heatmap will show up on the map with static test latitude/longitude data. Once we figure out storing tracked location data, we will integrate the stored tracked location data to be represented with the heatmap visualization.


# Screenshot #
![screenshot](/images/milestones/milestone5.png)
The screenshot shows our grass overlay, a ferret "marker" at a current location, and a test point for a test heatmap visualization (the red dot).

![screenshot2](/images/milestones/milestone5_new.PNG)
This screenshot shows the location "error" or "exploration" radius.
