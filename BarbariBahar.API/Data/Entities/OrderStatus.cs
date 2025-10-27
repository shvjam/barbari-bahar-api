namespace BarbariBahar.API.Data.Entities
{
    public enum OrderStatus
    {
        PendingPayment,
        PendingCustomerConfirmation,
        PendingAdminApproval,
        HeadingToOrigin,
        InProgress,
        Completed,
        Cancelled
    }
}
