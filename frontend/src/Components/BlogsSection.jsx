import BlogCard from "../Pages/BlogCards";

const blogs = [
    {
        image: "https://agcamritsar.in/blog-img/agc-quality.png",
        title: "FUSION 2023",
        description:
            "AGC organized FUSION 2023, a grand two-day celebration for the 10+2 students of the region. The event was a mesmerizing display of talent, energy, and youthful spirit.",
    },
    {
        image: "https://agcamritsar.in/blog-img/Got_France_Visa_Gurinderbir_Singh.jpg",
        title: "FUSION 2023",
        description:
            "AGC organized FUSION 2023, a grand two-day celebration for the 10+2 students of the region. The event was a mesmerizing display of talent, energy, and youthful spirit.",
    },
    {
        image: "https://agcamritsar.in/blog-img/blog-fd.png",
        title: "Celebrating World Tourism Day",
        description:
            "AGC celebrated World Tourism Day with cultural diversity and the grand opening of the Ragreen Doll Museum at AGC Agro Farm.",
    },
    {
        image: "https://agcamritsar.in/blog-img/bhmct-radisson-blu.jpg",
        title: "AGCian's Journey to Success: From India to Canada",
        description:
            "Achieving dreams and realizing ambitions is a testament to hard work and dedication.",
    },
    ...Array.from({ length: 7 }).map((_, i) => ({
        image: `https://picsum.photos/seed/blog${i}/300/200`,
        title: `Auto Blog ${i + 4}`,
        description: `This is a sample blog description for post ${i + 4}.`,
    })),
];

const BlogsSection = () => {
    return (
        <section className="py-12 px-4 bg-gray-50 overflow-hidden">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">BLOG'S</h1>
            <div className="relative">
                <div
                    className="flex animate-slide gap-6 w-max"
                    style={{ animationDuration: "40s" }}
                >
                    {[...blogs, ...blogs].map((blog, index) => (
                        <div key={index} className="w-80 flex-shrink-0">
                            <BlogCard
                                image={blog.image}
                                title={blog.title}
                                description={blog.description}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Keyframes injected here for auto-slide */}
            <style>
                {`
          @keyframes slide {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          .animate-slide {
            animation: slide linear infinite;
          }
        `}
            </style>
        </section>
    );
};

export default BlogsSection;