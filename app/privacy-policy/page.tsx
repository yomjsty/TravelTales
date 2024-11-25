function PrivacyPolicyPage() {
    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

            <section className="mb-6">
                <p className="text-gray-700">
                    Selamat datang di <strong>TravelTales</strong>. Privasi Anda penting bagi kami. Halaman ini menjelaskan bagaimana data Anda dikumpulkan, digunakan, dan dilindungi selama menggunakan website ini.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">1. Data yang Kami Kumpulkan</h2>
                <p className="text-gray-700">
                    Website ini mengumpulkan data tertentu untuk memastikan fungsionalitasnya, termasuk:
                </p>
                <ul className="list-disc list-inside text-gray-700">
                    <li>Informasi login (melalui BetterAuth).</li>
                    <li>Data yang Anda masukkan seperti cerita perjalanan, lokasi, atau kolaborasi grup.</li>
                    <li>Data analitik anonim untuk meningkatkan performa website.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">2. Bagaimana Kami Menggunakan Data Anda</h2>
                <p className="text-gray-700">
                    Data yang kami kumpulkan digunakan untuk:
                </p>
                <ul className="list-disc list-inside text-gray-700">
                    <li>Memberikan akses ke fitur-fitur website.</li>
                    <li>Meningkatkan pengalaman pengguna.</li>
                    <li>Menganalisis dan memahami penggunaan website (data anonim).</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">3. Penyimpanan dan Keamanan Data</h2>
                <p className="text-gray-700">
                    Kami menggunakan <strong>NeonDB</strong> sebagai database untuk menyimpan data Anda. Semua data dilindungi dengan keamanan yang sesuai untuk mencegah akses tidak sah.
                    Namun, perlu dicatat bahwa proyek ini dibuat untuk tujuan portfolio, sehingga data mungkin tidak sepenuhnya aman seperti pada layanan komersial.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">4. Hak Anda</h2>
                <p className="text-gray-700">
                    Anda memiliki hak untuk:
                </p>
                <ul className="list-disc list-inside text-gray-700">
                    <li>Meminta penghapusan data Anda kapan saja.</li>
                    <li>Menanyakan tentang data apa saja yang disimpan terkait penggunaan Anda.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">5. Perubahan pada Privacy Policy</h2>
                <p className="text-gray-700">
                    Kebijakan privasi ini dapat berubah sewaktu-waktu sesuai dengan pembaruan proyek. Kami akan memberikan pemberitahuan jika ada perubahan besar pada kebijakan ini.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-2">Hubungi Saya</h2>
                <p className="text-gray-700">
                    Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi:
                    <br />
                    <strong>akbarknawan@gmail.com</strong>
                </p>
            </section>
        </div>
    );
}

export default PrivacyPolicyPage;
