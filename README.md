1. Install the required packages using npm install:
    - Open your terminal or command prompt.
    - Navigate to the project directory.
    - Run the command `npm install` to install the necessary packages specified in the `package.json` file.

2. TestCafe configuration file:
    - In the project directory, there is a file named `testcafe.config.js`.
    - Inside the configuration file, it is specified the path to run all tests, the browser, timeouts, execution speed, and screenshots on fail executions.
    - The base URL is defined in `src/reactapp/support/Config.ts`, testcafe has a limitation where it cannot access .testcaferc.json variables, so this class was created to provide a single source of truth for the application's URLs.

3. Test files:
    - The test file is located in `src/reactapp/tests/*.ts`
    - The test file has 4 test cases:
        1. Check all devices on the screen
        2. Create and delete a device
        3. Rename a device
        4. Delete a device using API
    - The test file was created to make the objects class calls only. The test file was aimed to have test instructions, all locators and interactions are handled in the object class.
    - I slightly modified the test cases to be sanitized. That means any created items are deleted, any renamed items have their changes reverted, and any deleted items are recreated.
        1. This might introduce a few redundancies, which can be mitigated in the test plan phase.

4. Object files:
    - The page object files are located in `src/reactapp/pages/*.ts`
    - The page object file is distributed using the following pattern:
        1. On the top of the page, all variables and locators
        2. The UI methods
        3. The API methods, using the naming convention APImethodName()
    - The object file is created by view, if the page is refresed and all elements change to another view, it should be a new page object class
    - The object file is abstract

5. Run the tests using TestCafe:
    - Open your terminal or command prompt.
    - Run the command `testcafe`, it should automatically collect all available tests from the test file set in the .testcaferc.json

6. Room for impromenets:
    - On larger projects, it is helpful to add better loggin, with metrics indicators or arguments to add a more verbose log
        1. This is specially helpful on remote environments such as CI/CD
    - Test reports:
        1. Even in successful executions, having evidence of a successful run saved in HTML/image format might help compare results in failing cases or track unwanted changes
        2. The test report may vary depending on the project; however, keeping results in databases helps track the weak spots in development, improve areas with a higher number of issues, and reduce effort in areas with fewer bugs


