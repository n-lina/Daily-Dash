# DailyDash

## To change your life, change your daily habits 

We, Lina Nguyen, Jeremy Wiens, Harry Yao, and Pawel Mirski, truly believe that small efforts everyday can accumulate to yield life-changing results. Armed with this core belief, we created Daily Dash to empower **users across all walks of life** to achieve their goals, whether its to become skilled at public speaking or to adopt a healthier diet. 

Featuring a fun, games-like points and awards system, push notifications, and a database of common goals from which users can draw inspiration, Daily Dash encourages, excites, and engages users every step of the way. 

Dynamically-rendered forms, the ability to complete any task in less than 5 taps, and the perfect shade of aqua green (#46BFAC!), meticulously selected, all lend to a user-interface that's intuitive, inviting, and above all, inclusive.

With the game-like motivators appealing to younger audiences, the uncomplicated user-interface inviting older users, the flexible forms and push notifications attracting highly self-motivated users, and the option to use 12-hour time or 24-hour time, anyone and everyone will enjoy Daily Dash.  

Never again will New Year's Resolutions be left unfulfilled!

## App Overview 

After logging in, users are greeted with their dashboard, which lists all the sub-goals users need to complete for that day. At the time listed, users will receive a **push notification** regarding their goal. As users check off completed goals, their number of goals completed increase and reflects on the profile screen. As users complete goals, they accumulate awards and level-up. Below the user's name on the profile screen is their latest award earned! On the profile screen, users can also select their preferred time mode - 12 hour time or 24 hour time.  <br>
<br>
<pre>Profile Screen               Home Screen               All Goals Screen</pre>
<img src="https://github.com/n-lina/DailyDash/blob/main/frontend/assets/profileScreen.PNG?raw=true" width="200" height="400"/><img src="https://github.com/n-lina/DailyDash/blob/main/frontend/assets/homeScreen.PNG?raw=true" width="200" height="400"/><img src="https://github.com/n-lina/DailyDash/blob/main/frontend/assets/allGoals.PNG?raw=true" width="200" height="400"/>\
<br>
From the goals screen shown above, users can add a new goal, browse the catalog of common goals, and press on a goal to view its subgoals. The catalog of common goals lists common goals from which users can draw inspiration. Users can easily add a common goal to their personal repertoire by selecting a common goal and pressing "Add Goal". <br>
<br>
<pre>Add Goal Screen           Catalog of Common Goals    Common Goal Detail Screen</pre>
<img src="https://github.com/n-lina/DailyDash/blob/main/frontend/assets/addGoal.PNG?raw=true" width="200" height="400"/><img src="https://github.com/n-lina/DailyDash/blob/main/frontend/assets/commonGoal.PNG?raw=true" width="200" height="400"/><img src="https://github.com/n-lina/DailyDash/blob/main/frontend/assets/commonDetail.PNG?raw=true" width="200" height="400"/>\
<br>
From the goals screen, users can also press on a goal to see its details. From the goal detail screen, users can edit or delete the selected goal. Both the edit and add goal pages also have a "Get Suggestion" button, which, when pressed, offers users a sub-goal suggestion, generated using a **complex cosine-similarity algorithm** in the backend. <br>
<pre>Goal Detail Screen             Delete Goal              Edit Goal Screen           Get Suggestion</pre>
<img src="https://github.com/n-lina/DailyDash/blob/main/frontend/assets/goalDetail.PNG?raw=true" width="200" height="400"/><img src="https://github.com/n-lina/DailyDash/blob/main/frontend/assets/deleteGoal.PNG?raw=true" width="200" height="400"/><img src="https://github.com/n-lina/DailyDash/blob/main/frontend/assets/editGoal.PNG?raw=true" width="200" height="400"/><img src="https://github.com/n-lina/DailyDash/blob/main/frontend/assets/getSuggestion.PNG?raw=true" width="200" height="400"/>\
<br>
From the profile screen shown in the first row, users can access their awards and log out. Logging out will redirect users to the welcome screen and sign in screen where users can sign in using **Google authentication.**  <br>
<pre>Awards Screen                 Welcome Screen              Sign In Screen          </pre>
<img src="https://github.com/n-lina/DailyDash/blob/main/frontend/assets/awardPage.PNG?raw=true" width="200" height="400"/><img src="https://github.com/n-lina/DailyDash/blob/main/frontend/assets/welcomeScreen.PNG?raw=true" width="200" height="400"/><img src="https://github.com/n-lina/DailyDash/blob/main/frontend/assets/signInScreen.PNG?raw=true" width="200" height="400"/>\

### Technologies Used

#### Backend 
-   MongoDB
-   NodeJS 

#### Frontend 
-   React Native 
-   Ignite CLI 
-   TypeScript 
-   Android

### Main Components 

### Non - Functional Requirements 

**1. asdf**

### Testing 

#### Testing on Backend 

#### Testing on Frontend 
-   Detox 
end to end tests

#### Full Stack 
-   Codacy
