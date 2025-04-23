// import collageImage from "../assets/images/Home.jpg";

const Home = () => {
    return (
        <div className="w-full">
            <img
                // src={collageImage}
                src="https://agcamritsar.in/pictures/New/agc_high_resolution_img.jpg"
                alt="Collage"
                className="w-full object-cover
                           h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[450px]"
            />
        </div>
    );
};

export default Home;