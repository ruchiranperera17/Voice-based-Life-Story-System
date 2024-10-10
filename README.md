# Voice-based Life Story System (VBL2S)

## Overview
The Voice-based Life Story System (VBL2S) is an innovative application designed to assist individuals, particularly those with dementia, in narrating their life stories. Utilizing voice recognition technology and AI-driven responses, the system engages users in a conversational format, enabling them to share their memories and experiences interactively.

## Features
- **Interactive Voice Conversations**: Users can engage in natural conversations, allowing them to reminisce and recount their life stories.
- **Story Saving**: Captures user responses and stores them in a MongoDB database for future retrieval.
- **AI Summarization**: Utilizes OpenAI's API to generate narrative summaries from user input.
- **Randomized Questioning**: Presents users with random questions to prompt storytelling.
- **Easy Deployment**: Hosted on an AWS EC2 instance and integrated with GitHub runners for continuous deployment.

## Technologies Used
- **Backend**: Node.js with Express framework
- **Database**: MongoDB for data storage
- **AI Integration**: OpenAI API for generating responses and summaries
- **Frontend**: React (located in the `client` directory)
- **Styling**: Tailwind CSS for UI components

## Project Structure
```
.
├── .github
├── .vscode
├── client
│   ├── build
│   ├── node_modules
│   ├── public
│   ├── src
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── tailwind.config.js
│   └── tsconfig.json
├── controllers
├── models
├── node_modules
├── resources
├── routes
├── .env
├── .gitignore
├── database.js
├── index.js
├── package-lock.json
├── package.json
├── prompt.js
└── README.md
```

## Installation
1. **Clone the Repository**
   ```bash
   git clone https://github.com/ruchiranperera17/Voice-based-Life-Story-System.git
   ```
2. **Navigate to the Project Directory**
   ```bash
   cd Voice-based-Life-Story-System
   ```
3. **Install Dependencies**
   ```bash
   npm install
   cd client
   npm install
   ```

4. **Create a `.env` file**  
   In the root directory, create a `.env` file and add your MongoDB URI and OpenAI API key:
   ```plaintext
   OPEN_AI_API=your_openai_api_key
   MODEL=your_gpt_model
   DATABASE=your_mongodb_connection_string
   ```

## Running the Application
1. **Start the Server**
   ```bash
   npm run dev:start
   ```
   The server will run on `http://localhost:8080`.

2. **Access the Frontend**
   - Navigate to the `client` directory and run:
   ```bash
   npm start
   ```
   The React application will run on `http://localhost:3000`.

## Deployment
This application is self-hosted on an AWS EC2 instance, utilizing GitHub Actions for CI/CD. 

1. **Set up AWS EC2 Instance**
   - Create an EC2 instance with appropriate specifications.
   - Ensure security group settings allow HTTP and SSH traffic.

2. **Configure GitHub Actions**
   - Create a `.github/workflows/main.yml` file to define the CI/CD pipeline that deploys the application on push events.

## API Endpoints

- `GET /user/retrieveUser`: Retrieve the user's name.
- `GET /user/retrieveUserDetails`: Retrieve detailed information about the user.
- `POST /response/responseToUser`: Process user responses and store them in the database.
- `GET /story/complete/:id`: Process user responses to complete the user's story based on the provided user ID.
- `GET /story/readAloud/:id`: Retrieve the complete story of a user to be read aloud.
