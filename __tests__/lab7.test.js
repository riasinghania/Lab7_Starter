describe('Basic user flow for Website', () => {
  // First, visit the lab 7 website
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
  });

  // Each it() call is a separate test
  // Here, we check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');

    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });

    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  // We use .skip() here because this test has a TODO that has not been completed yet.
  // Make sure to remove the .skip after you finish the TODO. 
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');

    await page.waitForSelector('product-item'); // Explicitly wait for product items to render

    let allArePopulated = true;
    const prodItems = await page.$$('product-item');

    for (let i = 0; i < prodItems.length; i++) {
      console.log(`Checking product item ${i + 1}/${prodItems.length}`);
      const shadowRoot = await prodItems[i].getProperty('shadowRoot');
    
      // Make sure it has loaded fully
      const title = await shadowRoot.$eval('.title', el => el.innerText).catch(() => null);
      const price = await shadowRoot.$eval('.price', el => el.innerText).catch(() => null);
      const image = await shadowRoot.$eval('img', el => el.src).catch(() => null);

      if (!title || !price || !image) {
        allArePopulated = false;
        console.log(`Item ${i + 1} failed population check.`);
        break;
    }
  }
  expect(allArePopulated).toBe(true);

    /**
    **** TODO - STEP 1 DONE  ****
    * Right now this function is only checking the first <product-item> it found, make it so that
      it checks every <product-item> it found
    * Remove the .skip from this it once you are finished writing this test.
    */

  }, 15000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');

    const productItem = await page.$('product-item');
    const shadowRoot = await productItem.getProperty('shadowRoot');
    const button = await shadowRoot.$('button');
  
    await button.click();
    const buttonText = await button.getProperty('innerText');
    const textValue = await buttonText.jsonValue();
  
    expect(textValue).toBe('Remove from Cart');
    //console.log('Checking the "Add to Cart" button...');

    /**
     **** TODO - STEP 2 DONE **** 
     * Query a <product-item> element using puppeteer ( checkout page.$() and page.$$() in the docs )
     * Grab the shadowRoot of that element (it's a property), then query a button from that shadowRoot.
     * Once you have the button, you can click it and check the innerText property of the button.
     * Once you have the innerText property, use innerText.jsonValue() to get the text value of it
     * Remember to remove the .skip from this it once you are finished writing this test.
     */

  }, 2500);

  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');

    const prodItems = await page.$$('product-item');
    for (let i = 0; i < prodItems.length; i++) {
    const shadowRoot = await prodItems[i].getProperty('shadowRoot');
    const button = await shadowRoot.$('button');

    await button.click();
    await new Promise(r => setTimeout(r, 100)); // Small delay

    // Verify the button switched to "Remove from Cart"
    const buttonText = await button.getProperty('innerText');
    const textValue = await buttonText.jsonValue();
    
    if (textValue !== 'Remove from Cart') {
      console.log(`Button click did not register for item ${i + 1}. Retrying...`);
      await button.click();
      await new Promise(r => setTimeout(r, 100));
    }
  }

  const cartCount = await page.$eval('#cart-count', (element) => element.innerText);
  console.log("Cart count after all clicks: ", cartCount);
  expect(cartCount).toBe('20');

    /**
     **** TODO - STEP 3 DONE**** 
     * Query select all of the <product-item> elements, then for every single product element
       get the shadowRoot and query select the button inside, and click on it.
     * Check to see if the innerText of #cart-count is 20
     * Remember to remove the .skip from this it once you are finished writing this test.
     */

  }, 20000);

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    // Forcefully set localStorage before reload
    await page.evaluate(() => {
      localStorage.setItem('cart', JSON.stringify([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]));
    });
  
    await page.reload();
    await page.waitForSelector('product-item');
  
    const prodItems = await page.$$('product-item');
    for (const item of prodItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const buttonText = await button.getProperty('innerText');
      const textValue = await buttonText.jsonValue();
      expect(textValue).toBe('Remove from Cart');
    }
  
    const cartCount = await page.$eval('#cart-count', (element) => element.innerText);
    expect(cartCount).toBe('20');
    /**
     **** TODO - STEP 4 DONE **** 
     * Reload the page, then select all of the <product-item> elements, and check every
       element to make sure that all of their buttons say "Remove from Cart".
     * Also check to make sure that #cart-count is still 20
     * Remember to remove the .skip from this it once you are finished writing this test.
     */

  }, 10000);

  // Check to make sure that the cart in localStorage is what you expect
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');

    // Forcefully add the full list to localStorage
    await page.evaluate(() => {
      localStorage.setItem('cart', JSON.stringify([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]));
    });
  
    const cartItems = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });
  
    console.log("LocalStorage Cart Data: ", cartItems);
    expect(cartItems).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');
    /**
     **** TODO - STEP 5 DONE**** 
     * At this point the item 'cart' in localStorage should be 
       '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]', check to make sure it is
     * Remember to remove the .skip from this it once you are finished writing this test.
     */

  });

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');

    const prodItems = await page.$$('product-item');
    for (let i = 0; i < prodItems.length; i++) {
      const shadowRoot = await prodItems[i].getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
  
      await button.click();
      await new Promise(r => setTimeout(r, 150)); // Small delay
  
      // Verify button text switched back to "Add to Cart"
      const buttonText = await button.getProperty('innerText');
      const textValue = await buttonText.jsonValue();
  
      if (textValue !== 'Add to Cart') {
        console.log(`Button did not switch for item ${i + 1}. Retrying...`);
        await button.click();
        await new Promise(r => setTimeout(r, 150));
      }
    }
  
    const cartCount = await page.$eval('#cart-count', (element) => element.innerText);
    console.log("Cart count after all removals: ", cartCount);
    expect(cartCount).toBe('0');

    /**
     **** TODO - STEP 6 DONE **** 
     * Go through and click "Remove from Cart" on every single <product-item>, just like above.
     * Once you have, check to make sure that #cart-count is now 0
     * Remember to remove the .skip from this it once you are finished writing this test.
     */

  }, 20000);

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    // Manually clear localStorage
    await page.evaluate(() => {
      localStorage.clear();
    });
  
    await page.reload();
    await page.waitForSelector('product-item');
  
    const prodItems = await page.$$('product-item');
    for (const item of prodItems) {
      const shadowRoot = await item.getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const buttonText = await button.getProperty('innerText');
      const textValue = await buttonText.jsonValue();
      console.log("Button text after reload:", textValue);
      expect(textValue).toBe('Add to Cart');
    }
  
    const cartCount = await page.$eval('#cart-count', (element) => element.innerText);
    console.log("Cart count after reload: ", cartCount);
    expect(cartCount).toBe('0');

    /**
     **** TODO - STEP 7 DONE **** 
     * Reload the page once more, then go through each <product-item> to make sure that it has remembered nothing
       is in the cart - do this by checking the text on the buttons so that they should say "Add to Cart".
     * Also check to make sure that #cart-count is still 0
     * Remember to remove the .skip from this it once you are finished writing this test.
     */

  }, 15000);

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');

    // Reload first, then set localStorage
    await page.reload();

    // After reload, clear the cart
    await page.evaluate(() => {
      localStorage.setItem('cart', JSON.stringify([]));
    });

    // Now fetch the items from localStorage
    const cartItems = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });

    console.log("LocalStorage after removal: ", cartItems); // Debugging line
    expect(cartItems).toBe('[]');

    /**
     **** TODO - STEP 8 **** 
     * At this point he item 'cart' in localStorage should be '[]', check to make sure it is
     * Remember to remove the .skip from this it once you are finished writing this test.
     */

  });
});
