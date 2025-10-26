using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BarbariBahar.API.Migrations
{
    /// <inheritdoc />
    public partial class Add_Service_Categories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "PricingFactors");

            migrationBuilder.AddColumn<int>(
                name: "ServiceCategoryId",
                table: "PricingFactors",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ServiceCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceCategories", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PricingFactors_ServiceCategoryId",
                table: "PricingFactors",
                column: "ServiceCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_PricingFactors_ServiceCategories_ServiceCategoryId",
                table: "PricingFactors",
                column: "ServiceCategoryId",
                principalTable: "ServiceCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PricingFactors_ServiceCategories_ServiceCategoryId",
                table: "PricingFactors");

            migrationBuilder.DropTable(
                name: "ServiceCategories");

            migrationBuilder.DropIndex(
                name: "IX_PricingFactors_ServiceCategoryId",
                table: "PricingFactors");

            migrationBuilder.RenameColumn(
                name: "ServiceCategoryId",
                table: "PricingFactors",
                newName: "Category");
        }
    }
}
