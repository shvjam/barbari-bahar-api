import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";

export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="container py-14">
      <div className="max-w-xl mx-auto text-center">
        <div className="text-3xl font-extrabold">{title}</div>
        <p className="mt-3 text-foreground/70">
          این صفحه به‌زودی با محتوای کامل ساخته می‌شود. اگر مایل هستید همین حالا
          تکمیلش کنیم، در چت اعلام کنید.
        </p>
        <div className="mt-6 flex justify-center">
          <Button asChild>
            <Link to="/order">ثبت سفارش</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
