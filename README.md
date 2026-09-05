## Overview

**pi-weather** is a lightweight weather dashboard designed to run on a **Raspberry Pi 3B+**. The application retrieves weather data from the **National Weather Service (NWS) API** and presents it through a React-based frontend.

The backend is built with **Node.js and Express.js**, which serves both the API and the compiled React frontend. The application is designed around the limited processing and memory resources of the Raspberry Pi 3B+.

### Features

* Fetches fresh weather data from the NWS API every **12 minutes**
* React-based weather dashboard
* Node.js + Express.js backend
* Frontend served directly by the backend
* Optimized for deployment on a Raspberry Pi 3B+
* Reduced frontend animations and processing-intensive features to accommodate the hardware limitations of the deployment environment

### Additional Info

While the project is technically *finished*, there are lots of optimizations and bugs I would like to fix/implement before leaving this project. In the meanwhile, this project is on the back burner until I find some time to do so.

### TO-DO LIST:
- Implement environment file to allow for users to easily configure the dashboard
- Implement toggle inside of env file to allow the API logic/server to be moved to a cloud server (reducing memory load on the 3b+)
