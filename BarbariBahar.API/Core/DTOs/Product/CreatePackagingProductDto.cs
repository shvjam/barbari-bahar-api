// فایل: Core/DTOs/Product/CreatePackagingProductDto.cs
using Microsoft.AspNetCore.Http; // برای استفاده از IFormFile
using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.Core.DTOs.Product // مطمئن شو namespace درست باشد
{
    public class CreatePackagingProductDto
    {
        [Required(ErrorMessage = "نام محصول الزامی است.")]
        public string Name { get; set; }

        public string? Description { get; set; }

        [Required(ErrorMessage = "قیمت الزامی است.")]
        [Range(0, double.MaxValue, ErrorMessage = "قیمت نمی‌تواند منفی باشد.")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "موجودی الزامی است.")]
        [Range(0, int.MaxValue, ErrorMessage = "موجودی نمی‌تواند منفی باشد.")]
        public int Stock { get; set; }

        [Required(ErrorMessage = "انتخاب دسته‌بندی الزامی است.")]
        public int CategoryId { get; set; }

        // این پراپرتی برای دریافت فایل عکس از فرانت‌اند است
        public IFormFile? ImageFile { get; set; }
    }
}
