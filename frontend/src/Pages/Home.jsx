import collageImage from "../assets/images/collage.jpg";

const Home = () => {
    return (
        <div className="relative w-full h-screen flex items-center justify-center">
            <img
                src={collageImage} // ✅ Use the imported image
                alt="Collage"
                className="absolute top-0 left-0 w-full h-full object-cover opacity-90"
            />
            <h1 className="relative z-10 text-4xl font-bold text-white bg-black bg-opacity-50 px-4 py-2 rounded-md">
                Welcome to Our College Portal
            </h1>
        </div>
    );
};

export default Home;
