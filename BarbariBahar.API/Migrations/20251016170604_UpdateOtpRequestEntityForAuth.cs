using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BarbariBahar.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateOtpRequestEntityForAuth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OtpRequests_Users_UserId",
                table: "OtpRequests");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "OtpRequests",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "Mobile",
                table: "OtpRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_OtpRequests_Users_UserId",
                table: "OtpRequests",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OtpRequests_Users_UserId",
                table: "OtpRequests");

            migrationBuilder.DropColumn(
                name: "Mobile",
                table: "OtpRequests");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "OtpRequests",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_OtpRequests_Users_UserId",
                table: "OtpRequests",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
