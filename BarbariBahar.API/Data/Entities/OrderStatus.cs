namespace BarbariBahar.API.Data.Entities
{
    public enum OrderStatus
    {
        PendingPayment,
        PendingCustomerConfirmation,
        PendingAdminApproval,
        InProgress,
        Completed,
        Cancelled
    }
}
