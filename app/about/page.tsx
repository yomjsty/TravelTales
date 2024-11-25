function AboutPage() {
    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">About TravelTales</h1>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">About Me</h2>
                <p className="text-gray-700">
                    Hi! Saya <strong>Akbar Krishnawan</strong>, seorang web developer yang sedang membangun portfolio saya.{" "}
                    <strong>TravelTales</strong> adalah salah satu project web yang saya buat untuk menunjukkan kemampuan saya
                    dalam pengembangan aplikasi modern menggunakan teknologi terkini.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Apa itu TravelTales?</h2>
                <p className="text-gray-700">
                    <strong>TravelTales</strong> adalah platform berbagi cerita perjalanan. Dengan fitur seperti peta interaktif,
                    blog mini, dan kolaborasi grup, TravelTales dirancang untuk membantu traveler berbagi pengalaman, mencari inspirasi,
                    dan merencanakan perjalanan bersama.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Teknologi yang Digunakan</h2>
                <ul className="list-disc list-inside text-gray-700">
                    <li><strong>Next.js 15</strong></li>
                    <li><strong>TypeScript</strong></li>
                    <li><strong>Tailwind CSS</strong></li>
                    <li><strong>BetterAuth</strong></li>
                    <li><strong>shadcn/ui</strong></li>
                    <li><strong>Prisma</strong></li>
                    <li><strong>PostgreSQL (NeonDB)</strong></li>
                </ul>
            </section>

            <section id="contact">
                <h2 className="text-2xl font-semibold mb-2">Contact Me</h2>
                <p className="text-gray-700">
                    Jika Anda ingin memberikan feedback atau berdiskusi tentang project ini, silakan hubungi saya di:
                    <br />
                    <strong>akbarknawan@gmail.com</strong>
                </p>
            </section>
        </div>
    );
}

export default AboutPage;
