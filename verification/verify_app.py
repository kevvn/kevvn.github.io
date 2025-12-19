from playwright.sync_api import sync_playwright

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app (default Vite port)
        page.goto("http://localhost:5173")

        # Wait for the "Load Test Image" button and click it to trigger the test mode
        # This will load the static image and run the CV logic
        page.wait_for_selector("button:has-text('Load Test Image')")
        page.click("button:has-text('Load Test Image')")

        # Wait a moment for the canvas/heatmap to render
        page.wait_for_timeout(2000)

        # Take a screenshot
        page.screenshot(path="verification/verification.png")

        browser.close()

if __name__ == "__main__":
    verify_app()
