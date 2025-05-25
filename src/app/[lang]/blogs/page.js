import BlogListing from "@/widgets/BlogListing";

export default async function LeaderSinglePage({ params: { slug, lang } }) {
    
    return (
        <main className="min-h-screen pt-20">
           <BlogListing/>
        </main>
    )
}
