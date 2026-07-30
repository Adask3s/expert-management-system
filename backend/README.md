### How to run:

1. **Open the project** in IntelliJ IDEA.
2. **Generate OpenAPI interfaces:**
   - Open the **Maven** tab on the right side of the editor.
   - Expand `expert-management-system` > `Lifecycle`.
   - Run `clean`, then run `compile`.
3. **Start infrastructure:**
   - Open the built-in terminal in IntelliJ.
   - Run the following command:
     ```bash
     docker-compose up -d
     ```
4. **Run the Application:**
   - Start the main application class from IntelliJ.
5. **Access Documentation & Endpoints:**
   - Open your browser and go to: `http://localhost:8080/swagger-ui/index.html`
   - To authenticate from swagger:
      + Open the /auth/login POST request
      + Fill with following data:
        ```json
        {
        "email": "admin@example.com",
        "password": "admin"
        }
        ```
      + Press ```Execute```
      + Copy the ```accessToken``` Body
      + Navigate to the Authorize button on the top of the page
      + Paste the token into the ```Value:``` field
      + Press authorize