import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Truck, Boxes, PackageCheck, Users, ArrowLeftRight } from "lucide-react";

const services = [
  {
    key: "moving-truck",
    title: "اسباب‌کشی با خاور و کامیون",
    desc: "ویژه جابجایی منازل و شرکت‌ها با تیم حرفه‌ای",
    icon: Truck,
    to: "/order?service=moving-truck",
    gradient: "from-primary to-secondary/80",
  },
  {
    key: "moving-pickup",
    title: "حمل با وانت و نیسان",
    desc: "جابجایی سبک و سریع درون‌شهری",
    icon: ArrowLeftRight,
    to: "/order?service=moving-pickup",
    gradient: "from-secondary to-primary/70",
  },
  {
    key: "vip-hercule",
    title: "پکیج VIP هِرکول",
    desc: "بسته‌بندی کامل + حمل حرفه‌ای",
    icon: PackageCheck,
    to: "/order?service=vip",
    gradient: "from-accent to-primary/80",
  },
  {
    key: "packaging",
    title: "سرویس بسته‌بندی",
    desc: "نیروی متخصص خانم/آقا + لوازم بسته‌بندی",
    icon: Boxes,
    to: "/order?service=packaging",
    gradient: "from-accent to-secondary/80",
  },
  {
    key: "workers",
    title: "کارگر جابه‌جایی",
    desc: "نیروی ماهر ساعتی",
    icon: Users,
    to: "/order?service=workers",
    gradient: "from-primary/80 to-accent",
  },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -end-24 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -start-24 size-80 rounded-full bg-accent/10 blur-3xl" />

      {/* Hero */}
      <section className="container pt-10 md:pt-16 pb-8 md:pb-12">
        <div className="grid lg:grid-cols-2 items-center gap-8">
          <div className="order-2 lg:order-none">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-5xl font-extrabold leading-[1.2]"
            >
              سفارش آنلاین اسباب‌کشی و حمل بار
              <span className="block text-transparent bg-clip-text bg-gradient-to-tr from-primary to-accent">
                سریع، جذاب، حرفه‌ای
              </span>
            </motion.h1>
            <p className="mt-4 text-foreground/70 text-sm md:text-base">
              از انتخاب سرویس تا پیش‌فاکتور لحظه‌ای. رابط کاربری کاملاً فارسی،
              راست‌چین و موبایل‌فرست.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => navigate("/order?service=moving-truck")}>شروع ثبت سفارش</Button>
              <Button asChild variant="outline">
                <Link to="/shop">خرید کارتن بسته‌بندی</Link>
              </Button>
            </div>
            <div className="mt-6 text-xs text-foreground/60">
              طراحی‌شده با انیمیشن‌ها و افکت‌های مدرن الهام‌گرفته از uiverse.io
            </div>
          </div>
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="aspect-[4/3] rounded-2xl bg-gradient-to-tr from-primary/15 via-secondary/10 to-accent/15 p-[2px]"
            >
              <div className="h-full w-full rounded-2xl bg-background grid place-items-center">
                <div className="grid grid-cols-3 gap-3 p-4 w-full max-w-md">
                  {services.slice(0, 3).map((s, i) => (
                    <motion.div
                      key={s.key}
                      className={`rounded-xl p-3 bg-gradient-to-br ${s.gradient} text-white shadow-lg`}
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 4 + i, repeat: Infinity }}
                    >
                      <s.icon className="size-6 opacity-90" />
                      <div className="mt-2 text-xs leading-5">{s.title}</div>
                    </motion.div>
                  ))}
                  <div className="col-span-3 text-center text-xs text-foreground/60">
                    UI تعاملی و چشم‌نواز
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="container pb-16">
        <h2 className="text-xl md:text-2xl font-extrabold mb-4">نوع سرویس را انتخاب کنید</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((s, idx) => (
            <motion.div key={s.key} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}>
              <Link to={s.to} className="block">
                <Card className="overflow-hidden group border-0 bg-gradient-to-br from-background to-muted">
                  <CardContent className="p-5">
                    <div className={`size-12 rounded-xl grid place-items-center text-white bg-gradient-to-br ${s.gradient} shadow-md group-hover:animate-float`}>
                      <s.icon className="size-6" />
                    </div>
                    <div className="mt-4 font-bold">{s.title}</div>
                    <div className="text-sm text-foreground/70 mt-1">{s.desc}</div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <div className="rounded-2xl p-[2px] bg-gradient-to-tr from-primary via-accent to-secondary">
          <div className="rounded-2xl bg-background p-6 md:p-8 flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="text-center md:text-start">
              <h3 className="text-lg md:text-2xl font-extrabold">همین حالا قیمت حدودی را ببینید</h3>
              <p className="text-foreground/70 text-sm mt-1">بدون نیاز به ورود، مراحل را طی کنید و پیش‌فاکتور دریافت کنید.</p>
            </div>
            <Button asChild className="ms-auto">
              <Link to="/order?service=moving-truck">شروع</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
