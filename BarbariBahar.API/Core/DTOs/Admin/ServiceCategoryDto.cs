using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Core.DTOs.Admin
{
    public class ServiceCategoryDto
    {
        [Required(ErrorMessage = "نام دسته بندی اجباری است.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "نام دسته بندی باید بین 2 تا 100 کاراکتر باشد.")]
        public string Name { get; set; }
    }
}
