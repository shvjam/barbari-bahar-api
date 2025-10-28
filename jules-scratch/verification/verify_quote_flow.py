from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    try:
        page.goto("http://localhost:5173/")
        expect(page.get_by_role("heading", name="سفارش آنلاین اسباب‌کشی و حمل بار")).to_be_visible(timeout=10000)

        # Click the new quote button
        page.get_by_role("link", name="شروع استعلام قیمت").click()

        # Wait for the quote initialization and navigation
        expect(page.get_by_role("heading", name="نوع سرویس را انتخاب کنید")).to_be_visible(timeout=15000)

        page.screenshot(path="jules-scratch/verification/quote_flow_start.png")
        print("Verification successful!")
    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")
    finally:
        browser.close()

with sync_playwright() as p:
    run(p)
