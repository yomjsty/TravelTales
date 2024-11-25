import BlogSection from "@/components/blog";
import HeroSection from "@/components/hero";
import SearchInput from "@/components/search-input";

export default function Home() {
  return (
    <main className="-mt-16 space-y-12">
      <HeroSection />
      <SearchInput />
      <BlogSection />
    </main>
  );
}
