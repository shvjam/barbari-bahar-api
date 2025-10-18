namespace BarbariBahar.API.Data.Entities
{
    public class PackagingProduct
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public string? Dimensions { get; set; } // مثال: "40x30x25 cm"
        public int Stock { get; set; } // تعداد موجودی
        public decimal Price { get; set; }
        public bool IsActive { get; set; } = true;
        

        // ارتباط با دسته‌بندی محصولات
        public int CategoryId { get; set; }
        public PackagingProductCategory? Category { get; set; }
    }

    public class PackagingProductCategory
    {
        public int Id { get; set; }
        public required string Name { get; set; } // مثال: "کارتن‌ها", "لوازم محافظتی"

        public ICollection<PackagingProduct> Products { get; set; } = new List<PackagingProduct>();
    }
}
