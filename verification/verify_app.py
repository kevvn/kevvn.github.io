
from playwright.sync_api import sync_playwright

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Capture console logs
        page.on("console", lambda msg: print(f"[{msg.type}] {msg.text}"))
        page.on("pageerror", lambda err: print(f"[PAGE ERROR] {err}"))

        try:
            print("Navigating...")
            page.goto("http://localhost:5173", timeout=10000)

            # Wait for any potential js load
            page.wait_for_timeout(2000)

            print(f"Page title: {page.title()}")

            # Check if root has children
            root_html = page.inner_html("#root")
            print(f"Root HTML: {root_html}")

            # Wait for header to appear
            print("Waiting for header...")
            page.wait_for_selector("header", timeout=5000)

            print("Clicking 'Run Test Mode'...")
            page.get_by_role("button", name="Run Test Mode").click(timeout=5000)

            print("Waiting for test image confirmation...")
            page.wait_for_selector("text=Test Image Loaded:", timeout=10000)

            # Take final screenshot
            page.screenshot(path="verification/verification.png")
            print("Screenshot saved to verification/verification.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_state.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_app()
