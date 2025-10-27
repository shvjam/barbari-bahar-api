using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BarbariBahar.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PackagingProductCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PackagingProductCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ServiceCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Mobile = table.Column<string>(type: "TEXT", nullable: false),
                    FirstName = table.Column<string>(type: "TEXT", nullable: true),
                    LastName = table.Column<string>(type: "TEXT", nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Role = table.Column<string>(type: "TEXT", nullable: false),
                    NationalCode = table.Column<string>(type: "TEXT", nullable: true),
                    ProfilePictureUrl = table.Column<string>(type: "TEXT", nullable: true),
                    WorkerCount = table.Column<int>(type: "INTEGER", nullable: true),
                    CarModel = table.Column<string>(type: "TEXT", nullable: true),
                    CarPlateNumber = table.Column<string>(type: "TEXT", nullable: true),
                    Status = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PackagingProducts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: true),
                    Dimensions = table.Column<string>(type: "TEXT", nullable: true),
                    Stock = table.Column<int>(type: "INTEGER", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsAvailable = table.Column<bool>(type: "INTEGER", nullable: false),
                    CategoryId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PackagingProducts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PackagingProducts_PackagingProductCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "PackagingProductCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PricingFactors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Price = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    Unit = table.Column<string>(type: "TEXT", nullable: false),
                    ServiceCategoryId = table.Column<int>(type: "INTEGER", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PricingFactors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PricingFactors_ServiceCategories_ServiceCategoryId",
                        column: x => x.ServiceCategoryId,
                        principalTable: "ServiceCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DriverLocations",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DriverId = table.Column<long>(type: "INTEGER", nullable: false),
                    Latitude = table.Column<double>(type: "REAL", nullable: false),
                    Longitude = table.Column<double>(type: "REAL", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DriverLocations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DriverLocations_Users_DriverId",
                        column: x => x.DriverId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TrackingCode = table.Column<string>(type: "TEXT", nullable: false),
                    CustomerId = table.Column<long>(type: "INTEGER", nullable: false),
                    DriverId = table.Column<long>(type: "INTEGER", nullable: true),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    FinalPrice = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    ScheduledAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LastUpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Users_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Orders_Users_DriverId",
                        column: x => x.DriverId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "OtpRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Mobile = table.Column<string>(type: "TEXT", nullable: false),
                    Code = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    IsUsed = table.Column<bool>(type: "INTEGER", nullable: false),
                    UserId = table.Column<long>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OtpRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OtpRequests_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Wallets",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<long>(type: "INTEGER", nullable: false),
                    Balance = table.Column<decimal>(type: "decimal(18, 2)", nullable: false, defaultValue: 0m),
                    LastUpdated = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Wallets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Wallets_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PackingServiceSubItem",
                columns: table => new
                {
                    PackingServiceId = table.Column<int>(type: "INTEGER", nullable: false),
                    SubItemId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PackingServiceSubItem", x => new { x.PackingServiceId, x.SubItemId });
                    table.ForeignKey(
                        name: "FK_PackingServiceSubItem_PricingFactors_PackingServiceId",
                        column: x => x.PackingServiceId,
                        principalTable: "PricingFactors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PackingServiceSubItem_PricingFactors_SubItemId",
                        column: x => x.SubItemId,
                        principalTable: "PricingFactors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "OrderAddresses",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    OrderId = table.Column<long>(type: "INTEGER", nullable: false),
                    Type = table.Column<string>(type: "TEXT", nullable: false),
                    FullAddress = table.Column<string>(type: "TEXT", nullable: false),
                    Latitude = table.Column<double>(type: "REAL", nullable: true),
                    Longitude = table.Column<double>(type: "REAL", nullable: true),
                    Floor = table.Column<int>(type: "INTEGER", nullable: true),
                    HasElevator = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderAddresses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderAddresses_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    OrderId = table.Column<long>(type: "INTEGER", nullable: false),
                    ItemName = table.Column<string>(type: "TEXT", nullable: false),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    TotalPrice = table.Column<decimal>(type: "decimal(18, 2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tickets",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    OrderId = table.Column<long>(type: "INTEGER", nullable: true),
                    UserId = table.Column<long>(type: "INTEGER", nullable: false),
                    Subject = table.Column<string>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    Priority = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LastUpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tickets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tickets_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Tickets_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TicketMessages",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TicketId = table.Column<long>(type: "INTEGER", nullable: false),
                    SenderId = table.Column<long>(type: "INTEGER", nullable: false),
                    Message = table.Column<string>(type: "TEXT", nullable: false),
                    SentAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TicketMessages_Tickets_TicketId",
                        column: x => x.TicketId,
                        principalTable: "Tickets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TicketMessages_Users_SenderId",
                        column: x => x.SenderId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "PackagingProductCategories",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "کارتن‌ها" },
                    { 2, "لوازم محافظتی" }
                });

            migrationBuilder.InsertData(
                table: "ServiceCategories",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "جابجایی شهری" },
                    { 2, "حمل بار بین شهری" },
                    { 3, "بسته بندی" }
                });

            migrationBuilder.InsertData(
                table: "PackagingProducts",
                columns: new[] { "Id", "CategoryId", "Description", "Dimensions", "ImageUrl", "IsActive", "IsAvailable", "Name", "Price", "Stock" },
                values: new object[,]
                {
                    { 1, 1, null, null, null, true, true, "کارتن سه لایه", 50000m, 0 },
                    { 2, 2, null, null, null, true, true, "نایلون حباب دار (متری)", 25000m, 0 },
                    { 3, 2, null, null, null, true, true, "چسب پهن", 30000m, 0 }
                });

            migrationBuilder.InsertData(
                table: "PricingFactors",
                columns: new[] { "Id", "Description", "IsActive", "Name", "Price", "ServiceCategoryId", "Unit" },
                values: new object[,]
                {
                    { 1, null, true, "وانت", 500000m, 1, "سرویس" },
                    { 2, null, true, "کارگر", 250000m, 1, "نفر" },
                    { 3, null, true, "هزینه به ازای هر کیلومتر", 10000m, 2, "کیلومتر" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_DriverLocations_DriverId",
                table: "DriverLocations",
                column: "DriverId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderAddresses_OrderId",
                table: "OrderAddresses",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CustomerId",
                table: "Orders",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_DriverId",
                table: "Orders",
                column: "DriverId");

            migrationBuilder.CreateIndex(
                name: "IX_OtpRequests_UserId",
                table: "OtpRequests",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PackagingProducts_CategoryId",
                table: "PackagingProducts",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_PackingServiceSubItem_SubItemId",
                table: "PackingServiceSubItem",
                column: "SubItemId");

            migrationBuilder.CreateIndex(
                name: "IX_PricingFactors_ServiceCategoryId",
                table: "PricingFactors",
                column: "ServiceCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketMessages_SenderId",
                table: "TicketMessages",
                column: "SenderId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketMessages_TicketId",
                table: "TicketMessages",
                column: "TicketId");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_OrderId",
                table: "Tickets",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_UserId",
                table: "Tickets",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Wallets_UserId",
                table: "Wallets",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DriverLocations");

            migrationBuilder.DropTable(
                name: "OrderAddresses");

            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "OtpRequests");

            migrationBuilder.DropTable(
                name: "PackagingProducts");

            migrationBuilder.DropTable(
                name: "PackingServiceSubItem");

            migrationBuilder.DropTable(
                name: "TicketMessages");

            migrationBuilder.DropTable(
                name: "Wallets");

            migrationBuilder.DropTable(
                name: "PackagingProductCategories");

            migrationBuilder.DropTable(
                name: "PricingFactors");

            migrationBuilder.DropTable(
                name: "Tickets");

            migrationBuilder.DropTable(
                name: "ServiceCategories");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
