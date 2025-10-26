namespace BarbariBahar.API.Data.Entities
{
    public enum OrderStatus
    {
        PendingCustomerConfirmation,
        PendingAdminApproval,
        InProgress,
        Completed,
        Cancelled
    }
}
