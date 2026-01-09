import HomeFooter from "../sections/HomeFooter";
import HowTo from "../sections/HowTo";
import Features from "../sections/Features";
import AboutUs from "../sections/AboutUs";
import GetInTouch from "../sections/GetInTouch";
import Hero from "../sections/Hero";
import FAQ from "../sections/FAQ";

const Home = () => {
    return (
        <>
            <Hero />
            <Features />
            <AboutUs />
            <HowTo />
            <FAQ />
            <GetInTouch />
            <HomeFooter />
        </>
    );
};

export default Home;