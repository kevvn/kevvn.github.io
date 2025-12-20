from playwright.sync_api import sync_playwright

def verify_app_loads():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to app...")
            page.goto("http://localhost:5173/")

            # Wait for the app to load
            print("Waiting for title...")
            page.wait_for_selector("h1")

            # Check title
            title = page.title()
            print(f"Page title: {title}")

            # Check for header
            header_text = page.locator("h1").text_content()
            print(f"Header text: {header_text}")

            if "Valorant Stream Analyzer" not in header_text:
                raise Exception("Header text mismatch")

            # Take screenshot
            print("Taking screenshot...")
            page.screenshot(path="verification/app_loaded.png")
            print("Screenshot saved.")

        except Exception as e:
            print(f"Error: {e}")
            # Take error screenshot if possible
            try:
                page.screenshot(path="verification/error.png")
            except:
                pass
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    verify_app_loads()
