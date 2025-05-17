1) Where would you fit your automated tests in your Recipe project development pipeline? Select one of the following and explain why.

   - *Within a Github action that runs whenever code is pushed*

   - Running automated tests every time code is pushed to GitHub is the best way to catch problems early. This way, any new code is automatically tested to make sure it doesn’t break existing features. It also helps the team find bugs quickly, making it easier to fix them before they become bigger issues. This method keeps the project more stable and makes it easier to work together, knowing the code is always tested and reliable.

2) Would you use an end to end test to check if a function is returning the correct output? (yes/no)

   - No. Unit tests are a way to easily test the correctness of individual functions in the program, such as the correct output and error handling. However, end to end testing simulates real-life user interactions in the context of the full application to ensure that all parts of the program function soundly together. So, if I wanted to check if a specific function is returning the correct output, I'd use a unit test.

3) What is the difference between navigation and snapshot mode?
   - Navigation mode analyzes a page right after it loads, and it's helpful for finding out how long it takes for the page to load, accessibility of the page, overall performance, etc. However, snapshot mode analyzes the current DOM state of the page when the Lighthouse report is run, which is helpful for testing different states of the UI or specific components. So, in snapshot mode, you can analyze several states of the page, but in navigation mode, you can only analyze the start state of the page on load.
4) Name three things we could do to improve the CSE 110 shop site based on the Lighthouse results.
   - The report suggested that we preconnect to required origins like fakestoreapi.com (i.e. `<link rel="preconnect" href="https://fakestoreapi.com">`) because it allow us potential savings of 110 ms. The reason behind this is that currently, the browser will wait until it encounters a request to the API to start navigating to the external site, create a connection, etc. This process adds latency when we want to load components that use data from that API. So, if we tell the browser to start connecting to it before a request is even made, then we can reduce some loading time.
   - The report noted that we are loading images that have larger resolution sizes than are necessary for what we actually displaying on the page. This results in hurting performance, increasing cellular data usage, and extending loading times. The report said we are wasting 518 KiB. So, we should resize the images so that they're at an appropriate size for what we display on the page.
   - For user experience, the best practice is to include a `<meta name="viewport">` tag with width or initial-scale in order to optimize the app for smaller mobile screen sizes. This also prevents the mobile device having to render pages at the dekstop width and then scale the page down, which may disturb formating and readability/usability. 



