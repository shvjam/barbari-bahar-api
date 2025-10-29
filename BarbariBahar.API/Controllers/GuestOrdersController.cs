// GuestOrdersController.cs (additional endpoint)
// ... existing code

[HttpGet("packaging-items")]
public IActionResult GetPackagingItems()
{
    var items = new[]
    {
        new { id = "fridge_large", name = "یخچال ساید بای ساید", price = 150000 },
        new { id = "sofa_3seater", name = "مبل سه نفره", price = 100000 },
        new { id = "tv_large", name = "تلویزیون بالای ۵۵ اینچ", price = 75000 },
    };
    return Ok(items);
}

// ... rest of the controller
