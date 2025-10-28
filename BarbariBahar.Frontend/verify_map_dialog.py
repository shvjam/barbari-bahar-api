from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:8080/order")

    # Go to the address selection step
    for _ in range(6):
        page.get_by_role("button", name="ادامه").click()
        page.wait_for_timeout(500)

    # Click the address picker button
    page.get_by_role("button", name="انتخاب").first.click()

    # Wait for the map to load
    page.wait_for_selector(".leaflet-container")
    page.wait_for_timeout(2000) # Wait for tiles to load

    page.screenshot(path="jules-scratch/verification/map_dialog.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
