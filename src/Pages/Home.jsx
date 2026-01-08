import React, { useState, useEffect, useCallback, memo } from "react"
import { Github, Linkedin, Mail, ExternalLink, Instagram, Sparkles } from "lucide-react"
import catCoding from "../components/images/cat-coding.gif"
import AOS from 'aos'
import 'aos/dist/aos.css'

// Memoized Components
const StatusBadge = memo(() => (
  <div className="inline-block animate-float lg:mx-0" data-aos="zoom-in" data-aos-delay="400">
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
        <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-transparent bg-clip-text text-[0.65rem] xs:text-[0.7rem] sm:text-sm font-medium flex items-center">
          <Sparkles className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 mr-1.5 xs:mr-2 text-blue-400" />
          <span className="hidden xs:inline">Menuju Masa Depan Yang Cerah</span>
          <span className="xs:hidden">Masa Depan Cerah</span>
        </span>
      </div>
    </div>
  </div>
));

const MainTitle = memo(() => (
  <div className="space-y-0.5 sm:space-y-1 lg:space-y-2" data-aos="fade-up" data-aos-delay="600">
    <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
      <span className="relative inline-block">
        <span className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-xl sm:blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
          Students
        </span>
      </span>
      <br />
      <span className="relative inline-block mt-0.5 sm:mt-1 lg:mt-2">
        <span className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-xl sm:blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
          Developer
        </span>
      </span>
    </h1>
  </div>
));

const TechStack = memo(({ tech }) => (
  <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-xs sm:text-sm text-gray-300 hover:bg-white/10 transition-colors">
    {tech}
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon }) => (
  <a href={href}>
    <button className="group relative w-[140px] sm:w-[160px]">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-50 blur-md group-hover:opacity-90 transition-all duration-700"></div>
      <div className="relative h-9 sm:h-11 bg-[#030014] backdrop-blur-xl rounded-lg border border-white/10 leading-none overflow-hidden">
        <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-[#4f52c9]/20 to-[#8644c5]/20"></div>
        <span className="absolute inset-0 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm group-hover:gap-2 sm:group-hover:gap-3 transition-all duration-300">
          <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-medium z-10">
            {text}
          </span>
          <Icon className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-200 ${text === 'Contact' ? 'group-hover:translate-x-1' : 'group-hover:rotate-45'} transform transition-all duration-300 z-10`} />
        </span>
      </div>
    </button>
  </a>
));

const SocialLink = memo(({ icon: Icon, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <button className="group relative p-3">
      <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
      <div className="relative rounded-xl bg-black/50 backdrop-blur-xl p-2 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-300">
        <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
      </div>
    </button>
  </a>
));

// Constants
const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;
const WORDS = ["Network & Telecom Student", "Tech Enthusiast", "UI/UX Designer"];
const TECH_STACK = ["Java", "Javascript", "Node.js", "Lua", "Python", "R", "HTML"];
const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/Mingkhemx" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/MuhammadRifkiApreliant/" },
  { icon: Instagram, link: "https://www.instagram.com/_rippkiiii/?hl=id" }
];

const Home = () => {
  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)


  // Optimize AOS initialization
  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: true,
        offset: 10,

      });
    };

    initAOS();
    window.addEventListener('resize', initAOS);
    return () => window.removeEventListener('resize', initAOS);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  // Optimize typing effect
  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText(prev => prev + WORDS[wordIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      } else {
        setWordIndex(prev => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? TYPING_SPEED : ERASING_SPEED
    );
    return () => clearTimeout(timeout);
  }, [handleTyping]);




  return (
    <div className="min-h-screen bg-[#030014] overflow-hidden" id="Home">
      <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 min-h-screen">
          <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between min-h-screen pt-32 sm:pt-36 lg:pt-0 pb-8 sm:pb-12 lg:pb-0 gap-6 sm:gap-10 lg:gap-10 xl:gap-16">
            {/* Left Column */}
            <div className="w-full lg:w-[35%] xl:w-[30%] space-y-3 sm:space-y-5 lg:space-y-7 text-left order-1 lg:order-1"
              data-aos="fade-right"
              data-aos-delay="200">
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                <StatusBadge />
                <MainTitle />

                {/* Typing Effect */}
                <div className="h-5 sm:h-6 lg:h-8 flex items-center" data-aos="fade-up" data-aos-delay="800">
                  <span className="text-xs sm:text-sm lg:text-base xl:text-lg bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent font-light">
                    {text}
                  </span>
                  <span className="w-[2px] sm:w-[3px] h-3 sm:h-4 lg:h-6 bg-gradient-to-t from-[#6366f1] to-[#a855f7] ml-1 animate-blink"></span>
                </div>

                {/* Description */}
                <p className="text-[0.7rem] xs:text-xs sm:text-sm lg:text-base xl:text-lg text-gray-400 max-w-xl leading-relaxed font-light"
                  data-aos="fade-up"
                  data-aos-delay="1000">
                  Menciptakan Website Yang Inovatif, Fungsional, dan User-Friendly untuk Solusi Digital.
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-start" data-aos="fade-up" data-aos-delay="1200">
                  {TECH_STACK.map((tech, index) => (
                    <TechStack key={index} tech={tech} />
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-row gap-2 sm:gap-3 lg:gap-4 w-full justify-start" data-aos="fade-up" data-aos-delay="1400">
                  <CTAButton href="#Portofolio" text="Projects" icon={ExternalLink} />
                  <CTAButton href="#Contact" text="Contact" icon={Mail} />
                </div>

                {/* Social Links */}
                <div className="flex gap-3 lg:gap-4 justify-start" data-aos="fade-up" data-aos-delay="1600">
                  {SOCIAL_LINKS.map((social, index) => (
                    <SocialLink key={index} {...social} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Optimized Lottie Animation */}
            <div className="w-full lg:w-[60%] xl:w-[65%] h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[900px] 2xl:h-[1000px] relative flex items-center justify-center lg:justify-end lg:pr-12 order-2 lg:order-2"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              data-aos="fade-left"
              data-aos-delay="600">
              <div className="relative w-full h-full flex items-center justify-center opacity-90">
                <div className={`absolute inset-0 bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 rounded-3xl blur-3xl transition-all duration-700 ease-in-out ${isHovering ? "opacity-50 scale-105" : "opacity-20 scale-100"}`}>
                </div>

                <div className={`relative z-10 w-full h-full flex items-center justify-center lg:justify-end opacity-90 transition-transform duration-500 ${isHovering ? "scale-105 rotate-2" : "scale-100"}`}>
                  <img src={catCoding} alt="Coding Animation" className="w-[80%] h-auto lg:w-[90%] max-w-[350px] sm:max-w-[450px] lg:max-w-[500px] object-contain" />
                </div>

                <div className={`absolute inset-0 pointer-events-none transition-all duration-700 ${isHovering ? "opacity-50" : "opacity-20"}`}>
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl animate-[pulse_6s_cubic-bezier(0.4,0,0.6,1)_infinite] transition-all duration-700 ${isHovering ? "scale-110" : "scale-100"}`}>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Home);
