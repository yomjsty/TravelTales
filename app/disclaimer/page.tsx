function DisclaimerPage() {
    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Disclaimer</h1>

            <section className="mb-6">
                <p className="text-gray-700">
                    Selamat datang di <strong>TravelTales</strong>. Website ini dibuat oleh <strong>Akbar Krishnawan</strong> untuk kepentingan
                    portofolio dan pembelajaran. Informasi dan fitur yang disediakan pada platform ini bertujuan untuk memberikan pengalaman
                    simulasi dan inspirasi, bukan sebagai layanan resmi untuk publik.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Konten dan Data</h2>
                <p className="text-gray-700">
                    Semua konten dalam website ini bersifat simulasi dan hanya untuk keperluan demonstrasi. Data yang dimasukkan oleh pengguna
                    tidak disimpan secara permanen atau digunakan untuk tujuan komersial. Harap berhati-hati saat memasukkan informasi pribadi.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Penggunaan Teknologi</h2>
                <p className="text-gray-700">
                    Website ini menggunakan teknologi seperti <strong>Next.js</strong>, <strong>Prisma</strong>, <strong>NeonDB</strong>, dan
                    lainnya. Namun, pengguna perlu memahami bahwa ini adalah proyek eksperimental dan dapat mengandung bug atau keterbatasan.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Tidak Ada Jaminan</h2>
                <p className="text-gray-700">
                    Website ini disediakan "sebagaimana adanya" tanpa jaminan apa pun, baik tersurat maupun tersirat. Pengguna bertanggung jawab
                    penuh atas penggunaan platform ini.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-2">Hubungi Saya</h2>
                <p className="text-gray-700">
                    Jika Anda memiliki pertanyaan atau kekhawatiran tentang Disclaimer ini, silakan hubungi saya di:
                    <br />
                    <strong>akbarknawan@gmail.com</strong>
                </p>
            </section>
        </div>
    );
}

export default DisclaimerPage;
