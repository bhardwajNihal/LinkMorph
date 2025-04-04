
## Setup
  - a vite project with react and TS
  - install tailwind and shadcn, following shadcn official documentation for tailwind v4

  1. Supabase setup ✅
    - register, login, set up a organization 
    - create a project
    - add api key, and supabase url in .env
    - add tables for 
      1. urls- add user_id as foreign key, user auth will be handled right out of the box by supabase
      2. clicks - info about who clicked the link

  2. Install react-router-dom 
    - Setup browserRouters, ✅
      - Applayout
      - parent route
      - child route 
      - outlet - to render children routes

3. Header✅
4. landing page✅

5. Define function to handle login Api✅
  - create ui for login

6. define signout function ✅
  - ui for signup

7. input validations ✅
8. protected routes✅

9. dynamic header ✅
10. logout api✅
  - logout loader

11. add dummy urls, clicks info in the table
12. add a qr for that entry.
    - add policies

13. Dashboard
  - fetch urls and clicks info
  - dashboard component to display urls and clicks info
  - added search filter to links
  - completed url card component

14. done with share, delete and download functionality

15. finally addde details page for the urls
  - added stats, for devices and location

16. fixed navigation issues post deployment

  fix : added vercel.json to the root dir.
    - added configurations to it.

