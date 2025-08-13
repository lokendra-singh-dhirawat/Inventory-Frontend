Live Demo <https://inventory-frontend-yjxe.vercel.app/>
- 

About The Project


This project is the frontend for the Inventory Management Application, providing a modern, responsive, and interactive user interface to interact with the backend API. It's built with React and a focus on efficient data fetching, robust form handling, and a clean design system.

Features

- User Authentication:
	- User Registration.
	- Secure User Login with Access & Refresh Token management.
	- Automatic token refresh for seamless sessions.
	- User Logout.
	- Password Change functionality for authenticated users.
	- Protected routes for authenticated and authorized content.
- Game Inventory Management:
	- Form to create new game entries, including details (name, description, price, etc.) and cover image upload.
	- Multi-select functionality for assigning game categories.
	- Have filters to search game by searching name or by selecting categories.
  - only admin have authority to delete and update the game.
  - users can check out the single page of the game.
- Responsive UI: Built with Tailwind CSS for a mobile-first, responsive design.
- Reusable Components: Utilizes Shadcn/UI for accessible and customizable UI components.
- Efficient Data Fetching: Manages API requests, caching, and data synchronization using Tanstack React Query.
- Hash-Based Routing: Uses react-router's createHashRouter for client-side routing, suitable for static site deployments.

Technologies Used

- Framework: React
- Build Tool: Vite
- Language: TypeScript
- UI Components: Shadcn/UI
- Styling: Tailwind CSS
- State Management/Data Fetching: Tanstack React Query
- HTTP Client: Axios
- Routing: react-router (via react-router-dom)
- JWT Decoding: jwt-decode
