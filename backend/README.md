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
    - If prompted for authentication, use:
        * **Username:** `user`
        * **Password:** Check the application console startup logs for the generated password.