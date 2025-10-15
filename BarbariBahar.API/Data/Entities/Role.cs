namespace BarbariBahar.API.Data.Entities
{
    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        // Navigation Property: یک نقش می‌تواند به چندین کاربر اختصاص داده شود
        public virtual ICollection<User> Users { get; set; } = null!;
    }
}
