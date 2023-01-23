### Public Services Challenge

### Technologies
- Frontend
  - React
  - Redux
- Backend
  - Node.js
  - Express
- Database
  - PostgreSQL via Supabase (relational database)

### Screenshots
#### DB Schema
![Supbase Schema](https://user-images.githubusercontent.com/11008603/214025852-c3f90fd0-eacf-48ff-8102-b1469668ba50.png)


![image](https://user-images.githubusercontent.com/11008603/214018912-efe9b5b4-8b71-4cc7-a148-52a8f775775e.png)
![image](https://user-images.githubusercontent.com/11008603/214019208-906f9110-e385-46c2-8969-e2e61c3e7bd9.png)



### Setup
- Clone the repository
- Install dependencies in `/api` and root directories
  - `yarn install`
- Run `yarn start` in `/api` to start the server.
- Run `yarn start` in root directory to start the frontend.

### Features
- Viewing the status of trucks in a lane.
- Updating the status of trucks by drag-dropping them into different lanes.
- Adding new trucks to the system.
- Updating an existing trucks information.
- Deleting a truck from the system.
- Updating the title of a lane.
- Switching between profiles (driver and operator).

Note: In 'Driver' mode, only moving of trucks is allowed. In 'Operator' mode, all features are available.

### Demo
#### Driver User Journey

Mobile
https://youtube.com/shorts/xA3bE6hR6fs

Desktop
https://youtu.be/Vnh_yJr3ny0


#### Operator User Journey

Mobile
https://youtu.be/Y-_xemwMvGw

Desktop
https://youtu.be/3HQbXfqgnFY

### Future Improvements
- User Authentication.
- Improved validation for the truck form and lanes.
- Unit and intergration tests for the frontend and backend using Jest.
- End-to-end tests using Puppeteer.
