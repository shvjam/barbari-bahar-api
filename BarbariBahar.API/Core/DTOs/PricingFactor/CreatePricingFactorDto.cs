using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Core.DTOs.PricingFactor // مطمئن شو namespace با پروژه تو مطابقت دارد
{
    public class CreatePricingFactorDto
    {
        [Required(ErrorMessage = "نام آیتم اجباری است.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "نام آیتم باید بین 2 تا 100 کاراکتر باشد.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "قیمت اجباری است.")]
        [Range(0, double.MaxValue, ErrorMessage = "مقدار قیمت نمی‌تواند منفی باشد.")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "واحد اجباری است.")]
        public string Unit { get; set; }

        [Required(ErrorMessage = "دسته بندی اجباری است.")]
        public int ServiceCategoryId { get; set; }

        public bool IsActive { get; set; } = true; // یک مقدار پیشفرض برای ایجاد
    }
}
