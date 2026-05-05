import { test, expect } from '@playwright/test';

test.describe('Login and Purchase Flow', () => {
  test('should login as admin, select iPhone X, checkout and validate purchase success', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Login as Admin
    // Fill username field
    await page.locator('#username').fill('rahulshettyacademy');
    
    // Fill password field - Note: password changed to Learning@830$3mK2
    await page.locator('#password').fill('Learning@830$3mK2');
    
    // Click on Admin radio button
    await page.locator('input[value="admin"]').check();
    
    // Check the terms checkbox
    await page.locator('#terms').check();
    
    // Click the Sign In button
    await page.locator('#signInBtn').click();

    // Wait for navigation to the shop page
    await page.waitForURL('**/angularpractice/shop');
    await page.waitForLoadState('networkidle');

    // Select iPhone X and add to cart
    // Use JavaScript to click the Add button for iPhone X (first Add button)
    // This is needed because the Angular app might not respond to regular Playwright clicks
    await page.evaluate(() => {
      const addButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('button')).filter((b): b is HTMLButtonElement =>
        b.textContent?.includes('Add') ?? false
      );
      if (addButtons.length > 0) {
        addButtons[0].click(); // iPhone X is the first product
      }
    });

    // Wait a moment for the item to be added
    await page.waitForTimeout(1500);

    // Click on Checkout button using JavaScript
    // The checkout button may not respond to regular clicks due to Angular routing
    await page.evaluate(() => {
      // Find the button that contains "Checkout" text
      const checkoutBtn = (Array.from(document.querySelectorAll('button, a')) as HTMLElement[])
        .find(el => el.textContent?.includes('Checkout'));
      
      if (checkoutBtn) {
        checkoutBtn.click();
      }
    });

    // Wait for any page updates (may not be a full page navigation due to Angular routing)
    await page.waitForTimeout(2500);

    // Verify we're on the cart/checkout page
    const pageContent = await page.content();
    
    // Check if we see checkout items or delivery form
    if (pageContent.includes('Proceed')) {
      // Click Proceed button if available
      await page.locator('button:has-text("Proceed")').click();
      await page.waitForTimeout(1000);
    }

    // Enter delivery location as 3008
    // Wait for the form to appear
    await page.waitForTimeout(1500);
    
    // Try to find and fill country/delivery field
    await page.evaluate(() => {
      // Find input elements that might be for country/address
      const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('input[type="text"]'));
      
      if (inputs.length > 0) {
        // Get the last text input (likely the delivery location)
        const deliveryInput = inputs[inputs.length - 1];
        deliveryInput.value = '3008';
        
        // Trigger input event to notify Angular
        deliveryInput.dispatchEvent(new Event('input', { bubbles: true }));
        deliveryInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // Wait for input processing
    await page.waitForTimeout(1000);

    // Handle checkbox if needed (checkbox for terms/conditions)
    await page.evaluate(() => {
      const checkboxes = Array.from(document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'));
      
      if (checkboxes.length > 0) {
        // Check any unchecked checkboxes
        checkboxes.forEach(checkbox => {
          if (!checkbox.checked) {
            checkbox.click();
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      }
    });

    // Wait after checkbox check
    await page.waitForTimeout(1000);

    // Click on Purchase button
    await page.evaluate(() => {
      const purchaseBtn = Array.from(document.querySelectorAll<HTMLButtonElement>('button'))
        .find(el => el.textContent?.includes('Purchase'));
      if (purchaseBtn) {
        purchaseBtn.click();
      }
    });

    // Wait for the success page to load
    await page.waitForTimeout(2500);

    // Validate the success message
    const pageText = await page.textContent('body') ?? '';

    // Check for success indicators
    expect(pageText).toMatch(/success|thank you|order will be delivered/i);

    // Additional validation - check for the success banner text
    const successBanner = page.locator('text=/Success! Thank you! Your order will be delivered in next few weeks/i');
    await expect(successBanner).toBeVisible();
  });
});