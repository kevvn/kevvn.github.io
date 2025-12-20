from playwright.sync_api import sync_playwright

def verify_app_loads():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to app...")
            page.goto("http://localhost:5173/")

            # Wait for the app to load (look for specific elements)
            print("Waiting for title...")
            page.wait_for_selector("h1")

            # Get the title text
            title = page.locator("h1").text_content()
            print(f"Found title: {title}")

            if "Valorant Stream Analyzer" in title:
                print("App loaded successfully!")
            else:
                print(f"App loaded but title mismatch: {title}")

            # Take screenshot
            page.screenshot(path="verification/app_loaded.png")
            print("Screenshot saved to verification/app_loaded.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_app_loads()
