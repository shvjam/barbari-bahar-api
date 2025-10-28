from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:8080/")

    # Click the login button
    login_button = page.get_by_role("button", name="ورود / ثبت‌نام")
    login_button.click()

    # Wait for the dialog to appear
    page.wait_for_selector('div[role="dialog"]')

    page.screenshot(path="jules-scratch/verification/auth_dialog.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
